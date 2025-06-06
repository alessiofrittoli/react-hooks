import { act, renderHook } from '@testing-library/react'
import { useInView, type UseInViewOptions } from '@/dom-api/useInView'

type MockedIntersectionObserver = (
	jest.Mocked<IntersectionObserver>
	& {
		callback?: IntersectionObserverCallback
		options?: IntersectionObserverInit
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		construct: jest.Mock<MockedIntersectionObserver, [callback: IntersectionObserverCallback, options?: IntersectionObserverInit | undefined], any>
	}
)

describe( 'useInView', () => {

	let mockRef: React.RefObject<Element | null>
	let mockIntersectionObserver: MockedIntersectionObserver

	beforeEach( () => {
		mockRef = { current: document.createElement( 'div' ) }

		mockIntersectionObserver = {
			observe		: jest.fn(),
			unobserve	: jest.fn(),
			disconnect	: jest.fn(),
			construct	: jest.fn( ( callback: IntersectionObserverCallback, options?: IntersectionObserverInit ) => {

				mockIntersectionObserver.callback = callback
				mockIntersectionObserver.options = options

				if ( options?.root && ! ( options.root instanceof Element ) ) {
					throw new TypeError( 'Type error' )
				}

				// the real intersection observer calls the `callback` on initialization.
				const entry = { isIntersecting: false } as IntersectionObserverEntry
				callback( [ entry ], mockIntersectionObserver )
				
				return mockIntersectionObserver

			} ),
		} as unknown as MockedIntersectionObserver


		global.IntersectionObserver = (
			jest.fn( mockIntersectionObserver.construct )
		)

	} )


	afterEach( () => {
		jest.restoreAllMocks().resetModules()
	} )


	it( 'returns initial state as false by default', () => {

		const { result } = renderHook( () => useInView( mockRef ) )
		expect( result.current.inView ).toBe( false )
	
	} )


	it( 'returns initial state as true when initial option is set to true', () => {

		/**
		 * Mock constructor implementation to avoid the initial `callback` call
		 * made by `IntersectionObserver` by default.
		 * 
		 * We can't check that double state update.
		 */
		mockIntersectionObserver.construct.mockImplementationOnce( ( callback, options ) => {

			mockIntersectionObserver.callback	= callback
			mockIntersectionObserver.options	= options
			
			return mockIntersectionObserver

		} )

		const options: UseInViewOptions = { initial: true }
		const { result } = renderHook( () => useInView( mockRef, options ) )
		expect( result.current.inView ).toBe( true )

	} )


	it( 'returns falsey state if IntersectionObserver is not defined', () => {

		global.IntersectionObserver = undefined as unknown as typeof IntersectionObserver

		const { result: { current } } = renderHook( () => useInView( mockRef ) )
		
		expect( current.inView ).toBe( false )
		expect( current.observer ).toBeUndefined()
		expect( typeof current.setInView ).toBe( 'function' )
	
	} )


	it( 'creates an IntersectionObserver instance', () => {

		const { result } = renderHook( () => useInView( mockRef ) )

		expect( result.current.observer )
			.toBe( mockIntersectionObserver )

	} )


	it( 'sets threshold to 1 if given `amount` is set to all', () => {

		renderHook( () => useInView( mockRef, { amount: 'all' } ) )

		expect( mockIntersectionObserver.options?.threshold )
			.toBe( 1 )

	} )
	
	
	it( 'sets threshold to 0.5 if given `amount` is set to some', () => {

		renderHook( () => useInView( mockRef, { amount: 'some' } ) )

		expect( mockIntersectionObserver.options?.threshold )
			.toBe( 0.5 )

	} )
	
	
	it( 'sets threshold to given `amount` if number is given', () => {

		renderHook( () => useInView( mockRef, { amount: 0.85 } ) )

		expect( mockIntersectionObserver.options?.threshold )
			.toBe( 0.85 )

	} )


	it( 'observes the given target', () => {

		const observe = jest.spyOn( mockIntersectionObserver, 'observe' )

		renderHook( () => useInView( mockRef ) )

		expect( observe ).toHaveBeenCalledWith( mockRef.current )
		
	} )


	it( 'doesn\'t observe if target ref is falsey', () => {

		const observe = jest.spyOn( mockIntersectionObserver, 'observe' )

		renderHook( () => useInView( { current: null } ) )

		expect( observe ).not.toHaveBeenCalled()
		
	} )


	it( 'updates inView state when intersection occurs', async () => {

		const { result } = renderHook( () => useInView( mockRef ) )

		const observerCallback = ( result.current.observer as MockedIntersectionObserver ).callback
		const entry = { isIntersecting: true } as IntersectionObserverEntry
		
		await act( async () => {
			await observerCallback?.( [ entry ], result.current.observer! )
		} )

		expect( result.current.inView ).toBe( true )

	} )


	it( 'allows consumer to update inView state', async () => {

		const { result } = renderHook( () => useInView( mockRef ) )
		
		expect( result.current.inView ).toBe( false )

		await act( async () => {
			result.current.setInView( true )
		} )

		expect( result.current.inView ).toBe( true )

	} )


	it( 'allows on-demand target observation', async () => {

		const { result } = renderHook( () => useInView( mockRef, { enable: false } ) )

		expect( result.current.enabled )
			.toBe( false )
		expect( typeof result.current.setEnabled )
			.toBe( 'function' )
		expect( result.current.observer )
			.toBeUndefined()
		
		act( () => {
			result.current.setEnabled( true )
		} )

		expect( result.current.enabled )
			.toBe( true )
		expect( result.current.observer )
			.toBe( mockIntersectionObserver )


		const observerCallback = ( result.current.observer as MockedIntersectionObserver ).callback
		const entry = { isIntersecting: true } as IntersectionObserverEntry
		
		await act( async () => {
			await observerCallback?.( [ entry ], result.current.observer! )
		} )

		expect( result.current.inView ).toBe( true )

	} )


	it( 'disconnects observer when component unmounts', () => {

		const { unmount } = renderHook( () => useInView( mockRef ) )
		
		unmount()

		expect( mockIntersectionObserver.disconnect )
			.toHaveBeenCalled()

	} )


	it( 'disconnects observer if once option is true and intersection occurs', async () => {

		const options: UseInViewOptions = { once: true }
		const { result } = renderHook( () => useInView( mockRef, options ) )

		const observerCallback = ( result.current.observer as MockedIntersectionObserver ).callback
		const entry = { isIntersecting: true } as IntersectionObserverEntry
		
		await act( async () => {
			await observerCallback?.( [ entry ], result.current.observer! )
		} )

		expect( mockIntersectionObserver.disconnect )
			.toHaveBeenCalled()

	} )


	it( 'does nothing if entry is undefined in IntersectionObserver callback', async () => {

		const onIntersectMock = jest.fn()
		const options: UseInViewOptions = { onIntersect: onIntersectMock }
		const { result } = renderHook( () => useInView( mockRef, options ) )

		const observerCallback = ( result.current.observer as MockedIntersectionObserver ).callback

		await act( async () => {
			await observerCallback?.( [], result.current.observer! )
		} )

		expect( result.current.inView ).toBe( false )
		expect( onIntersectMock ).not.toHaveBeenCalled()

	} )


	it( 'calls onIntersect callback when intersection occurs', async () => {

		const onIntersectMock = jest.fn()
		const options: UseInViewOptions = { onIntersect: onIntersectMock }
		const { result } = renderHook( () => useInView( mockRef, options ) )

		const observerCallback = ( result.current.observer as MockedIntersectionObserver ).callback
		const entry = { isIntersecting: true } as IntersectionObserverEntry

		await act( async () => {
			await observerCallback?.( [ entry ], result.current.observer! )
		} )
		
		await act( async () => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			;( entry as any ).isIntersecting = false
			await observerCallback?.( [ entry ], result.current.observer! )
		} )

		expect( onIntersectMock )
			.toHaveBeenNthCalledWith( 1, {
				entry,
				observer	: result.current.observer,
				isEntering	: true,
				isExiting	: false,
			} )
		
		expect( onIntersectMock )
			.toHaveBeenNthCalledWith( 2, {
				entry,
				observer	: result.current.observer,
				isEntering	: false,
				isExiting	: true,
			} )

	} )


	it( 'doesn\'t call onIntersect callback on initialization', async () => {

		const onIntersectMock = jest.fn()
		const options: UseInViewOptions = { onIntersect: onIntersectMock }
		renderHook( () => useInView( mockRef, options ) )

		expect( onIntersectMock ).toHaveBeenCalledTimes( 0 )

	} )


	it( 'calls onEnter when target is intersecting', async () => {

		const onEnterMock = jest.fn()
		const options: UseInViewOptions = { onEnter: onEnterMock }
		const { result } = renderHook( () => useInView( mockRef, options ) )

		const observerCallback = ( result.current.observer as MockedIntersectionObserver ).callback
		const entry = { isIntersecting: true } as IntersectionObserverEntry

		await act( async () => {
			await observerCallback?.( [ entry ], result.current.observer! )
		} )

		expect( onEnterMock )
			.toHaveBeenCalledWith( {
				entry,
				observer: result.current.observer,
			} )

	} )
	
	
	it( 'calls onExit when target enter then exit the viewport', async () => {

		const onExitMock = jest.fn()
		const options: UseInViewOptions = { onExit: onExitMock }
		const { result } = renderHook( () => useInView( mockRef, options ) )
	
		const observerCallback = ( result.current.observer as MockedIntersectionObserver ).callback
		const entry = { isIntersecting: true } as IntersectionObserverEntry
	
		await act( async () => {
			await observerCallback?.( [ entry ], result.current.observer! )
		} )
		await act( async () => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			;( entry as any ).isIntersecting = false
			await observerCallback?.( [ entry ], result.current.observer! )
		} )
	
		expect( onExitMock )
			.toHaveBeenCalledWith( {
				entry,
				observer: result.current.observer,
			} )

	} )


	it( 'doesn\'t update state if Component did unmount after awaiting onIntersect', async () => {

		const onIntersectMock = jest.fn()
		const options: UseInViewOptions = { onIntersect: onIntersectMock }
		const { result, unmount } = renderHook( () => useInView( mockRef, options ) )

		const observerCallback = ( result.current.observer as MockedIntersectionObserver ).callback
		const entry = { isIntersecting: true } as IntersectionObserverEntry

		unmount()

		await act( async () => {
			await observerCallback?.( [ entry ], result.current.observer! )
		} )


		expect( result.current.inView ).toBe( false )

	} )
	
	
	it( 'catches onIntersect callback errors without state updates', async () => {

		const consoleError = (
			jest.spyOn( console, 'error' )
				.mockImplementationOnce( () => {} ) // do not print to stdout.
		)

		const onIntersectMock = jest.fn( () => {
			throw new Error( 'For some reason' )
		} )
		const options: UseInViewOptions = { onIntersect: onIntersectMock }
		const { result } = renderHook( () => useInView( mockRef, options ) )

		const observerCallback = ( result.current.observer as MockedIntersectionObserver ).callback
		const entry = { isIntersecting: true } as IntersectionObserverEntry
		
		await act( async () => {
			await observerCallback?.( [ entry ], result.current.observer! )
		} )

		expect( result.current.inView ).toBe( false ) // state update not triggered
		expect( consoleError )
			.toHaveBeenCalledWith( new Error( 'For some reason' ) )
		
		consoleError.mockRestore()
	} )


	it( 'catches IntersectionObserver constructing errors', () => {

		const consoleError = (
			jest.spyOn( console, 'error' )
				.mockImplementationOnce( () => {} ) // do not print to stdout.
		)

		// @ts-expect-error negative testing
		const options: UseInViewOptions = { root: true }
		
		renderHook( () => useInView( mockRef, options ) )

		expect( consoleError )
			.toHaveBeenCalledWith( expect.any( TypeError ) )

		consoleError.mockRestore()
	} )

} )