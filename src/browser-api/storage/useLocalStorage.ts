import { useStorage } from './useStorage'

/**
 * useLocalStorage hook.
 * 
 * @param	key		The local storage item key.
 * @param	initial	The local storage item initial value.
 */
export const useLocalStorage = <T = string>(
	key		: string,
	initial?: T
) => useStorage( key, initial, 'local' )