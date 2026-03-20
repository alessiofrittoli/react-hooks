import { useCallback, useMemo, useState } from 'react'
import { getNextIndex, getPreviousIndex } from '@alessiofrittoli/web-utils'

import { useShuffle } from '@/misc/queue/useShuffle'
import { addItemsUUID, maybeAddItemsUUID, getEffectiveQueue, findIndexByUUID } from '@/misc/queue/utils'
import type { Queue, QueuedItemType, QueuedItemsType, OptionalQueuedItem, OptionalQueuedItems, NewQueue, UUID } from '@/misc/queue/types'


export type JumpToOptions<T extends Queue = Queue> = {
	/**
	 * The item UUID where to jump to.
	 * 
	 * If not given, queue will jump to first item.
	 */
	uuid?: UUID
	/**
	 * A new queue to set.
	 * 
	 */
	queue?: NewQueue<T>
}


/**
 * Jump to a specific item.
 * 
 * @param options An object defining an optional item UUID where to jump to and an optional new queue to set. See {@link JumpToOptions}.
 * 
 * @returns The item being set as active if any. It could be included in the main queue, custom queue or the new given queue.
 */
export type JumpToHandler<T extends Queue = Queue> = ( options: JumpToOptions<T> ) => QueuedItemType<T> | undefined


/**
 * Defines configuration options for the `useQueue` hook.
 *  
 */
export interface UseQueueOptions<T extends Queue = Queue>
{
	/**
	 * The queue.
	 * 
	 */
	queue: T
	/**
	 * Defines the initial active item in the queue.
	 * 
	 */
	current?: QueuedItemType<T>
	/**
	 * Indicates whether repeatition of the given queue is initially active.
	 * 
	 * @default true
	 */
	repeat?: boolean
}


/**
 * Defines `useQueue` hook API.
 * 
 */
export interface UseQueue<T extends Queue = Queue>
{
	// -- queues --
	/**
	 * The main queue.
	 * 
	 */
	queue: T
	/**
	 * The current active item.
	 * 
	 * It could be included in either the main `queue` or custom queue.
	 */
	current?: QueuedItemType<T>
	/**
	 * Defines the `current` item cursor ID.
	 * 
	 */
	currentId?: QueuedItemType<T>[ 'uuid' ]
	/**
	 * Defines an array of queued items in the custom queue.
	 * 
	 */
	customQueue: QueuedItemsType<T>
	/**
	 * Defines the complete queue (main queue + custom queue).
	 * 
	 */
	effectiveQueue: QueuedItemsType<T>
	/**
	 * Upcoming main queue items.
	 * 
	 */
	nextFromQueue: QueuedItemsType<T>
	/**
	 * Indicates whether the current item has a previous item.
	 * 
	 * - `true` if main queue has more than 0 items.
	 * - `true` if `repeat` is enabled.
	 * - `true` if current item index in the main queue is greather than 0.
	 * - `false` otherwise.
	 */
	hasPrevious: boolean
	/**
	 * Indicates whether the current item has a next item.
	 * 
	 * - `true` if custom queue has more than 0 items.
	 * - `true` if main queue has more than 0 items.
	 * - `true` if `repeat` is enabled.
	 * - `true` if current item index in the main queue is less than the main queue length.
	 * - `false` otherwise.
	 */
	hasNext: boolean

	// -- shuffle --
	/**
	 * Indicates whether shuffle is currently enabled.
	 * 
	 */
	isShuffleEnabled: boolean
	/**
	 * Shuffle main queue.
	 * 
	 */
	shuffle: VoidFunction
	/**
	 * Un-shuffle main queue.
	 * 
	 */
	unshuffle: VoidFunction
	/**
	 * Toggle shuffle for the main queue.
	 * 
	 */
	toggleShuffle: VoidFunction

	// -- repeat --
	/**
	 * Indicates whether `repeat` is enabled or not.
	 * 
	 */
	isRepeatEnabled: boolean
	/**
	 * Toggle `repeat` on/off.
	 * 
	 */
	toggleRepeat: VoidFunction

