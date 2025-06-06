import { useCallback, useEffect, useState } from 'react'
import { LocalStorage } from '@alessiofrittoli/web-utils/storage/LocalStorage'
import { SessionStorage } from '@alessiofrittoli/web-utils/storage/SessionStorage'

type Value<T>		= T | undefined | null
type SetValue<T>	= React.Dispatch<React.SetStateAction<T>>

/**
 * Easly handle Local or Session Storage State.
 * 
 * @param	key		The storage item key.
 * @param	initial	The storage item initial value.
 * @param	type	( Optional ) The storage API to use. Default: `local`.
 */
export const useStorage = <T = string>(
	key		: string,
	initial?: T,
	type	: 'local' | 'session' = 'local'
): [ Value<T>, SetValue<Value<T>> ] => {

	const readValue = useCallback( () => (
		( type === 'local' ? LocalStorage : SessionStorage )
			.get<T>( key ) ?? initial
	), [ type, key, initial ] )


	/**
	 * State to store our value.
	 * Pass initial state function to useState so logic is only executed once.
	 * 
	 */
	const [ storedValue, setStoredValue ] = useState<Value<T>>( initial )

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