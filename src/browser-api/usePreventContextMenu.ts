import { useCallback } from 'react'
import { useEventListener, type EventListenerTarget } from './useEventListener'


/**
 * Prevents the context menu from appearing on a specified target element.
 * 
 * @param target The target element or `React.RefObject` where the context menu should be prevented.
 * 	If not provided, the listener will be attached to the top window.
 * 
 * @example
 * ```ts
 * // Prevent context menu on the entire top window.
 * usePreventContextMenu();
 * ```
 * 
 * @example
 * ```ts
 * // Prevent context menu on a specific target.
 * const ref = useRef<HTMLDivElement>(null);
 * usePreventContextMenu(ref);
 * ```
 */
export const usePreventContextMenu = (
	target?: EventListenerTarget | React.RefObject<EventListenerTarget>
) => {

	useEventListener( 'contextmenu', {
		target,
		listener: useCallback( ( event: Event ) => {
			event.preventDefault()
		}, [] ),
	} )

}