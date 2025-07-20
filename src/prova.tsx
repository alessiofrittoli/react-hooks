import { useSelection } from '@alessiofrittoli/react-hooks'
import { useMemo } from 'react'

interface Item
{
	id		: number
	name	: string
}

const items: Item[] = [
	{
		id		: 1,
		name	: 'item-1',
	},
	{
		id		: 2,
		name	: 'item-2',
	},
	{
		id		: 3,
		name	: 'item-3',
	},
]


export const MyComponent: React.FC = () => {

	const { selection } = useSelection( useMemo( () => items.map( item => item.id ), [] ) )

	return (
		<></>
	)

}