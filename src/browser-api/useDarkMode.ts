import { useCallback, useEffect, useRef } from 'react'
import { useIsClient, useUpdateEffect } from '@/misc'
import { useMediaQuery } from './useMediaQuery'
import { useLocalStorage } from './storage'


export interface UseDarkModeOutput
{
	/**
	 * Indicates whether dark mode is enabled.
	 * 
	 */
	isDarkMode: boolean
	/**
	 * Indicates whether the current device prefers dark theme.
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
	 * The fallback value to use if no preference is saved in `localStorage`.
	 * 
	 * @default
	 * 
	 * true	// if device prefers dark color scheme.
	 * false	// if device prefers light color scheme.
	 * 
	 */
	initial?: boolean
	/**
	 * Array of class names to toggle on the `<html>` element, e.g. `['dark', 'light']`.
	 * 
	 */
	docClassNames?: [ dark: string, light: string ]
}


/**
 * Easily manage dark mode with full respect for user device preferences.
 * 
 * This hook is user-oriented and built to honor system-level color scheme settings:
 * 
 * - If the device prefers a dark color scheme, dark mode is automatically enabled on first load.
 * - If the user enables/disables dark mode via a web widget, the preference is stored in `localStorage` under the key `dark-mode`.
 * - If the device color scheme preference changes (e.g. via OS settings), that change takes precedence and is stored for future visits.
 * 
 * @param options Configuration object for the hook. See {@link UseDarkModeOptions} for more info.
 * 
 * @returns	An object containing utilities for managing dark mode.
 */
export const useDarkMode = ( options: UseDarkModeOptions = {} ): UseDarkModeOutput => {

	const isClient	= useIsClient()
	const isDarkOS	= useMediaQuery( '(prefers-color-scheme: dark)' )
	
	const {
		initial = isDarkOS, docClassNames = [],
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
		if ( darkClassName ) document.documentElement.classList.toggle( darkClassName, darkModeEnabled )
		if ( lightClassName ) document.documentElement.classList.toggle( lightClassName, ! darkModeEnabled )
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