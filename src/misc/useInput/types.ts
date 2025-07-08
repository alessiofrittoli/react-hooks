export type InputType = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null

export enum InputActionKind
{
	/**
	 * Dispatch this action when the input has been "touched" by the user (focused and valued) so errors may be displayed to the user.
	 */
	TOUCHED = 'TOUCHED',
	/**
	 * Dispatch this action when a React.ChangeEvent occurs in order to keep track of the input value and validity.
	 */
	CHANGE = 'CHANGE',
	/**
	 * Dispatch this action when a React.FocusEvent occurs in order to keep track of the "touched" state.
	 */
	BLUR = 'BLUR',
	/**
	 * Dispatch this action to reset input state.
	 */
	RESET = 'RESET',
}


export interface InputAction<T = unknown>
{
	/**
	 * The `InputActionKind` being dispatched.
	 * 
	 */
	type: InputActionKind
	/**
	 * The input value read while dispatching the current action.
	 * 
	 */
	value?: T
}


export interface InputState<I = unknown, O = I>
{
	/**
	 * The input value.
	 * 
	 */
	value?: O
	/**
	 * Indicates whether the input has been focused and valued.
	 * 
	 */
	isTouched: boolean
	/**
	 * Indicates whether the Input is valid or not based on the given validation callback. Default `true` if no callback is given.
	 * 
	 */
	isValid: boolean
}


/**
 * The useReducer function.
 * 
 * @param state		The current state.
 * @param action	The state dispatch action being dispatched.
 * 
 * @returns The updated state.
 */
export type ReducerFn<T = unknown> = ( state: InputState<T>, action: InputAction<T> ) => InputState<T>


/**
 * Input change handler.
 * 
 * @param value The new value.
 */
export type ChangeHandler<O = unknown> = ( value?: O ) => void


/**
 * Validate value.
 * 
 * @param value The value to validate. If `parse` callback is given, the `value` will be parsed before validation.
 * @returns `true` if the `value` has a valid state, `false` otherwise.
 */
export type ValidateValueHandler<O = unknown> = ( value?: O ) => boolean


/**
 * Parse value.
 * 
 * @param value The value to parse.
 * @returns The parsed `value`.
 */
export type ParseValueHandler<I = unknown, O = I> = ( value: I ) => O | undefined