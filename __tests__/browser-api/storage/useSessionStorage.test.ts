import { useStorage as _useStorage, useSessionStorage } from '@/browser-api'
import { describe, expect, it, vi, type Mock } from 'vitest'
import { renderHook } from '@testing-library/react'

vi.mock('@/browser-api/storage/useStorage')

const useStorage = _useStorage as Mock<typeof _useStorage>

describe('useSessionStorage', () => {
	const key = 'testKey'
	const initialValue = 'testValue'

	it('shortcut usage of useStorage', () => {
		renderHook(() => useSessionStorage(key, initialValue))

		expect(useStorage).toHaveBeenCalledWith(key, initialValue, 'session')
	})
})
