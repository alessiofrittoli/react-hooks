import { useStorage } from './useStorage'

/**
 * useSessionStorage hook.
 * 
 * @param	key				The session item key.
 * @param	initialValue	The session item initial value.
 */
export const useSessionStorage = <T = string>(
	key				: string,
	initialValue?	: T
) => useStorage( key, initialValue, 'session' )