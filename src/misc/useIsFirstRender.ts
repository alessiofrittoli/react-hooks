import { useRef } from 'react'

/**
 * Check if is first component render.
 * 
 * @returns True at the mount time, then always false
 */
export const useIsFirstRender = (): boolean => {
	const isFirst = useRef( true )

	if ( isFirst.current ) {
		isFirst.current = false

		return true
	}

	return isFirst.current
}