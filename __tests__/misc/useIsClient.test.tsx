import '@testing-library/jest-dom'

import { render, renderHook, screen } from '@testing-library/react'
import { useIsClient } from '@/misc/useIsClient'


describe( 'useIsClient', () => {

	it( 'initially returns false during server rendering then updates to true in the client', () => {

		const renders: boolean[] = []

		const useUseIsClient = () => {
			const isClient = useIsClient()
			renders.push( isClient )
			return isClient
		}

		renderHook( () => useUseIsClient() )

		expect( renders.length ).toBe( 2 )
		expect( renders.at( 0 ) ).toBe( false )
		expect( renders.at( -1 ) ).toBe( true )

	} )


	it( 'causes the parent Component to revalidate', () => {

		const renders: boolean[] = []

		const TestComponent: React.FC = () => {
			const isClient = useIsClient()
			renders.push( isClient )

			return (
				<div data-testid='result'>Is client: { isClient.toString() }</div>
			)
		}

		render( <TestComponent /> )

		expect( renders.length ).toBe( 2 )
		expect( renders.at( 0 ) ).toBe( false )
		expect( renders.at( -1 ) ).toBe( true )

		const result = screen.getByTestId( 'result' )
		expect( result ).toBeInTheDocument()
		expect( result ).toHaveTextContent( 'Is client: true' )

	} )

} )