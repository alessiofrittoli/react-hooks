import { useMemo } from 'react'
import { paginate, type PaginateOptions } from '@alessiofrittoli/math-utils/helpers'

/**
 * Get pagination informations based on the given options.
 *
 * @param options An object defining pagination input data. See {@link PaginateOptions} for more information.
 * @returns A memoized object containing pagination informations based on the given options.
 */
export const usePagination = ( options: PaginateOptions = {} ) => (
	useMemo( () => paginate( options ), [ options ] )
)