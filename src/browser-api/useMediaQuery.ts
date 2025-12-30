import { useCallback, useEffect, useState } from 'react'
import { getMediaMatches } from '@alessiofrittoli/web-utils/browser-api'

export type OnChangeHandler = ( matches: boolean ) => void

interface CommonOptions
{
	/**
	 * A custom callback that will be invoked on initial page load and when the given `query` change event get dispatched.
	 * 
	 * @param matches Whether the document currently matches the media query list.
	 */
	onChange?: OnChangeHandler
}

export interface UseMediaQueryOptions extends CommonOptions
{
	/**
	 * Indicates whether the hook will dispatch a React state update when the given `query` change event get dispatched.
	 * 
	 */
	updateState: false
	/**
	 * A custom callback that will be invoked on initial page load and when the given `query` change event get dispatched.
	 * 
	 * @param matches Whether the document currently matches the media query list.
	 */
	onChange: OnChangeHandler
}


export interface UseMediaQueryStateOptions extends CommonOptions
{
	/**
	 * Indicates whether the hook will dispatch a React state update when the given `query` change event get dispatched.
	 * 
	 * @default true
	 */
	updateState?: true
}


/**
 * Get Document Media matches and dispatch a React state update on MediaQuery changes.
 *
 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia)
 *
 * @param	query	A string specifying the media query to parse into a `MediaQueryList`.
 * @param	options	An object defining custom options. See {@linkcode UseMediaQueryStateOptions} for more info.
 * 
 * @returns	A boolean value that returns `true` if the document currently matches the media query list, or `false` if not.
 */
export function useMediaQuery( query: string, options?: UseMediaQueryStateOptions ): boolean


/**
 * Get Document Media matches and listen for changes.
 * 
 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia)
 *
 * @param	query	A string specifying the media query to parse into a `MediaQueryList`.
 * @param	options	An object defining custom options. See {@linkcode UseMediaQueryOptions} for more info.
 */
export function useMediaQuery( query: string, options?: UseMediaQueryOptions ): void


/**
 * Get Document Media matches and listen for changes.
 *
 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia)
 *
 * @param	query	A string specifying the media query to parse into a `MediaQueryList`.
 * @param	options	An object defining custom options. See {@linkcode UseMediaQueryOptions} and {@linkcode UseMediaQueryStateOptions} for more info.
 * 
 * @returns	A boolean value that returns `true` if the document currently matches the media query list, or `false` if not.
 */
export function useMediaQuery(
	query	: string,
	options	: UseMediaQueryOptions | UseMediaQueryStateOptions = {}
): boolean | void
{

	const { updateState = true, onChange } = options

	const [ matches, setMatches ]	= useState( getMediaMatches( query ) )
	const matchMediaChangeHandler	= useCallback( () => {

		const matches = getMediaMatches( query )
		if ( updateState ) setMatches( matches )
		
		onChange?.( matches )

	}, [ query, updateState, onChange ] )


	useEffect( () => {

		const matchMedia	= window.matchMedia( query )
		const { matches }	= matchMedia

		if ( updateState ) setMatches( matches )

		onChange?.( matches )

		matchMedia.addEventListener( 'change', matchMediaChangeHandler )

		return () => {
			matchMedia.removeEventListener( 'change', matchMediaChangeHandler )
		}

	}, [ query, updateState, onChange, matchMediaChangeHandler ] )

	if ( ! updateState ) return

	return matches
	
}