	// -- moving functions --
	/**
	 * Jump to a specific item.
	 * 
	 * @param options An object defining an optional item UUID where to jump to and an optional new queue to set. See {@link JumpToOptions}.
	 * 
	 * @returns The item being set as active if any. It could be included in the main queue, custom queue or the new given queue.
	 */
	jumpTo: JumpToHandler<T>
	/**
	 * Get previous item.
	 * 
	 * @returns The previous item, `undefined` if none has been found.
	 */
	getPrevious: () => QueuedItemType<T> | undefined
	/**
	 * Jump to previous item.
	 * 
	 * @returns The previous item being set as active, `undefined` if none has been found.
	 */
	previous: () => QueuedItemType<T> | undefined
	/**
	 * Get next item.
	 * 
	 * @returns The next item, `undefined` if none has been found.
	 */
	getNext: () => QueuedItemType<T> | undefined
	/**
	 * Jump to next item.
	 * 
	 * @returns The next item being set as active, `undefined` if none has been found.
	 */
	next: () => QueuedItemType<T> | undefined

	// -- queue handlers --
	/**
	 * Completely overwrite the main queue and optionally generate a new UUID for each queue item.
	 * 
	 * @param queue The new queue.
	 */
	setQueue: ( queue: NewQueue<T> ) => T
	/**
	 * Add a new item the custom queue.
	 * 
	 * A new UUID is automatically generated for each item.
	 * 
	 * @param item The item or an array of items to add in the queue.
	 */
	addToQueue: ( item: OptionalQueuedItem<QueuedItemType<T>> | OptionalQueuedItems<QueuedItemType<T>> ) => void
	/**
	 * Remove item from the queues.
	 * 
	 * @param uuid The item UUID to remove from the queue.
	 */
	removeFromQueue: ( uuid: UUID ) => void
	/**
	 * Wipe custom queue.
	 * 
	 */
	clearQueue: VoidFunction
}


/**
 * Manage a queue of items with support for shuffling, repeating, and custom queue items.
 * 
 * @template T		The type of the queue, defaults to `Queue`.
 * @param options	Configuration options for the `useQueue` hook. See {@link UseQueueOptions} for more info.
 * 
 * @returns An object containing state and utilities. See {@link UseQueue} for more info.
 */
