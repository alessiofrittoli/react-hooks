import type { UUID as _UUID } from '@alessiofrittoli/math-utils'

/**
 * UUID type alias used by queue items.
 * 
 */
export type UUID = _UUID


/**
 * Queue item with an optional UUID.
 * 
 */
export type QueueItem<T extends object = object> = T & {
	/**
	 * Optional item UUID.
	 * 
	 */
	uuid?: UUID
}


/**
 * Queue item with a required UUID.
 * 
 */
export type QueuedItem<T extends object = object> = QueueItem<T> & {
	/**
	 * Item UUID.
	 * 
	 */
	uuid: UUID
}


/**
 * List of queued items.
 * 
 */
export type QueuedItems<T extends object = object> = QueuedItem<T>[]


/**
 * Item shape accepted when enqueuing, with UUID optional.
 * 
 */
export type OptionalQueuedItem<T extends object = object> = Omit<T, 'uuid'> & Pick<QueueItem<Omit<T, 'uuid'>>, 'uuid'>


/**
 * List of items accepted when enqueuing.
 * 
 */
export type OptionalQueuedItems<T extends object = object> = OptionalQueuedItem<T>[]

/**
 * Defines the queue.
 * 
 */
export interface Queue<T extends object = object>
{
	/**
	 * The queue items.
	 * 
	 */
	items: QueuedItems<T>
}


/**
 * Extracts the queued items type from a queue.
 * 
 */
export type QueuedItemsType<Q extends Queue = Queue> = Q[ 'items' ]


/**
 * Extracts the queued item type from a queue.
 * 
 */
export type QueuedItemType<Q extends Queue = Queue> = QueuedItemsType<Q>[ number ]


/**
 * Queue shape used when creating a new queue with optional item UUIDs.
 * 
 */
export type NewQueue<T extends Queue = Queue> = Omit<T, 'items'> & {
	/**
	 * The queue items.
	 * 
	 */
	items: OptionalQueuedItems<QueuedItemType<T>>
}