import { renderHook } from '@testing-library/react'
import { useStorage as _useStorage, useSessionStorage } from '@/browser-api'

jest.mock( '@/browser-api/storage/useStorage' )

const useStorage = _useStorage as jest.Mock

describe( 'useSessionStorage', () => {

	const key			= 'testKey'
	const initialValue	= 'testValue'

	afterEach( () => {
		jest.clearAllMocks().resetModules()
	} )

	it( 'shortcut usage of useStorage', () => {

		renderHook( () => useSessionStorage( key, initialValue ) )

		expect( useStorage )
			.toHaveBeenCalledWith( key, initialValue, 'session' )
			
	} )

} )