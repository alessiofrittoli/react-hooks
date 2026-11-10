import { blockScroll as _blockScroll, restoreScroll as _restoreScroll } from '@alessiofrittoli/web-utils'
import { describe, expect, it, vi, type Mock } from 'vitest'
import { useScrollBlock } from '@/dom-api/useScrollBlock'
import { renderHook, act } from '@testing-library/react'
import { useRef } from 'react'

vi.mock('@alessiofrittoli/web-utils')

const blockScroll = _blockScroll as Mock<typeof _blockScroll>
const restoreScroll = _restoreScroll as Mock<typeof _restoreScroll>

describe('useScrollBlock', () => {
	it('calls blockScroll with default target when invoked', () => {
		const {
			result: { current },
		} = renderHook(() => useScrollBlock())
		const [hookBlockScroll] = current

		act(() => {
			hookBlockScroll()
		})

		expect(blockScroll).toHaveBeenCalledWith(undefined)
	})

	it('calls blockScroll with custom target when invoked', () => {
		const target = document.createElement('div')
		const {
			result: { current },
		} = renderHook(() => {
			const targetRef = useRef(target)
			return useScrollBlock(targetRef)
		})

		const [hookBlockScroll] = current

		act(() => {
			hookBlockScroll()
		})

		expect(blockScroll).toHaveBeenCalledWith(target)
	})

	it('calls restoreScroll with default target when invoked', () => {
		const {
			result: { current },
		} = renderHook(() => useScrollBlock())
		const [, hookRestoreScroll] = current

		act(() => {
			hookRestoreScroll()
		})

		expect(restoreScroll).toHaveBeenCalledWith(undefined)
	})

	it('calls restoreScroll with custom target when invoked', () => {
		const target = document.createElement('div')
		const {
			result: { current },
		} = renderHook(() => {
			const targetRef = useRef(target)
			return useScrollBlock(targetRef)
		})
		const [, hookRestoreScroll] = current

		act(() => {
			hookRestoreScroll()
		})

		expect(restoreScroll).toHaveBeenCalledWith(target)
	})
})
