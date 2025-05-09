import { useState } from 'react'
import { renderHook, act } from '@testing-library/react'
import { useDarkMode } from '@/browser-api/useDarkMode'
import { useMediaQuery as _useMediaQuery } from '@/browser-api/useMediaQuery'
import { useLocalStorage as _useLocalStorage } from '@/browser-api/storage'


jest.mock( '@/browser-api/useMediaQuery' )
jest.mock( '@/browser-api/storage' )


const useMediaQuery		= _useMediaQuery as jest.Mock
const useLocalStorage	= _useLocalStorage as jest.Mock


describe( 'useDarkMode', () => {

	beforeEach( () => {
		useMediaQuery.mockReturnValue( false )
		useLocalStorage.mockImplementation( ( key, initial ) => useState( initial ) )
	} )


	afterEach( () => {
		jest.restoreAllMocks().resetModules()
	} )


	it( 'initializes with the correct default values', () => {

		const { result } = renderHook( () => useDarkMode() )

		expect( result.current.isDarkMode ).toBe( false )
		expect( result.current.isDarkOS ).toBe( false )

	} )


	it( 'respects the initial option', () => {

		const { result } = renderHook( () => useDarkMode( { initial: true } ) )

		expect( result.current.isDarkMode ).toBe( true )

	} )


	it( 'fallback to user device preference', () => {

		useMediaQuery.mockReturnValue( true )
		useLocalStorage.mockReturnValue( [ undefined ] )

		const { result } = renderHook( () => useDarkMode() )

		expect( result.current.isDarkMode ).toBe( true )
		expect( result.current.isDarkOS ).toBe( true )

	} )


	describe( 'toggleDarkMode', () => {

		it( 'toggles dark mode', () => {

			const { result } = renderHook( () => useDarkMode() )

			expect( result.current.isDarkMode ).toBe( false )
	
			act( () => {
				result.current.toggleDarkMode()
			} )
			
			expect( result.current.isDarkMode ).toBe( true )
			
			act( () => {
				result.current.toggleDarkMode()
			} )
			
			expect( result.current.isDarkMode ).toBe( false )
	
		} )

	} )


	describe( 'enableDarkMode', () => {
		
		it( 'enables dark mode', () => {

			const { result } = renderHook( () => useDarkMode() )
	
			expect( result.current.isDarkMode ).toBe( false )

			act( () => {
				result.current.enableDarkMode()
			} )
	
			expect( result.current.isDarkMode ).toBe( true )
	
		} )

	} )


	describe( 'disableDarkMode', () => {
		
		it( 'disables dark mode', () => {

			const { result } = renderHook( () => useDarkMode( { initial: true }) )

			expect( result.current.isDarkMode ).toBe( true )
	
			act( () => {
				result.current.disableDarkMode()
			} )

			expect( result.current.isDarkMode ).toBe( false )

		} )

	} )


	it( 'updates class names on the document element', () => {

		const { result } = renderHook( () =>
			useDarkMode( { docClassNames: [ 'dark-theme', 'light-theme' ] } )
		)

		act( () => {
			result.current.enableDarkMode()
		} )

		expect( document.body.parentElement?.classList.contains( 'dark-theme' ) )
			.toBe( true )
		expect( document.body.parentElement?.classList.contains( 'light-theme' ) )
			.toBe( false )

		act( () => {
			result.current.disableDarkMode()
		} )

		expect( document.body.parentElement?.classList.contains( 'dark-theme' ) )
			.toBe( false )
		expect( document.body.parentElement?.classList.contains( 'light-theme' ) )
			.toBe( true )

	} )


	it( 'updates dark mode state based on OS preference changes', () => {

		const { result, rerender } = renderHook( () =>
			useDarkMode( { docClassNames: [ 'dark-theme', 'light-theme' ] } )
		)

		expect( result.current.isDarkMode ).toBe( false )
		expect( result.current.isDarkOS ).toBe( false )

		act( () => {
			useMediaQuery.mockReturnValue( true )
			rerender()
		} )

		expect( result.current.isDarkMode ).toBe( true )
		expect( result.current.isDarkOS ).toBe( true )

	} )


	it( 'switches theme color accordingly', () => {

		const lightColor = document.createElement( 'meta' )
		lightColor.setAttribute( 'name', 'theme-color' )
		lightColor.setAttribute( 'content', '#FFFFFF' )
		lightColor.setAttribute( 'media', '(prefers-color-scheme: light)' )

		const darkColor = document.createElement( 'meta' )
		darkColor.setAttribute( 'name', 'theme-color' )
		darkColor.setAttribute( 'content', '#1F1F1F' )
		darkColor.setAttribute( 'media', '(prefers-color-scheme: dark)' )

		document.head.append( lightColor )
		document.head.append( darkColor )
		
		const { result } = renderHook( () => useDarkMode( { initial: false } ) )

		act( () => {
			result.current.enableDarkMode()
		} )

		expect(
			document.querySelector( 'meta[media="(prefers-color-scheme: light)"]' )
				?.getAttribute( 'content' )
		).toBe( '#1F1F1F' )
		expect(
			document.querySelector( 'meta[media="(prefers-color-scheme: dark)"]' )
				?.getAttribute( 'content' )
		).toBe( '#1F1F1F' )
		
		
		act( () => {
			result.current.disableDarkMode()
		} )

		expect(
			document.querySelector( 'meta[media="(prefers-color-scheme: light)"]' )
				?.getAttribute( 'content' )
		).toBe( '#FFFFFF' )
		expect(
			document.querySelector( 'meta[media="(prefers-color-scheme: dark)"]' )
				?.getAttribute( 'content' )
		).toBe( '#FFFFFF' )

		lightColor.remove()
		darkColor.remove()

	} )
	
	
	it( 'doesn\'t switch theme colors if no color is found', () => {

		const lightColor = document.createElement( 'meta' )
		lightColor.setAttribute( 'name', 'theme-color' )
		lightColor.setAttribute( 'media', '(prefers-color-scheme: light)' )

		const darkColor = document.createElement( 'meta' )
		darkColor.setAttribute( 'name', 'theme-color' )
		darkColor.setAttribute( 'media', '(prefers-color-scheme: dark)' )

		document.head.append( lightColor )
		document.head.append( darkColor )
		
		const { result } = renderHook( () => useDarkMode( { initial: false } ) )

		act( () => {
			result.current.enableDarkMode()
		} )

		expect(
			document.querySelector( 'meta[media="(prefers-color-scheme: light)"]' )
				?.getAttribute( 'content' )
		).toBeNull()
		expect(
			document.querySelector( 'meta[media="(prefers-color-scheme: dark)"]' )
				?.getAttribute( 'content' )
		).toBeNull()
		
		
		act( () => {
			result.current.disableDarkMode()
		} )

		expect(
			document.querySelector( 'meta[media="(prefers-color-scheme: light)"]' )
				?.getAttribute( 'content' )
		).toBeNull()
		expect(
			document.querySelector( 'meta[media="(prefers-color-scheme: dark)"]' )
				?.getAttribute( 'content' )
		).toBeNull()

		lightColor.remove()
		darkColor.remove()

	} )

} )