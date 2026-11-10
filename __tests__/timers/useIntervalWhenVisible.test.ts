import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import { useIntervalWhenVisible } from '@/timers/useIntervalWhenVisible'
import { useInterval as _useInterval } from '@/timers/useInterval'
import { renderHook } from '@testing-library/react'

vi.mock('@/timers/useInterval')

const useInterval = _useInterval as unknown as Mock<typeof _useInterval>

describe('useIntervalWhenVisible', () => {
	let mockStart: Mock
	let mockStop: Mock

	beforeEach(() => {
		mockStart = vi.fn()
		mockStop = vi.fn()

		useInterval.mockReturnValue({
			start: mockStart,
			stop: mockStop,
		})

		Object.defineProperty(document, 'hidden', {
			configurable: true,
			writable: true,
			value: false,
		})
	})

	afterEach(() => {
		vi.clearAllMocks().resetModules()
	})

	it('starts the interval when autoplay is true and document is visible', () => {
		renderHook(() => useIntervalWhenVisible(vi.fn()))

		expect(mockStart).toHaveBeenCalledTimes(1)
		expect(mockStop).not.toHaveBeenCalled()
	})

	it("doesn't start the interval when autoplay is false", () => {
		renderHook(() => useIntervalWhenVisible(vi.fn(), { autoplay: false }))

		expect(mockStart).not.toHaveBeenCalled()
		expect(mockStop).not.toHaveBeenCalled()
	})

	it("doesn't start the interval when document is not visible and autoplay is true", () => {
		Object.defineProperty(document, 'hidden', { value: true })

		renderHook(() => useIntervalWhenVisible(vi.fn()))

		expect(mockStart).not.toHaveBeenCalled()
		expect(mockStop).not.toHaveBeenCalled()
	})

	it('starts the interval manually when start is called', () => {
		const { result } = renderHook(() => useIntervalWhenVisible(vi.fn(), { autoplay: false }))

		result.current.start()

		expect(mockStart).toHaveBeenCalledTimes(1)
		expect(mockStop).not.toHaveBeenCalled()
	})

	it('stops the interval manually when stop is called', () => {
		const { result } = renderHook(() => useIntervalWhenVisible(vi.fn()))

		result.current.stop()

		expect(mockStop).toHaveBeenCalledTimes(1)
		expect(mockStart).toHaveBeenCalledTimes(1)
	})

	it('handles visibility change events', () => {
		const { result } = renderHook(() => useIntervalWhenVisible(vi.fn(), { autoplay: false }))

		result.current.start()

		expect(mockStart).toHaveBeenCalledTimes(1)

		Object.defineProperty(document, 'hidden', { value: true })
		document.dispatchEvent(new Event('visibilitychange'))

		expect(mockStop).toHaveBeenCalledTimes(1)

		Object.defineProperty(document, 'hidden', { value: false })
		document.dispatchEvent(new Event('visibilitychange'))

		expect(mockStart).toHaveBeenCalledTimes(2)
	})

	it('clean up visibility change listener on unmount', () => {
		const { unmount } = renderHook(() => useIntervalWhenVisible(vi.fn()))

		const removeEventListener = vi.spyOn(document, 'removeEventListener')

		unmount()

		expect(mockStop).toHaveBeenCalledTimes(1)

		expect(removeEventListener).toHaveBeenCalledWith('visibilitychange', expect.any(Function))
	})
})
