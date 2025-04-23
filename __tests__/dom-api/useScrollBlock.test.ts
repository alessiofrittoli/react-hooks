import { renderHook, act } from '@testing-library/react'
import { useScrollBlock } from '@/dom-api/useScrollBlock'
import { blockScroll, restoreScroll } from '@alessiofrittoli/web-utils/dom'

jest.mock( '@alessiofrittoli/web-utils/dom', () => ( {
	blockScroll		: jest.fn(),
	restoreScroll	: jest.fn(),
} ) )


describe( 'useScrollBlock', () => {

	afterEach( () => {
		jest.clearAllMocks().resetModules()
	} )
	

	it( 'calls blockScroll with default target when invoked', () => {
		
		const { result: { current } } = renderHook( () => useScrollBlock() )
		const [ hookBlockScroll ] = current

		act( () => {
			hookBlockScroll()
		} )

		expect( blockScroll ).toHaveBeenCalledWith( undefined )

	} )


	it( 'calls blockScroll with custom target when invoked', () => {

		const target = document.createElement( 'div' )
		const { result: { current } } = renderHook( () => useScrollBlock( target ) )
		const [ hookBlockScroll ] = current

		act( () => {
			hookBlockScroll()
		} )

		expect( blockScroll ).toHaveBeenCalledWith( target )

	} )


	it( 'calls restoreScroll with default target when invoked', () => {

		const { result: { current } } = renderHook( () => useScrollBlock() )
		const [, hookRestoreScroll ] = current

		act( () => {
			hookRestoreScroll()
		} )

		expect( restoreScroll ).toHaveBeenCalledWith( undefined )

	} )
	
	
	it( 'calls restoreScroll with custom target when invoked', () => {

		const target = document.createElement( 'div' )
		const { result: { current } } = renderHook( () => useScrollBlock( target ) )
		const [, hookRestoreScroll ] = current

		act( () => {
			hookRestoreScroll()
		} )

		expect( restoreScroll ).toHaveBeenCalledWith( target )

	} )

} )