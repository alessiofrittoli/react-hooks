import { useIsFirstRender as _useIsFirstRender } from '@/misc/useIsFirstRender'
import { describe, expect, it, vi, type Mock } from 'vitest'
import { useUpdateEffect } from '@/misc/useUpdateEffect'
import { renderHook } from '@testing-library/react'

vi.mock('@/misc/useIsFirstRender')

const useIsFirstRender = _useIsFirstRender as Mock<typeof _useIsFirstRender>

describe('useUpdateEffect', () => {
	it('should not call the effect on the first render', () => {
		useIsFirstRender.mockReturnValue(true)
		const effect = vi.fn()

		renderHook(() => useUpdateEffect(effect, []))

		expect(effect).not.toHaveBeenCalled()
	})

	it('should call the effect on subsequent renders when dependencies change', () => {
		useIsFirstRender.mockReturnValueOnce(true).mockReturnValue(false)

		const effect = vi.fn()

		const { rerender } = renderHook(({ deps }) => useUpdateEffect(effect, deps), {
			initialProps: { deps: [1] },
		})

		rerender({ deps: [2] })

		expect(effect).toHaveBeenCalledTimes(1)
	})

	it('should not call the effect if dependencies do not change', () => {
		useIsFirstRender.mockReturnValueOnce(true).mockReturnValue(false)

		const effect = vi.fn()

		const { rerender } = renderHook(({ deps }) => useUpdateEffect(effect, deps), {
			initialProps: { deps: [1] },
		})

		rerender({ deps: [1] })

		expect(effect).not.toHaveBeenCalled()
	})
})
