import { useCallback, useMemo } from 'react'
import {
	blockScroll as blockScrollHandler,
	restoreScroll as restoreScrollHandler
} from '@alessiofrittoli/web-utils/dom'


/**
 * Prevent Element overflow.
 * 
 * @param target (Optional) The React RefObject target HTMLElement. Default: `Document.documentElement`.
 */
export const useScrollBlock = ( target?: React.RefObject<HTMLElement | null> ) => {

	const _target = useMemo( () => target?.current, [ target ] )
	
	/**
	 * Block scroll.
	 * 
	 */
	const blockScroll = useCallback(
		() => blockScrollHandler( _target || undefined ), [ _target ]
	)


	/**
	 * Restore scroll.
	 * 
	 */
	const restoreScroll = useCallback(
		() => restoreScrollHandler( _target || undefined ), [ _target ]
	)

	
	return [ blockScroll, restoreScroll ] as const

}