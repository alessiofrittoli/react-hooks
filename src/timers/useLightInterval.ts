import { useEffect } from 'react'
import type { BasicTimerOptions, TimerHandler } from './types'


/**
 * Schedules repeated execution of `callback` every `delay` milliseconds.
 *
 * This is a lighter version of [`useInterval`](./useInterval.ts) and is suggested to use when
 * a basic functionality is enough (no manual start/stop or state updates).
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
export const useLightInterval = <T extends readonly unknown[]>(
	callback: TimerHandler<T>,
	options	: BasicTimerOptions<T> = {},
) => {

	const { delay = 1, args } = options

	useEffect( () => {
		
		const timer = setInterval( callback, delay, ...( args || [] ) )

		return () => clearInterval( timer )

	}, [ delay, args, callback ] )

}