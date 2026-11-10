import { useStorage as _useStorage, useLocalStorage } from '@/browser-api'
import { describe, expect, it, vi, type Mock } from 'vitest'
import { renderHook } from '@testing-library/react'

vi.mock('@/browser-api/storage/useStorage')

const useStorage = _useStorage as Mock<typeof _useStorage>

describe('useLocalStorage', () => {
	const key = 'testKey'
	const initialValue = 'testValue'

	it('shortcut usage of useStorage', () => {
		renderHook(() => useLocalStorage(key, initialValue))

		expect(useStorage).toHaveBeenCalledWith(key, initialValue, 'local')
	})
})
