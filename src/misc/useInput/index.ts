import { useCallback, useReducer } from 'react'
import { useUpdateEffect } from '../useUpdateEffect'

import { initialState, inputReducer, isEmptyValue } from './inputReducer'
import { InputActionKind } from './types'
import type { ChangeHandler, InputState, InputType, ParseValueHandler, ValidateValueHandler } from './types'

export type { InputType, InputState, ChangeHandler, ParseValueHandler, ValidateValueHandler }


/**
 * useInput options.
 * 
 * @template I The input value type.
 * @template O The output parsed value type.
 */
export interface UseInputOptions<I = unknown, O = I>
{
	/**
	 * The React HTML input element ref.
	 * 
	 * This is required to properly execute the {@link UseInputOutput.focus}.
	 */
	inputRef?: React.RefObject<InputType>
	/**
	 * The input initial value.
	 * 
	 */
	initialValue?: O | null
	/**
	 * A timeout in milliseconds which will be used to define the input as "touched" thus validations are triggered and errors can be displayed.
	 * 
	 * @default 600
	 */
	touchTimeout?: number
	/**
	 * Validate value.
	 * 
	 * @param value The value to validate. If `parse` callback is given, the `value` will be parsed before validation.
	 * @returns `true` if the `value` has a valid state, `false` otherwise.
	 */
	validate?: ValidateValueHandler<O>
	/**
	 * Parse value.
	 * 
	 * @param value The value to parse.
	 * @returns The parsed `value`.
	 */
	parse?: ParseValueHandler<I, O>
	/**
	 * A callable function executed when the `ChangeEvent` is dispatched on the HTML input element.
	 * @param value The input value.
	 */
	onChange?: ChangeHandler<O>
}


export interface UseInputOutput<I = unknown, O = I> extends InputState<I, O>
{
	/**
	 * Indicates whether the Input is empty or not.
	 * 
	 */
	isEmpty: boolean
	/**
	 * Indicates whether the input has error or not.
	 * It will return true if the Input does not pass the validation checks and it has been touched.
	 * Please refer to the `isValid` property to check the Input validity regardless of whether it has been touched or not.
	 */
	hasError: boolean
	/**
	 * Change handler callback used to handle Input change events.
	 * 
	 */
	changeHandler: React.ChangeEventHandler<InputType>
	/**
	 * Blur handler callback used to handle Input blur events.
	 * 
	 */
	blurHandler: () => void
	/**
	 * Call `setValue` method to update input value.
	 * 
	 */
	setValue: ( value: O ) => void
	/**
	 * Call `submit` method to re-run validations and ensure error state is updated successfully.
	 * 
	 */
	submit: () => void
	/**
	 * Call `reset` method to reset the Input state.
	 * 
	 */
	reset: () => void
	/**
	 * Call `focus` method to focus the Input Element. A ref object must be provided.
	 * 
	 */
	focus: () => void
}


/**
 * Handle input states with ease.
 * 
 * @param props An object defining custom options. See {@link UseInputOptions} for more info.
 * @returns	An object containing Input state and utility functions. See {@link UseInputOutput} for more info.
 */
export const useInput = <I = unknown, O = I>( props: UseInputOptions<I, O> = {} ): UseInputOutput<I, O> => {

	const { inputRef }				= props
	const { initialValue }			= props
	const { touchTimeout = 600 }	= props
	const { validate, parse }		= props
	const { onChange }				= props

	const [ state, dispatch ] = useReducer( inputReducer,
		{
			...initialState,
			value: initialValue,
		}
	)

	const value			= parse ? parse( state.value as I ) : state.value as O
	const { isTouched }	= state
	const isEmpty		= isEmptyValue( value )
	const isValid		= typeof validate === 'function' ? validate( value ) : true
	const hasError		= (
		( ! isValid && isTouched ) ||
		( !! initialValue && ! isValid )
	)


	/**
	 * Set 'touched' state with delay when `value` change.
	 * 
	 */
	useUpdateEffect( () => {

		const identifier = setTimeout( () => {
			if ( isEmptyValue( value ) ) return

			dispatch( {
				type: InputActionKind.TOUCHED,
			} )
		}, touchTimeout )

		return () => clearTimeout( identifier )

	}, [ value, touchTimeout ] )


	/**
	 * Handle input change state.
	 *
	 * @param event The change event interface.
	 */
	const changeHandler = useCallback<React.ChangeEventHandler<InputType>>(
		event => {
		
			const { target }	= event
			const { type }		= target
			const value			= (
				type === 'checkbox' ?
				( target as HTMLInputElement ).checked : target.value
			)

			dispatch( {
				type	: InputActionKind.CHANGE,
				value	: value,
			} )

			onChange?.( parse ? parse( value as I ) : value as O )
			
		}, [ onChange, parse ]
	)


	/**
	 * Handle input blur state.
	 *
	 */
	const blurHandler = useCallback( () => {
		dispatch( {
			type: InputActionKind.BLUR,
		} )
	}, [] )


	/**
	 * Trigger input validation on submit.
	 *
	 */
	const submit = useCallback( () => {
		dispatch( {
			type: InputActionKind.TOUCHED,
		} )
	}, [] )


	/**
	 * Programmatically set a new value.
	 *
	 */
	const setValue = useCallback( ( value: O ) => {
		dispatch( {
			type	: InputActionKind.CHANGE,
			value	: value,
		} )
	}, [] )


	/**
	 * Focus the input.
	 *
	 */
	const focus = useCallback( () => {
		inputRef?.current?.focus()
	}, [ inputRef ] )


	/**
	 * Reset the input.
	 *
	 */
	const reset = useCallback( () => {
		dispatch( {
			type: InputActionKind.RESET,
		} )
	}, [] )


	return {
		value, isTouched, isValid, isEmpty, hasError,
		changeHandler, blurHandler, setValue,
		submit, focus, reset,
	}

}