import { useMediaQuery as _useMediaQuery, type UseMediaQueryStateOptions } from '@/browser-api/useMediaQuery'
import { useIsTouchDevice } from '@/browser-api/useIsTouchDevice'
import { describe, expect, it, vi, type Mock } from 'vitest'
import { renderHook } from '@testing-library/react'

vi.mock('@/browser-api/useMediaQuery', () => ({
	useMediaQuery: vi.fn().mockReturnValue(false),
}))

const useMediaQuery = _useMediaQuery as Mock<(query: string, options?: UseMediaQueryStateOptions) => boolean>

describe('useIsTouchDevice', () => {
	it('calls useMediaQuery with (pointer: coarse)', () => {
		renderHook(() => useIsTouchDevice())

		expect(useMediaQuery).toHaveBeenCalledWith('(pointer: coarse)')
	})

	it('returns true if useMediaQuery returns true', () => {
		useMediaQuery.mockReturnValueOnce(true)
		const { result } = renderHook(() => useIsTouchDevice())
		expect(result.current).toBe(true)
	})

	it('returns false if useMediaQuery returns false', () => {
		useMediaQuery.mockReturnValueOnce(false)
		const { result } = renderHook(() => useIsTouchDevice())
		expect(result.current).toBe(false)
	})
})
