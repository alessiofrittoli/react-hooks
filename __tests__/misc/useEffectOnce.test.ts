import { useIsFirstRender as _useIsFirstRender } from '@/misc/useIsFirstRender'
import { describe, expect, it, vi, type Mock } from 'vitest'
import { useEffectOnce } from '@/misc/useEffectOnce'
import { renderHook } from '@testing-library/react'

vi.mock('@/misc/useIsFirstRender', () => ({
	useIsFirstRender: vi.fn(),
}))

const useIsFirstRender = _useIsFirstRender as Mock<typeof _useIsFirstRender>

describe('useEffectOnce', () => {
	it('calls effect on first render', () => {
		useIsFirstRender.mockReturnValue(true)

		const effect = vi.fn()
		renderHook(() => useEffectOnce(effect))
		expect(effect).toHaveBeenCalledTimes(1)
	})

	it("doesn't call effect if not first render", () => {
		useIsFirstRender.mockReturnValue(false)

		const effect = vi.fn()
		renderHook(() => useEffectOnce(effect))
		expect(effect).toHaveBeenCalledTimes(0)
	})

	it("doesn't call effect on subsequent renders", () => {
		useIsFirstRender.mockReturnValue(true)

		const effect = vi.fn()
		const { rerender } = renderHook(() => useEffectOnce(effect))

		useIsFirstRender.mockReturnValue(false)
		rerender()
		expect(effect).toHaveBeenCalledTimes(1)
	})

	it('calls cleanup function on unmount if provided', () => {
		useIsFirstRender.mockReturnValue(true)

		const cleanup = vi.fn()
		const effect = vi.fn(() => cleanup)

		const { unmount } = renderHook(() => useEffectOnce(effect))

		unmount()
		expect(cleanup).toHaveBeenCalledTimes(1)
	})
})
