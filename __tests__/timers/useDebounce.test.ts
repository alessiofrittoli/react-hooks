import { renderHook, act } from '@testing-library/react'
import { useDebounce } from '@/timers/useDebounce'


describe( 'useDebounce', () => {

	beforeAll( () => {
		jest.useFakeTimers()
	} )

	afterAll( () => {
		jest.clearAllTimers()
		jest.useRealTimers()
	} )


	it( 'debounces the value update', () => {

		const delay = 500

		const { result, rerender } = renderHook(
			( { value, delay } ) => useDebounce( value, delay ),
			{ initialProps: { value: 'initial', delay } }
		)

		expect( result.current ).toBe( 'initial' )

		rerender( { value: 'updated', delay } )
		expect( result.current ).toBe( 'initial' )

		act( () => {
			jest.advanceTimersByTime( delay )
		} )

		expect( result.current ).toBe( 'updated' )

	} )


	it( 'uses the default delay if none is provided', () => {

		const { result, rerender } = renderHook(
			( { value } ) => useDebounce( value ),
			{ initialProps: { value: 'initial' } }
		)

		expect( result.current ).toBe( 'initial' )

		rerender( { value: 'updated' } )
		expect( result.current ).toBe( 'initial' )

		act( () => {
			jest.advanceTimersByTime( 500 )
		} )

		expect( result.current ).toBe( 'updated' )

	} )


	it( 'resets timers if value updates', () => {

		const delay = 500

		const { result, rerender } = renderHook(
			( { value, delay } ) => useDebounce( value, delay ),
			{ initialProps: { value: 'initial', delay } }
		)

		expect( result.current ).toBe( 'initial' )

		rerender( { value: 'updated', delay } )
		expect( result.current ).toBe( 'initial' )

		act( () => {
			jest.advanceTimersByTime( delay / 2 )
			rerender( { value: 'updated-2', delay } )
		} )

		expect( result.current ).toBe( 'initial' )

		act( () => {
			jest.advanceTimersByTime( delay )
		} )

		expect( result.current ).toBe( 'updated-2' )

	} )

} )