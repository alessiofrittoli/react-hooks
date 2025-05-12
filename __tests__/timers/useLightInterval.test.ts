import { act, renderHook } from '@testing-library/react'
import { useLightInterval } from '@/timers/useLightInterval'


describe( 'useLightInterval', () => {

	beforeAll( () => {
		jest.useFakeTimers()
	} )

	afterAll( () => {
		jest.clearAllTimers()
		jest.useRealTimers()
	} )


	it( 'calls the callback after the specified delay', () => {
	
		const callback	= jest.fn()
		const delay		= 1000

		renderHook( () => useLightInterval( callback, { delay } ) )

		expect( callback ).not.toHaveBeenCalled()

		act( () => {
			jest.advanceTimersByTime( delay )
		} )

		expect( callback ).toHaveBeenCalledTimes( 1 )

	} )


	it( 'calls the callback with optional arguments', () => {
	
		const callback	= jest.fn()
		const delay		= 1000
		const args		= [ 'argument1', 'argument2' ]

		renderHook( () => useLightInterval( callback, { delay, args } ) )

		expect( callback ).not.toHaveBeenCalled()

		act( () => {
			jest.advanceTimersByTime( delay )
		} )

		expect( callback ).toHaveBeenCalledWith( ...args )

	} )


	it( 'defaults delay to 1 if not provided', () => {

		const callback = jest.fn()

		renderHook( () => useLightInterval( callback ) )

		act( () => {
			jest.advanceTimersByTime( 1 )
		} )

		expect( callback ).toHaveBeenCalledTimes( 1 )

	} )


	it( 'clears the timer on unmount', () => {

		const callback	= jest.fn()
		const delay		= 1000

		const { unmount } = renderHook( () => useLightInterval( callback, { delay } ) )

		act( () => {
			unmount()
			jest.advanceTimersByTime( delay )
		} )

		expect( callback ).not.toHaveBeenCalled()

	} )

} )