import { useEffect } from 'react'

type CommonEventHandler<
	W extends keyof WindowEventMap,
	D extends keyof DocumentEventMap,
	E extends keyof HTMLElementEventMap,
	M extends keyof MediaQueryListEventMap,
	C extends keyof Record<string, Event>,
> = ( event: (
	| WindowEventMap[ W ]
	| DocumentEventMap[ D ]
	| HTMLElementEventMap[ E ]
	| MediaQueryListEventMap[ M ]
	| Record<string, Event>[ C ]
	| Event
) ) => void


/**
 * Specifies characteristics about the event listener.
 * 
 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#options)
 */
export interface AddEventListenerOptions
{
	/**
	 * A boolean value indicating that events of this type will be dispatched to the registered
	 * listener before being dispatched to any `EventTarget`beneath it in the DOM tree.
	 * 
	 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#capture) 
	 * 
	 * @default false
	 */
	capture?: boolean
	/**
	 * A boolean value indicating that the listener should be invoked at most once after being added.
	 * If `true`, the listener would be automatically removed when invoked.
	 * 
	 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#once) 
	 * 
	 * @default false
	 */
    once?: boolean
	/**
	 * A boolean value that, if `true`, indicates that the function specified by `listener`
	 * will never call [`preventDefault()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault).
	 * If a passive listener calls `preventDefault()`, nothing will happen and a console warning may be generated.
	 * 
	 * If this option is not specified it defaults to `false` – except that in browsers other than Safari,
	 * it defaults to `true` for [`wheel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event),
	 * [`mousewheel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mousewheel_event),
	 * [`touchstart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchstart_event) and
	 * [`touchmove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchmove_event) events.
	 * 
	 * See [Using passive listeners](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#using_passive_listeners) to learn more.
	 * 
	 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#passive) 
	 */
    passive?: boolean
	/**
	 * An [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal).
	 * The listener will be removed when the
	 * [`abort()`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort) method
	 * of the [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) which
	 * owns the `AbortSignal` is called. If not specified, no `AbortSignal` is associated with the listener.
	 * 
	 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#signal) 
	 */
    signal?: AbortSignal
}


/**
 * The `addEventListener` options.
 * 
 * - If `boolean` is given, indicates whether events of this type will be dispatched to the registered
 * listener before being dispatched to any EventTarget beneath it in the DOM tree. See [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#usecapture).
 * - If an object is given, it specifies characteristics about the event listener. See [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#options).
 */
export type ListenerOptions = boolean | AddEventListenerOptions


/**
 * The Window Event listener.
 * 
 * @param event The event object that implements the [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event) interface.
 */
export type WindowEventListener<
	K extends keyof WindowEventMap
> = ( event: WindowEventMap[ K ] ) => void


/**
 * The Document Event listener.
 * 
 * @param event The event object that implements the [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event) interface.
 */
export type DocumentEventListener<
	K extends keyof DocumentEventMap
> = ( event: DocumentEventMap[ K ] ) => void


/**
 * The MediaQueryList Event listener.
 * 
 * @param event The [`MediaQueryListEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryListEvent) object.
 */
export type MediaQueryEventListener<
	K extends keyof MediaQueryListEventMap
> = ( event: MediaQueryListEventMap[ K ] ) => void


/**
 * The MediaQueryList "change" Event listener.
 * 
 * @param event The [`MediaQueryListEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryListEvent) object.
 */
export type MediaQueryChangeListener = ( event: MediaQueryListEventMap[ 'change' ] ) => void


/**
 * The HTMLElement Event listener.
 * 
 * @param event The event object that implements the [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event) interface.
 */
export type ElementEventListener<
	K extends keyof HTMLElementEventMap
> = ( event: HTMLElementEventMap[ K ] ) => void


export interface CommonListenerOptions
{
	/**
	 * A custom callback executed before event listener get attached.
	 * 
	 */
	onLoad?: () => void
	/**
	 * A custom callback executed after event listener get removed.
	 * 
	 */
	onCleanUp?: () => void
	/**
	 * Specifies characteristics about the event listener.
	 * 
	 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#options)
	 */
	options?: ListenerOptions
}


export interface WindowListenerOptions<
	K extends keyof WindowEventMap
> extends CommonListenerOptions
{
	/**
	 * The Window Event listener.
	 * 
	 * @param event The event object that implements the [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event) interface.
	 */
	listener: WindowEventListener<K>
}


export interface DocumentListenerOptions<
	K extends keyof DocumentEventMap
> extends CommonListenerOptions
{
	/**
	 * The `Document` reference or a React RefObject of the `Document`.
	 * 
	 */
	target: Document | null | React.RefObject<Document | null>,
	/**
	 * The Document Event listener.
	 * 
	 * @param event The event object that implements the [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event) interface.
	 */
	listener: DocumentEventListener<K>,
}


