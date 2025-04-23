import { useMediaQuery } from './useMediaQuery'
import { portraitMediaQuery } from '@alessiofrittoli/web-utils/device'

/**
 * Check if device is portrait oriented.
 * 
 * State get updated when device orientation changes.
 *
 * @returns	`true` if the device is portrait oriented, `false` otherwise.
 */
export const useIsPortrait = () => useMediaQuery( portraitMediaQuery )