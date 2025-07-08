import { isEmpty } from '@alessiofrittoli/web-utils'
import { InputActionKind } from './types'
import type { InputState, ReducerFn } from './types'

/**
 * Check if the given `value` is empty.
 * 
 * @param value The value to check.
 * @returns `true` if `value` is an empty string or is a falsey value, `false` otherwise.
 */
export const isEmptyValue = ( value: unknown ) => (
	typeof value === 'string' ? isEmpty( value ) : ! value
)


/**
 * The input initial state.
 * 
 */
export const initialState: InputState = {
	value		: '',
	isTouched	: false,
	isValid		: true,
}


/**
 * Handle dispatched actions and update state accordingly.
 * 
 * @param state		The current state.
 * @param action	The dispatched action.
 * 
 * @returns The updated state.
 */
export const inputReducer: ReducerFn = ( state, action ) => {

	switch ( action.type ) {
		case InputActionKind.TOUCHED:
			return {
				...state,
				isTouched: true,
			}
			
		case InputActionKind.CHANGE:
			return {
				...state,
				value: action.value,
			}
			
		case InputActionKind.BLUR:
			return {
				...state,
				value		: state.value,
				isTouched	: ! isEmptyValue( state.value ?? '' )
			}
			
		case InputActionKind.RESET:
			return initialState
	}

}