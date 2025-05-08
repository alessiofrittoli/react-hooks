import { useEffect, useMemo, useRef, useState } from 'react'

export type MarginValue = `${ number }${ 'px' | '%' }`

export type MarginType = (
	| MarginValue
	| `${ MarginValue } ${ MarginValue }`
	| `${ MarginValue } ${ MarginValue } ${ MarginValue }`
	| `${ MarginValue } ${ MarginValue } ${ MarginValue } ${ MarginValue }`
)


/**
 * A custom callback executed when target element's visibility has crossed one or more thresholds.
 * 
 * This callback is awaited before any state update.
 * 
 * If an error is thrown the React State update won't be fired.
 * 
 * ⚠️ Wrap your callback with `useCallback` to avoid unnecessary `IntersectionObserver` recreation.
 * 
 * @param	entry		The intersecting {@link IntersectionObserverEntry}.
 * @param	observer	The current {@link IntersectionObserver} instance.
 */
export type OnStartHandler = ( entry: IntersectionObserverEntry, observer: IntersectionObserver ) => void | Promise<void>


export interface UseInViewOptions
{
	/**
	 * Identifies the {@link Element} or {@link Document} whose bounds are treated as the bounding box of the viewport for the Element which is the observer's target.
	 * 
	 * If the `root` is `null`, then the bounds of the actual document viewport are used.
	 * 
	 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/root)
	 */
	root?: Element | Document | false | null
	/**
	 * A string, formatted similarly to the CSS margin property's value, which contains offsets for one or more sides of the root's bounding box.
	 * 
	 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin)
	 */
	margin?: MarginType
	/**
	 * The intersecting target thresholds.
	 * 
	 * Threshold can be set to:
	 * - `all` - `1` will be used.
	 * - `some` - `0.5` will be used.
	 * - `number`
	 * - `number[]`
	 * 
	 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/thresholds)
	 */
	amount?: 'all' | 'some' | number | number[]
	/**
	 * By setting this to `true` the observer will be disconnected after the target Element enters the viewport.
	 *
	 * Consider using a placeholder to avoid layout shifts while mounting/unmounting components when `once` is set to `false`.
	 */
	once?: boolean
	/**
	 * Initial value.
	 * 
	 * @default true
	 */
	initial?: boolean
	/**
	 * Defines the initial observation activity. Use {@link UseInViewReturnType.setEnabled} to update this state.
	 * 
	 * @default true
	 */
	enable?: boolean
	/**
	 * A custom callback executed when target element's visibility has crossed one or more thresholds.
	 * 
	 * This callback is awaited before any state update.
	 * 
	 * If an error is thrown the React State update won't be fired.
	 * 
	 * ⚠️ Wrap your callback with `useCallback` to avoid unnecessary `IntersectionObserver` recreation.
	 * 
	 * @param	entry		The intersecting {@link IntersectionObserverEntry}.
	 * @param	observer	The current {@link IntersectionObserver} instance.
	 */
	onStart?: OnStartHandler
}


interface UseInViewReturnType
{
	/**
	 * Indicates whether the target Element is in viewport or not.
	 * 
	 */
	inView: boolean
	/**
	 * Indicates whether the target Element is being observed or not.
	 * 
	 */
	enabled: boolean
	/**
	 * The {@link IntersectionObserver} instance.
	 * 
	 * It could be `undefined` if `IntersectionObserver` is not available or observation is not enabled.
	 * 
	 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver)
	 */
	observer?: IntersectionObserver
	/**
	 * A React Dispatch SetState action that allows custom state updates.
	 * 
	 */
	setInView: React.Dispatch<React.SetStateAction<boolean>>
	/**
	 * A React Dispatch SetState action that allows to enable/disable observation when needed.
	 * 
	 */
	setEnabled: React.Dispatch<React.SetStateAction<boolean>>
}


/**
 * Check if the given target Element is intersecting with an ancestor Element or with a top-level document's viewport.
 * 
 * @param	target	The React.RefObject of the target Element to observe.
 * @param	options ( Optional ) An object defining custom {@link IntersectionObserver} options. See {@link UseInViewOptions} for more info.
 * 
 * @returns An object defining intersection data. See {@link UseInViewReturnType} for more info.
 */
export const useInView = (
	target	: React.RefObject<Element | null>,
	options	: UseInViewOptions = {},
): UseInViewReturnType => {

	const {
		initial = false, once,
		amount, margin, root, enable = true, onStart,
	} = options

	const isMounted = useRef( true )

	const [ inView, setInView ]		= useState( initial )
	const [ enabled, setEnabled ]	= useState( enable )

	const observer = useMemo( () => {

		if (
			! enabled ||
			typeof IntersectionObserver === 'undefined'
		) return

		const threshold = (
			amount === 'all' ? 1 : (
				amount === 'some' ? 0.5 : amount
			)
		)

		try {

			return (
				new IntersectionObserver(
					async ( [ entry ], observer ) => {
						if ( ! entry ) return

						const isInview = entry.isIntersecting

						try {
							await onStart?.( entry, observer )
							if ( ! isMounted.current ) return
							setInView( isInview )
						} catch ( error ) {
							console.error( error )
						}

						if ( isInview && once ) observer.disconnect()
					},
					{
						root		: root || undefined,
						rootMargin	: margin,
						threshold	: threshold,
					}
				)
			)

		} catch ( error ) {
			console.error( error )
		}

	}, [ root, margin, amount, once, enabled, onStart ] )


	useEffect( () => {

		isMounted.current = true

		if (
			! enabled || ! target.current || ! observer
		) return
		
		observer.observe( target.current )

		return () => {
			isMounted.current = false
			observer.disconnect()
		}

	}, [ target, observer, enabled ] )


	return { inView, enabled, observer, setInView, setEnabled }

}