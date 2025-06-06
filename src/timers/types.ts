/**
 * The function called when the timer elapses.
 * 
 */
export type TimerHandler<T extends readonly unknown[]> = ( ( ...args: T ) => void ) | ( () => void )


/**
 * The Timer Id return by `setTimeout` or `setInterval` functions
 * 
 */
export type TimerId = number | NodeJS.Timeout


/**
 * Start the timer.
 * 
 * @returns The {@link TimerId}.
 */
export type StartTimer = () => TimerId


/**
 * Stop the timer.
 * 
 */
export type StopTimer = () => void


export interface BasicTimerOptions<T extends readonly unknown[]>
{
	/**
	 * The number of milliseconds to wait before calling the `callback`.
	 * 
	 * @default 1
	 */
	delay?: number
	/**
	 * Optional arguments to pass when the `callback` is called.
	 * 
	 * Make sure to memoize its value to avoid timer restarts when a state update happen in your Component.
	 */
	args?: T
}


export interface TimerOptions<T extends readonly unknown[]> extends BasicTimerOptions<T>
{
	/**
	 * Indicates whether auto start the timer.
	 * 
	 * @default true
	 */
	autoplay?: boolean
	/**
	 * Whether to update React state about Timer running status.
	 * 
	 * @default false
	 */
	updateState?: boolean
	/**
	 * Indicates whether to execute the callback when timer starts.
	 * 
	 * @default false
	 */
	runOnStart?: boolean
}


export interface StateTimerOptions<T extends readonly unknown[]> extends TimerOptions<T>
{
	/**
	 * Whether to update React state about Timer running status.
	 * 
	 * @default false
	 */
	updateState: true
}


export interface TimerReturnType
{
	/**
	 * Manually start the timer.
	 * 
	 * @returns The Timer ID.
	 */
	start: StartTimer
	/**
	 * Manually stop the timer.
	 * 
	 */
	stop: StopTimer
}


export interface StateTimerReturnType extends TimerReturnType
{
	/**
	 * Indicates whether the timer is active.
	 * 
	 */
	isActive: boolean
}