import { useEffect, useMemo, useState } from 'react'

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
	 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/root
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
	 * Initial value. Default: `false`.
	 */
	initial?: boolean
	/**
	 * A custom callback executed when target element's visibility has crossed one or more thresholds.
	 * 
	 * This callback is awaited before any state update.
	 * 
	 * If an error is thrown the React State update won't be fired.
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
	 * A React Dispatch SetState action that allows custom state updates.
	 * 
	 */
	setInView: React.Dispatch<React.SetStateAction<boolean>>
	/**
	 * The {@link IntersectionObserver} instance.
	 * 
	 */
	observer?: IntersectionObserver
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
		amount, margin, root, onStart,
	} = options

	const [ inView, setInView ] = useState( initial )

	const observer = useMemo( () => {

		if ( typeof IntersectionObserver === 'undefined' ) {
			return;
		}

		try {

			const threshold = (
				amount === 'all' ? 1 : (
					amount === 'some' ? 0.5 : amount
				)
			)

			return (
				new IntersectionObserver(
					async ( [ entry ], observer ) => {
						if ( ! entry ) return

						const isInview = entry.isIntersecting

						try {
							await onStart?.( entry, observer )
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

	}, [ root, margin, amount, once, onStart ] )


	useEffect( () => {

		if ( ! target.current || ! observer ) return

		observer.observe( target.current )

		return () => {
			observer.disconnect()
		}

	}, [ target, observer ] )


	return { inView, observer, setInView }

}