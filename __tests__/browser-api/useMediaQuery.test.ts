import { renderHook } from '@testing-library/react'
import { useMediaQuery } from '@/browser-api/useMediaQuery'


describe( 'useMediaQuery', () => {

	beforeEach( () => {
		Object.defineProperty( window, 'matchMedia', {
			writable: true,
			value: jest.fn().mockImplementation( query => ( {
				matches	: query === '(min-width: 768px)',
				media	: query,
				addEventListener	: jest.fn(),
				removeEventListener	: jest.fn(),
			} ) ),
		} )
	} )


	afterEach( () => {
		jest.clearAllMocks()
	} )


	it( 'returns true if the media query matches', () => {
		const { result } = renderHook( () => useMediaQuery( '(min-width: 768px)' ) )
		expect( result.current ).toBe( true )
	} )


	it( 'returns false if the media query does not match', () => {
		const { result } = renderHook( () => useMediaQuery( '(max-width: 767px)' ) )
		expect( result.current ).toBe( false )
	} )


	it( 'updates the matches value when the media query changes', () => {

		const mockAddEventListener		= jest.fn()
		const mockRemoveEventListener	= jest.fn()

		window.matchMedia = jest.fn().mockImplementation( query => ( {
			matches	: query === '(min-width: 768px)',
			media	: query,
			addEventListener	: mockAddEventListener,
			removeEventListener	: mockRemoveEventListener,
		} ) )

		const { result, rerender } = renderHook( ( { query } ) => useMediaQuery( query ), {
			initialProps: { query: '(min-width: 768px)' },
		} )

		expect( result.current ).toBe( true )

		rerender( { query: '(max-width: 767px)' } )
		expect( result.current ).toBe( false )

		expect( mockRemoveEventListener ).toHaveBeenCalled()
		expect( mockAddEventListener ).toHaveBeenCalled()
		
	} )

} )