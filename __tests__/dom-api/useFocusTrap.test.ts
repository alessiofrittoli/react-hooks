import { useRef } from 'react'
import userEvent from '@testing-library/user-event'
import { renderHook, act } from '@testing-library/react'
import { useFocusTrap } from '@/dom-api/useFocusTrap'


describe( 'useFocusTrap', () => {

	let container: HTMLElement

	beforeEach( () => {
		container = document.createElement( 'div' )
		container.setAttribute( 'tabindex', '0' )
		container.innerHTML = (
			`
				<button>Button 1</button>
				<a href="#">Link</a>
				<button>Button 2</button>
				<input type="text"/>
			`
		)

		document.body.appendChild( container )
	} )

	afterEach( () => {
		document.body.removeChild( container )
	} )


	it( 'traps forward focus within the provided element', async () => {

		const {
			result: { current: [ setFocusTrap ] }
		} = renderHook( () => useFocusTrap( useRef( container ) ) )

		act( () => {
			setFocusTrap()
			container.focus()
		} )

		const focusableElements = Array.from(
			container.querySelectorAll<HTMLElement>(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			)
		)

		await act( async () => {
			await userEvent.tab()
		} )

		// first element focused when 'Tab' is pressed.
		expect( document.activeElement ).toBe( focusableElements.at( 0 ) )
		
		await act( async () => {
			await userEvent.tab()
		} )
		
		// second element focused when 'Tab' is pressed.
		expect( document.activeElement ).toBe( focusableElements.at( 1 ) )

		await act( async () => {
			await userEvent.tab() // focus the 3rd
			await userEvent.tab() // focus the 4th
			await userEvent.tab() // focus restart from 1st
		} )

		// focus restart from 1st element
		expect( document.activeElement ).toBe( focusableElements.at( 0 ) )

	} )
	
	
	it( 'traps backward focus within the provided element', async () => {

		const {
			result: { current: [ setFocusTrap ] }
		} = renderHook( () => useFocusTrap( useRef( container ) ) )

		act( () => {
			setFocusTrap()
			container.focus()
		} )

		const focusableElements = Array.from(
			container.querySelectorAll<HTMLElement>(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			)
		)

		await act( async () => {
			await userEvent.tab() // focus the 1st
			await userEvent.tab() // focus the 2nd
			await userEvent.tab( { shift: true } ) // focus back the 1st
		} )

		// focus back when 'Tab+Shift' is pressed.
		expect( document.activeElement ).toBe( focusableElements.at( 0 ) )

		await act( async () => {
			await userEvent.tab( { shift: true } ) // focus back the last element
		} )

		// focus restart from last element when 'Tab+Shift' is pressed.
		expect( document.activeElement ).toBe( focusableElements.at( -1 ) )

	} )


	it( 'skips focus trap logics if different key rather than Tab is pressed', async () => {

		const {
			result: { current: [ setFocusTrap ] }
		} = renderHook( () => useFocusTrap( useRef( container ) ) )

		act( () => {
			setFocusTrap()
			container.focus()
		} )

		const focusableElements = Array.from(
			container.querySelectorAll<HTMLElement>(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			)
		)

		await act( async () => {
			await userEvent.tab()
			await userEvent.keyboard( 'some-random-input' )
		} )

		expect( document.activeElement ).toBe( focusableElements.at( 0 ) )

	} )
	

	it( 'restores focus to the last active element when focus trap is removed', async () => {

		const {
			result: { current: [ setFocusTrap, restoreFocusTrap ] }
		} = renderHook( () => useFocusTrap( useRef( container ) ) )

		const buttonOutside = document.createElement( 'button' )
		document.body.appendChild( buttonOutside )
		buttonOutside.focus() // focus due to a potential click

		const focusableElements = Array.from(
			container.querySelectorAll<HTMLElement>(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			)
		)
		
		act( () => {
			setFocusTrap()
			container.focus()
		} )

		await act( async () => {
			await userEvent.tab() // focus the 1st element
		} )

		expect( document.activeElement ).toBe( focusableElements.at( 0 ) )

		act( () => {
			restoreFocusTrap()
		} )
		
		expect( document.activeElement ).toBe( buttonOutside )
		document.body.removeChild( buttonOutside )

	} )


	it( 'allows setting a new HTML target Element when enabling the focus trap', async () => {

		const anotherEl = document.createElement( 'div' )
		anotherEl.setAttribute( 'tabindex', '0' )
		anotherEl.innerHTML = (
			`
				<button>Button 1</button>
				<a href="#">Link</a>
				<button>Button 2</button>
				<input type="text"/>
			`
		)

		document.body.appendChild( anotherEl )

		const {
			result: { current: [ setFocusTrap ] }
		} = renderHook( () => useFocusTrap() )

		act( () => {
			setFocusTrap( anotherEl )
			anotherEl.focus()
		} )

		const focusableElements = Array.from(
			anotherEl.querySelectorAll<HTMLElement>(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			)
		)

		await act( async () => {
			await userEvent.tab()
		} )

		// first element focused when 'Tab' is pressed.
		expect( document.activeElement ).toBe( focusableElements.at( 0 ) )

		document.body.removeChild( anotherEl )

	} )

} )