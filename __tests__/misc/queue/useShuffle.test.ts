import { act, renderHook } from '@testing-library/react'
import { shuffle as _shuffle } from '@alessiofrittoli/web-utils'
import { findIndexByUUID as _findIndexByUUID } from '@/misc/queue/utils'
import { useShuffle } from '@/misc/queue/useShuffle'
import type { Queue, UUID } from '@/misc/queue/types'

jest.mock( '@alessiofrittoli/web-utils', () => ( {
	shuffle: jest.fn(),
} ) )

jest.mock( '@/misc/queue/utils', () => ( {
	findIndexByUUID: jest.fn(),
} ) )

const shuffleArray = _shuffle as jest.Mock<Queue[ 'items' ], [ Queue[ 'items' ] ]>
const findIndexByUUID = _findIndexByUUID as jest.Mock<number, [ Queue[ 'items' ], UUID | undefined ]>

const makeQueue = ( uuids: string[] ): Queue => ( {
	items: uuids.map( ( uuid ) => ( { uuid: uuid as UUID } ) ),
} )


describe( 'useShuffle', () => {

	afterEach( () => {
		jest.clearAllMocks().resetModules()
	} )


	it( 'shuffles upcoming items and enables shuffle', () => {

		const queue = makeQueue( [ 'a', 'b', 'c', 'd' ] )
		findIndexByUUID.mockReturnValue( 1 )
		shuffleArray.mockImplementation( ( items ) => [ ...items ].reverse() )

		const { result } = renderHook( () => useShuffle() )

		let shuffled: Queue | undefined

		act( () => {
			shuffled = result.current.shuffle( queue, 'b' as UUID )
		} )

		expect( findIndexByUUID ).toHaveBeenCalledWith( queue.items, 'b' )
		expect( shuffleArray ).toHaveBeenCalledWith( queue.items.slice( 2 ) )
		expect( shuffled?.items.map( item => item.uuid ) ).toEqual( [ 'a', 'b', 'd', 'c' ] )
		expect( result.current.enabled ).toBe( true )

	} )


	it( 'restores original order on unshuffle and disables shuffle', () => {

		const queue = makeQueue( [ 'a', 'b', 'c', 'd' ] )
		findIndexByUUID.mockReturnValue( 1 )
		shuffleArray.mockImplementation( ( items ) => [ ...items ].reverse() )

		const { result } = renderHook( () => useShuffle() )

		let shuffled: Queue 

		act( () => {
			shuffled = result.current.shuffle( queue, 'b' as UUID )
		} )

		let restored: Queue | undefined

		act( () => {
			restored = result.current.unshuffle( shuffled, 'b' as UUID )
		} )

		expect( restored?.items.map( ( item ) => item.uuid ) )
			.toEqual( [ 'a', 'b', 'c', 'd' ] )
		expect( result.current.enabled ).toBe( false )
		expect( findIndexByUUID ).toHaveBeenCalledTimes( 2 )
		expect( shuffleArray ).toHaveBeenCalledTimes( 1 )

	} )


	it( 'toggles shuffle state based on previous shuffle', () => {

		const queue = makeQueue( [ 'a', 'b', 'c' ] )
		findIndexByUUID.mockReturnValue( 0 )
		shuffleArray.mockImplementation( ( items ) => [ ...items ].reverse() )

		const { result } = renderHook( () => useShuffle() )

		let shuffled: Queue | undefined 

		act( () => {
			shuffled = result.current.toggleShuffle( queue, 'a' as UUID )
		} )

		expect( shuffled?.items.map( ( item ) => item.uuid ) )
			.toEqual( [ 'a', 'c', 'b' ] )
		expect( result.current.enabled ).toBe( true )

		let restored: Queue | undefined

		act( () => {
			restored = result.current.toggleShuffle( shuffled!, 'a' as UUID )
		} )

		expect( restored?.items.map( ( item ) => item.uuid ) ).toEqual( [ 'a', 'b', 'c' ] )
		expect( result.current.enabled ).toBe( false )
		expect( shuffleArray ).toHaveBeenCalledTimes( 1 )

	} )


	it( 'returns early for queues with one or fewer items', () => {

		const queue = makeQueue( [ 'only' ] )

		const { result } = renderHook( () => useShuffle() )

		let returned: Queue | undefined

		act( () => {
			returned = result.current.shuffle( queue )
		} )

		expect( returned ).toBe( queue )
		expect( result.current.enabled ).toBe( false )
		expect( findIndexByUUID ).not.toHaveBeenCalled()
		expect( shuffleArray ).not.toHaveBeenCalled()

	} )


	it( 'returns early when no original order exists', () => {

		const queue = makeQueue( [ 'a', 'b' ] )
		findIndexByUUID.mockReturnValue( 0 )

		const { result } = renderHook( () => useShuffle() )

		let returned: Queue | undefined

		act( () => {
			returned = result.current.unshuffle( queue, 'a' as UUID )
		} )

		expect( returned ).toBe( queue )
		expect( result.current.enabled ).toBe( false )
		expect( findIndexByUUID ).not.toHaveBeenCalled()

	} )


	it( 'returns early when upcoming items are one or fewer', () => {

		const queue = makeQueue( [ 'a', 'b' ] )
		findIndexByUUID.mockReturnValue( 0 )

		const { result } = renderHook( () => useShuffle() )

		let returned: Queue | undefined
		
		act( () => {
			returned = result.current.shuffle( queue, 'a' as UUID )
		} )

		expect( returned ).toBe( queue )
		expect( result.current.enabled ).toBe( true )
		expect( shuffleArray ).not.toHaveBeenCalled()

	} )


	it( 'preserves the original order across repeated shuffles', () => {

		const queue = makeQueue( [ 'a', 'b', 'c', 'd' ] )
		findIndexByUUID.mockReturnValue( 1 )
		shuffleArray.mockImplementation( ( items ) => [ ...items ].reverse() )

		const { result } = renderHook( () => useShuffle() )

		let shuffledOnce: Queue | undefined

		act( () => {
			shuffledOnce = result.current.shuffle( queue, 'b' as UUID )
		} )

		let shuffledTwice: Queue | undefined

		act( () => {
			shuffledTwice = result.current.shuffle( shuffledOnce!, 'b' as UUID )
		} )

		let restored: Queue | undefined

		act( () => {
			restored = result.current.unshuffle( shuffledTwice!, 'b' as UUID )
		} )

		expect( restored?.items.map( ( item ) => item.uuid ) )
			.toEqual( [ 'a', 'b', 'c', 'd' ] )
		expect( shuffleArray ).toHaveBeenCalledTimes( 2 )

	} )


	it( 'restores items not in the original order to the front of upcoming items', () => {

		const queue = makeQueue( [ 'a', 'b', 'c' ] )
		findIndexByUUID
			.mockReturnValueOnce( 0 )
			.mockReturnValueOnce( 1 )
		shuffleArray.mockImplementation( ( items ) => [ ...items ] )

		const { result } = renderHook( () => useShuffle() )

		act( () => {
			result.current.shuffle( queue, 'a' as UUID )
		} )

		const queueWithExtra = makeQueue( [ 'a', 'b', 'c', 'x' ] )

		let restored: Queue | undefined

		act( () => {
			restored = result.current.unshuffle( queueWithExtra, 'b' as UUID )
		} )

		expect( restored?.items.map( ( item ) => item.uuid ) )
			.toEqual( [ 'a', 'b', 'x', 'c' ] )
		expect( shuffleArray ).toHaveBeenCalledTimes( 1 )

	} )

	
	it( 'keeps upcoming order when all upcoming items are unknown to the original', () => {

		const queue = makeQueue( [ 'a', 'b', 'c' ] )
		findIndexByUUID
			.mockReturnValueOnce( 0 )
			.mockReturnValueOnce( 1 )
		shuffleArray.mockImplementation( ( items ) => [ ...items ] )

		const { result } = renderHook( () => useShuffle() )

		act( () => {
			result.current.shuffle( queue, 'a' as UUID )
		} )

		const queueWithUnknowns = makeQueue( [ 'a', 'b', 'x', 'y' ] )

		let restored: Queue | undefined

		act( () => {
			restored = result.current.unshuffle( queueWithUnknowns, 'b' as UUID )
		} )

		expect( restored?.items.map( ( item ) => item.uuid ) )
			.toEqual( [ 'a', 'b', 'x', 'y' ] )

	} )

} )
