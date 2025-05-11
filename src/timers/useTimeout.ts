import { useCallback, useEffect, useRef, useState } from 'react'
import type { StartTimer, StopTimer, TimerHandler, TimerId } from '.'
import type { TimerOptions, StateTimerOptions } from '.'
import type { TimerReturnType, StateTimerReturnType } from '.'


/**
 * Schedules execution of a one-time `callback` after `delay` milliseconds.
 * 
 * A React State update will occur when the timer expires or get cancelled by `stop()` method.
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
 * @param	options		(Optional) An object defining custom timer options. See {@link StateTimerOptions} for more info.
 * 
 * @returns An object with timer utilities. See {@link StateTimerReturnType} for more info.
 */
export function useTimeout<T extends readonly unknown[]>(
	callback: TimerHandler<T>,
	options?: StateTimerOptions<T>,
): StateTimerReturnType


/**
 * Schedules execution of a one-time `callback` after `delay` milliseconds.
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
 * @param	options		(Optional) An object defining custom timer options. See {@link TimerOptions} for more info.
 * 
 * @returns An object with timer utilities. See {@link TimerReturnType} for more info.
 */
export function useTimeout<T extends readonly unknown[]>(
	callback: TimerHandler<T>,
	options?: TimerOptions<T>,
): TimerReturnType


/**
 * Schedules execution of a one-time `callback` after `delay` milliseconds.
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
 * @param	options		(Optional) An object defining custom timer options. See {@link TimerOptions} and {@link StateTimerOptions} for more info.
 * 
 * @returns An object with timer utilities. See {@link TimerReturnType} and {@link StateTimerReturnType} for more info.
 */
export function useTimeout<T extends readonly unknown[]>(
	callback: TimerHandler<T>,
	options	: TimerOptions<T> | StateTimerOptions<T> = {},
): TimerReturnType | StateTimerReturnType
{

	const {
		delay = 1, args, autoplay = true,
		runOnStart = false, updateState = false,
	} = options

	const timerRef = useRef<TimerId>( undefined )
	const [ isActive, setIsActive ] = useState( autoplay )


	/**
	 * Clear timer without state update.
	 * 
	 * @returns `true` if timer was running, `false` otherwise.
	 */
	const clear = useCallback( () => {

		if ( ! timerRef.current ) return false

		clearTimeout( timerRef.current )
		timerRef.current = undefined

		return true

	}, [] )


	const start = useCallback<StartTimer>( () => {

		const wasActive = clear()

		if ( runOnStart ) {
			if ( args ) {
				callback( ...args )
			} else {
				callback()
			}
		}
		
		timerRef.current = setTimeout( () => {
			timerRef.current = undefined
			if ( updateState ) setIsActive( false )
			if ( args ) return callback( ...args )
			callback()
		}, delay )

		if ( ! wasActive && updateState ) setIsActive( true )

		return timerRef.current

	}, [ delay, args, updateState, runOnStart, callback, clear ] )


	const stop = useCallback<StopTimer>( () => {

		if ( clear() && updateState ) setIsActive( false )

	}, [ updateState, clear ] )


	useEffect( () => {

		if ( ! autoplay ) return
		
		start()

		return stop

	}, [ autoplay, start, stop ] )


	return (
		updateState
			? { isActive, start, stop }
			: { start, stop }
	)

}