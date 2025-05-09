import { useCallback, useEffect, useRef } from 'react'
import { useIsClient, useUpdateEffect } from '@/misc'
import { useMediaQuery } from './useMediaQuery'
import { useLocalStorage } from './storage'


export interface UseDarkModeOutput
{
	/**
	 * Indicates wheter dark mode is enabled or not.
	 * 
	 */
	isDarkMode: boolean
	/**
	 * Indicates wheter the current device prefers dark theme or not.
	 * 
	 */
	isDarkOS: boolean
	/**
	 * Toggle dark mode.
	 * 
	 */
	toggleDarkMode: () => void
	/**
	 * Enable dark mode.
	 * 
	 */
	enableDarkMode: () => void
	/**
	 * Disable dark mode.
	 * 
	 */
	disableDarkMode: () => void
}


export interface UseDarkModeOptions
{
	/**
	 * A boolean value which determines the default value if no preference has been saved in Local Storage.
	 * 
	 */
	initial?: boolean
	/**
	 * An Array of class names toggled to the Document HTML Element. ( e.g. [ 'dark-theme', 'light-theme' ] )
	 * 
	 */
	docClassNames?: [ dark: string, light: string ]
}


/**
 * Use Dark Mode hook.
 * 
 * @param options An object defining hook options. See {@link UseDarkModeOptions} for more info.
 * 
 * @returns	An object containing dark mode utilities.
 */
export const useDarkMode = ( options: UseDarkModeOptions = {} ): UseDarkModeOutput => {

	const isClient	= useIsClient()
	const isDarkOS	= useMediaQuery( '(prefers-color-scheme: dark)' )
	
	const {
		initial = isDarkOS,
		docClassNames = [],
	} = options

	const [ isDarkMode, setIsDarkMode ]	= useLocalStorage( 'dark-mode', initial )
	
	const darkModeEnabled = isDarkMode ?? isDarkOS
	const [ darkClassName, lightClassName ] = docClassNames

	const colorsRef = useRef( { light: '', dark: '' } )

	// Update dark mode if OS prefers changes
	useUpdateEffect( () => {
		setIsDarkMode( isDarkOS )
	}, [ isDarkOS, setIsDarkMode ] )


	useEffect( () => {
		if ( darkClassName ) document.body.parentElement?.classList.toggle( darkClassName, darkModeEnabled )
		if ( lightClassName ) document.body.parentElement?.classList.toggle( lightClassName, ! darkModeEnabled )
	}, [ darkModeEnabled, darkClassName, lightClassName ] )


	/**
	 * Recover Document `theme-color` for further updates.
	 * 
	 */
	useEffect( () => {

		document.head.querySelectorAll( 'meta[name="theme-color"]' )
			.forEach( element => {

				const media = element.getAttribute( 'media' )
				const color = element.getAttribute( 'content' )
				
				if ( ! color ) return

				if ( ! media || media === '(prefers-color-scheme: light)' ) {
					colorsRef.current.light = color
					return
				}

				colorsRef.current.dark = color

			} )
		
	}, [] )


	/**
	 * Ensure theme color match when dark mode is toggled.
	 * 
	 */
	useUpdateEffect( () => {

		// const darkColor	 = colorsRef.current.dark || colorsRef.current.light
		// const lightColor = colorsRef.current.light || colorsRef.current.dark
		const darkColor	 = colorsRef.current.dark
		const lightColor = colorsRef.current.light

		if ( isDarkMode && ! darkColor ) return
		if ( ! isDarkMode && ! lightColor ) return

		document.head.querySelectorAll( 'meta[name="theme-color"]' )
			.forEach( element => {

				element
					.setAttribute( 'content', isDarkMode ? darkColor : lightColor )

			} )


	}, [ isDarkMode ] )


	return {
		isDarkMode		: ! isClient ? false : darkModeEnabled, // ensure no hydration error
		isDarkOS		: ! isClient ? false : isDarkOS, // ensure no hydration error
		toggleDarkMode	: useCallback( () => setIsDarkMode( prev => ! prev ), [ setIsDarkMode ] ),
		enableDarkMode	: useCallback( () => setIsDarkMode( true ), [ setIsDarkMode ] ),
		disableDarkMode	: useCallback( () => setIsDarkMode( false ), [ setIsDarkMode ] ),
	}
	
}