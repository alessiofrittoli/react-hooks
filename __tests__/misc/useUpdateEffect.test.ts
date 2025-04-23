import { renderHook } from '@testing-library/react'
import { useUpdateEffect } from '@/misc/useUpdateEffect'
import { useIsFirstRender } from '@/misc/useIsFirstRender'

jest.mock( '@/misc/useIsFirstRender' )

describe( 'useUpdateEffect', () => {

	let mockUseIsFirstRender: jest.Mock

	beforeEach( () => {
		mockUseIsFirstRender = useIsFirstRender as jest.Mock;
	} )


	it( 'should not call the effect on the first render', () => {
		mockUseIsFirstRender.mockReturnValue( true )
		const effect = jest.fn()

		renderHook( () => useUpdateEffect( effect, [] ) )

		expect( effect ).not.toHaveBeenCalled()
	} )


	it( 'should call the effect on subsequent renders when dependencies change', () => {

		mockUseIsFirstRender
			.mockReturnValueOnce( true )
			.mockReturnValue( false )

		const effect = jest.fn()

		const { rerender } = renderHook( ( { deps } ) => useUpdateEffect( effect, deps ), {
			initialProps: { deps: [ 1 ] },
		} )

		rerender( { deps: [ 2 ] } )

		expect( effect ).toHaveBeenCalledTimes( 1 )

	} )


	it( 'should not call the effect if dependencies do not change', () => {

		mockUseIsFirstRender
			.mockReturnValueOnce( true )
			.mockReturnValue( false )
		
		const effect = jest.fn()

				const { rerender } = renderHook( ( { deps } ) => useUpdateEffect( effect, deps ), {
			initialProps: { deps: [ 1 ] },
		} )

		rerender( { deps: [ 1 ] } )

		expect( effect ).not.toHaveBeenCalled()
	} )

} )