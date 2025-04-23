import { useCallback } from 'react'
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
	
	/**
	 * Block scroll.
	 * 
	 */
	const blockScroll = useCallback(
		() => blockScrollHandler( target?.current || undefined ), [ target ]
	)


	/**
	 * Restore scroll.
	 * 
	 */
	const restoreScroll = useCallback(
		() => restoreScrollHandler( target?.current || undefined ), [ target ]
	)

	
	return [ blockScroll, restoreScroll ] as const

}