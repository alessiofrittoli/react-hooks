import { act, renderHook } from '@testing-library/react'
import { useInView, type UseInViewOptions } from '@/dom-api/useInView'

type MockedIntersectionObserver = (
	jest.Mocked<IntersectionObserver>
	& {
		callback?: IntersectionObserverCallback
		options?: IntersectionObserverInit
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
		} as unknown as MockedIntersectionObserver

		global.IntersectionObserver = (
			jest.fn( ( callback, options ) => {

				mockIntersectionObserver.callback = callback
				mockIntersectionObserver.options = options

				if ( options?.root && ! ( options.root instanceof Element ) ) {
					throw new TypeError( 'Type error' )
				}
				
				return mockIntersectionObserver
			} )
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

		const options: UseInViewOptions = { initial: true }
		const { result } = renderHook( () => useInView( mockRef, options ) )
		expect( result.current.inView ).toBe( true )

	} )


	it( 'returns falsey state if IntersectionObserver is not defined', () => {

		global.IntersectionObserver = undefined as unknown as typeof IntersectionObserver

		const { result: { current } } = renderHook( () => useInView( mockRef ) )
		
		expect( current.inView ).toBe( false )
		expect( current.observer ).toBe( undefined )
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

		const onStartMock = jest.fn()
		const options: UseInViewOptions = { onStart: onStartMock }
		const { result } = renderHook( () => useInView( mockRef, options ) )

		const observerCallback = ( result.current.observer as MockedIntersectionObserver ).callback

		await act( async () => {
			await observerCallback?.( [], result.current.observer! )
		} )

		expect( result.current.inView ).toBe( false )
		expect( onStartMock ).not.toHaveBeenCalled()

	} )


	it( 'calls onStart callback when intersection occurs', async () => {

		const onStartMock = jest.fn()
		const options: UseInViewOptions = { onStart: onStartMock }
		const { result } = renderHook( () => useInView( mockRef, options ) )

		const observerCallback = ( result.current.observer as MockedIntersectionObserver ).callback
		const entry = { isIntersecting: true } as IntersectionObserverEntry

		await act( async () => {
			await observerCallback?.( [ entry ], result.current.observer! )
		} )

		expect( onStartMock )
			.toHaveBeenCalledWith( entry, result.current.observer )

	} )
	
	
	it( 'catches onStart callback errors without state updates', async () => {

		const consoleError	= jest.spyOn( console, 'error' )
		const onStartMock	= jest.fn( () => {
			throw new Error( 'For some reason' )
		} )
		const options: UseInViewOptions = { onStart: onStartMock }
		const { result } = renderHook( () => useInView( mockRef, options ) )

		const observerCallback = ( result.current.observer as MockedIntersectionObserver ).callback
		const entry = { isIntersecting: true } as IntersectionObserverEntry
		
		await act( async () => {
			await observerCallback?.( [ entry ], result.current.observer! )
		} )

		expect( result.current.inView ).toBe( false )
		expect( consoleError )
			.toHaveBeenCalledWith( new Error( 'For some reason' ) )

	} )


	it( 'catches IntersectionObserver constructing errors', () => {

		const consoleError = jest.spyOn( console, 'error' )

		// @ts-expect-error negative testing
		const options: UseInViewOptions = { root: true }
		
		renderHook( () => useInView( mockRef, options ) )

		expect( consoleError )
			.toHaveBeenCalledWith( expect.any( TypeError ) )

	} )

} )