import { fireEvent } from '@testing-library/dom'
import { renderHook } from '@testing-library/react'
import { EventEmitter } from '@alessiofrittoli/event-emitter'
import { useEventListener } from '@/browser-api/useEventListener'


describe( 'useEventListener', () => {


	describe( 'Lifecycle', () => {

		it( 'execute `onLoad` on mount', () => {
	
			const onLoadMock = jest.fn()
		
			renderHook( () => (
				useEventListener( 'resize', {
					onLoad	: onLoadMock,
					listener: jest.fn(),
				} )
			) )
	
			expect( onLoadMock ).toHaveBeenCalled()
	
		} )
		
		
		it( 'execute `onCleanUp` on unmount', () => {
	
			const onLoadMock	= jest.fn()
			const onCleanUpMock = jest.fn()
		
			const { rerender } = renderHook( () => (
				useEventListener( 'resize', {
					onLoad		: onLoadMock,
					onCleanUp	: onCleanUpMock,
					listener	: jest.fn(),
				} )
			) )
	
			expect( onCleanUpMock ).not.toHaveBeenCalled()
			
			rerender()
			
			expect( onCleanUpMock ).toHaveBeenCalled()
			expect( onLoadMock ).toHaveBeenCalledTimes( 2 )

		} )


	} )




	describe( 'Window', () => {

		it( 'attaches a window event listener', () => {

			const mockListener = jest.fn()
	
			renderHook( () => (
				useEventListener( 'resize', {
					listener: mockListener,
				} )
			) )
	
			fireEvent( window, new Event( 'resize' ) )
			expect( mockListener ).toHaveBeenCalledTimes( 1 )
	
		} )

	} )

	
	describe( 'Document', () => {

		it( 'attaches a Document event listener', () => {
	
			const mockListener = jest.fn()
	
			renderHook( () => (
				useEventListener( 'visibilitychange', {
					target		: typeof document !== 'undefined' ? document : null,
					listener	: mockListener,
				} )
			) )
	
			fireEvent( document, new Event( 'visibilitychange' ) )
			expect( mockListener ).toHaveBeenCalledTimes( 1 )
	
		} )
		
		
		it( 'attaches a React RefObject Document event listener', () => {
	
			const mockListener	= jest.fn()
			const documentRef	= { current: typeof document !== 'undefined' ? document : null }
	
			renderHook( () => (
				useEventListener( 'visibilitychange', {
					target		: documentRef,
					listener	: mockListener,
				} )
			) )
	
			fireEvent( document, new Event( 'visibilitychange' ) )
			expect( mockListener ).toHaveBeenCalledTimes( 1 )
	
		} )

	} )


	describe( 'HTMLElement', () => {

		it( 'attaches a HTMLElement event listener', () => {
	
			const mockListener	= jest.fn()
			const element		= document.createElement( 'button' )
	
			renderHook( () => (
				useEventListener( 'click', {
					target		: element,
					listener	: mockListener,
				} )
			) )
	
			fireEvent.click( element )
			expect( mockListener ).toHaveBeenCalledTimes( 1 )
	
		} )


		it( 'attaches a React RefObject HTMLElement event listener', () => {
	
			const mockListener	= jest.fn()
			const element		= document.createElement( 'button' )
			const elementRef	= { current: element }
	
			renderHook( () => (
				useEventListener( 'click', {
					target		: elementRef,
					listener	: mockListener,
				} )
			) )
	
			fireEvent.click( element )
			expect( mockListener ).toHaveBeenCalledTimes( 1 )
	
		} )

	} )


	describe( 'MediaQueryList', () => {

		it( 'attaches a MediaQueryList event listener', () => {

			const emitter = new EventEmitter()

			Object.defineProperty( window, 'matchMedia', {
				writable: true,
				value: jest.fn().mockImplementation( query => ( {
					matches	: query === '(min-width: 768px)',
					media	: query,
					addEventListener: jest.fn( ( type, listener ) => {
						emitter.on( type, listener )
					} ),
					removeEventListener: jest.fn( ( type, listener ) => {
						emitter.off( type, listener )
					} ),
					dispatchEvent: jest.fn( ( event: Event ) => {
						emitter.emit( event.type, event )
					} ),
				} ) ),
			} )

			const mockListener		= jest.fn()
			const query				= '(max-width: 768px)'
			const mediaQueryList	= window.matchMedia( query )


			renderHook( () => (
				useEventListener( 'change', {
					query		: query,
					listener	: mockListener,
				} )
			) )

			mediaQueryList.dispatchEvent( new Event( 'change' ) )
			expect( mockListener ).toHaveBeenCalledTimes( 1 )

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			;( window as any ).matchMedia = undefined

		} )

	} )


	describe( 'Custom events', () => {

		it( 'allows listening to custom events', () => {
	
			const mockListener	= jest.fn()
			const element		= document.createElement( 'div' )
			const elementRef	= { current: element }
	
	
			renderHook( () => (
				useEventListener( 'customevent', {
					target		: elementRef,
					listener	: mockListener,
				} )
			) )
	
			fireEvent( element, new Event( 'customevent' ) )
			expect( mockListener ).toHaveBeenCalledTimes( 1 )
	
		} )


		it( 'allows listening to custom typed events', () => {

			interface Details
			{
				property?: string
			}

			type CustomEventMap = {
				customevent			: CustomEvent<Details>
				anothercustomEvent	: MouseEvent
			}
	
			const mockListener	= jest.fn()
			const element		= document.createElement( 'div' )
			const elementRef	= { current: element }
	
			renderHook( () => (
				useEventListener<CustomEventMap, 'customevent'>( 'customevent', {
					target  : elementRef,
					listener: mockListener,
				} )
			) )
	
			const customEvent = (
				new CustomEvent<Details>( 'customevent', {
					detail: { property: 'value' }
				} )
			)

			fireEvent( element, customEvent )
			expect( mockListener ).toHaveBeenCalledWith( customEvent )
	
		} )

	} )


	describe( 'Multiple events', () => {

		it( 'allows listening to multiple events', () => {

			const mockListener = jest.fn()
			
			renderHook( () => (
				useEventListener( [ 'click', 'scroll' ], {
					listener: mockListener,
				} )
			) )

			const scrollEvent	= new Event( 'scroll' )
			const clickEvent	= new MouseEvent( 'click' )

			fireEvent( window, scrollEvent )
			fireEvent( window, clickEvent )

			expect( mockListener ).toHaveBeenCalledTimes( 2 )

			expect( mockListener ).toHaveBeenNthCalledWith( 1, scrollEvent )
			expect( mockListener ).toHaveBeenNthCalledWith( 2, clickEvent )

		} )

	} )


	it( 'doesn\'t attach listener to the given target if `.addEventListener()` is not defined', () => {
		
		const mockListener	= jest.fn()
		const element		= document.createElement( 'button' )

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		;( element as any ).addEventListener = undefined
		
		renderHook( () => (
			useEventListener( 'click', {
				target	: element,
				listener: mockListener,
			} )
		) )

		fireEvent( element, new Event( 'click' ) )
		expect( mockListener ).not.toHaveBeenCalled()

	} )


	it( 'clean up event listeners on unmount', () => {

		const mockListener = jest.fn()

		const { unmount } = renderHook( () => (
			useEventListener( 'scroll', {
				listener: mockListener,
			} )
		) )

		fireEvent( window, new Event( 'scroll' ) )
		unmount()
		fireEvent( window, new Event( 'scroll' ) )

		expect( mockListener ).toHaveBeenCalledTimes( 1 )

	} )

} )