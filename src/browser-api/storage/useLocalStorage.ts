import type { SetValue, Value } from '@/browser-api/storage/useStorage'
import { useStorage } from '@/browser-api/storage/useStorage'

/**
 * useLocalStorage hook.
 *
 * @param	key		The local storage item key.
 * @param	initial	The local storage item initial value.
 */
export const useLocalStorage = <T = string>(
	key: string,
	initial?: T,
): readonly [Value<T>, SetValue<Value<T>>] => useStorage(key, initial, 'local')
