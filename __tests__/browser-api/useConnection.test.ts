import '@testing-library/jest-dom'

import { act, renderHook } from '@testing-library/react'
import type { NetworkInformation } from '@alessiofrittoli/web-utils'
import { useConnection } from '@/browser-api/useConnection'


class MockNetworkInformation extends EventTarget implements Partial<NetworkInformation>
{
	downlink
	effectiveType
	rtt
	saveData

	constructor( props: Partial<NetworkInformation> )
	{
		super()

		this.downlink		= props.downlink
		this.effectiveType	= props.effectiveType
		this.rtt			= props.rtt
		this.saveData		= props.saveData
	}
}


describe( 'useConnection', () => {

	let originalNavigator: Navigator
	let network: MockNetworkInformation

	beforeEach( () => {
		originalNavigator = global.navigator

		Object.defineProperty( navigator, 'onLine', {
			configurable	: true,
			writable		: true,
			value			: true,
		} )
		
		network = new MockNetworkInformation( {
			downlink			: 40,
			effectiveType		: '4g',
			rtt					: 0,
			saveData			: false,
		} )


		Object.defineProperty( navigator, 'connection', {
			configurable	: true,
			value			: network,
		} )

	} )

	afterEach( () => {
		global.navigator = originalNavigator
		jest.clearAllMocks()
	} )


	it( 'returns online state when navigator.onLine is true', () => {

		const { result } = renderHook( () => useConnection() )
		
		expect( result.current.onLine ).toBe( true )

	} )


	it( 'returns offline state when navigator.onLine is false', async () => {

		Object.defineProperty( navigator, 'onLine', { value: false } )

		const { result } = renderHook( () => useConnection() )
		
		expect( result.current.onLine ).toBe( false )

	} )
	
	
	it( 'returns `NetworkInformation` if available', async () => {

		const { result } = renderHook( () => useConnection() )
		
		expect( result.current.network ).toBe( network )

		Object.defineProperty( navigator, 'connection', {
			configurable	: true,
			value			: undefined,
		} )

		expect(
			renderHook( () => useConnection() ).result.current.network
		).toBeUndefined()

	} )


	it( 'updates state when network status changes', () => {

		const { result } = renderHook( () => useConnection() )
		
		expect( result.current.onLine ).toBe( true )
		expect( result.current.network?.effectiveType ).toBe( '4g' )

		act( () => {
			Object.defineProperty( navigator, 'onLine', { value: false } )
			window.dispatchEvent( new Event( 'offline' ) )
		} )

		expect( result.current.onLine ).toBe( false )
		expect( result.current.network?.effectiveType ).toBe( '4g' )

		
		act( () => {
			Object.defineProperty( navigator, 'onLine', { value: true } )
			window.dispatchEvent( new Event( 'online' ) )
			
			network.effectiveType = 'slow-2g'
			network.dispatchEvent( new Event( 'change' ) )
		} )

		expect( result.current.onLine ).toBe( true )
		expect( result.current.network?.effectiveType ).toBe( 'slow-2g' )

	} )

} )