export interface ElementListenerOptions<
	T extends HTMLElement,
	K extends keyof HTMLElementEventMap,
> extends CommonListenerOptions
{
	/**
	 * The React RefObject of the target where the listener get attached to.
	 * 
	 */
	target: T | React.RefObject<T | null>,
	/**
	 * The HTMLElement Event listener.
	 * 
	 * @param event The event object that implements the [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event) interface.
	 */
	listener: ElementEventListener<K>,
}


export interface MediaQueryListenerOptions extends CommonListenerOptions
{
	/**
	 * The Media Query string to check.
	 * 
	 */
	query: string,
	/**
	 * The MediaQueryList Event listener.
	 * 
	 * @param event The [`MediaQueryListEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryListEvent) object.
	 */
	listener: MediaQueryChangeListener,
}


export interface CustomEventListenerOptions<
	T extends Record<string, Event>,
	K extends keyof T = keyof T,
> extends CommonListenerOptions
{
	/**
	 * The target where the listener get attached to.
	 * 
	 * If not set, the listener will get attached to the `Window` object.
	 */
	target?: Document | HTMLElement | null | React.RefObject<Document | HTMLElement | null>
	/**
	 * The Event listener.
	 * 
	 * @param event The event object that implements the [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event) interface.
	 */
	listener: ( event: T[ K ] ) => void
}


/**
 * Attach a new Event listener to the `Window` object.
 * 
 * @param type		The `Window` event name or an array of event names.
 * @param options	An object defining init options. See {@link WindowListenerOptions} for more info.
 * 
 * @example
 * 
 * #### Add a new `Window` event listener
 * 
 * ```ts
 * useEventListener( 'scroll', {
 * 	listener: useCallback( () => {
 * 		console.log( window.scrollY )
 * 	}, [] )
 * } )
 * ```
 * 
 * ---
 * 
 * #### Add multiple `Window` event listeners
 * 
 * ```ts
 * useEventListener( [ 'scroll', 'resize' ], {
 * 	listener: useCallback( event => {
 * 		console.log( event )
 * 	}, [] )
 * } )
 * ```
 */
export function useEventListener<K extends keyof WindowEventMap>(
	type	: K | K[],
	options	: WindowListenerOptions<K>
): void


/**
 * Attach a new Event listener to the `Document` object.
 * 
 * @param type		The `Document` event name or an array of event names.
 * @param options	An object defining init options. See {@link DocumentListenerOptions} for more info.
 * 
 * @example
 * 
 * #### Add a new `Document` event listener
 * 
 * ```ts
 * // A React.RefObject<Document | null> can be used too.
 * const documentRef = useRef( typeof document !== 'undefined' ? document : null )
 * 
 * useEventListener( 'visibilitychange', {
 * 	target  : typeof document !== 'undefined' ? document : null, // or `documentRef`
 * 	listener: useCallback( () => {
 * 		console.log( document.visibilityState )
 * 	}, [] )
 * } )
 * ```
 * 
 * ---
 * 
 * #### Add multiple `Document` event listeners
 * 
 * ```ts
 * useEventListener( [ 'visibilitychange', 'dblclick' ], {
 * 	target  : typeof document !== 'undefined' ? document : null,
 * 	listener: useCallback( ( event ) => {
 * 		console.log( event )
 * 	}, [] )
 * } )
 * ```
 */
export function useEventListener<K extends keyof DocumentEventMap>(
	type	: K | K[],
	options	: DocumentListenerOptions<K>
): void


/**
 * Attach a new Event listener to a `HTMLElement` object.
 * 
 * @param type		The `HTMLElement` event name or an array of event names.
 * @param options	An object defining init options. See {@link ElementListenerOptions} for more info.
 * 
 * @example
 * 
 * #### Add a new `HTMLElement` event listener
 * 
 * ```tsx
 * 'use client'
 * 
 * const Component: React.FC = () => {
 * 
 * 	const elementRef = useRef<HTMLButtonElement>( null )
 * 
 * 	useEventListener( 'click', {
 * 		target  : elementRef,
 * 		listener: useCallback( event => {
 * 			console.log( event )
 * 		}, [] )
 * 	} )
 * 
 * 	return (
 * 		<button ref={ elementRef }>Click me</button>
 * 	)
 * 
 * }
 * ```
 * 
 * ---
 * 
 * #### Add multiple `HTMLElement` event listeners
 * 
 * ```tsx
 * 'use client'
 * 
 * const Component: React.FC = () => {
 * 
 * 	const elementRef = useRef<HTMLButtonElement>( null )
 * 
 * 	useEventListener( [ 'click', 'touchmove' ], {
 * 		target  : elementRef,
 * 		listener: useCallback( event => {
 * 			console.log( event )
 * 		}, [] )
 * 	} )
 * 
 * 	return (
 * 		<button ref={ elementRef }>Click me</button>
 * 	)
 * 
 * }
 * ```
 */
