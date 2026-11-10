import { useIsFirstRender } from './useIsFirstRender'
import { useEffect } from 'react'

/**
 * Modified version of `useEffect` that only run once on intial load.
 *
 * @param effect Imperative function that can return a cleanup function.
 */
export const useEffectOnce = (effect: React.EffectCallback): void => {
	const isFirst = useIsFirstRender()

	useEffect(() => {
		if (isFirst) return effect()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
}
