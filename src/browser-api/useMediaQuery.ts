import { useCallback, useEffect, useState } from 'react'
import { getMediaMatches } from '@alessiofrittoli/web-utils/browser-api'


/**
 * Get Document Media matches and listen for changes.
 *
 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia)
 *
 * @param	query A string specifying the media query to parse into a `MediaQueryList`.
 * @returns	A boolean value that returns `true` if the document currently matches the media query list, or `false` if not.
 */
export const useMediaQuery = ( query: string ) => {

	const [ matches, setMatches ]	= useState( getMediaMatches( query ) )
	const matchMediaChangeHandler	= useCallback( () => setMatches( getMediaMatches( query ) ), [ query ] )


	useEffect( () => {

		const matchMedia = window.matchMedia( query )
		// Triggered at the first client-side load
		matchMediaChangeHandler()
		// Listen matchMedia
		matchMedia.addEventListener( 'change', matchMediaChangeHandler )

		return () => {
			matchMedia.removeEventListener( 'change', matchMediaChangeHandler )
		}

	}, [ query, matchMediaChangeHandler ] )

	return matches
	
}