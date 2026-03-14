import { act, renderHook } from '@testing-library/react'
import { useQueue } from '@/misc/queue/useQueue'
import { useShuffle as _useShuffle } from '@/misc/queue/useShuffle'
import {
	addItemsUUID as _addItemsUUID,
	maybeAddItemsUUID as _maybeAddItemsUUID,
	findIndexByUUID as _findIndexByUUID,
} from '@/misc/queue/utils'
import type { Queue, UUID } from '@/misc/queue/types'

jest.mock( '@/misc/queue/useShuffle', () => ( {
	useShuffle: jest.fn(),
} ) )

jest.mock( '@/misc/queue/utils', () => {
	const actual = jest.requireActual( '@/misc/queue/utils' )
	return {
		...actual,
		addItemsUUID: jest.fn(),
		maybeAddItemsUUID: jest.fn(),
		findIndexByUUID: jest.fn( actual.findIndexByUUID ),
	}
} )

const useShuffle = _useShuffle as jest.Mock
const addItemsUUID = _addItemsUUID as jest.Mock
const maybeAddItemsUUID = _maybeAddItemsUUID as jest.Mock
const findIndexByUUID = _findIndexByUUID as jest.Mock
const actualUtils = jest.requireActual( '@/misc/queue/utils' ) as typeof import( '@/misc/queue/utils' )

const makeQueue = ( uuids: string[] ): Queue => ( {
	items: uuids.map( ( uuid ) => ( { uuid: uuid as UUID } ) ),
} )

const makeQueuedItems = ( uuids: string[] ) => (
	uuids.map( ( uuid ) => ( { uuid: uuid as UUID } ) )
)

