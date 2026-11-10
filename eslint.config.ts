import { reactProfile } from '@alessiofrittoli/package-configs/eslint/profiles/react'
import { eslintConfig } from '@alessiofrittoli/package-configs/eslint'
// import { fixupConfigRules } from '@eslint/compat'
// import { FlatCompat } from '@eslint/eslintrc'
// import { fileURLToPath } from 'url'
// import { dirname } from 'path'

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = dirname(__filename)

// const compat = new FlatCompat({
// 	baseDirectory: __dirname,
// })

/** react-hooks/exhaustive-deps additional hooks. */
const additionalHooks = ['useUpdateEffect', 'useDeferCallback']

// export default eslintConfig(
// 	{
// 		settings: {
// 			react: {
// 				version: 'detect',
// 			},
// 		},
// 	},
// 	...fixupConfigRules(compat.extends('plugin:react/recommended')),
// 	...fixupConfigRules(compat.extends('plugin:react-hooks/recommended')),
// 	// make sure standard profile rules get no overrides
// 	...standardProfile,
// 	// ...reactProfile,
// 	{
// 		rules: {
// 			'react/react-in-jsx-scope': 'off',
// 			'react-hooks/exhaustive-deps': [
// 				'warn',
// 				{
// 					additionalHooks: additionalHooks.join('|'),
// 				},
// 			],
// 		},
// 	},
// )
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
