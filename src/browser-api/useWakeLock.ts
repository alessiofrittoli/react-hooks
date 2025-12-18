import { useCallback, useEffect, useRef, useState } from 'react'
import { useEffectOnce } from '@/misc'
import { useDocumentVisibility, type VisibilityChangeHandler } from './useDocumentVisibility'

/**
 * Defines a callback executed when a screen Wake Lock request fails.
 * 
 * @param error The `DOMException` thrown by [`WakeLock.request()`](https://developer.mozilla.org/en-US/docs/Web/API/WakeLock/request).
 */
export type OnWakeLockRequestError = ( error: DOMException ) => void


export interface UseWakeLockOptions
{
	/**
	 * Indicates whether to request the screen Wake Lock on mount.
	 * 
	 * @default true
	 */
	onMount?: boolean
	/**
	 * A custom callback executed when a screen Wake Lock request fails.
	 * 
	 * @param error The `DOMException` thrown by [`WakeLock.request()`](https://developer.mozilla.org/en-US/docs/Web/API/WakeLock/request).
	 */
	onError?: OnWakeLockRequestError
}


export interface UseWakeLockBase
{
	/**
	 * Manually request the Wake Lock.
	 * 
	 */
	requestWakeLock: () => Promise<void>
	/**
	 * Manually release the Wake Lock.
	 * 
	 */
	releaseWakeLock: () => Promise<void>
}


export type UseWakeLock = UseWakeLockBase & (
	| {
		/**
		 * The **`WakeLockSentinel`** interface of the Screen Wake Lock API can be used to monitor the status of the platform screen wake lock, and manually release the lock when needed.
		 * Available only in secure contexts.
		 *
		 * [MDN Reference](https://developer.mozilla.org/docs/Web/API/WakeLockSentinel)
		 */
		wakeLock: WakeLockSentinel
		/**
		 * Indicates whether the Wake Lock is enabled.
		 *  
		 */
		enabled: true
	} | {
		/**
		 * The **`WakeLockSentinel`** interface of the Screen Wake Lock API returned by the `WakeLock` instance once has been enabled.
		 * Available only in secure contexts.
		 *
		 * [MDN Reference](https://developer.mozilla.org/docs/Web/API/WakeLockSentinel)
		 */
		wakeLock: null
		/**
		 * Indicates whether the Wake Lock is enabled.
		 *  
		 */
		enabled: false
	}
)


/**
 * React hook to manage the Screen Wake Lock API.
 * 
 * This hook allows you to request and release a screen wake lock, preventing the device from dimming or locking the screen.
 * It automatically handles wake lock requests based on document visibility and user interaction.
 * 
 * @param options An object defining hook options. See {@link UseWakeLockOptions} for more info.
 * @returns An object returning The current `WakeLockSentinel` instance or `null` if not enabled and utility functions. See {@link UseWakeLock} for more info.
 * 
 * @example
 * ```tsx
 * const { enabled, requestWakeLock, releaseWakeLock } = useWakeLock()
 * 
 * if ( ! enabled ) {
 * 	// Request wake lock on button click
 * 	<button onClick={ requestWakeLock }>Enable Wake Lock</button>
 * }
 * 
 * if ( enabled ) {
 * 	// Release wake lock on button click
 * 	<button onClick={ releaseWakeLock }>Disable Wake Lock</button>
 * }
 * ```
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API
 */
export const useWakeLock = ( options: UseWakeLockOptions = {} ): UseWakeLock => {

	const { onMount = true, onError } = options

	const [ wakeLock, setWakeLock ] = useState<WakeLockSentinel | null>( null )
	
	/**
	 * Indicates whether Wake Lock has been enabled by user.
	 * 
	 * This is initially set to `true` if `onMount` is set `true`.
	 * 
	 * - This flag is set to `true` to ensure Wake Lock get re-enabled when Document come back to visible and user previously enabled Wake Lock.
	 * - This flag is set to `false` to ensure Wake Lock doesn't get re-enabled when Document come back to visible and user previously released Wake Lock.
	 */
	const wakeLockRequested = useRef( onMount )
	
	/**
	 * Indicates whether the Wake Lock is enabled.
	 * 
	 */
	const enabled = ( wakeLock && ! wakeLock.released ) || false
	

	/**
	 * Request Wake Lock (this function is intended for internal use only).
	 * 
	 * If Wake Lock was already requested and it's not released it's then returned instead of making a new request.
	 */
	const __requestWakeLock = useCallback(
		async ( onResolve?: () => void ) => (
			! wakeLock || wakeLock.released ?
				navigator.wakeLock.request( 'screen' )
					.then( WakeLockSentinel => {
						setWakeLock( WakeLockSentinel )
						onResolve?.()
					} )
					.catch( onError || console.error )
			: wakeLock
		), [ wakeLock, onError ]
	)


	/**
	 * Eventually release Wake Lock if any `WakeLockSentinel` has been defined (this function is intended for internal use only).
	 * 
	 */
	const __releaseWakeLock = useCallback( async () => (
		wakeLock?.release()
	), [ wakeLock ] )


	/**
	 * Manually request Wake Lock (this function is intended for users only).
	 * 
	 */
	const requestWakeLock = useCallback( async () => {
		__requestWakeLock( () => {
			// ensure Wake Lock get re-enabled when Document come back to visible and user previously enabled Wake Lock.
			wakeLockRequested.current = true
		} )
	}, [ __requestWakeLock ] )

	
	/**
	 * Manually release the Wake Lock.
	 * 
	 */
	const releaseWakeLock = useCallback( async () => {
		// ensure Wake Lock doesn't get re-enabled when Document come back to visible and user previously released Wake Lock.
		wakeLockRequested.current = false
		__releaseWakeLock()
	}, [ __releaseWakeLock ] )

	
	/**
	 * Enable Wake Lock if Document visibility is back to "visible" and dev/user previously enabled Wake Lock.
	 * 
	 * Eventually release Wake Lock if Document visibility is not "visible".
	 */
	useDocumentVisibility( {
		updateState: false,
		onVisibilityChange: useCallback<VisibilityChangeHandler>( isVisible => {
			if ( isVisible && ! enabled && wakeLockRequested.current ) {
				return __requestWakeLock()
			}
			if ( ! isVisible ) {
				return __releaseWakeLock()
			}
		}, [ enabled, __requestWakeLock, __releaseWakeLock ] )
	} )

	
	/**
	 * Request Wake Lock when hook did mount.
	 * 
	 */
	useEffectOnce( () => {
		if ( enabled || ! onMount ) return
		__requestWakeLock()
	} )
	

	/**
	 * Handle release on 'release' Event and when hook did unmount.
	 * 
	 */
	useEffect( () => {
		if ( ! wakeLock ) return

		/**
		 * Handle WakeLockSentinel release.
		 * 
		 * This handler get executed when WakeLockSentinel get effectively released.
		 */
		const releaseHandler = () => {
			if ( ! wakeLock.released ) return
			setWakeLock( null )
		}

		wakeLock.addEventListener( 'release', releaseHandler )

		return () => {

			wakeLock.removeEventListener( 'release', releaseHandler )
			
			if ( wakeLock.released ) return

			wakeLock.release()

		}
	}, [ wakeLock ] )


	return {
		wakeLock, enabled, requestWakeLock, releaseWakeLock
	} as UseWakeLock

}