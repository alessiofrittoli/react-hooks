import { useIsFirstRender } from '@/misc/useIsFirstRender'
import { useEffect } from 'react'

/**
 * Modified version of `useEffect` that skips the first render.
 *
 * @param	effect	Imperative function that can return a cleanup function.
 * @param	deps	If present, effect will only activate if the values in the list change.
 */
export const useUpdateEffect = (effect: React.EffectCallback, deps?: React.DependencyList): void => {
	const isFirst = useIsFirstRender()

	useEffect(() => {
		if (!isFirst) return effect()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps)
}
