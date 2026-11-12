import { deferCallback, type DeferredTask } from '@alessiofrittoli/web-utils'
import { useCallback } from 'react'

/**
 * `useDeferCallback` will return a memoized and deferred version of the callback
 * that only changes if one of the `inputs` in the dependency list has changed.
 *
 * Since [`deferCallback`](https://npmjs.com/package/@alessiofrittoli/web-utils?activeTab=readme#deferCallback) returns a new function when called,
 * it may cause your child components to uselessly re-validate when a state update occurs in the main component.
 * To avoid these pitfalls you can memoize and defer your task with `useDeferCallback`.
 *
 * Take a look at [`deferTask`](https://npmjs.com/package/@alessiofrittoli/web-utils?activeTab=readme#deferTask) to defer single tasks in a function handler.
 *
 * @example
 *
 * ```ts
 * const onKeyDown = useDeferCallback<React.KeyboardEventHandler>(
 * 	event => { ... }, []
 * )
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useDeferCallback = <T extends DeferredTask<U>, U extends any[] = any[]>(
	task: T,
	deps: React.DependencyList,
	// eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/use-memo
): ReturnType<typeof deferCallback<T, U>> => useCallback(deferCallback<T, U>(task), deps)
