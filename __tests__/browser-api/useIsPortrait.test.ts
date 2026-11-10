import { useMediaQuery as _useMediaQuery, type UseMediaQueryStateOptions } from '@/browser-api/useMediaQuery'
import { portraitMediaQuery } from '@alessiofrittoli/web-utils'
import { describe, expect, it, vi, type Mock } from 'vitest'
import { useIsPortrait } from '@/browser-api/useIsPortrait'
import { renderHook } from '@testing-library/react'

vi.mock('@/browser-api/useMediaQuery')

const useMediaQuery = _useMediaQuery as Mock<(query: string, options?: UseMediaQueryStateOptions) => boolean>

describe('useIsPortrait', () => {
	it('returns true when the device is in portrait mode', () => {
		useMediaQuery.mockReturnValue(true)

		const { result } = renderHook(() => useIsPortrait())

		expect(result.current).toBe(true)
		expect(useMediaQuery).toHaveBeenCalledWith(portraitMediaQuery)
	})

	it('returns false when the device is not in portrait mode', () => {
		useMediaQuery.mockReturnValue(false)

		const { result } = renderHook(() => useIsPortrait())

		expect(result.current).toBe(false)
		expect(useMediaQuery).toHaveBeenCalledWith(portraitMediaQuery)
	})
})
