import { paginate as _paginate, type Pagination, type PaginateOptions } from '@alessiofrittoli/math-utils'
import { describe, expect, it, vi, type Mock } from 'vitest'
import { usePagination } from '@/misc/usePagination'
import { renderHook } from '@testing-library/react'

vi.mock('@alessiofrittoli/math-utils', () => ({
	paginate: vi.fn(),
}))

const paginate = _paginate as Mock<typeof _paginate>

describe('usePagination', () => {
	it('initializes with defaults', () => {
		const mockPaginateResult: Pagination = {
			pages: 0,
			currentPage: 0,
			previousPage: false,
			nextPage: false,
		}
		paginate.mockReturnValue(mockPaginateResult)

		const { result } = renderHook(() => usePagination())

		expect(result.current).toEqual(mockPaginateResult)
	})

	it('calls paginate with the provided options', () => {
		const options: PaginateOptions = { perPage: 10, total: 100 }
		const mockPaginateResult: Pagination = {
			pages: 10,
			currentPage: 1,
			previousPage: false,
			nextPage: 2,
		}
		paginate.mockReturnValue(mockPaginateResult)

		const { result } = renderHook(() => usePagination(options))

		expect(paginate).toHaveBeenCalledWith(options)
		expect(result.current).toEqual(mockPaginateResult)
	})

	it('memoizes the result when options do not change', () => {
		const options: PaginateOptions = { perPage: 10, offset: 30, total: 100 }
		const mockPaginateResult: Pagination = {
			pages: 10,
			currentPage: 3,
			previousPage: 2,
			nextPage: 4,
		}

		paginate.mockReturnValue(mockPaginateResult)

		const { result, rerender } = renderHook(() => usePagination(options))

		expect(result.current).toEqual(mockPaginateResult)

		rerender()

		expect(paginate).toHaveBeenCalledTimes(1) // paginate should not be called again
	})

	it('recomputes the result when options change', () => {
		const initialOptions: PaginateOptions = { perPage: 10, offset: 0, total: 100 }
		const updatedOptions: PaginateOptions = { perPage: 10, offset: 30, total: 100 }

		const initialMockResult: Pagination = {
			pages: 10,
			currentPage: 1,
			previousPage: false,
			nextPage: 2,
		}

		const updatedMockResult: Pagination = {
			pages: 10,
			currentPage: 3,
			previousPage: 2,
			nextPage: 4,
		}

		paginate.mockReturnValueOnce(initialMockResult).mockReturnValueOnce(updatedMockResult)

		const { result, rerender } = renderHook(({ options }) => usePagination(options), {
			initialProps: { options: initialOptions },
		})

		expect(paginate).toHaveBeenCalledWith(initialOptions)
		expect(result.current).toEqual(initialMockResult)

		rerender({ options: updatedOptions })

		expect(paginate).toHaveBeenCalledWith(updatedOptions)
		expect(paginate).toHaveBeenCalledTimes(2)
		expect(result.current).toEqual(updatedMockResult)
	})
})
