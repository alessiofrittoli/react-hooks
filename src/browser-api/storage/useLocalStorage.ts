import { useStorage } from './useStorage'

/**
 * useLocalStorage hook.
 * 
 * @param	key				The local storage item key.
 * @param	initialValue	The local storage item initial value.
 */
export const useLocalStorage = <T = string>(
	key				: string,
	initialValue?	: T
) => useStorage( key, initialValue, 'local' )