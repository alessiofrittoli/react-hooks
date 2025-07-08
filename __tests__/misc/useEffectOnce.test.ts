import { renderHook } from '@testing-library/react'
import { useEffectOnce } from '../../src/misc/useEffectOnce'
import { useIsFirstRender as _useIsFirstRender } from '@/misc/useIsFirstRender'


jest.mock( '@/misc/useIsFirstRender', () => ( {
	useIsFirstRender: jest.fn(),
} ) )

const useIsFirstRender = _useIsFirstRender as jest.Mock


describe( 'useEffectOnce', () => {

	beforeEach( () => {
		jest.clearAllMocks()
	} )

	it( 'calls effect on first render', () => {

		useIsFirstRender.mockReturnValue( true )
		
		const effect = jest.fn()
		renderHook( () => useEffectOnce( effect ) )
		expect( effect ).toHaveBeenCalledTimes( 1 )

	} )


	it( 'doesn\'t call effect if not first render', () => {

		useIsFirstRender.mockReturnValue( false )
		
		const effect = jest.fn()
		renderHook( () => useEffectOnce( effect ) )
		expect( effect ).toHaveBeenCalledTimes( 0 )

	} )


	it( 'doesn\'t call effect on subsequent renders', () => {

		useIsFirstRender.mockReturnValue( true )

		const effect = jest.fn()
		const { rerender } = renderHook( () => useEffectOnce( effect ) )

		useIsFirstRender.mockReturnValue( false )
		rerender()
		expect( effect ).toHaveBeenCalledTimes( 1 )

	} )


	it( 'calls cleanup function on unmount if provided', () => {

		useIsFirstRender.mockReturnValue( true )
		
		const cleanup	= jest.fn()
		const effect	= jest.fn( () => cleanup )

		const { unmount } = renderHook( () => useEffectOnce( effect ) )
		
		unmount()
		expect( cleanup ).toHaveBeenCalledTimes( 1 )

	} )

} )