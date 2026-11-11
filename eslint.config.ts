import { reactProfile } from '@alessiofrittoli/package-configs/eslint/profiles/react'
import { eslintConfig } from '@alessiofrittoli/package-configs/eslint'

/** react-hooks/exhaustive-deps additional hooks. */
const additionalHooks = ['useUpdateEffect', 'useDeferCallback']

export default eslintConfig(...reactProfile, {
	rules: {
		'react/react-in-jsx-scope': 'off',
		'react-hooks/exhaustive-deps': [
			'warn',
			{
				additionalHooks: additionalHooks.join('|'),
			},
		],
	},
})
