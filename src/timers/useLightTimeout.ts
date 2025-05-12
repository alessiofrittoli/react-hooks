import { useEffect } from 'react'
import type { BasicTimerOptions, TimerHandler } from './types'


/**
 * Schedules execution of a one-time `callback` after `delay` milliseconds.
 * 
 * This is a lighter version of [`useTimeout`](./useTimeout.ts), suggested to use when
 * a basic functionality is enough (no manual start/stop or state updates).
 *
 * The `callback` will likely not be invoked in precisely `delay` milliseconds.
 * Node.js makes no guarantees about the exact timing of when callbacks will fire,
 * nor of their ordering. The callback will be called as close as possible to the
 * time specified.
 *
 * When `delay` is larger than `2147483647` or less than `1` or `NaN`, the `delay`
 * will be set to `1`. Non-integer delays are truncated to an integer.
 *
 * If `callback` is not a function, a `TypeError` will be thrown.
 * 
 * The `Timeout` is automatically cancelled on unmount.
 * 
 * @template T An Array defining optional arguments passed to the `callback`.
 * 
 * @param	callback	The function to call when the timer elapses.
 * @param	options		(Optional) An object defining custom timer options. See {@link BasicTimerOptions} for more info.
 */
export const useLightTimeout = <T extends readonly unknown[]>(
	callback: TimerHandler<T>,
	options	: BasicTimerOptions<T> = {},
) => {

	const { delay = 1, args } = options

	useEffect( () => {
		
		const timer = setTimeout( callback, delay, ...( args || [] ) )

		return () => clearTimeout( timer )

	}, [ delay, args, callback ] )

}