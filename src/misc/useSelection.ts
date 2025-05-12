import { useCallback, useState } from 'react'

/**
 * Check if the given `entry` is in the selection.
 * 
 * @template V The `entry` type.
 * 
 * @param value The `entry` to check.
 */
export type IsSelectedHandler<V> = ( entry: V ) => void


/**
 * A React Dispatch SetStateAction that allows custom selection update.
 * 
 * @template V The `entry` type.
 */
export type SetSelectionHandler<V> = React.Dispatch<React.SetStateAction<V[]>>


/**
 * Update selection by adding a new `entry` or removing the given `entry` if already exists in the selection.
 * 
 * @template V The `entry` type.
 * 
 * @param entry The entry to add/remove from selection.
 */
export type SelectHandler<V> = ( entry: V ) => void


/**
 * Select all items from the given `array` starting from the first item in the selection up to the given `entry`.
 * 
 * @template V The `entry` type.
 * 
 * @param entry The final entry the selection will be updated to.
 */
export type GroupSelectHandler<V> = ( entry: V ) => void


/**
 * Add all entries from the given `array` to the selection.
 * 
 */
export type SelectAllHandler = () => void


/**
 * Removes all entries from the selection.
 * 
 * @param initial If set to `true` will reset selection to the `initial` given value. Will empty the selection otherwise.
 */
export type ResetSelectionHandler = ( initial?: boolean ) => void


export interface UseSelectionReturnType<V>
{
	/**
	 * The current selected items.
	 * 
	 */
    selection: V[]
	/**
	 * Indicates whether `selection` is not empty. Short-hand for `selection.length > 0`.
	 * 
	 */
    hasSelection: boolean
	/**
	 * Check if the given `entry` is in the selection.
	 * 
	 * @template V The `entry` type.
	 * 
	 * @param value The `entry` to check.
	 */
	isSelected: IsSelectedHandler<V>
	/**
	 * A React Dispatch SetStateAction that allows custom selection update.
	 * 
	 * @template V The `entry` type.
	 * 
	 * @param value The React.SetStateAction<V[]> value.
	 */
    setSelection: SetSelectionHandler<V>
	/**
	 * Update selection by adding a new `entry` or removing the given `entry` if already exists in the selection.
	 * 
	 * @template V The `entry` type.
	 * 
	 * @param entry The entry to add/remove from selection.
	 */
	select: SelectHandler<V>
	/**
	 * Select all items from the given `array` starting from the first item in the selection up to the given `entry`.
	 * 
	 * @template V The `entry` type.
	 * 
	 * @param entry The final entry the selection will be updated to.
	 */
    groupSelect: GroupSelectHandler<V>
	/**
	 * Add all entries from the given `array` to the selection.
	 * 
	 */
	selectAll: SelectAllHandler
	/**
	 * Removes all entries from the selection.
	 * 
	 * @param initial If set to `true` will reset selection to the `initial` given value. Will empty the selection otherwise.
	 */
    resetSelection: ResetSelectionHandler
}


/**
 * A React hook for managing selection states in an array.
 * 
 * Provides functionality for single and group selection, as well as resetting the selection.
 * 
 * @template V The type of the values in the `array` (defaults to the value type of `T`).
 *
 * @param	array	The array of items to manage selection for.
 * @param	initial	The initial selection state (defaults to an empty array).
 * 
 * @returns An object containing the selection state and handlers. See {@link UseSelectionReturnType} for more info.
 */
export const useSelection = <V>( array: V[], initial: V[] = [] ): UseSelectionReturnType<V> => {
	
	const [ selection, setSelection ] = useState<V[]>( initial )
	const hasSelection = selection.length > 0

	const isSelected: IsSelectedHandler<V> = entry => (
		selection.includes( entry )
	)

	const select = useCallback<SelectHandler<V>>( entry => (
		setSelection( prev => {

			const selected = new Set( prev )

			if ( ! selected.has( entry ) ) {
				selected.add( entry )
			} else {
				selected.delete( entry )
			}

			return Array.from( selected.values() )

		} )
	), [] )


	const groupSelect = useCallback<GroupSelectHandler<V>>( entry => {
		
		setSelection( prev => {

			if ( prev.length === 0 ) return [ entry ]

			const entries		= [ ...array ]
			const firstIndex	= entries.indexOf( prev.at( 0 )! )
			const lastIndex		= entries.indexOf( entry )

			if ( firstIndex > lastIndex ) {
				const reversed		= [ ...entries ].reverse()
				const firstIndex	= reversed.indexOf( prev.at( 0 )! )
				const lastIndex		= reversed.indexOf( entry )

				return (
					reversed
						.slice( firstIndex, lastIndex + 1 )
						.reverse()
				)
			}

			return entries.slice( firstIndex, lastIndex + 1 )

		} )

	}, [ array ] )


	const selectAll = useCallback( () => {
		setSelection( array )
	}, [ array ] )


	const resetSelection = (
		useCallback<ResetSelectionHandler>( _initial => (
			setSelection( _initial ? initial : [] )
		), [ initial ] )
	)


	return {
		selection, hasSelection,
		isSelected, setSelection,
		select, groupSelect,
		selectAll, resetSelection,
	}

}


// /**
//  * Update `array` by adding a new `entry` or removing the given `entry` if already exists in the given `array`.
//  * 
//  * @template V The type of the values in the `array`.
//  * 
//  * @param	array An array where `entry` will be added/removed from.
//  * @param	entry The `entry` to add/remove from the given `array`.
//  * 
//  * @returns The newly updated `array`.
//  */
// const toggleEntry = <V>( array: V[], entry: V ) => {

// 	const selected = new Set( array )

// 	if ( ! selected.has( entry ) ) {
// 		selected.add( entry )
// 	} else {
// 		selected.delete( entry )
// 	}

// 	return Array.from( selected.values() )

// }