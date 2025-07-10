import { useCallback, useState } from 'react'
import { useEventListener } from '@/browser-api'

export type Connection = 'online' | 'offline'

export const getState = ( online: boolean ) => online ? 'online' : 'offline'

export interface UseConnectionReturnType
{
	/**
	 * Indicates the connections status.
	 * 
	 */
	connection: Connection
	/**
	 * Indicates whether the current device is online.
	 * 
	 */
	isOnline: boolean
	/**
	 * Indicates whether the current device is offline.
	 * 
	 */
	isOffline: boolean
}


/**
 * Get states about Internet Connection.
 * 
 * @returns An object defining Internet Connection status. See {@link UseConnectionReturnType} for more info.
 */
export const useConnection = (): UseConnectionReturnType => {

	const [ connection, setConnection ] = useState<Connection>( getState( true ) )	
	
	const isOnline	= connection === 'online'
	const isOffline	= connection === 'offline'

	const updateStateHandler = useCallback( () => (
		setConnection( getState( navigator.onLine ) )
	), [] )

	useEventListener( [ 'online', 'offline' ], {
		listener: updateStateHandler,
		onLoad	: updateStateHandler,
	} )

	return {
		connection, isOnline, isOffline
	}
	
}