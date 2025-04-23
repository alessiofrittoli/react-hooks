import { useCallback, useEffect, useState } from 'react'
import { LocalStorage, SessionStorage } from '@alessiofrittoli/web-utils'

type Value<T>		= T | undefined | null
type SetValue<T>	= React.Dispatch<React.SetStateAction<T>>

/**
 * useStorage hook.
 * 
 * @param	key				The storage item key.
 * @param	initialValue	The storage item initial value.
 * @param	type			( Optional ) The storage API to use. Default: `local`.
 */
export const useStorage = <T = string>(
	key				: string,
	initialValue?	: T,
	type			: 'local' | 'session' = 'local'
): [ Value<T>, SetValue<Value<T>> ] => {

	const readValue = useCallback( () => (
		typeof window !== 'undefined'
			? ( type === 'local' ? LocalStorage : SessionStorage )
				.get<T>( key ) ?? initialValue
			: initialValue
	), [ type, key, initialValue ] )


	/**
	 * State to store our value.
	 * Pass initial state function to useState so logic is only executed once.
	 * 
	 */
	const [ storedValue, setStoredValue ] = useState<Value<T>>( initialValue )

	/**
	 * Return a wrapped version of useState's setter function that
	 * persists the new value to localStorage | sessionStorage.
	 * 
	 * @param value The SetStateAction value.
	 */
	const setValue = useCallback<SetValue<Value<T>>>( value => {

		setStoredValue( storedValue => {
			const valueToStore = value instanceof Function ? value( storedValue ) : value
	
			;(
				typeof window !== 'undefined' &&
				type === 'local' ? LocalStorage : SessionStorage
			).set( key, valueToStore )

			return valueToStore
		} )


	}, [ type, key ] )

	useEffect( () => {
		setStoredValue( readValue() )
	}, [ readValue ] )

	return [ storedValue, setValue ]
}