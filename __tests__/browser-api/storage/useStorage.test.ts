import { SessionStorage as _SessionStorage } from '@alessiofrittoli/web-utils/storage'
import { LocalStorage as _LocalStorage } from '@alessiofrittoli/web-utils/storage'
import { useStorage } from '@/browser-api/storage/useStorage'
import { describe, expect, it, vi, type Mock } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('@alessiofrittoli/web-utils/storage', () => ({
	LocalStorage: {
		get: vi.fn(),
		set: vi.fn(),
	},
	SessionStorage: {
		get: vi.fn(),
		set: vi.fn(),
	},
}))

const LocalStorage = {
	get: _LocalStorage.get as Mock<typeof _LocalStorage.get>,
	set: _LocalStorage.set as Mock<typeof _LocalStorage.set>,
}

const SessionStorage = {
	get: _SessionStorage.get as Mock<typeof _SessionStorage.get>,
	set: _SessionStorage.set as Mock<typeof _SessionStorage.set>,
}

describe('useStorage', () => {
	const key = 'testKey'
	const initialValue = 'testValue'

	const storgeTypes = ['local', 'session'] as const

	storgeTypes.map(type => {
		describe(type, () => {
			it(`initializes with the value from ${type} storage if available`, () => {
				const Storage = type === 'local' ? LocalStorage : SessionStorage

				Storage.get.mockReturnValue('storedValue')

				const {
					result: {
						current: [value],
					},
				} = renderHook(() => useStorage(key, initialValue, type))

				expect(value).toBe('storedValue')
				expect(Storage.get).toHaveBeenCalledWith(key)
			})

			it(`initializes with the given initial value if ${type} storage is empty`, () => {
				const Storage = type === 'local' ? LocalStorage : SessionStorage

				Storage.get.mockReturnValue(undefined)

				const {
					result: {
						current: [value],
					},
				} = renderHook(() => useStorage(key, initialValue, type))

				expect(value).toBe(initialValue)
				expect(Storage.get).toHaveBeenCalledWith(key)
			})

			it(`should set and persist the value to ${type} storage`, () => {
				const Storage = type === 'local' ? LocalStorage : SessionStorage

				const { result } = renderHook(() => useStorage(key, initialValue, type))
				const {
					current: [, setValue],
				} = result

				act(() => {
					setValue('newValue')
				})

				const {
					current: [value],
				} = result
				expect(value).toBe('newValue')
				expect(Storage.set).toHaveBeenCalledWith(key, 'newValue')
			})
		})
	})

	it('fallbacks to local storage if no type is given', () => {
		const { result } = renderHook(() => useStorage(key, initialValue))
		const {
			current: [, setValue],
		} = result

		act(() => {
			setValue('newValue')
		})

		const {
			current: [value],
		} = result
		expect(value).toBe('newValue')
		expect(LocalStorage.set).toHaveBeenCalledWith(key, 'newValue')
	})

	it('setter accepts a function', () => {
		const { result } = renderHook(() => useStorage(key, initialValue))
		const {
			current: [, setValue],
		} = result

		act(() => {
			setValue(prev => prev + 'newValue')
		})

		const {
			current: [value],
		} = result
		expect(value).toBe(initialValue + 'newValue')
		expect(LocalStorage.set).toHaveBeenCalledWith(key, initialValue + 'newValue')
	})
})
