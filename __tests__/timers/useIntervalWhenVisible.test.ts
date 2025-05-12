import { renderHook } from '@testing-library/react'
import { useIntervalWhenVisible } from '@/timers/useIntervalWhenVisible'
import { useInterval as _useInterval } from '@/timers/useInterval'

jest.mock( '@/timers/useInterval' )

const useInterval = _useInterval as jest.Mock


describe( 'useIntervalWhenVisible', () => {

	let mockStart	: jest.Mock
	let mockStop	: jest.Mock

	beforeEach( () => {

		mockStart	= jest.fn()
		mockStop	= jest.fn()

		useInterval.mockReturnValue( {
			start	: mockStart,
			stop	: mockStop,
		} )

		Object.defineProperty( document, 'hidden', {
			configurable	: true,
			writable		: true,
			value			: false,
		} )

	} )


	afterEach( () => {
		jest.clearAllMocks().resetModules()
	} )


	it( 'starts the interval when autoplay is true and document is visible', () => {

		renderHook( () => useIntervalWhenVisible( jest.fn() ) )

		expect( mockStart ).toHaveBeenCalledTimes( 1 )
		expect( mockStop ).not.toHaveBeenCalled()

	} )


	it( 'doesn\'t start the interval when autoplay is false', () => {

		renderHook( () => useIntervalWhenVisible( jest.fn(), { autoplay: false } ) )

		expect( mockStart ).not.toHaveBeenCalled()
		expect( mockStop ).not.toHaveBeenCalled()

	} )


	it( 'starts the interval manually when start is called', () => {

		const { result } = renderHook( () => (
			useIntervalWhenVisible( jest.fn(), { autoplay: false } )
		) )

		result.current.start()

		expect( mockStart ).toHaveBeenCalledTimes( 1 )
		expect( mockStop ).not.toHaveBeenCalled()

	} )


	it( 'stops the interval manually when stop is called', () => {

		const { result } = renderHook( () => (
			useIntervalWhenVisible( jest.fn() )
		) )

		result.current.stop()

		expect( mockStop ).toHaveBeenCalledTimes( 1 )
		expect( mockStart ).toHaveBeenCalledTimes( 1 )

	} )


	it( 'handles visibility change events', () => {

		const { result } = renderHook( () => (
			useIntervalWhenVisible( jest.fn(), { autoplay: false } )
		) )

		result.current.start()

		expect( mockStart ).toHaveBeenCalledTimes( 1 )

		Object.defineProperty( document, 'hidden', { value: true } )
		document.dispatchEvent( new Event( 'visibilitychange' ) )

		expect( mockStop ).toHaveBeenCalledTimes( 1 )


		Object.defineProperty( document, 'hidden', { value: false } )
		document.dispatchEvent( new Event( 'visibilitychange' ) )

		expect( mockStart ).toHaveBeenCalledTimes( 2 )

	} )


	it( 'clean up visibility change listener on unmount', () => {

		const { unmount } = renderHook( () => (
			useIntervalWhenVisible( jest.fn() )
		) )

		const removeEventListener = jest.spyOn( document, 'removeEventListener' )

		unmount()

		expect( mockStop ).toHaveBeenCalledTimes( 1 )

		expect( removeEventListener )
			.toHaveBeenCalledWith( 'visibilitychange', expect.any( Function ) )

	} )

} )