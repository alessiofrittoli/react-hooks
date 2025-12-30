import { useMediaQuery } from './useMediaQuery'


/**
 * Detects if the current device supports touch events.
 *
 * @returns	A boolean indicating whether the device is a touch device or not.
 *
 * @example
 * 
 * ```ts
 * const isTouch = useIsTouchDevice()
 * 
 * if ( isTouch ) {
 *   // Enable touch-specific UI
 * }
 * ```
 */
export const useIsTouchDevice = () => useMediaQuery( '(pointer: coarse)' )