export const useQueue = <T extends Queue = Queue>( options: UseQueueOptions<T> ): UseQueue<T> => {

	const {
		queue	: initialQueue,
		repeat	: initialRepeat = true,
		current	: initialCurrent,
	} = options

	const {
		enabled			: isShuffleEnabled,
		shuffle			: shuffleHanlder,
		unshuffle		: unshuffleHandler,
		toggleShuffle	: toggleShuffleHandler,
	} = useShuffle()


	/**
	 * Indicates whether `repeat` is enabled or not.
	 * 
	 */
	const [ isRepeatEnabled, setIsRepeatEnabled ] = useState( initialRepeat )


	/**
	 * Toggle `repeat` on/off.
	 * 
	 */
	const toggleRepeat = useCallback( () => setIsRepeatEnabled( prev => ! prev ), [] )


	/**
	 * The main queue.
	 * 
	 */
	const [ queue, setQueueState ] = useState( initialQueue )


	/**
	 * Defines a custom queue items added by the user.
	 * 
	 */
	const [ customQueue, setCustomQueue ] = useState<QueuedItemsType<T>>( [] )


	/**
	 * Defines the current active queue item.
	 * 
	 */
	const [ current, setCurrent ] = useState( initialCurrent )


	/**
	 * Defines the current main queue item UUID.
	 * 
	 * This value is only updated when the current queue item is NOT in the custom queue.
	 */
	const [ cursorUUID, setCursorUUID ] = useState( initialCurrent?.uuid )


	/**
	 * The main queue items.
	 * 
	 */
	const mainQueueItems = queue.items


	/**
	 * Defines the current executing queue item UUID.
	 * 
	 */
	const currentItemUUID = current?.uuid


	/**
	 * Defines the complete queue (main queue + custom queue).
	 * 
	 */
	const effectiveQueue = useMemo( () => (
		getEffectiveQueue( { queue: mainQueueItems, customQueue, uuid: currentItemUUID } )
	), [ mainQueueItems, customQueue, currentItemUUID ] )


	/**
	 * Indicates whether the current item has a previous item.
	 * 
	 * - `true` if main queue has more than 0 items.
	 * - `true` if `repeat` is enabled.
	 * - `true` if current item index in the main queue is greather than 0.
	 * - `false` otherwise.
	 */
	const hasPrevious = useMemo( () => {

		
		if ( mainQueueItems.length <= 0 ) return false
		if ( isRepeatEnabled ) return true
		if ( ! cursorUUID ) return mainQueueItems.length > 0

		const index = findIndexByUUID( mainQueueItems, cursorUUID )

		if ( index > 0 ) return true

		return false

	}, [ mainQueueItems, cursorUUID, isRepeatEnabled ] )


	/**
	 * Indicates whether the current item has a next item.
	 * 
	 * - `true` if custom queue has more than 0 items.
	 * - `true` if main queue has more than 0 items.
	 * - `true` if `repeat` is enabled.
	 * - `true` if current item index in the main queue is less than the main queue length.
	 * - `false` otherwise.
	 */
	const hasNext = useMemo( () => {

		if ( customQueue.length > 0 ) return true
		if ( mainQueueItems.length <= 0 ) return false
		if ( isRepeatEnabled ) return true
		if ( ! cursorUUID ) return mainQueueItems.length > 0

		const index = findIndexByUUID( mainQueueItems, cursorUUID )

		if ( index < mainQueueItems.length - 1 ) return true
		
		return false

	}, [ mainQueueItems, customQueue, cursorUUID, isRepeatEnabled ] )


	/**
	 * Completely overwrite the main queue and optionally generate a new UUID for each queue item.
	 * 
	 * @param queue The new queue.
	 */
	const setQueue = useCallback<UseQueue<T>[ 'setQueue' ]>( queue => {

		const newQueue = {
			...queue, items: maybeAddItemsUUID( queue.items )
		} as unknown as T

		setQueueState( newQueue )

		return newQueue

	}, [] )


	/**
	 * Add a new item the custom queue.
	 * 
	 * A new UUID is automatically generated for each item.
	 * 
	 * @param item The item or an array of items to add in the queue.
	 */
	const addToQueue = useCallback<UseQueue<T>[ 'addToQueue' ]>( item => (
		setCustomQueue( prev => [
			...prev, ...addItemsUUID( item )
		] )
	), [] )


	/**
	 * Remove item from the queues.
	 * 
	 * @param uuid The item UUID to remove from the queue.
	 */
	const removeFromQueue = useCallback<UseQueue<T>[ 'removeFromQueue' ]>( uuid => {

		const predicate = ( item: QueuedItemType<T> ) => item.uuid === uuid
		const negativePredicate = ( item: QueuedItemType<T> ) => item.uuid !== uuid

		setQueueState( queue => {
			
			if ( queue.items.find( predicate ) ) {
				return {
					...queue, items: queue.items.filter( negativePredicate )
				}
			}

			return queue

		} )

		setCustomQueue( customQueue => {

			if ( customQueue.find( predicate ) ) {
				return customQueue.filter( negativePredicate )
			}

			return customQueue

		} )

	}, [] )


	/**
	 * Wipe custom queue.
	 * 
	 */
	const clearQueue = useCallback<UseQueue<T>[ 'clearQueue' ]>( () => setCustomQueue( [] ), [] )


	/**
	 * Jump to a specific item.
	 * 
	 * @param options An object defining an optional item UUID where to jump to and an optional new queue to set. See {@link JumpToOptions}.
	 * @returns The item being set as active if any. It could be included in either the main queue or custom queue.
	 */
	const jumpTo = useCallback<UseQueue<T>[ 'jumpTo' ]>( ( { uuid, queue } ) => {
		
		const queueItems = queue ? setQueue( queue ).items : mainQueueItems

		if ( customQueue.length > 0 ) {

			const index = findIndexByUUID( customQueue, uuid )
			
			if ( index >= 0 ) {
				const item = customQueue.at( index )
				setCurrent( item )
				setCustomQueue( customQueue.slice( index + 1 ) )
				return item
			}

		}

		const index	= ! uuid ? 0 : findIndexByUUID( queueItems, uuid )
		const item	= queueItems[ index === -1 ? 0 : index ]

		setCurrent( item )
		setCursorUUID( item?.uuid )

		return item

	}, [ mainQueueItems, customQueue, setQueue ] )


	/**
	 * Get previous item.
	 * 
	 * @returns The previous item, `undefined` if none has been found.
	 */
	const getPrevious = useCallback<UseQueue<T>[ 'getPrevious' ]>( () => {
		
		if ( ! currentItemUUID ) {
			return mainQueueItems.at( -1 )
		}

		/**
		 * Indicates whether the `current` active item is in the main queue.
		 * 
		 * - `true` the current item is in the main queue.
		 * - `false` the current item is in the custom queue.
		 */
		const currentInQueue = !! mainQueueItems.find( item => item.uuid === currentItemUUID )

		/**
		 * Defines the index of the current item in the main queue.
		 * 
		 * - if the current item is in the main queue, index is searched using the current item `uuid`.
		 * - if the current item is in the custom queue, index is searched using
		 * 	the `queueCursors` (which get updates only when jumping to an item in the main queue).
		 *  in that case, `index` will point at the last item before custom queue begins.
		 */
		const index = findIndexByUUID( mainQueueItems, currentInQueue ? currentItemUUID : cursorUUID )


		/**
		 * Indicates the previous item before the `current`
		 * excluding items from the custom queue (this because custom items are removed once consumed).
		 * 
		 */
		const previous = mainQueueItems.at(
			currentInQueue ? getPreviousIndex( mainQueueItems.length, index ) : index
		)

		return previous

	}, [ currentItemUUID, cursorUUID, mainQueueItems ] )


	/**
	 * Jump to previous item.
	 * 
	 * @returns The previous item being set as active, `undefined` if none has been found.
	 */
	const previous = useCallback<UseQueue<T>[ 'previous' ]>( () => {

		const previous = getPrevious()

		setCurrent( previous )
		setCursorUUID( previous?.uuid )

		return previous

	}, [ getPrevious ] )


	/**
	 * Get next item.
	 * 
	 * @returns The next item, `undefined` if none has been found.
	 */
	const getNext = useCallback<UseQueue<T>[ 'getNext' ]>( () => {

		if ( customQueue.length > 0 ) {
			return customQueue.at( 0 )
		}

		const index	= findIndexByUUID( queue.items, cursorUUID )
		const next	= queue.items.at( getNextIndex( queue.items.length, index ) )

		return next

	}, [ queue, customQueue, cursorUUID ] )


	/**
	 * Jump to next item.
	 * 
	 * @returns The next item being set as active, `undefined` if none has been found.
	 */
	const next = useCallback<UseQueue<T>[ 'next' ]>( () => {

		if ( customQueue.length > 0 ) {

			const [ next, ...rest ] = customQueue

			setCurrent( next )
			setCustomQueue( rest )

			return next

		}

		const next = getNext()

		setCurrent( next )
		setCursorUUID( next?.uuid )

		return next

	}, [ customQueue, getNext ] )


	/**
	 * Shuffle main queue.
	 * 
	 */
	const shuffle = useCallback<UseQueue<T>[ 'shuffle' ]>( () => (
		setQueueState( queue => shuffleHanlder( queue, cursorUUID ) )
	), [ cursorUUID, shuffleHanlder ] )


	/**
	 * Un-shuffle main queue.
	 * 
	 */
	const unshuffle = useCallback<UseQueue<T>[ 'unshuffle' ]>( () => (
		setQueueState( queue => unshuffleHandler( queue, cursorUUID ) )
	), [ cursorUUID, unshuffleHandler ] )


	/**
	 * Toggle shuffle for the main queue.
	 * 
	 */
	const toggleShuffle = useCallback<UseQueue<T>[ 'toggleShuffle' ]>( () => (
		setQueueState( queue => toggleShuffleHandler( queue, cursorUUID ) )
	), [ cursorUUID, toggleShuffleHandler ] )


	/**
	 * Upcoming main queue items.
	 * 
	 */
	const nextFromQueue = useMemo( () => (
		cursorUUID
			? mainQueueItems.slice( findIndexByUUID( mainQueueItems, cursorUUID ) + 1 )
			: mainQueueItems
	), [ mainQueueItems, cursorUUID ] )


	return {
		// queues
		queue,
		currentId: currentItemUUID,
		current,
		customQueue,
		effectiveQueue,
		nextFromQueue,

		hasPrevious,
		hasNext,

		// shuffle
		isShuffleEnabled,
		shuffle,
		unshuffle,
		toggleShuffle,
		
		// repeat
		isRepeatEnabled,
		toggleRepeat,

		// moving functions
		jumpTo,
		getPrevious,
		previous,
		getNext,
		next,

		// queue handlers
		setQueue,
		addToQueue,
		removeFromQueue,
		clearQueue,
	}

}