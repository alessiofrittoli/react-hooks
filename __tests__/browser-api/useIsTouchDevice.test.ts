import { renderHook } from '@testing-library/react'
import { useIsTouchDevice } from '@/browser-api/useIsTouchDevice'
import { useMediaQuery as _useMediaQuery } from '@/browser-api/useMediaQuery'

jest.mock( '@/browser-api/useMediaQuery', () => ( {
	useMediaQuery: jest.fn().mockReturnValue( false )
} ) )


const useMediaQuery = _useMediaQuery as jest.Mock

describe( 'useIsTouchDevice', () => {

	afterEach( () => {
		jest.clearAllMocks()
	} )


	it( 'calls useMediaQuery with (pointer: coarse)', () => {
		renderHook( () => useIsTouchDevice() )
		expect( useMediaQuery )
			.toHaveBeenCalledWith( '(pointer: coarse)' )
	} )


	it( 'returns true if useMediaQuery returns true', () => {
		useMediaQuery.mockReturnValueOnce( true )
		const { result } = renderHook( () => useIsTouchDevice() )
		expect( result.current ).toBe( true )
	} )


	it( 'returns false if useMediaQuery returns false', () => {
		useMediaQuery.mockReturnValueOnce( false )
		const { result } = renderHook( () => useIsTouchDevice() )
		expect( result.current ).toBe( false )
	} )

} )