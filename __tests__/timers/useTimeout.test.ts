import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useTimeout } from '@/timers/useTimeout'

describe('useTimeout', () => {
	beforeAll(() => {
		vi.useFakeTimers()
	})

	afterAll(() => {
		vi.clearAllTimers().useRealTimers()
	})

	it('calls the callback after the specified delay', () => {
		const callback = vi.fn()
		const delay = 1000

		renderHook(() => useTimeout(callback, { delay }))

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

		renderHook(() => useTimeout(callback, { delay, args }))

		expect(callback).not.toHaveBeenCalled()

		act(() => {
			vi.advanceTimersByTime(delay)
		})

		expect(callback).toHaveBeenCalledWith(...args)
	})

	it('defaults delay to 1 if not provided', () => {
		const callback = vi.fn()

		renderHook(() => useTimeout(callback))

		act(() => {
			vi.advanceTimersByTime(1)
		})

		expect(callback).toHaveBeenCalledTimes(1)
	})

	it('clears the timer on unmount', () => {
		const callback = vi.fn()
		const delay = 1000

		const { unmount } = renderHook(() => useTimeout(callback, { delay }))

		act(() => {
			unmount()
			vi.advanceTimersByTime(delay)
		})

		expect(callback).not.toHaveBeenCalled()
	})

	it('optionally update state', () => {
		const callback = vi.fn()
		const delay = 1000

		const { result } = renderHook(() => useTimeout(callback, { delay, updateState: true }))

		expect(result.current.isActive).toBe(true)

		act(() => {
			vi.advanceTimersByTime(delay)
		})

		expect(result.current.isActive).toBe(false)
	})

	it('handles timeout with no custom callback when updateState is set to true', () => {
		const delay = 1000
		const { result } = renderHook(() => useTimeout(undefined, { delay, updateState: true }))

		expect(result.current.isActive).toBe(true)

		act(() => {
			vi.advanceTimersByTime(delay)
		})

		expect(result.current.isActive).toBe(false)
	})

	it('allows to disable autoplay', () => {
		const callback = vi.fn()
		const delay = 1000

		renderHook(() => useTimeout(callback, { delay, autoplay: false }))

		act(() => {
			vi.advanceTimersByTime(delay)
		})

		expect(callback).not.toHaveBeenCalled()
	})

	describe('start', () => {
		it('provides start method to manually start the timer', () => {
			const callback = vi.fn()
			const delay = 1000

			const { result } = renderHook(() => useTimeout(callback, { delay, autoplay: false }))

			expect(callback).not.toHaveBeenCalled()

			act(() => {
				result.current.start()
				vi.advanceTimersByTime(delay)
			})

			expect(callback).toHaveBeenCalled()
		})

		it('optionally run callback when timer starts', () => {
			const callback = vi.fn()
			const delay = 1000

			renderHook(() => useTimeout(callback, { delay, runOnStart: true }))

			act(() => {
				vi.advanceTimersByTime(delay)
			})

			expect(callback).toHaveBeenCalledTimes(2)
		})

		it('optionally run callback with custom args when timer starts', () => {
			const callback = vi.fn()
			const delay = 1000

			renderHook(() => useTimeout(callback, { delay, args: [1, 2], runOnStart: true }))

			act(() => {
				vi.advanceTimersByTime(delay)
			})

			expect(callback).toHaveBeenCalledTimes(2)
			expect(callback).toHaveBeenCalledWith(1, 2)
		})

		it('set isActive to true only when timer was previously inactive', () => {
			const callback = vi.fn()
			const delay = 1000
			const autoplay = false
			const updateState = true

			const { result } = renderHook(() => useTimeout(callback, { delay, autoplay, updateState }))

			expect(result.current.isActive).toBe(false)

			act(() => {
				result.current.start()
			})

			expect(result.current.isActive).toBe(true)
		})
	})

	describe('stop', () => {
		it('provides stop method to manually stop the timer', () => {
			const callback = vi.fn()
			const delay = 1000

			const { result } = renderHook(() => useTimeout(callback, { delay }))

			act(() => {
				vi.advanceTimersByTime(delay / 2)
				result.current.stop()
				vi.advanceTimersByTime(delay / 2)
			})

			expect(callback).not.toHaveBeenCalled()
		})

		it('does nothing if no timer has been initialised', () => {
			const callback = vi.fn()
			const delay = 1000

			const { result } = renderHook(() => useTimeout(callback, { delay, autoplay: false }))

			const clearTimeout = vi.spyOn(global, 'clearTimeout')

			result.current.stop()

			expect(callback).not.toHaveBeenCalled()
			expect(clearTimeout).not.toHaveBeenCalled()
		})

		it('sets isActive to false only when timer is running and updateState is true', () => {
			const callback = vi.fn()
			const delay = 1000
			const autoplay = true
			const updateState = true

			const { result } = renderHook(() => useTimeout(callback, { delay, autoplay, updateState }))

			expect(result.current.isActive).toBe(true)

			act(() => {
				result.current.stop()
			})

			expect(result.current.isActive).toBe(false)
		})
	})
})
