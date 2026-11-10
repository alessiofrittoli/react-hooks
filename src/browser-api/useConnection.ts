import { getConnection, type Connection } from '@alessiofrittoli/web-utils'
import { useEventListener } from '@/browser-api'
import { useCallback, useState } from 'react'

const initialState: Connection = { onLine: true }
const connectivityEvents: (keyof WindowEventMap)[] = ['online', 'offline']

/**
 * Get states about Internet Connection.
 *
 * @returns An object defining network status and `NetworkInformation`. See {@link Connection} for more info.
 */
export const useConnection = (): Connection => {
	const [connection, setConnection] = useState<Connection>(initialState)

	const updateStateHandler = useCallback(() => {
		setConnection(getConnection())
	}, [])

	useEventListener('change', {
		target: connection.network,
		listener: updateStateHandler,
		onLoad: updateStateHandler,
	})

	useEventListener(connectivityEvents, {
		listener: updateStateHandler,
	})

	return connection
}
