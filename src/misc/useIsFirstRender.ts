import { useRef } from 'react'

/**
 * Check if is first React Hook/Component render.
 * 
 * @returns `true` at the mount time, then always `false`.
 * - Note that if the React Hook/Component has no state updates, `useIsFirstRender` will always return `true`.
 */
export const useIsFirstRender = () => {

	const isFirst = useRef( true )

	if ( isFirst.current ) {
		isFirst.current = false

		return true
	}

	return isFirst.current
	
}