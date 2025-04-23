import type { Linter } from 'eslint'

interface ESLintConfiguration
{
	recommended: Linter.Config[]
}


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
						additionalHooks: '(useUpdateEffect)',
					},
				],
			}
		}
	]
}