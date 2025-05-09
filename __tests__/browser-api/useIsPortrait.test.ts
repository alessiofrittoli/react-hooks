import { renderHook } from '@testing-library/react'
import { portraitMediaQuery } from '@alessiofrittoli/web-utils/device'

import { useMediaQuery } from '@/browser-api/useMediaQuery'
import { useIsPortrait } from '@/browser-api/useIsPortrait'

jest.mock( '@/browser-api/useMediaQuery' )
const mockedUseMediaQuery = useMediaQuery as jest.Mock


describe( 'useIsPortrait', () => {

	afterEach( () => {
		jest.clearAllMocks().resetModules()
	} )

	it( 'returns true when the device is in portrait mode', () => {

		mockedUseMediaQuery.mockReturnValue( true )

		const { result } = renderHook( () => useIsPortrait() )

		expect( result.current ).toBe( true )
		expect( mockedUseMediaQuery ).toHaveBeenCalledWith( portraitMediaQuery )
	} )


	it( 'returns false when the device is not in portrait mode', () => {

		mockedUseMediaQuery.mockReturnValue( false )

		const { result } = renderHook( () => useIsPortrait() )

		expect( result.current ).toBe( false )
		expect( mockedUseMediaQuery ).toHaveBeenCalledWith( portraitMediaQuery )
		
	} )

} )