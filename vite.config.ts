/// <reference types='vitest/config' />

import { viteConfig } from '@alessiofrittoli/package-configs/vite'

console.log(
	`
____________________________________________________________________
        ____                  __     __  __            __
       / __ \\___  ____ ______/ /_   / / / /___  ____  / /_______
      / /_/ / _ \\/ __ \\\`/___/ __/  / /_/ / __ \\/ __ \\/ //_/ ___/
     / _, _/  __/ /_/ / /__/ /_   / __  / /_/ / /_/ / ,< (__  )
    /_/ |_|\\___/\\__,_/\\___/\\__/  /_/ /_/\\____/\\____/_/|_/____/
____________________________________________________________________
`,
)

export default viteConfig({
	test: {
		projects: [
			{
				extends: true,
				test: {
					name: 'jsdom',
					environment: 'jsdom',
					include: ['__tests__/**/*.test.(ts|tsx)'],
					setupFiles: ['__tests__/jsdom-setup.ts'],
				},
			},
		],
	},
})
