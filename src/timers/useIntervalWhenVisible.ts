import { useCallback, useEffect } from 'react'
import { useInterval } from './useInterval'
import type { TimerHandler, TimerOptions, StateTimerOptions, TimerId } from '.'
import type { TimerReturnType, StateTimerReturnType } from '.'

export interface UseIntervalWhenVisibleTimerReturnType extends Omit<TimerReturnType, 'start'>
{
	/**
	 * Manually start the timer.
	 * 
	 * @returns The Timer ID if Document is visible.
	 */
	start: () => TimerId | undefined
}


export interface UseIntervalWhenVisibleStateTimerReturnType extends Omit<StateTimerReturnType, 'start'>
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


export function useIntervalWhenVisible<T extends readonly unknown[]>(
	callback: TimerHandler<T>,
	options?: StateTimerOptions<T>,
): UseIntervalWhenVisibleStateTimerReturnType


export function useIntervalWhenVisible<T extends readonly unknown[]>(
	callback: TimerHandler<T>,
	options?: TimerOptions<T>,
): UseIntervalWhenVisibleTimerReturnType



export function useIntervalWhenVisible<T extends readonly unknown[]>(
	callback: TimerHandler<T>,
	options	: TimerOptions<T> | StateTimerOptions<T> = {},
): UseIntervalWhenVisibleTimerReturnType | UseIntervalWhenVisibleStateTimerReturnType
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