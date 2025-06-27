import { act, renderHook } from '@testing-library/react'
import { EventEmitter } from '@alessiofrittoli/event-emitter'
import { useMediaQuery, type OnChangeHandler } from '@/browser-api/useMediaQuery'


describe( 'useMediaQuery', () => {

	beforeEach( () => {
		Object.defineProperty( window, 'matchMedia', {
			writable: true,
			value: jest.fn().mockImplementation( query => ( {
				matches	: query === '(min-width: 768px)',
				media	: query,
				addEventListener	: jest.fn(),
				removeEventListener	: jest.fn(),
			} ) ),
		} )
	} )


	afterEach( () => {
		jest.clearAllMocks()
	} )


	it( 'returns true if the media query matches', () => {
		const { result } = renderHook( () => useMediaQuery( '(min-width: 768px)' ) )
		expect( result.current ).toBe( true )
	} )


	it( 'returns false if the media query does not match', () => {
		const { result } = renderHook( () => useMediaQuery( '(max-width: 767px)' ) )
		expect( result.current ).toBe( false )
	} )


	it( 'updates the matches value when the media query changes', () => {

		const emitter					= new EventEmitter()
		const mockAddEventListener		= jest.fn( ( event: string, cb: ( matches: boolean ) => void ) => emitter.on( event, cb ) )
		const mockRemoveEventListener	= jest.fn( ( event: string, cb: ( matches: boolean ) => void ) => emitter.off( event, cb ) )


		let matches = true

		window.matchMedia = jest.fn().mockImplementation( query => ( {
			matches	: matches,
			media	: query,
			addEventListener	: mockAddEventListener,
			removeEventListener	: mockRemoveEventListener,
		} ) )

		const { result, rerender } = renderHook( ( { query } ) => useMediaQuery( query ), {
			initialProps: { query: '(min-width: 768px)' },
		} )

		// expect hook to set the initial value.
		expect( result.current ).toBe( true )
		// expect hook to listen for media query changes.
		expect( mockAddEventListener ).toHaveBeenCalled()

		// emit 'change' event so states get updated.
		act( () => {
			matches = false
			emitter.emit( 'change' )
		} )


		expect( result.current ).toBe( false )
		
		// expect listeners to be removed on un-mount.
		rerender( { query: '(min-width: 767px)' } )
		expect( mockRemoveEventListener ).toHaveBeenCalled()

	} )


	it( 'doesn\'t dispatch React state updates if `updateState` is set to false', () => {

		const emitter	= new EventEmitter()
		const onChange	= jest.fn<void, Parameters<OnChangeHandler>>()


		let matches = true

		window.matchMedia = jest.fn().mockImplementation( query => ( {
			matches	: matches,
			media	: query,
			addEventListener	: jest.fn( ( event: string, cb: ( matches: boolean ) => void ) => emitter.on( event, cb ) ),
			removeEventListener	: jest.fn( ( event: string, cb: ( matches: boolean ) => void ) => emitter.off( event, cb ) ),
		} ) )

		const { result } = renderHook( ( { query } ) => useMediaQuery( query, { updateState: false, onChange } ), {
			initialProps: { query: '(min-width: 768px)' },
		} )

		// expect hook to return void
		expect( result.current ).toBe( undefined )
		// expect hook to initially invoke `onChange` callback.
		expect( onChange ).toHaveBeenCalledWith( true )

		// emit 'change' event so `onChange` callback get invoked.
		act( () => {
			matches = false
			emitter.emit( 'change' )
		} )

		// expect hook to not update returned state value.
		expect( result.current ).toBe( undefined )
		// expect hook invoke `onChange` callback.
		expect( onChange ).toHaveBeenCalledWith( false )

	} )

} )