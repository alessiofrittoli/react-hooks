import { useMemo, useState } from 'react'
import { useLightTimeout } from './useLightTimeout'


/**
 * Debounce a value by a specified delay.
 * 
 * This hook returns a debounced version of the input value, which only updates
 * after the specified delay has passed without any changes to the input value.
 * It is useful for scenarios like search input fields or other cases where
 * frequent updates should be minimized.
 * 
 * The `Timeout` automatically restarts when the given `value` changes.
 * 
 * @template T The type of the `value`.
 * 
 * @param value The value to debounce. This can be of any type.
 * @param delay The debounce delay in milliseconds. Default `500`.
 * 
 * @returns The debounced value, which updates only after the delay has passed.
 */
export const useDebounce = <T>(
	value	: T,
	delay	: number = 500,
) => {

	const [ debounced, setDebounced ] = useState<T>( value )
	const args = useMemo( () => [ value ], [ value ] )

	useLightTimeout<T[]>( setDebounced, { delay, args } )

	return debounced

}