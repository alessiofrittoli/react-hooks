import { useTimeout } from '@/timers/useTimeout'
import { act, renderHook } from '@testing-library/react'


describe( 'useTimeout', () => {
	
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

		renderHook( () => useTimeout( callback, { delay } ) )

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

		renderHook( () => useTimeout( callback, { delay, args } ) )

		expect( callback ).not.toHaveBeenCalled()

		act( () => {
			jest.advanceTimersByTime( delay )
		} )

		expect( callback ).toHaveBeenCalledWith( ...args )

	} )


	it( 'defaults delay to 1 if not provided', () => {

		const callback = jest.fn()

		renderHook( () => useTimeout( callback ) )

		act( () => {
			jest.advanceTimersByTime( 1 )
		} )

		expect( callback ).toHaveBeenCalledTimes( 1 )

	} )


	it( 'clears the timeout on unmount', () => {

		const callback	= jest.fn()
		const delay		= 1000

		const { unmount } = renderHook( () => useTimeout( callback, { delay } ) )

		act( () => {
			unmount()
			jest.advanceTimersByTime( delay )
		} )

		expect( callback ).not.toHaveBeenCalled()

	} )


	it( 'optionally update state', () => {

		const callback	= jest.fn()
		const delay		= 1000

		const { result } = renderHook( () => (
			useTimeout( callback, { delay, updateState: true } )
		) )

		expect( result.current.isActive )
			.toBe( true )

		act( () => {
			jest.advanceTimersByTime( delay )
		} )

		expect( result.current.isActive )
			.toBe( false )

	} )


	it( 'allows to disable autoplay', () => {

		const callback	= jest.fn()
		const delay		= 1000
		
		renderHook( () => (
			useTimeout( callback, { delay, autoplay: false } )
		) )

		act( () => {
			jest.advanceTimersByTime( delay )
		} )
		
		expect( callback ).not.toHaveBeenCalled()

	} )


	describe( 'start', () => {

		it( 'provides start method to manually start the timer', () => {
	
			const callback	= jest.fn()
			const delay		= 1000
	
			const { result } = renderHook( () => (
				useTimeout( callback, { delay, autoplay: false } )
			) )
	
			expect( callback ).not.toHaveBeenCalled()
	
			act( () => {
				result.current.start()
				jest.advanceTimersByTime( delay )
			} )
			
			expect( callback ).toHaveBeenCalled()
	
		} )


		it( 'optionally run callback when timer starts', () => {

			const callback	= jest.fn()
			const delay		= 1000
	
			renderHook( () => (
				useTimeout( callback, { delay, runOnStart: true } )
			) )
	
			act( () => {
				jest.advanceTimersByTime( delay )
			} )
	
			expect( callback ).toHaveBeenCalledTimes( 2 )
	
		} )
		
		
		it( 'optionally run callback with custom args when timer starts', () => {

			const callback	= jest.fn()
			const delay		= 1000
	
			renderHook( () => (
				useTimeout( callback, { delay, args: [ 1, 2 ], runOnStart: true } )
			) )
	
			act( () => {
				jest.advanceTimersByTime( delay )
			} )
	
			expect( callback ).toHaveBeenCalledTimes( 2 )
			expect( callback ).toHaveBeenCalledWith( 1, 2 )
	
		} )


		it( 'set isActive to true only when timer was previously inactive', () => {

			const callback		= jest.fn()
			const delay			= 1000
			const autoplay		= false
			const updateState	= true
	
			const { result } = renderHook( () => (
				useTimeout( callback, { delay, autoplay, updateState } )
			) )

			expect( result.current.isActive ).toBe( false )
	
			act( () => {
				result.current.start()
			} )

			expect( result.current.isActive ).toBe( true )

		} )

	} )
	
	
	describe( 'stop', () => {

		it( 'provides stop method to manually stop the timer', () => {
	
			const callback	= jest.fn()
			const delay		= 1000
	
			const { result } = renderHook( () => (
				useTimeout( callback, { delay } )
			) )

			
			act( () => {
				jest.advanceTimersByTime( delay / 2 )
				result.current.stop()
				jest.advanceTimersByTime( delay / 2 )
			} )
			
			expect( callback ).not.toHaveBeenCalled()
	
		} )

		
		it( 'does nothing if no timer has been initialised', () => {
	
			const callback	= jest.fn()
			const delay		= 1000
	
			const { result } = renderHook( () => (
				useTimeout( callback, { delay, autoplay: false } )
			) )
			
			const clearTimeout = jest.spyOn( global, 'clearTimeout' )

			result.current.stop()
			
			expect( callback ).not.toHaveBeenCalled()
			expect( clearTimeout ).not.toHaveBeenCalled()

		} )


		it( 'sets isActive to false only when timer is running and updateState is true', () => {

			const callback		= jest.fn()
			const delay			= 1000
			const autoplay		= true
			const updateState	= true
	
			const { result } = renderHook( () => (
				useTimeout( callback, { delay, autoplay, updateState } )
			) )

			expect( result.current.isActive ).toBe( true )
	
			act( () => {
				result.current.stop()
			} )

			expect( result.current.isActive ).toBe( false )

		} )

	} )
	
} )