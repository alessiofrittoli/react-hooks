import type { SetValue, Value } from '@/browser-api/storage/useStorage'
import { useStorage } from '@/browser-api/storage/useStorage'

/**
 * useSessionStorage hook.
 *
 * @param	key		The session item key.
 * @param	initial	The session item initial value.
 */
export const useSessionStorage = <T = string>(
	key: string,
	initial?: T,
): readonly [Value<T>, SetValue<Value<T>>] => useStorage(key, initial, 'session')