describe( 'useQueue', () => {

	beforeEach( () => {
		useShuffle.mockReturnValue( {
			enabled: false,
			shuffle: jest.fn( ( queue: Queue ) => queue ),
			unshuffle: jest.fn( ( queue: Queue ) => queue ),
			toggleShuffle: jest.fn( ( queue: Queue ) => queue ),
		} )
		findIndexByUUID.mockImplementation( actualUtils.findIndexByUUID )
	} )

	afterEach( () => {
		jest.clearAllMocks().resetModules()
	} )


	it( 'initializes with defaults and derives queue metadata', () => {

		const queue = makeQueue( [ 'a', 'b', 'c' ] )

		const { result } = renderHook( () => useQueue( {
			queue,
			current: queue.items[ 1 ],
			repeat: false,
		} ) )

		expect( result.current.currentId ).toBe( 'b' )
		expect( result.current.hasPrevious ).toBe( true )
		expect( result.current.hasNext ).toBe( true )
		expect( result.current.nextFromQueue.map( item => item.uuid ) )
			.toEqual( [ 'c' ] )
		expect( result.current.effectiveQueue ).toEqual( queue.items )

	} )


	it( 'adds items to the custom queue and updates effective queue', () => {

		const queue = makeQueue( [ 'a' ] )
		const added = makeQueuedItems( [ 'x', 'y' ] )
		addItemsUUID.mockReturnValue( added )

		const { result } = renderHook( () => useQueue( {
			queue,
			current: queue.items[ 0 ],
		} ) )

		act( () => {
			result.current.addToQueue( [ { uuid: 'x' as UUID }, { uuid: 'y' as UUID } ] )
		} )

		expect( addItemsUUID ).toHaveBeenCalledTimes( 1 )
		expect( result.current.customQueue ).toEqual( added )
		expect( result.current.hasNext ).toBe( true )
		expect( result.current.effectiveQueue.map( item => item.uuid ) )
			.toEqual( [ 'a', 'x', 'y' ] )

	} )


	it( 'jumps to a custom queue item without moving the main queue cursor', () => {

		const queue = makeQueue( [ 'a', 'b', 'c' ] )
		const added = makeQueuedItems( [ 'x', 'y' ] )
		addItemsUUID.mockReturnValue( added )

		const { result } = renderHook( () => useQueue( {
			queue,
			current: queue.items[ 0 ],
		} ) )

		act( () => {
			result.current.addToQueue( [ { uuid: 'x' as UUID }, { uuid: 'y' as UUID } ] )
		} )

		act( () => {
			result.current.jumpTo( { uuid: 'y' as UUID } )
		} )

		expect( result.current.currentId ).toBe( 'y' )
		expect( result.current.customQueue ).toEqual( [] )
		expect( result.current.nextFromQueue.map( item => item.uuid ) )
			.toEqual( [ 'b', 'c' ] )

	} )


	it( 'drains custom queue items before advancing the main queue', () => {

		const queue = makeQueue( [ 'a', 'b' ] )
		const added = makeQueuedItems( [ 'x', 'y' ] )
		addItemsUUID.mockReturnValue( added )

		const { result } = renderHook( () => useQueue( {
			queue,
			current: queue.items[ 0 ],
		} ) )

		act( () => {
			result.current.addToQueue( [ { uuid: 'x' as UUID }, { uuid: 'y' as UUID } ] )
		} )

		act( () => {
			result.current.next()
		} )

		expect( result.current.currentId ).toBe( 'x' )
		expect( result.current.customQueue.map( item => item.uuid ) )
			.toEqual( [ 'y' ] )

		act( () => {
			result.current.next()
		} )

		expect( result.current.currentId ).toBe( 'y' )
		expect( result.current.customQueue ).toEqual( [] )

		act( () => {
			result.current.next()
		} )

		expect( result.current.currentId ).toBe( 'b' )

	} )


	it( 'removes items from both queues', () => {

		const queue = makeQueue( [ 'a', 'b' ] )
		const added = makeQueuedItems( [ 'x' ] )
		addItemsUUID.mockReturnValue( added )

		const { result } = renderHook( () => useQueue( {
			queue,
			current: queue.items[ 0 ],
		} ) )

		act( () => {
			result.current.addToQueue( [ { uuid: 'x' as UUID } ] )
		} )

		act( () => {
			result.current.removeFromQueue( 'b' as UUID )
		} )

		expect( result.current.queue.items.map( item => item.uuid ) )
			.toEqual( [ 'a' ] )

		act( () => {
			result.current.removeFromQueue( 'x' as UUID )
		} )

		expect( result.current.customQueue ).toEqual( [] )

	} )


	it( 'normalizes UUIDs when setting a new queue', () => {

		type Item = { label: string }
		const queue: Queue<Item> = {
			items: [ { label: 'a', uuid: 'a' as UUID } ],
		}
		const normalized = [ { label: 'new', uuid: 'n1' as UUID } ]
		maybeAddItemsUUID.mockReturnValue( normalized )

		const { result } = renderHook( () => useQueue( { queue } ) )

		let returned: Queue | undefined

		act( () => {
			returned = result.current.setQueue( { items: [ { label: 'new' } ] } )
		} )

		expect( maybeAddItemsUUID ).toHaveBeenCalledTimes( 1 )
		expect( returned?.items ).toEqual( normalized )
		expect( result.current.queue.items ).toEqual( normalized )

	} )


	it( 'updates hasPrevious and hasNext when repeat is disabled', () => {

		const queue = makeQueue( [ 'a', 'b', 'c' ] )

		const { result } = renderHook( () => useQueue( {
			queue,
			current: queue.items[ 0 ],
			repeat: false,
		} ) )

		expect( result.current.hasPrevious ).toBe( false )
		expect( result.current.hasNext ).toBe( true )

		act( () => {
			result.current.jumpTo( { uuid: 'c' as UUID } )
		} )

		expect( result.current.hasPrevious ).toBe( true )
		expect( result.current.hasNext ).toBe( false )

	} )


	it( 'returns false for hasPrevious/hasNext when queue is empty', () => {

		const queue = makeQueue( [] )

		const { result } = renderHook( () => useQueue( {
			queue,
			repeat: false,
		} ) )

		expect( result.current.hasPrevious ).toBe( false )
		expect( result.current.hasNext ).toBe( false )

	} )


	it( 'returns hasPrevious/hasNext when cursor is missing but queue has items', () => {

		const queue = makeQueue( [ 'a' ] )

		const { result } = renderHook( () => useQueue( {
			queue,
			repeat: false,
		} ) )

		expect( result.current.hasPrevious ).toBe( true )
		expect( result.current.hasNext ).toBe( true )

	} )


	it( 'toggles repeat state', () => {

		const queue = makeQueue( [ 'a' ] )

		const { result } = renderHook( () => useQueue( {
			queue,
			repeat: false,
		} ) )

		expect( result.current.isRepeatEnabled ).toBe( false )

		act( () => {
			result.current.toggleRepeat()
		} )

		expect( result.current.isRepeatEnabled ).toBe( true )

		act( () => {
			result.current.toggleRepeat()
		} )

		expect( result.current.isRepeatEnabled ).toBe( false )

	} )


	it( 'jumps to the first item when uuid is missing and accepts a new queue', () => {

		const queue = makeQueue( [ 'a' ] )
		const newQueue = makeQueue( [ 'x', 'y' ] )
		maybeAddItemsUUID.mockReturnValue( newQueue.items )

		const { result } = renderHook( () => useQueue( { queue } ) )

		let returned: Queue[ 'items' ][ number ] | undefined

		act( () => {
			returned = result.current.jumpTo( { queue: { items: newQueue.items } } )
		} )

		expect( maybeAddItemsUUID ).toHaveBeenCalledTimes( 1 )
		expect( returned?.uuid ).toBe( 'x' )
		expect( result.current.currentId ).toBe( 'x' )
		expect( result.current.queue.items.map( item => item.uuid ) )
			.toEqual( [ 'x', 'y' ] )

	} )


	it( 'previous returns the last item when current is undefined', () => {

		const queue = makeQueue( [ 'a', 'b' ] )

		const { result } = renderHook( () => useQueue( { queue } ) )

		let previousItem: Queue[ 'items' ][ number ] | undefined

		act( () => {
			previousItem = result.current.previous()
		} )

		expect( previousItem?.uuid ).toBe( 'b' )
		expect( result.current.currentId ).toBe( 'b' )

	} )


	it( 'advances with getNext/next when custom queue is empty', () => {

		const queue = makeQueue( [ 'a', 'b', 'c' ] )

		const { result } = renderHook( () => useQueue( {
			queue,
			current: queue.items[ 0 ],
		} ) )

		expect( result.current.getNext()?.uuid ).toBe( 'b' )

		act( () => {
			result.current.next()
		} )

		expect( result.current.currentId ).toBe( 'b' )

	} )


	it( 'uses custom queue for getNext and previous while in custom items', () => {

		const queue = makeQueue( [ 'a', 'b', 'c' ] )
		const added = makeQueuedItems( [ 'x', 'y' ] )
		addItemsUUID.mockReturnValue( added )

		const { result } = renderHook( () => useQueue( {
			queue,
			current: queue.items[ 0 ],
		} ) )

		act( () => {
			result.current.addToQueue( [ { uuid: 'x' as UUID }, { uuid: 'y' as UUID } ] )
		} )

		expect( result.current.getNext()?.uuid ).toBe( 'x' )

		act( () => {
			result.current.next()
		} )

		expect( result.current.currentId ).toBe( 'x' )
		expect( result.current.getPrevious()?.uuid ).toBe( 'a' )

	} )


	it( 'clears the custom queue', () => {

		const queue = makeQueue( [ 'a' ] )
		const added = makeQueuedItems( [ 'x' ] )
		addItemsUUID.mockReturnValue( added )

		const { result } = renderHook( () => useQueue( {
			queue,
			current: queue.items[ 0 ],
		} ) )

		act( () => {
			result.current.addToQueue( [ { uuid: 'x' as UUID } ] )
		} )

		expect( result.current.customQueue ).toEqual( added )

		act( () => {
			result.current.clearQueue()
		} )

		expect( result.current.customQueue ).toEqual( [] )

	} )


	it( 'uses custom queue items when jumping to a custom uuid', () => {

		const queue = makeQueue( [ 'a', 'b' ] )
		const added = makeQueuedItems( [ 'x', 'y' ] )
		addItemsUUID.mockReturnValue( added )

		findIndexByUUID.mockReturnValue( 0 )

		const { result } = renderHook( () => useQueue( {
			queue,
			current: queue.items[ 0 ],
		} ) )

		act( () => {
			result.current.addToQueue( [ { uuid: 'x' as UUID } ] )
		} )

		let jumped: Queue[ 'items' ][ number ] | undefined

		act( () => {
			jumped = result.current.jumpTo( { uuid: 'x' as UUID } )
		} )

		expect( jumped?.uuid ).toBe( 'x' )
		expect( result.current.currentId ).toBe( 'x' )
		expect( result.current.customQueue.map( item => item.uuid ) ).toEqual( [ 'y' ] )

	} )


	it( 'falls back to main queue when custom uuid is not found', () => {

		const queue = makeQueue( [ 'a', 'b', 'c' ] )
		const added = makeQueuedItems( [ 'x', 'y' ] )
		addItemsUUID.mockReturnValue( added )

		const { result } = renderHook( () => useQueue( {
			queue,
			current: queue.items[ 0 ],
		} ) )

		act( () => {
			result.current.addToQueue( [ { uuid: 'x' as UUID }, { uuid: 'y' as UUID } ] )
		} )

		act( () => {
			result.current.jumpTo( { uuid: 'b' as UUID } )
		} )

		expect( result.current.currentId ).toBe( 'b' )
		expect( result.current.customQueue.map( item => item.uuid ) )
			.toEqual( [ 'x', 'y' ] )

	} )


	it( 'returns previous item from main queue when current is in main queue', () => {

		const queue = makeQueue( [ 'a', 'b', 'c' ] )

		const { result } = renderHook( () => useQueue( {
			queue,
			current: queue.items[ 1 ],
		} ) )

		expect( result.current.getPrevious()?.uuid ).toBe( 'a' )

	} )


	it( 'delegates shuffle controls to useShuffle handlers', () => {

		const queue = makeQueue( [ 'a', 'b' ] )
		const shuffledQueue = makeQueue( [ 'b', 'a' ] )

		const handlers = {
			enabled: true,
			shuffle: jest.fn( () => shuffledQueue ),
			unshuffle: jest.fn( () => queue ),
			toggleShuffle: jest.fn( () => queue ),
		}

		useShuffle.mockReturnValue( handlers )

		const { result } = renderHook( () => useQueue( {
			queue,
			current: queue.items[ 0 ],
		} ) )

		act( () => {
			result.current.shuffle()
		} )

		expect( handlers.shuffle ).toHaveBeenCalledWith( queue, 'a' )
		expect( result.current.queue.items.map( item => item.uuid ) )
			.toEqual( [ 'b', 'a' ] )

		act( () => {
			result.current.unshuffle()
		} )

		expect( handlers.unshuffle ).toHaveBeenCalledWith( shuffledQueue, 'a' )
		expect( result.current.queue.items.map( item => item.uuid ) )
			.toEqual( [ 'a', 'b' ] )

		act( () => {
			result.current.toggleShuffle()
		} )

		expect( handlers.toggleShuffle ).toHaveBeenCalledWith( queue, 'a' )

	} )

} )
