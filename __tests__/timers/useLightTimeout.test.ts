import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { useLightTimeout } from '@/timers/useLightTimeout'
import { act, renderHook } from '@testing-library/react'

describe('useLightTimeout', () => {
	beforeAll(() => {
		vi.useFakeTimers()
	})

	afterAll(() => {
		vi.clearAllTimers().useRealTimers()
	})

	it('calls the callback after the specified delay', () => {
		const callback = vi.fn()
		const delay = 1000

		renderHook(() => useLightTimeout(callback, { delay }))

		expect(callback).not.toHaveBeenCalled()

		act(() => {
			vi.advanceTimersByTime(delay)
		})

		expect(callback).toHaveBeenCalledTimes(1)
	})

	it('calls the callback with optional arguments', () => {
		const callback = vi.fn()
		const delay = 1000
		const args = ['argument1', 'argument2']

		renderHook(() => useLightTimeout(callback, { delay, args }))

		expect(callback).not.toHaveBeenCalled()

		act(() => {
			vi.advanceTimersByTime(delay)
		})

		expect(callback).toHaveBeenCalledWith(...args)
	})

	it('defaults delay to 1 if not provided', () => {
		const callback = vi.fn()

		renderHook(() => useLightTimeout(callback))

		act(() => {
			vi.advanceTimersByTime(1)
		})

		expect(callback).toHaveBeenCalledTimes(1)
	})

	it('clears the timer on unmount', () => {
		const callback = vi.fn()
		const delay = 1000

		const { unmount } = renderHook(() => useLightTimeout(callback, { delay }))

		act(() => {
			unmount()
			vi.advanceTimersByTime(delay)
		})

		expect(callback).not.toHaveBeenCalled()
	})
})
