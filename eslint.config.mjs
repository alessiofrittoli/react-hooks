import { dirname } from 'path'
import { fileURLToPath } from 'url'
import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import { FlatCompat } from '@eslint/eslintrc'
import { fixupConfigRules } from '@eslint/compat'

const __filename	= fileURLToPath( import.meta.url )
const __dirname		= dirname( __filename )

const compat = new FlatCompat( {
	baseDirectory: __dirname,
} )

// Initial file generated with `npm lint -- --init`

/** @type {import('eslint').Linter.Config[]} */
// @ts-expect-error `languageOptions` property in `tseslint.configs.recommended` result incompatible with `eslint` config types.
const tseslintReccommended = tseslint.configs.recommended

/** @type {import('eslint').Linter.Config[]} */
const config = [
	{ languageOptions: { globals: { ...globals.browser, ...globals.node } } },
	pluginJs.configs.recommended,
	...tseslintReccommended,
	...fixupConfigRules( compat.extends( 'plugin:react/recommended' ) ),
	...fixupConfigRules( compat.extends( 'plugin:react-hooks/recommended' ) ),
	{
		settings: {
			react: {
				version: 'detect',
			},
		},
	},
	{ files: [ 'src/**/*.{js,jsx,mjs,cjs,ts,tsx}' ] },
	{ ignores: [ 'dist', 'scripts', 'coverage' ] },
	{ rules: {
		'@typescript-eslint/no-namespace': 'off',
		'react/react-in-jsx-scope': 'off',
		'react/prop-types': 'off',
		'react-hooks/exhaustive-deps': [
			'warn',
			{
				additionalHooks: '(useUpdateEffect)',
			},
		],
	} },
]

export default config