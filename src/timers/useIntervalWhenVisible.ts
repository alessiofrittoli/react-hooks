import { useCallback, useEffect } from 'react'
import { useInterval } from './useInterval'
import type { TimerHandler, TimerOptions, StateTimerOptions, TimerId } from './types'
import type { TimerReturnType, StateTimerReturnType } from './types'

export interface UseIntervalWhenVisibleReturnType extends Omit<TimerReturnType, 'start'>
{
	/**
	 * Manually start the timer.
	 * 
	 * @returns The Timer ID if Document is visible.
	 */
	start: () => TimerId | undefined
}


export interface UseIntervalWhenVisibleStateReturnType extends Omit<StateTimerReturnType, 'start'>
{
	/**
	 * Manually start the timer.
	 * 
	 * @returns The Timer ID if Document is visible.
	 */
	start: () => TimerId | undefined
	/**
	 * Indicates that the timer is active, thus the Document is visible.
	 * 
	 */
	isActive: boolean
}


/**
 * Schedules repeated execution of `callback` every `delay` milliseconds when `Document` is visible.
 * 
 * This hook automatically starts and stops the interval based on the `Document` visibility.
 * 
 * The `Timeout` is automatically cancelled on unmount.
 * 
 * @template T An Array defining optional arguments passed to the `callback`.
 * 
 * @param	callback	The function to call when the timer elapses.
 * @param	options		(Optional) An object defining custom timer options. See {@link StateTimerOptions} for more info.
 * 
 * @returns An object with timer utilities. See {@link UseIntervalWhenVisibleStateReturnType} for more info.
 */
export function useIntervalWhenVisible<T extends readonly unknown[]>(
	callback: TimerHandler<T>,
	options?: StateTimerOptions<T>,
): UseIntervalWhenVisibleStateReturnType


/**
 * Schedules repeated execution of `callback` every `delay` milliseconds when `Document` is visible.
 * 
 * This hook automatically starts and stops the interval based on the `Document` visibility.
 * 
 * The `Timeout` is automatically cancelled on unmount.
 * 
 * @template T An Array defining optional arguments passed to the `callback`.
 * 
 * @param	callback	The function to call when the timer elapses.
 * @param	options		(Optional) An object defining custom timer options. See {@link TimerOptions} for more info.
 * 
 * @returns An object with timer utilities. See {@link UseIntervalWhenVisibleReturnType} for more info.
 */
export function useIntervalWhenVisible<T extends readonly unknown[]>(
	callback: TimerHandler<T>,
	options?: TimerOptions<T>,
): UseIntervalWhenVisibleReturnType


/**
 * Schedules repeated execution of `callback` every `delay` milliseconds when `Document` is visible.
 * 
 * This hook automatically starts and stops the interval based on the `Document` visibility.
 * 
 * The `Timeout` is automatically cancelled on unmount.
 * 
 * @template T An Array defining optional arguments passed to the `callback`.
 * 
 * @param	callback	The function to call when the timer elapses.
 * @param	options		(Optional) An object defining custom timer options. See {@link TimerOptions} and {@link StateTimerOptions} for more info.
 * 
 * @returns An object with timer utilities. See {@link UseIntervalWhenVisibleReturnType} and {@link UseIntervalWhenVisibleStateReturnType} for more info.
 */
export function useIntervalWhenVisible<T extends readonly unknown[]>(
	callback: TimerHandler<T>,
	options	: TimerOptions<T> | StateTimerOptions<T> = {},
): UseIntervalWhenVisibleReturnType | UseIntervalWhenVisibleStateReturnType
{

	const { autoplay = true } = options
	const result = useInterval( callback, { autoplay: false, ...options } )

	const {
		start	: intervalStart,
		stop	: intervalStop,
	} = result


	const visibilityChangeHandler = useCallback( () => (
		! document.hidden ? intervalStart() : intervalStop()
	), [ intervalStart, intervalStop ] )


	const start = useCallback( () => {

		document.addEventListener( 'visibilitychange', visibilityChangeHandler )

		if ( ! document.hidden ) return intervalStart()

	}, [ intervalStart, visibilityChangeHandler ] )


	const stop = useCallback( () => {
		
		intervalStop()
		document.removeEventListener( 'visibilitychange', visibilityChangeHandler )

	}, [ intervalStop, visibilityChangeHandler ] )
	

	useEffect( () => {

		if ( ! autoplay ) return

		start()

		return stop

	}, [ autoplay, start, stop ] )


	return { ...result, start, stop }

}