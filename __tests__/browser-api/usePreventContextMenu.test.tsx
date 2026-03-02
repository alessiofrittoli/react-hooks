import { renderHook } from '@testing-library/react'
import { useEventListener } from '@/browser-api/useEventListener'
import { usePreventContextMenu } from '@/browser-api/usePreventContextMenu'

jest.mock( '@/browser-api/useEventListener' )


describe( 'usePreventContextMenu', () => {

	afterEach( () => {
		jest.clearAllMocks()
	} )


	it( 'calls useEventListener with contextmenu event', () => {

		renderHook( () => usePreventContextMenu() )

		expect( useEventListener ).toHaveBeenCalledWith(
			'contextmenu',
			expect.objectContaining( {
				target		: undefined,
				listener	: expect.any( Function ),
			} )
		)

	} )


	it( 'prevents default on contextmenu event', () => {

		renderHook( () => usePreventContextMenu() )

		const event = new MouseEvent( 'contextmenu' )
		jest.spyOn( event, 'preventDefault' )
		
		const call = jest.mocked( useEventListener ).mock.calls[ 0 ]

		call?.[ 1 ].listener( event )

		expect( event.preventDefault ).toHaveBeenCalled()

	} )


	it( 'passes target to useEventListener when provided', () => {

		const target = document.createElement( 'div' )

		renderHook( () => usePreventContextMenu( target ) )

		expect( useEventListener ).toHaveBeenCalledWith(
			'contextmenu',
			expect.objectContaining( {
				target,
			} )
		)

	} )


	it( 'passes ref object as target when provided', () => {

		const ref = { current: document.createElement( 'div' ) }

		renderHook( () => usePreventContextMenu( ref ) )

		expect( useEventListener ).toHaveBeenCalledWith(
			'contextmenu',
			expect.objectContaining( {
				target: ref,
			} )
		)
	} )

} )