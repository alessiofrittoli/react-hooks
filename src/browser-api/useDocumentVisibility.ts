import { useEffectOnce } from '@/misc'
import { useCallback, useEffect, useState } from 'react'

export type VisibilityChangeHandler = ( isVisible: boolean ) => void


export interface UseDocumentVisibilityOptions
{
	/**
	 * Whether to update React state about Document visibility state or not.
	 * 
	 * @default true
	 */
	updateState?: boolean
	/**
	 * A custom callback executed when Document visiblity sate changes.
	 * 
	 */
	onVisibilityChange?: VisibilityChangeHandler
}


export interface StateDisabledUseDocumentVisibilityOptions extends UseDocumentVisibilityOptions
{
	/**
	 * React state updates will be disabled.
	 * 
	 * @default true
	 */
	updateState: false
}


/**
 * Track the visibility state of the document (i.e., whether the page is visible or hidden).
 *
 * @param options (Optional) Configuration options for the hook.
 * @param options.updateState If `true` (default), the hook manages and returns the visibility state. If `false`, the hook does not manage state and only calls `onVisibilityChange`.
 * @param options.onVisibilityChange Optional callback invoked whenever the document's visibility changes. Receives the new visibility state as a boolean.
 *
 * @remarks
 * - Uses the Page Visibility API (`document.hidden` and `visibilitychange` event).
 * - The hook will not trigger re-renders on visibility changes since `updateState` has been set to `false`.
 */
export function useDocumentVisibility( otpions: StateDisabledUseDocumentVisibilityOptions ): void


/**
 * Track the visibility state of the document (i.e., whether the page is visible or hidden).
 *
 * @param options (Optional) Configuration options for the hook.
 * @param options.updateState The hook will manage and return the visibility state.
 * @param options.onVisibilityChange Optional callback invoked whenever the document's visibility changes. Receives the new visibility state as a boolean.
 * 
 * @returns Returns `true` if the document is visible, `false` otherwise.
 *
 * @remarks
 * - Uses the Page Visibility API (`document.hidden` and `visibilitychange` event).
 * - The hook will trigger re-renders on visibility changes since `updateState` is `true` by default.
 */
export function useDocumentVisibility( otpions?: UseDocumentVisibilityOptions ): boolean


/**
 * Track the visibility state of the document (i.e., whether the page is visible or hidden).
 *
 * @param options (Optional) Configuration options for the hook.
 * @param options.updateState If `true` (default), the hook manages and returns the visibility state. If `false`, the hook does not manage state and only calls `onVisibilityChange`.
 * @param options.onVisibilityChange Optional callback invoked whenever the document's visibility changes. Receives the new visibility state as a boolean.
 * 
 * @returns Returns `true` if the document is visible, `false` if hidden, or `void` if `updateState` is set to `false`.
 *
 * @remarks
 * - Uses the Page Visibility API (`document.hidden` and `visibilitychange` event).
 * - If `updateState` is `false`, the hook will not trigger re-renders on visibility changes.
 */
export function useDocumentVisibility(
	options: UseDocumentVisibilityOptions | StateDisabledUseDocumentVisibilityOptions = {}
): boolean | void
{

	const {
		updateState = true, onVisibilityChange
	} = options
	
	const [ isVisible, setIsVisible ] = useState( false )

	const visibilityChangeHandler = useCallback( () => {
		const isVisible = ! document.hidden
		if ( updateState ) setIsVisible( isVisible )
		onVisibilityChange?.( isVisible )
	}, [ updateState, onVisibilityChange ] )


	useEffectOnce( () => {
		if ( ! updateState ) return
		setIsVisible( ! document.hidden )
	} )

	useEffect( () => {

		document.addEventListener( 'visibilitychange', visibilityChangeHandler )

		return () => document.removeEventListener( 'visibilitychange', visibilityChangeHandler )

	}, [ visibilityChangeHandler ] )

	
	if ( updateState ) return isVisible

}