export function useEventListener<
	T extends HTMLElement,
	K extends keyof HTMLElementEventMap,
>(
	type	: K | K[],
	options	: ElementListenerOptions<T, K>
): void


/**
 * Listen MediaQuery changes.
 * 
 * @param type		The `MediaQueryList` event name.
 * @param options	An object defining init options. See {@link MediaQueryListenerOptions} for more info.
 * 
 * @example
 * 
 * #### Listen for MediaQuery changes.
 * 
 * ```ts
 * useEventListener( 'change', {
 * 	query   : '(max-width: 768px)',
 * 	listener: useCallback( event => {
 * 		console.error( event.matches )
 * 	}, [] ),
 * } )
 * ```
 */
export function useEventListener(
	type	: 'change',
	options	: MediaQueryListenerOptions
): void


/**
 * Attach a new custom Event listener to the given target.
 * 
 * @param type		The custom event name or an array of event names.
 * @param options	An object defining init options. See {@link CustomEventListenerOptions} for more info.
 * 
 * @example
 * 
 * #### Add a new custom event listener
 * 
 * ```tsx
 * 'use client'
 * 
 * const Component: React.FC = () => {
 * 
 * 	const elementRef = useRef<HTMLButtonElement>( null )
 * 
 * 	useEventListener( 'customevent', {
 * 		target  : elementRef, // could be document. window will be used if omitted.
 * 		listener: useCallback( event => {
 * 			console.log( event )
 * 		}, [] )
 * 	} )
 * 
 * 	useEffect( () => {
 * 		elementRef.current?.dispatchEvent( new Event( 'customevent' ) )
 * 	}, [] )
 * 
 * 	return (
 * 		<button ref={ elementRef }>Button</button>
 * 	)
 * 
 * }
 * ```
 * 
 * ---
 * 
 * #### Adding types for custom events
 * 
 * ```tsx
 * interface Details
 * {
 * 	property?: string
 * }
 * 
 * type CustomEventMap = {
 * 	customevent		: CustomEvent<Details>
 * 	anothercustomEvent	: MouseEvent
 * }
 * 
 * type CustomEventType = keyof CustomEventMap
 * const elementRef = useRef<HTMLButtonElement>( null )
 * const eventType: CustomEventType = 'anothercustomEvent'
 * 
 * useEventListener<CustomEventMap, typeof eventType>( eventType, {
 * 	target  : elementRef,
 * 	listener: useCallback( event => {
 * 		console.log( event )
 * 	}, [] )
 * } )
 * 
 * useEffect( () => {
 * 
 * 	elementRef.current?.dispatchEvent( new CustomEvent<Details>( 'customevent', {
 * 		detail: {
 * 			property: 'value'
 * 		}
 * 	} ) )
 * 
 * }, [] ) 
 *```
 */
export function useEventListener<
	T extends Record<string, Event>,
	K extends keyof T = keyof T,
>(
	type	: K | K[],
	options	: CustomEventListenerOptions<T, K>
): void


/**
 * Attach a new Event listener to the `Window`, `Document`, `MediaQueryList` or an `HTMLElement`.
 * 
 * @param type		The event name or an array of event names.
 * @param options	An object defining init options.
 */
export function useEventListener<
	W extends keyof WindowEventMap,
	D extends keyof DocumentEventMap,
	E extends keyof HTMLElementEventMap,
	M extends keyof MediaQueryListEventMap,
	C extends keyof Record<string, Event>,
>(
	type: W | D | E | M | C | ( W | D | E | M | C )[],
	options: {
		listener: CommonEventHandler<W, D, E, M, C>,
		target?	: Document | HTMLElement | null | React.RefObject<Document | HTMLElement | null>,
		query?	: string,
	} & CommonListenerOptions
)
{
	const {
		target, query, options: listenerOptions,
		listener, onLoad, onCleanUp,
	} = options

	useEffect( () => {

		/**
		 * Defines the event types.
		 * 
		 */
		const types = Array.isArray( type ) ? type : [ type ]

		/**
		 * Defines the target where listeners get attached to.
		 * 
		 */
		const targetElement = (
			query
				? window.matchMedia( query )
				: (
					target && 'current' in target
						? target.current
						: target
				)
		) ?? window

		if ( ! targetElement.addEventListener ) {
			return
		}

		onLoad?.()

		types.map( type => {
			targetElement.addEventListener( type, listener, listenerOptions )
		} )


		return () => {
			types.map( type => {
				targetElement.removeEventListener( type, listener, listenerOptions )
			} )
			onCleanUp?.()
		}

	}, [
		type, target, query, listenerOptions,
		listener, onLoad, onCleanUp
	] )

}