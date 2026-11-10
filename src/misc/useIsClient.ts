import { useEffect, useState } from 'react'

/**
 * Check if the React Hook or Component where this hook is executed is running in a browser environment.
 *
 * @returns `true` if the React Hook or Component is running in a browser environment, `false` otherwise.
 */
export const useIsClient = (): boolean => {
	const [isClient, setClient] = useState(false)

	useEffect(
		() =>
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setClient(true),
		[],
	)

	return isClient
}
