import { randomUUID } from '@alessiofrittoli/math-utils'
import { findIndexBy } from '@alessiofrittoli/web-utils'
import type { QueuedItem, QueuedItems, QueueItem, QueueItems, UUID } from '@/misc/queue/types'


/**
 * Adds a UUID to the given item.
 * 
 * @template T	The type of the given item, must extend object.
 * @param item	The item to add a UUID to.
 * @returns		A new item with the same properties as the input item plus a UUID.
 * 
 * @example
 * ```ts
 * const item       = { foo: 'bar' }
 * const newItem    = addItemUUID( item )
 * // Returns: { foo: 'bar', uuid: 'XXXXXXXX-XXXX-4XXX-YXXX-XXXXXXXXXXXX' }
 * ```
 */
export const addItemUUID = <T extends object = object>( item: QueueItem<T> | QueuedItem<T> ): QueuedItem<T> => ( {
	...item, uuid: randomUUID(),
} )


/**
 * Adds a UUID to one or more items.
 * 
 * If a single item is provided, it is normalized to an array and returned as
 * a one-element list with generated UUIDs.
 * 
 * @template T	The type of the given item, must extend object.
 * @param items	A single item or an array of items where UUIDs are added to.
 * @returns		An array of items with a UUID on each item.
 * 
 * @example
 * ```ts
 * const result = addItemsUUID( [ { foo: 'bar' } ] )
 * // Returns: [ { foo: 'bar', uuid: '...' } ]
 * ```
 */
export const addItemsUUID = <T extends object = object>(
	items: QueueItem<T> | QueuedItem<T> | QueueItems<T> | QueuedItems<T>
): QueuedItems<T> => (
	! Array.isArray( items )
		? addItemsUUID( [ items ] )
		: items.map( item => addItemUUID( item ) )
)


/**
 * Adds a UUID to the given item only when it does not already define one.
 *
 * @template T	The type of the given item, must extend object.
 * @param item	The item to normalize with a UUID.
 * @returns		A new item with a guaranteed UUID.
 *
 * @example
 * ```ts
 * const result = maybeAddItemUUID( { foo: 'bar' } )
 * // Returns: { foo: 'bar', uuid: '...' }
 * ```
 */
export const maybeAddItemUUID = <T extends object = object>( item: QueueItem<T> | QueuedItem<T> ): QueuedItem<T> => ( {
	...item, uuid: ( 'uuid' in item && item.uuid ) || randomUUID(),
} )


/**
 * Adds UUIDs to one or more items, preserving existing UUIDs when present.
 *
 * If a single item is provided, it is normalized to an array and returned as
 * a one-element list.
 *
 * @template T	The type of the given item, must extend object.
 * @param items	A single item or an array of items to normalize with UUIDs.
 * @returns		An array of items with UUIDs on each item.
 *
 * @example
 * ```ts
 * const result = maybeAddItemsUUID( [ { foo: 'bar' }, { foo: 'baz', uuid: '1' } ] )
 * // Returns: [ { foo: 'bar', uuid: '...' }, { foo: 'baz', uuid: '1' } ]
 * ```
 */
export const maybeAddItemsUUID = <T extends object = object>( items: QueueItem<T> | QueuedItem<T> | ( QueueItem<T> | QueuedItem<T> )[] ): QueuedItems<T> => (
	! Array.isArray( items )
		? maybeAddItemsUUID( [ items ] )
		: items.map( maybeAddItemUUID )
)


/**
 * Finds the index of the item matching the given UUID.
 *
 * @param items	The queue items to search in.
 * @param uuid	The UUID to match.
 * @returns		The matching index, or `-1` when the UUID is missing or not found.
 */
export const findIndexByUUID = ( items: QueuedItems, uuid?: UUID ) => (
	typeof uuid !== 'undefined'
		? findIndexBy( { items, field: 'uuid', value: uuid } )
		: -1
)


export interface GetEffectiveQueueOptions<T extends object = object>
{
	/**
	 * The main queue.
	 * 
	 */
	queue: QueuedItems<T>
	/**
	 * The custom queue.
	 * 
	 */
	customQueue: QueuedItems<T>
	/**
	 * The UUID after which the custom items are inserted.
	 * 
	 */
	uuid?: UUID
}


/**
 * Returns the queue with `customQueue` inserted after the item identified by `uuid`.
 *
 * If `uuid` is not provided, the original queue is returned unchanged. If `uuid`
 * is provided but not found, `customQueue` is appended to the end of `queue`.
 *
 * @template T		The type of the queue items, must extend object.
 * @param options	An object defining required parameters. See {@link GetEffectiveQueueOptions}.
 * @returns			The effective queue.
 */
export const getEffectiveQueue = <T extends object = object>(
	options: GetEffectiveQueueOptions<T>
) => {

	const { queue, customQueue, uuid } = options

	if ( ! uuid ) return queue

	const index = findIndexByUUID( queue, uuid )

	if ( index === -1 ) {
		return [ ...queue, ...customQueue ]
	}

	return [
		...queue.slice( 0, index + 1 ),
		...customQueue,
		...queue.slice( index + 1 )
	]

}
