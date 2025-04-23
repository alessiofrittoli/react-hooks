import { useCallback, useEffect, useRef, useState } from 'react'

const focusableSelector = [
	'input', 'select', 'textarea',
	'button', '[href]', '[tabindex]:not([tabindex="-1"])',
].join( ', ' )


/**
 * Trap focus inside the given HTMLElement.
 * 
 * @param target (Optional) The target HTMLElement React RefObject to trap focus within.
 * 					If no target is given, you must provide the target HTMLElement when calling `setFocusTrap`.
 * 
 * @returns A tuple containing:
 * - `setFocusTrap`: A function to enable the focus trap. Optionally accept an HTMLElement as target.
 * - `restoreFocusTrap`: A function to restore the previous focus state.
 */
export const useFocusTrap = ( target?: React.RefObject<HTMLElement | null> ) => {

	const [ focusTrap, setFocusTrapDispatch ] = (
		useState<boolean | HTMLElement>( target?.current || false )
	)

	const lastActiveElement = useRef(
		typeof document !== 'undefined' ? document.activeElement as HTMLElement : null
	)
	
	/**
	 * Enable the focus trap.
	 * 
	 */
	const setFocusTrap = useCallback( ( target?: HTMLElement ) => {
		lastActiveElement.current = document.activeElement as HTMLElement
		return setFocusTrapDispatch( target || true )
	}, [] )


	/**
	 * Restore the focus to the latest Document active Element.
	 */
	const restoreFocusTrap = useCallback( () => {
		lastActiveElement.current?.focus()
		setFocusTrapDispatch( false )
	}, [] )

	
	useEffect( () => {

		const _target = (
			typeof focusTrap !== 'boolean'
				? focusTrap
				: target?.current
		)

		if ( ! _target ) return

		const keyDownHandler = ( event: KeyboardEvent ) => {

			if ( event.key !== 'Tab' ) return

			const focusableElements		= Array.from( _target.querySelectorAll<HTMLElement>( focusableSelector ) ),
				firstFocusableElement	= focusableElements.at( 0 ),
				lastFocusableElement	= focusableElements.at( -1 );

			if ( ! event.shiftKey ) {
				/**
				 * Focust the firs element if
				 * focusing forward and the current focused element is the last one.
				 */
				if ( document.activeElement === lastFocusableElement ) {
					event.preventDefault()
					firstFocusableElement?.focus()
				}
				return
			}


			/**
			 * Focus the last focusable element if
			 * focusing backward and the current focused element is the first one.
			 * 
			 */
			if ( document.activeElement === firstFocusableElement ) {
				event.preventDefault()
				lastFocusableElement?.focus()
			}

		}

		document.addEventListener( 'keydown', keyDownHandler );
	
		return () => {
			document.removeEventListener( 'keydown', keyDownHandler );
		}

	}, [ focusTrap, target ] )

	return [ setFocusTrap, restoreFocusTrap ] as const

}