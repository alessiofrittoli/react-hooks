import { paginate, type PaginateOptions, type Pagination } from '@alessiofrittoli/math-utils'
import { useMemo } from 'react'

/**
 * Get pagination informations based on the given options.
 *
 * @param options An object defining pagination input data. See {@link PaginateOptions} for more information.
 * @returns A memoized object containing pagination informations based on the given options.
 */
export const usePagination = (options: PaginateOptions = {}): Pagination =>
	useMemo(() => paginate(options), [options])
