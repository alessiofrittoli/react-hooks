import { renderHook, act } from '@testing-library/react'
import { deferCallback as _deferCallback } from '@alessiofrittoli/web-utils'
import { useDeferCallback } from '@/misc'


jest.mock( '@alessiofrittoli/web-utils', () => ( {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	deferCallback: jest.fn( ( task: any ) => ( ...args: any[] ) => task( ...args ) ),
} ) )

const deferCallback = _deferCallback as jest.Mock



describe( 'useDeferCallback', () => {


	beforeEach( () => {
		deferCallback.mockClear()
	} )


	it( 'returns a memoized deferred callback', async () => {

		const callback = jest.fn()

		const { result, rerender } = renderHook(
			( { deps } ) => useDeferCallback( callback, deps ),
			{ initialProps: { deps: [ 0 ] } }
		)
		
		act( () => {
			result.current( 'test' )
		} )

		expect( deferCallback ).toHaveBeenCalledWith( callback )
		expect( callback ).toHaveBeenCalledWith( 'test' )

		const prev = result.current
		
		rerender( { deps: [ 0 ] } )
		expect( result.current ).toBe( prev )

		rerender( { deps: [ 1 ] } )
		expect( result.current ).not.toBe( prev )

	} )


	it( 'doesn\'t uses the latest callback when changed', () => {

		const callback1 = jest.fn()
		const callback2 = jest.fn()

		const { result, rerender } = renderHook(
			// eslint-disable-next-line react-hooks/exhaustive-deps
			( { cb } ) => useDeferCallback( cb, [] ),
			{ initialProps: { cb: callback1 } }
		)

		act( () => {
			result.current( 'foo' )
		} )

		expect( callback1 ).toHaveBeenCalledWith( 'foo' )

		rerender( { cb: callback2 } )

		act( () => {
			result.current( 'bar' )
		} )

		expect( callback1 ).toHaveBeenCalledWith( 'bar' )
		expect( callback2 ).not.toHaveBeenCalled()

	} )

} )