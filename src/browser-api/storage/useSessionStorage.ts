import { useStorage } from './useStorage'

/**
 * useSessionStorage hook.
 * 
 * @param	key		The session item key.
 * @param	initial	The session item initial value.
 */
export const useSessionStorage = <T = string>(
	key		: string,
	initial?: T
) => useStorage( key, initial, 'session' )