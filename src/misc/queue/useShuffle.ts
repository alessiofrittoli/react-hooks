import { useCallback, useRef, useState } from 'react'
import { shuffle as shuffleArray } from '@alessiofrittoli/web-utils'

import { findIndexByUUID } from '@/misc/queue/utils'
import type { UUID, Queue } from '@/misc/queue/types'


/**
 * Defines `useShuffle` hook API.
 * 
 */
export interface UseShuffle
{
	/**
	 * Indicates whether shuffle is currently enabled.
	 * 
	 */
    enabled: boolean

	/**
	 * Shuffle given `queue` items.
	 * 
	 * @param	queue	The Queue.
	 * @param	uuid	The current queue item UUID. This is used as entry point in order to shuffle upcoming items.
	 * 
	 * @returns	The given `queue` with shuffled items.
	 */
    shuffle: <T extends Queue>( queue: T, uuid?: UUID ) => T

	/**
	 * Un-shuffle given `queue` items.
	 * 
	 * @param	queue	The Queue.
	 * @param	uuid	The current queue item UUID. This is used as entry point in order to restore upcoming items.
	 * 
	 * @returns	The given `queue` with restored items order.
	 */
    unshuffle: <T extends Queue>( queue: T, uuid?: UUID ) => T

	/**
	 * Shuffle/un-shuffle given `queue` items.
	 * 
	 * @param	queue	The Queue.
	 * @param	cursor	The current queue item UUID. This is used as entry point in order to shuffle/restore upcoming items.
	 * 
	 * @returns	The given `queue` with shuffled items or the given `queue` with restored items order.
	 */
    toggleShuffle: <T extends Queue>( queue: T, cursor?: UUID ) => T
}


/**
 * Handle shuffle functionality for queues.
 * 
 * This hook manages the shuffle state and provides methods to shuffle, unshuffle, 
 * and toggle shuffle for a queue. When shuffling, it preserves the order
 * of items up to the current cursor position and only shuffles upcoming items.
 * 
 * @returns An object containing state and utilities. See {@link UseShuffle} for more info.
 * 
 * @example
 * ```tsx
 * const {
 *  enabled, shuffle, unshuffle, toggleShuffle
 * } = useShuffle()
 * 
 * // Shuffle the queue
 * const shuffledQueue = shuffle( currentQueue, currentUUID )
 * 
 * // Restore original order
 * const restoredQueue = unshuffle( currentQueue, currentUUID )
 * 
 * // Toggle shuffle state
 * const updatedQueue = toggleShuffle( currentQueue, currentUUID )
 * ```
 */
export const useShuffle = (): UseShuffle => {

	const [ enabled, setEnabled ]	= useState( false )
	const [ original, setOriginal ]	= useState<UUID[]>()
	const shuffledRef				= useRef( false )


	/**
	 * Shuffle given `queue` items.
	 * 
	 * @param	queue	The Queue.
	 * @param	uuid	The current queue item cursor ID. This is used as entry point in order to shuffle all items next to it.
	 * 
	 * @returns	The given `queue` with shuffled items.
	 */
	const shuffle = useCallback<UseShuffle[ 'shuffle' ]>( ( queue, uuid ) => {

		const { items } = queue

		if ( items.length <= 1 ) return queue

		setEnabled( true )

		if ( ! shuffledRef.current ) {
			setOriginal( items.map( ( { uuid } ) => uuid ) )
		}

		shuffledRef.current	= true
		const entryPoint	= findIndexByUUID( items, uuid )
		const past			= items.slice( 0, entryPoint + 1 )
		const upcoming		= items.slice( entryPoint + 1 )

		if ( upcoming.length <= 1 ) return queue

		return {
			...queue, items: [ ...past, ...shuffleArray( upcoming ) ]
		}

	}, [] )


	/**
	 * Un-shuffle given `queue` items.
	 * 
	 * @param	queue	The Queue.
	 * @param	uuid	The current queue item cursor ID. This is used as entry point in order to restore items order next to it.
	 * 
	 * @returns	The given `queue` with restored items order.
	 */
	const unshuffle = useCallback<UseShuffle[ 'unshuffle' ]>( ( queue, uuid ) => {
		
		if ( ! original ) return queue

		setEnabled( false )

		const { items }	= queue
		const orderMap	= new Map(
			original.map( ( id, index ) => [ id, index ] )
		)

		shuffledRef.current	= false
		const index			= findIndexByUUID( items, uuid )
		const past			= items.slice( 0, index + 1 )
		const upcoming		= items.slice( index + 1 )

		const restoredUpcoming = [ ...upcoming ].sort( ( a, b ) => (
			( orderMap.get( a.uuid ) ?? 0 ) -
			( orderMap.get( b.uuid ) ?? 0 )
		) )

		setOriginal( undefined )

		return {
			...queue, items: [ ...past, ...restoredUpcoming ]
		}

	}, [ original ] )


	/**
	 * Shuffle/un-shuffle given `queue` items.
	 * 
	 * @param	queue	The Queue.
	 * @param	uuid	The current queue item cursor ID. This is used as entry point in order to shuffle/restore items order next to it.
	 * 
	 * @returns	The given `queue` with shuffled items or the given `queue` with restored items order.
	 */
	const toggleShuffle = useCallback<UseShuffle[ 'toggleShuffle' ]>( ( queue, uuid ) => {

		if ( ! shuffledRef.current ) {
			return shuffle( queue, uuid )
		}

		return unshuffle( queue, uuid )

	}, [ shuffle, unshuffle ] )


	return { enabled, shuffle, unshuffle, toggleShuffle }

}
