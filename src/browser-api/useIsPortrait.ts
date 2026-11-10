import { portraitMediaQuery } from '@alessiofrittoli/web-utils'
import { useMediaQuery } from '@/browser-api/useMediaQuery'

/**
 * Check if device is portrait oriented.
 *
 * State get updated when device orientation changes.
 *
 * @returns	`true` if the device is portrait oriented, `false` otherwise.
 */
export const useIsPortrait = (): boolean => useMediaQuery(portraitMediaQuery)
