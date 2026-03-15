import { randomUUID as _randomUUID } from '@alessiofrittoli/math-utils'
import { findIndexBy as _findIndexBy } from '@alessiofrittoli/web-utils'
import {
	addItemUUID,
	addItemsUUID,
	maybeAddItemUUID,
	maybeAddItemsUUID,
	findIndexByUUID,
	getEffectiveQueue,
} from '@/misc/queue/utils'
import { UUID } from '@/misc/queue'

jest.mock( '@alessiofrittoli/math-utils', () => ( {
	randomUUID: jest.fn(),
} ) )

jest.mock( '@alessiofrittoli/web-utils', () => ( {
	findIndexBy: jest.fn(),
} ) )

const randomUUID = _randomUUID as jest.Mock<string, []>
const findIndexBy = _findIndexBy as jest.Mock<number, [ { items: Array<{ uuid?: string }>, field: string, value: string } ]>

describe( 'queue utils', () => {

	afterEach( () => {
		jest.clearAllMocks().resetModules()
	} )


	describe( 'addItemUUID', () => {

		it( 'adds a uuid to the given item', () => {

			randomUUID.mockReturnValue( 'uuid-1' )
			const item = { foo: 'bar' }

			const result = addItemUUID( item )

			expect( randomUUID ).toHaveBeenCalledTimes( 1 )
			expect( result ).toEqual( { foo: 'bar', uuid: 'uuid-1' } )

		} )


		it( 'overwrites existing uuid', () => {

			randomUUID.mockReturnValue( 'uuid-2' )
			const item = { foo: 'bar', uuid: 'old' as UUID }

			const result = addItemUUID( item )

			expect( result.uuid ).toBe( 'uuid-2' )
			
		} )

	} )


	describe( 'addItemsUUID', () => {

		it( 'normalizes a single item to an array', () => {
			randomUUID.mockReturnValue( 'uuid-3' )
			const item = { foo: 'bar' }

			const result = addItemsUUID( item )

			expect( result ).toEqual( [ { foo: 'bar', uuid: 'uuid-3' } ] )
		} )


		it( 'adds uuids to each item in the array', () => {
			randomUUID
				.mockReturnValueOnce( 'uuid-4' )
				.mockReturnValueOnce( 'uuid-5' )

			const result = addItemsUUID( [ { foo: 'a' }, { foo: 'b' } ] )

			expect( result ).toEqual( [
				{ foo: 'a', uuid: 'uuid-4' },
				{ foo: 'b', uuid: 'uuid-5' },
			] )
		} )

	} )


	describe( 'maybeAddItemUUID', () => {

		it( 'adds a uuid when missing', () => {
			randomUUID.mockReturnValue( 'uuid-6' )
			const item = { foo: 'bar' }

			const result = maybeAddItemUUID( item )

			expect( randomUUID ).toHaveBeenCalledTimes( 1 )
			expect( result ).toEqual( { foo: 'bar', uuid: 'uuid-6' } )
		} )


		it( 'preserves existing uuid', () => {
			const item = { foo: 'bar', uuid: 'keep' as UUID }

			const result = maybeAddItemUUID( item )

			expect( randomUUID ).not.toHaveBeenCalled()
			expect( result ).toEqual( { foo: 'bar', uuid: 'keep' } )
		} )

	} )


	describe( 'maybeAddItemsUUID', () => {

		it( 'normalizes a single item to an array', () => {
			randomUUID.mockReturnValue( 'uuid-7' )
			const item = { foo: 'bar' }

			const result = maybeAddItemsUUID( item )

			expect( result ).toEqual( [ { foo: 'bar', uuid: 'uuid-7' } ] )
		} )


		it( 'preserves existing uuids and adds missing ones', () => {
			randomUUID.mockReturnValue( 'uuid-8' )

			const result = maybeAddItemsUUID( [
				{ foo: 'a' },
				{ foo: 'b', uuid: 'keep' },
			] )

			expect( result ).toEqual( [
				{ foo: 'a', uuid: 'uuid-8' },
				{ foo: 'b', uuid: 'keep' },
			] )
		} )

	} )


	describe( 'findIndexByUUID', () => {

		it( 'returns -1 when uuid is missing', () => {
			const result = findIndexByUUID( [ { uuid: 'a' as UUID } ] )

			expect( findIndexBy ).not.toHaveBeenCalled()
			expect( result ).toBe( -1 )
		} )


		it( 'delegates to findIndexBy when uuid is provided', () => {
			findIndexBy.mockReturnValue( 1 )
			const items = [ { uuid: 'a' as UUID }, { uuid: 'b' as UUID } ]

			const result = findIndexByUUID( items, 'b' as UUID )

			expect( findIndexBy ).toHaveBeenCalledWith( { items, field: 'uuid', value: 'b' } )
			expect( result ).toBe( 1 )
		} )

	} )


	describe( 'getEffectiveQueue', () => {

		it( 'returns the original queue when uuid is not provided', () => {
			const queue = [ { uuid: 'a' as UUID } ]
			const customQueue = [ { uuid: 'b' as UUID } ]

			const result = getEffectiveQueue( { queue, customQueue } )

			expect( findIndexBy ).not.toHaveBeenCalled()
			expect( result ).toBe( queue )
		} )


		it( 'appends custom items when uuid is not found', () => {
			findIndexBy.mockReturnValue( -1 )
			const queue = [ { uuid: 'a' as UUID }, { uuid: 'b' as UUID } ]
			const customQueue = [ { uuid: 'c' as UUID } ]

			const result = getEffectiveQueue( { queue, customQueue, uuid: 'missing' as UUID } )

			expect( result ).toEqual( [ ...queue, ...customQueue ] )
			expect( result ).not.toBe( queue )
		} )


		it( 'inserts custom items after the matched uuid', () => {
			findIndexBy.mockReturnValue( 0 )
			const queue = [ { uuid: 'a' as UUID }, { uuid: 'b' as UUID } ]
			const customQueue = [ { uuid: 'c' as UUID }, { uuid: 'd' as UUID } ]

			const result = getEffectiveQueue( { queue, customQueue, uuid: 'a' as UUID } )

			expect( result ).toEqual( [
				{ uuid: 'a' },
				{ uuid: 'c' },
				{ uuid: 'd' },
				{ uuid: 'b' },
			] )
		} )

	} )

} )
