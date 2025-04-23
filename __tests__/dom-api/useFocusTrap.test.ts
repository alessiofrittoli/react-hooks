import { useRef } from 'react'
import userEvent from '@testing-library/user-event'
import { renderHook, act } from '@testing-library/react'
import { useFocusTrap } from '@/dom-api/useFocusTrap'


describe( 'useFocusTrap', () => {

	let nontarget: HTMLElement
	let dialog: HTMLElement

	beforeEach( () => {
		nontarget = document.createElement( 'div' )
		nontarget.setAttribute( 'id', 'nontarget-focusable' )
		nontarget.innerHTML = (
			`
				<button id="non-target-focusable-1">Non-target Focusable 1</button>
				<a id="non-target-focusable-2" href="#">Non-target Focusable 2</a>
				<button id="non-target-focusable-3">Non-target Focusable 3</button>
				<input id="non-target-focusable-4" type="text"/>
			`
		)

		dialog = document.createElement( 'div' )
		dialog.setAttribute( 'id', 'target-focusable' )
		dialog.setAttribute( 'role', 'dialog' )
		dialog.setAttribute( 'tabindex', '0' )
		dialog.innerHTML = (
			`
				<button id="target-focusable-1">Focusable 1</button>
				<a id="target-focusable-2" href="#">Focusable 2</a>
				<button id="target-focusable-3">Focusable 3</button>
				<input id="target-focusable-4" type="text" />
			`
		)

		document.body.appendChild( nontarget )
		document.body.appendChild( dialog )
	} )

	afterEach( () => {
		document.body.removeChild( nontarget )
		document.body.removeChild( dialog )
	} )


	it( 'traps forward focus within the provided element', async () => {

		const {
			result: { current: [ setFocusTrap ] }
		} = renderHook( () => useFocusTrap( useRef( dialog ) ) )

		act( () => {
			// ... open dialog ...
			setFocusTrap() // enable focus trap in the dialog
			dialog.focus() // focus the dialog so next tab is inside
		} )

		const focusableElements = Array.from(
			dialog.querySelectorAll<HTMLElement>(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			)
		)

		await act( async () => {
			await userEvent.tab() // focus the 1st element of the dialog
		} )

		// first element focused when 'Tab' is pressed.
		expect( document.activeElement ).toBe( focusableElements.at( 0 ) )
		
		await act( async () => {
			await userEvent.tab() // focus the 2nd element of the dialog
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
		} = renderHook( () => useFocusTrap( useRef( dialog ) ) )

		act( () => {
			// ... open dialog ...
			setFocusTrap() // enable focus trap in the dialog
			dialog.focus() // focus the dialog so next tab is inside
		} )

		const focusableElements = Array.from(
			dialog.querySelectorAll<HTMLElement>(
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
		} = renderHook( () => useFocusTrap( useRef( dialog ) ) )

		act( () => {
			// ... open dialog ...
			setFocusTrap() // enable focus trap in the dialog
			dialog.focus() // focus the dialog so next tab is inside
		} )

		const focusableElements = Array.from(
			dialog.querySelectorAll<HTMLElement>(
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
		} = renderHook( () => useFocusTrap( useRef( dialog ) ) )

		const buttonOutside = document.createElement( 'button' )
		document.body.appendChild( buttonOutside )
		buttonOutside.focus() // focus due to a potential click

		const focusableElements = Array.from(
			dialog.querySelectorAll<HTMLElement>(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			)
		)
		
		act( () => {
			// ... open dialog ...
			setFocusTrap() // enable focus trap in the dialog
			dialog.focus() // focus the dialog so next tab is inside
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


	it( 'doesn\'t enable focus trap if no target is provided', async () => {

		const {
			result: { current: [ setFocusTrap ] }
		} = renderHook( () => useFocusTrap() )

		act( () => {
			// ... open dialog ...
			setFocusTrap() // enable focus trap in the dialog
			dialog.focus() // focus the dialog so next tab is inside
		} )

		const nonTargetFocusableElements = Array.from(
			nontarget.querySelectorAll<HTMLElement>(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			)
		)

		await act( async () => {
			await userEvent.tab() // focus the 1st element of the dialog
			await userEvent.tab() // focus the 2nd element of the dialog
			await userEvent.tab() // focus the 3rd element of the dialog
			await userEvent.tab() // focus the 4th element of the dialog

			await userEvent.tab() // focus get back to body element as usual
			await userEvent.tab() // focus restart from 1st element in the DOM
		} )

		expect( document.activeElement ).toBe( nonTargetFocusableElements.at( 0 ) )

	} )

} )