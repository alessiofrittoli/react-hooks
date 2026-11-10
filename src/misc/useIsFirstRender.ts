import { useRef } from 'react'

/**
 * Check if is first React Hook/Component render.
 *
 * @returns `true` at the mount time, then always `false`.
 * - Note that if the React Hook/Component has no state updates, `useIsFirstRender` will always return `true`.
 */
export const useIsFirstRender = (): boolean => {
	const isFirst = useRef(true)

	// eslint-disable-next-line react-hooks/refs
	if (isFirst.current) {
		// eslint-disable-next-line react-hooks/refs
		isFirst.current = false

		return true
	}

	// eslint-disable-next-line react-hooks/refs
	return isFirst.current
}
