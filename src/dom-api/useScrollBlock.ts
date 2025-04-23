import { useCallback } from 'react'
import {
	blockScroll as blockScrollHandler,
	restoreScroll as restoreScrollHandler
} from '@alessiofrittoli/web-utils'


/**
 * Prevent Element overflow.
 * 
 * @param target (Optional) The target HTMLElement. Default: `Document.documentElement`.
 */
export const useScrollBlock = ( target?: HTMLElement ) => {
	
	/**
	 * Block scroll.
	 * 
	 */
	const blockScroll = useCallback( () => blockScrollHandler( target ), [ target ] )


	/**
	 * Restore scroll.
	 * 
	 */
	const restoreScroll = useCallback( () => restoreScrollHandler( target ), [ target ] )

	
	return [ blockScroll, restoreScroll ] as const

}