import { renderHook, act } from '@testing-library/react'
import { LocalStorage as WebLocalStorage } from '@alessiofrittoli/web-utils/storage/LocalStorage'
import { SessionStorage as WebSessionStorage } from '@alessiofrittoli/web-utils/storage/SessionStorage'

import { useStorage } from '@/browser-api/storage/useStorage'

jest.mock( '@alessiofrittoli/web-utils/storage/LocalStorage', () => ( {
	LocalStorage: {
		get: jest.fn(),
		set: jest.fn(),
	},
} ) )

jest.mock( '@alessiofrittoli/web-utils/storage/SessionStorage', () => ( {
	SessionStorage: {
		get: jest.fn(),
		set: jest.fn(),
	},
} ) )

const LocalStorage = {
	get: WebLocalStorage.get as jest.Mock,
	set: WebLocalStorage.set as jest.Mock,
}

const SessionStorage = {
	get: WebSessionStorage.get as jest.Mock,
	set: WebSessionStorage.set as jest.Mock,
}



describe( 'useStorage', () => {

	const key			= 'testKey'
	const initialValue	= 'testValue'

	afterEach( () => {
		jest.clearAllMocks().resetModules()
	} )

	const storgeTypes = [ 'local', 'session' ] as const

	storgeTypes.map( type => {
		describe( type, () => {

			it( `initializes with the value from ${ type } storage if available`, () => {

				const Storage = ( type === 'local' ? LocalStorage : SessionStorage )

				Storage.get.mockReturnValue( 'storedValue' )
		
				const {
					result: { current: [ value ] }
				} = renderHook( () => useStorage( key, initialValue, type ) )
		
				expect( value ).toBe( 'storedValue' )
				expect( Storage.get ).toHaveBeenCalledWith( key )
		
			} )
		
		
			it( `initializes with the given initial value if ${ type } storage is empty`, () => {

				const Storage = ( type === 'local' ? LocalStorage : SessionStorage )

				Storage.get.mockReturnValue( undefined )
		
				const {
					result: { current: [ value ] }
				} = renderHook( () => useStorage( key, initialValue, type ) )
		
				expect( value ).toBe( initialValue )
				expect( Storage.get ).toHaveBeenCalledWith( key )
		
			} )
		
		
			it( `should set and persist the value to ${ type } storage`, () => {

				const Storage = ( type === 'local' ? LocalStorage : SessionStorage )

				const { result } = renderHook( () => useStorage( key, initialValue, type ) )
				const { current: [, setValue ] } = result
		
				act( () => {
					setValue( 'newValue' )
				} )
		
		
				const { current: [ value ] } = result
				expect( value ).toBe( 'newValue' )
				expect( Storage.set ).toHaveBeenCalledWith( key, 'newValue' )
		
			} )

		} )
	} )


	it( 'fallbacks to local storage if no type is given', () => {

		const { result } = renderHook( () => useStorage( key, initialValue ) )
		const { current: [, setValue ] } = result

		act( () => {
			setValue( 'newValue' )
		} )


		const { current: [ value ] } = result
		expect( value ).toBe( 'newValue' )
		expect( LocalStorage.set ).toHaveBeenCalledWith( key, 'newValue' )

	} )
	
	
	it( 'setter accepts a function', () => {

		const { result } = renderHook( () => useStorage( key, initialValue ) )
		const { current: [, setValue ] } = result

		act( () => {
			setValue( prev => prev + 'newValue' )
		} )


		const { current: [ value ] } = result
		expect( value ).toBe( initialValue + 'newValue' )
		expect( LocalStorage.set ).toHaveBeenCalledWith( key, initialValue + 'newValue' )

	} )

} )