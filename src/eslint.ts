import type { Linter } from 'eslint'

interface ESLintConfiguration
{
	recommended: Linter.Config[]
}

/** react-hooks/exhaustive-deps additional hooks. */
const additionalHooks = [
	'useUpdateEffect', 'useDeferCallback'
]

/**
 * [`@alessiofrittoli/react-hooks`](https://npmjs.com/package/@alessiofrittoli/react-hooks) Recommended ESLint configurations.
 */
export const config: ESLintConfiguration = {
	recommended: [
		{
			rules: {
				'react-hooks/exhaustive-deps': [
					'warn',
					{
						additionalHooks: additionalHooks.join( '|' ),
					},
				],
			}
		}
	]
}