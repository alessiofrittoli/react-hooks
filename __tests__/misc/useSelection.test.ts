import { act, renderHook } from '@testing-library/react'
import { useSelection } from '@/misc/useSelection'

describe( 'useSelection', () => {

	const object		= { test: 'value' }
	const items			= [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]
	const mixedItems	= [ 1, 2, 3, 4, object, 6, 7, 8, 9, 10 ]


	it( 'initialises with the given initial value', () => {

		const { result } = renderHook( () => useSelection( items, [ 1, 2 ] ) )

		expect( result.current.selection )
			.toEqual( [ 1, 2 ] )

	} )


	describe( 'setSelection', () => {

		it( 'allows selection update', () => {

			const { result } = renderHook( () => useSelection( items ) )

			act( () => {
				result.current.setSelection( [ 1, 2 ] )
			} )

			expect( result.current.selection )
				.toEqual( [ 1, 2 ] )

		} )

	} )


	describe( 'isSelected', () => {

		it( 'returns true if the given `entry` is found in the selection', () => {

			const { result } = renderHook( () => useSelection( items ) )

			expect( result.current.isSelected( 1 ) )
				.toBe( false )

			act( () => {
				result.current.setSelection( [ 1 ] )
			} )

			expect( result.current.isSelected( 1 ) )
				.toBe( true )
			
		} )


		it( 'compares entries based on memory reference', () => {

			const { result } = renderHook( () => useSelection( mixedItems, [ object ] ) )
	
			expect( result.current.isSelected( object ) )
				.toBe( true )
			
		} )

	} )


	describe( 'select', () => {

		it( 'adds a new entry to the selection', () => {

			const { result } = renderHook( () => useSelection( items ) )

			act( () => {
				result.current.select( 1 )
			} )

			expect( result.current.isSelected( 1 ) )
				.toBe( true )
			
		} )


		it( 'remove the given entry from the selection if already exists', () => {

			const { result } = renderHook( () => useSelection( items ) )

			act( () => {
				result.current.select( 1 )
				result.current.select( 1 )
			} )

			expect( result.current.isSelected( 1 ) )
				.toBe( false )
			
		} )


		it( 'supports any entry type', () => {

			const { result } = renderHook( () => useSelection( mixedItems ) )
	
			act( () => {
				result.current.select( object )
			} )
	
			expect( result.current.isSelected( object ) )
				.toBe( true )
			
		} )

	} )


	describe( 'groupSelect', () => {

		it( 'forward select items starting from the first item in the selection up to the given entry', () => {

			const { result } = renderHook( () => useSelection( items ) )

			act( () => {
				result.current.select( 1 )
			} )

			expect( result.current.isSelected( 1 ) )
				.toBe( true )
			
			act( () => {
				result.current.groupSelect( 5 )
			} )

			expect( result.current.selection )
				.toEqual( [ 1, 2, 3, 4, 5 ] )
				
		} )
		
		
		it( 'backward select items starting from the first item in the selection up to the given entry', () => {

			const { result } = renderHook( () => useSelection( items ) )

			act( () => {
				result.current.select( 7 )
			} )

			expect( result.current.isSelected( 7 ) )
				.toBe( true )
			
			act( () => {
				result.current.groupSelect( 2 )
			} )

			expect( result.current.selection )
				// .toEqual( [ 2, 3, 4, 5, 6, 7 ] )
				.toEqual( [ 7, 6, 5, 4, 3, 2 ] )
			
		} )


		it( 'excludes out of range entries', () => {

			const { result } = renderHook( () => useSelection( items, [ 3, 2 ] ) )
			
			act( () => {
				result.current.groupSelect( 7 )
			} )
	
			expect( result.current.selection )
				.toEqual( [ 3, 4, 5, 6, 7 ] )
			
		} )


		it( 'doesn\'t keep original ordering when backward selecting', () => {

			const { result } = renderHook( () => useSelection( items, [ 9 ] ) )
			
			act( () => {
				result.current.groupSelect( 4 )
			} )

			// reverse selected items aren't `.reverse()` again before being returned
			expect( result.current.selection )
				.not.toEqual( [ 4, 5, 6, 7, 8, 9 ] )

		} )


		it( 'extends selection when called multiple times (forward/backward)', () => {

			const { result } = renderHook( () => useSelection( items, [ 4 ] ) )
			
			act( () => {
				result.current.groupSelect( 7 )
			} )
	
			expect( result.current.selection )
				.toEqual( [ 4, 5, 6, 7 ] )
	
	
			act( () => {
				result.current.groupSelect( 9 )
			} )
	
			expect( result.current.selection )
				.toEqual( [ 4, 5, 6, 7, 8, 9 ] )
			
			
			act( () => {
				result.current.groupSelect( 2 )
			} )
	
			expect( result.current.selection )
				.toEqual( [ 4, 3, 2 ] )
			
		} )
		
		
		it( 'doesn\'t remove the entry if already in selection', () => {

			const { result } = renderHook( () => useSelection( items, [ 4 ] ) )
			
			act( () => {
				result.current.groupSelect( 4 )
			} )
	
			expect( result.current.selection )
				.toEqual( [ 4 ] )
			
		} )


		it( 'simply adds the given entry if selection is empty', () => {

			const { result } = renderHook( () => useSelection( items ) )
			
			act( () => {
				result.current.groupSelect( 1 )
			} )

			expect( result.current.selection )
				.toEqual( [ 1 ] )
			
			act( () => {
				result.current.groupSelect( 1 )
			} )

			expect( result.current.selection )
				.toEqual( [ 1 ] )

		} )


		it( 'supports any entry type', () => {

			const { result } = renderHook( () => useSelection( mixedItems, [ 9 ] ) )
	
			act( () => {
				result.current.groupSelect( object )
			} )
	
			expect( result.current.selection )
				// .toEqual( [ object, 6, 7, 8, 9 ] )
				.toEqual( [ 9, 8, 7, 6, object ] )
			
		} )

	} )


	describe( 'selectAll', () => {

		it( 'adds all elements in the given array to the selection', () => {

			const { result } = renderHook( () => useSelection( items ) )
			
			act( () => {
				result.current.selectAll()
			} )

			expect( result.current.selection )
				.toEqual( items )

		} )

	} )


	describe( 'resetSelection', () => {

		it( 'empties the selection', () => {

			const { result } = renderHook( () => useSelection( items, [ 2, 6 ] ) )
			
			act( () => {
				result.current.resetSelection()
			} )

			expect( result.current.selection )
				.toEqual( [] )

		} )


		it( 'restores the selection to the initial given value', () => {

			const { result } = renderHook( () => useSelection( items, [ 2, 6 ] ) )
			
			act( () => {
				result.current.resetSelection( true )
			} )

			expect( result.current.selection )
				.toEqual( [ 2, 6 ] )

		} )

	} )

} )