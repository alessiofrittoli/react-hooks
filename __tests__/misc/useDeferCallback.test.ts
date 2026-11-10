import { deferCallback as _deferCallback } from '@alessiofrittoli/web-utils'
import { describe, expect, it, vi, type Mock } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDeferCallback } from '@/misc'

vi.mock('@alessiofrittoli/web-utils', () => ({
	deferCallback: vi.fn(
		(task: (...args: unknown[]) => unknown) =>
			(...args: unknown[]) =>
				task(...args),
	),
}))

const deferCallback = _deferCallback as Mock<typeof _deferCallback>

describe('useDeferCallback', () => {
	it('returns a memoized deferred callback', async () => {
		const callback = vi.fn()

		const { result, rerender } = renderHook(({ deps }) => useDeferCallback(callback, deps), {
			initialProps: { deps: [0] },
		})

		await act(async () => {
			await result.current('test')
		})

		expect(callback).toHaveBeenCalledWith('test')

		const prev = result.current

		rerender({ deps: [0] })
		expect(result.current).toBe(prev)

		rerender({ deps: [1] })
		expect(result.current).not.toBe(prev)

		expect(deferCallback).toHaveBeenCalledTimes(3)
		expect(deferCallback).toHaveBeenNthCalledWith(1, callback)
		expect(deferCallback).toHaveBeenNthCalledWith(2, callback)
		expect(deferCallback).toHaveBeenNthCalledWith(3, callback)
	})

	it("doesn't uses the latest callback when changed", async () => {
		const callback1 = vi.fn()
		const callback2 = vi.fn()

		const { result, rerender } = renderHook(
			// eslint-disable-next-line react-hooks/exhaustive-deps
			({ cb }) => useDeferCallback(cb, []),
			{ initialProps: { cb: callback1 } },
		)

		await act(async () => {
			await result.current('foo')
		})

		expect(callback1).toHaveBeenCalledWith('foo')

		rerender({ cb: callback2 })

		await act(async () => {
			await result.current('bar')
		})

		expect(callback1).toHaveBeenCalledWith('bar')
		expect(callback2).not.toHaveBeenCalled()

		expect(deferCallback).toHaveBeenCalledTimes(2)
		expect(deferCallback).toHaveBeenNthCalledWith(1, callback1)
		expect(deferCallback).toHaveBeenNthCalledWith(2, callback2)
	})
})
