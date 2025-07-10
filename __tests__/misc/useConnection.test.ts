import '@testing-library/jest-dom'

import { renderHook } from '@testing-library/react'
import { useConnection, getState } from '@/browser-api/useConnection'

describe( 'useConnection', () => {

	let originalNavigator: Navigator

	beforeEach( () => {
		originalNavigator	= global.navigator
		Object.defineProperty( navigator, 'onLine', {
			configurable	: true,
			writable		: true,
			value			: true,
		} )
	} )

	afterEach( () => {
		global.navigator = originalNavigator
		jest.clearAllMocks()
	} )


	describe( 'getState', () => {

		it( 'returns "online" when true', () => {
			expect( getState( true ) ).toBe( 'online' )
		} )


		it( 'returns "offline" when false', () => {
			expect( getState( false ) ).toBe( 'offline' )
		} )

	} )


	it( 'returns online state when navigator.onLine is true', () => {

		Object.defineProperty( navigator, 'onLine', { value: true } )

		const { result } = renderHook( () => useConnection() )
		
		expect( result.current.connection ).toBe( 'online' )
		expect( result.current.isOnline ).toBe( true )
		expect( result.current.isOffline ).toBe( false )

	} )


	it( 'returns offline state when navigator.onLine is false', async () => {

		Object.defineProperty( navigator, 'onLine', { value: false } )

		const { result } = renderHook( () => useConnection() )

		expect( result.current.connection ).toBe( 'offline' )
		expect( result.current.isOnline ).toBe( false )
		expect( result.current.isOffline ).toBe( true )

	} )


	it( 'updates state when navigator.onLine changes', () => {

		Object.defineProperty( navigator, 'onLine', { value: true } )

		const { result, rerender } = renderHook( () => useConnection() )

		expect( result.current.connection ).toBe( 'online' )

		Object.defineProperty( navigator, 'onLine', { value: false } )
		rerender()

		expect( result.current.connection ).toBe( 'offline' )
		expect( result.current.isOnline ).toBe( false )
		expect( result.current.isOffline ).toBe( true )

	} )

} )