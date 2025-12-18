import { renderHook, act } from '@testing-library/react'
import { useDocumentVisibility } from '@/browser-api/useDocumentVisibility'

describe( 'useDocumentVisibility', () => {

	const originalHidden = Object.getOwnPropertyDescriptor( document, 'hidden' )

	beforeEach( () => {

		// Reset document.hidden to false before each test
		Object.defineProperty( document, 'hidden', {
			get: () => false,
			configurable: true,
		} )

	} )


	afterAll( () => {

		// Restore original document.hidden
		if ( originalHidden ) {
			Object.defineProperty( document, 'hidden', originalHidden )
		}

	} )


	it( 'initialise to false to avoid hydration errors then it updates its value', () => {

		const { result } = renderHook( () => useDocumentVisibility() )
		expect( result.current ).toBe( true )

	} )


	it( 'updates state when document visibility changes', () => {

		const { result } = renderHook( () => useDocumentVisibility() )

		// Simulate document becoming hidden
		act( () => {
			Object.defineProperty( document, 'hidden', {
				get: () => true,
				configurable: true,
			} )
			document.dispatchEvent( new Event( 'visibilitychange' ) )
		} )

		expect( result.current ).toBe( false )

		// Simulate document becoming visible again
		act( () => {
			Object.defineProperty( document, 'hidden', {
				get: () => false,
				configurable: true,
			} )
			document.dispatchEvent( new Event( 'visibilitychange' ) )
		} )

		expect( result.current ).toBe( true )

	} )


	it( 'calls onVisibilityChange custom callback when visibility changes', () => {

		const onVisibilityChange = jest.fn()

		renderHook(() =>
			useDocumentVisibility( { onVisibilityChange } )
		)

		act( () => {
			Object.defineProperty( document, 'hidden', {
				get: () => true,
				configurable: true,
			} )
			document.dispatchEvent( new Event( 'visibilitychange' ) )
		} )

		expect( onVisibilityChange )
			.toHaveBeenCalledWith( false )

		act( () => {
			Object.defineProperty( document, 'hidden', {
				get: () => false,
				configurable: true,
			} )
			document.dispatchEvent( new Event( 'visibilitychange' ) )
		} )

		expect( onVisibilityChange )
			.toHaveBeenCalledWith( true )
		
	} )


	it( 'doesn\'t update state if updateState is set to false', () => {

		const { result } = renderHook( () =>
			useDocumentVisibility( { updateState: false } )
		)

		// Returns undefined when updateState is false
		expect( result.current ).toBeUndefined()

		act( () => {
			Object.defineProperty( document, 'hidden', {
				get: () => true,
				configurable: true,
			} )
			document.dispatchEvent( new Event( 'visibilitychange' ) )
		} )

		// Still undefined, state is not updated
		expect( result.current ).toBeUndefined()

	} )


	it( 'clean up event listener on unmount', () => {

		const addSpy		= jest.spyOn( document, 'addEventListener' )
		const removeSpy		= jest.spyOn( document, 'removeEventListener' )
		const { unmount }	= renderHook( () => useDocumentVisibility() )

		expect( addSpy )
			.toHaveBeenCalledWith( 'visibilitychange', expect.any( Function ) )
		
		unmount()

		expect( removeSpy )
			.toHaveBeenCalledWith( 'visibilitychange', expect.any( Function ) )
		
		addSpy.mockRestore()
		removeSpy.mockRestore()

	} )

} )