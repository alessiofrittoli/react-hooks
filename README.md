# React Hooks 🪝

[![NPM Latest Version][version-badge]][npm-url] [![Coverage Status][coverage-badge]][coverage-url] [![Socket Status][socket-badge]][socket-url] [![NPM Monthly Downloads][downloads-badge]][npm-url] [![Dependencies][deps-badge]][deps-url]

[![GitHub Sponsor][sponsor-badge]][sponsor-url]

[version-badge]: https://img.shields.io/npm/v/%40alessiofrittoli%2Freact-hooks
[npm-url]: https://npmjs.org/package/%40alessiofrittoli%2Freact-hooks
[coverage-badge]: https://coveralls.io/repos/github/alessiofrittoli/react-hooks/badge.svg
[coverage-url]: https://coveralls.io/github/alessiofrittoli/react-hooks
[socket-badge]: https://socket.dev/api/badge/npm/package/@alessiofrittoli/react-hooks
[socket-url]: https://socket.dev/npm/package/@alessiofrittoli/react-hooks/overview
[downloads-badge]: https://img.shields.io/npm/dm/%40alessiofrittoli%2Freact-hooks.svg
[deps-badge]: https://img.shields.io/librariesio/release/npm/%40alessiofrittoli%2Freact-hooks
[deps-url]: https://libraries.io/npm/%40alessiofrittoli%2Freact-hooks

[sponsor-badge]: https://img.shields.io/static/v1?label=Fund%20this%20package&message=%E2%9D%A4&logo=GitHub&color=%23DB61A2
[sponsor-url]: https://github.com/sponsors/alessiofrittoli

## TypeScript React utility Hooks

### Table of Contents

- [Getting started](#getting-started)
- [ESLint Configuration](#eslint-configuration)
- [API Reference](#api-reference)
  - [Browser API](#browser-api)
    - [`useStorage`](#usestorage)
    - [`useLocalStorage`](#uselocalstorage)
    - [`useSessionStorage`](#usesessionstorage)
    - [`useMediaQuery`](#usemediaquery)
    - [`useDarkMode`](#usedarkmode)
    - [`useIsPortrait`](#useisportrait)
  - [DOM API](#dom-api)
    - [`useScrollBlock`](#usescrollblock)
    - [`useFocusTrap`](#usefocustrap)
    - [`useInView`](#useinview)
  - [Miscellaneous](#miscellaneous)
    - [`useIsClient`](#useisclient)
    - [`useIsFirstRender`](#useisfirstrender)
    - [`useUpdateEffect`](#useupdateeffect)
    - [`usePagination`](#usepagination)
- [Development](#development)
  - [Install depenendencies](#install-depenendencies)
  - [Build the source code](#build-the-source-code)
  - [ESLint](#eslint)
  - [Jest](#jest)
- [Contributing](#contributing)
- [Security](#security)
- [Credits](#made-with-)

---

### Getting started

Run the following command to start using `react-hooks` in your projects:

```bash
npm i @alessiofrittoli/react-hooks
```

or using `pnpm`

```bash
pnpm i @alessiofrittoli/react-hooks
```

---

### ESLint Configuration

This library may define and exports hooks that requires additional ESLint configuration for your project such as [`useUpdateEffect`](#useupdateeffect).

Simply imports recommended configuration from `@alessiofrittoli/react-hooks/eslint` and add them to your ESLint configuration like so:

```mjs
import { config as AFReactHooksEslint } from '@alessiofrittoli/react-hooks/eslint'

/** @type {import('eslint').Linter.Config[]} */
const config = [
  ...AFReactHooksEslint.recommended,
  // ... other configurations
]


export default config
```

---

### API Reference

#### Browser API

##### Storage

The following storage hooks use Storage Utilities from [`@alessiofrittoli/web-utils`](https://npmjs.com/package/@alessiofrittoli/web-utils#storage-utilities) adding a React oriented implementation.

###### `useStorage`

Easly handle Local or Session Storage State.

<details>

<summary style="cursor:pointer">Type parameters</summary>

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `T`       | `any` | `string` | A custom type applied to the stored item. |

</details>

---

<details>

<summary style="cursor:pointer">Parameters</summary>

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `key`     | `string`           | - | The storage item key. |
| `initial` | `T`                | - | The storage item initial value. |
| `type`    | `local\|session`   | local | (Optional) The storage API to use. |

</details>

---

<details>

<summary style="cursor:pointer">Returns</summary>

Type: `[ Value<T>, SetValue<Value<T>> ]`

A tuple with the stored item value or initial value and the setter function.

</details>

---

<details>

<summary style="cursor:pointer">Usage</summary>

###### Importing the hooks

```tsx
import {
  useStorage, useLocalStorage, useSessionStorage
} from '@alessiofrittoli/react-hooks'
```

---

###### Reading item value from storage

```tsx
'use client'

import { useStorage } from '@alessiofrittoli/react-hooks'

type Locale = 'it' | 'en'

const storage       = 'local' // or 'session'
const defaultLocale = 'it'

export const SomeComponent: React.FC = () => {

  const [ userLocale ] = useStorage<Locale>( 'user-locale', defaultLocale, storage )

  return (
    ...
  )

}
```

---

###### Updating storage item value

```tsx
'use client'

import { useCallback } from 'react'
import { useStorage } from '@alessiofrittoli/react-hooks'

type Locale = 'it' | 'en'

const storage       = 'local' // or 'session'
const defaultLocale = 'it'

export const LanguageSwitcher: React.FC = () => {

  const [ userLocale, setUserLocale ] = useStorage<Locale>( 'user-locale', defaultLocale, storage )

  const clickHandler = useCallback( () => {
    setUserLocale( 'en' )
  }, [ setUserLocale ] )

  return (
    ...
  )

}
```

---

###### Deleting storage item

```tsx
'use client'

import { useCallback } from 'react'
import { useStorage } from '@alessiofrittoli/react-hooks'

type Locale = 'it' | 'en'

const storage       = 'local' // or 'session'
const defaultLocale = 'it'

export const LanguageSwitcher: React.FC = () => {

  const [ userLocale, setUserLocale ] = useStorage<Locale>( 'user-locale', defaultLocale, storage )

  const deleteHandler = useCallback( () => {
    setUserLocale( null )
    // or
    setUserLocale( undefined )
    // or
    setUserLocale( '' )
  }, [ setUserLocale ] )

  return (
    ...
  )

}
```

</details>

---

###### `useLocalStorage`

Shortcut React Hook for [`useStorage`](#usestorage).

Applies the same API Reference.

---

###### `useSessionStorage`

Shortcut React Hook for [`useStorage`](#usestorage).

Applies the same API Reference.

---

##### `useMediaQuery`

Get Document Media matches and listen for changes.

<details>

<summary style="cursor:pointer">Parameters</summary>

| Parameter | Type     | Default | Description |
|-----------|----------|---------|-------------|
| `query`   | `string` | - | A string specifying the media query to parse into a `MediaQueryList`. |
| `options` | `UseMediaQueryOptions\|UseMediaQueryStateOptions` | - | An object defining custom options. |
| `options.updateState` | `boolean` | `true` | Indicates whether the hook will dispatch a React state update when the given `query` change event get dispatched. |
| `options.onChange` | `OnChangeHandler` | - | A custom callback that will be invoked on initial page load and when the given `query` change event get dispatched. |
| | | | This callback is required if `updateState` is set to `false`. |

</details>

---

<details>

<summary style="cursor:pointer">Returns</summary>

Type: `boolean|void`

- `true` or `false` if the document currently matches the media query list or not.
- `void` if `updateState` is set to `false`.

</details>

---

<details>

<summary style="cursor:pointer">Usage</summary>

###### Check if user device prefers dark color scheme

```tsx
import { useMediaQuery } from '@alessiofrittoli/react-hooks'

const isDarkOS = useMediaQuery( '(prefers-color-scheme: dark)' )
```

---

###### Listen changes with no state updates

```tsx
import { useMediaQuery } from '@alessiofrittoli/react-hooks'

useMediaQuery( '(prefers-color-scheme: dark)', {
  updateState: false,
  onChange( matches ) {
    console.log( 'is dark OS?', matches )
  }
} )
```

</details>

---

##### `useDarkMode`

Easily manage dark mode with full respect for user device preferences.

This hook is user-oriented and built to honor system-level color scheme settings:

- If the device prefers a dark color scheme, dark mode is automatically enabled on first load.
- If the user enables/disables dark mode via a web widget, the preference is stored in `localStorage` under the key `dark-mode`.
- If the device color scheme preference changes (e.g. via OS settings), that change takes precedence and is stored for future visits.

<details>

<summary style="cursor:pointer">Parameters</summary>

| Parameter | Type | Description |
|-----------|------|-------------|
| `options` | `UseDarkModeOptions` | (Optional) Configuration object for the hook. |
| `options.initial` | `boolean` | (Optional) The fallback value to use if no preference is saved in `localStorage`. Defaults to `true` if the device prefers dark mode. |
| `options.docClassNames` | `[dark: string, light: string]` | (Optional) Array of class names to toggle on the `<html>` element, e.g. `['dark', 'light']`. |

</details>

---

<details>

<summary style="cursor:pointer">Returns</summary>

Type: `UseDarkModeOutput`

An object containing utilities for managing dark mode:

- `isDarkMode`: `boolean` — Whether dark mode is currently enabled.
- `isDarkOS`: `boolean` — Whether the user's system prefers dark mode.
- `toggleDarkMode`: `() => void` — Toggles dark mode and saves the preference.
- `enableDarkMode`: `() => void` — Enables dark mode and saves the preference.
- `disableDarkMode`: `() => void` — Disables dark mode and saves the preference.

</details>

---

<details>

<summary style="cursor:pointer">Usage</summary>

###### Basic usage

```tsx
'use client'

import { useDarkMode } from '@alessiofrittoli/react-hooks'

export const Component: React.FC = () => {
  const { isDarkMode } = useDarkMode()

  return (
    <div>{ isDarkMode ? 'Dark mode enabled' : 'Dark mode disabled' }</div>
  )
}
```

---

###### Update Document class names for CSS styling

```tsx
// Component.tsx
'use client'

import { useDarkMode } from '@alessiofrittoli/react-hooks'

export const Component: React.FC = () => {
  const { isDarkMode } = useDarkMode( {
    docClassNames: [ 'dark', 'light' ],
  } )

  return (
    <div>{ isDarkMode ? 'Dark mode enabled' : 'Dark mode disabled' }</div>
  )
}
```

```css
/* style.css */
.light {
  color-scheme: light;
}

.dark {
  color-scheme: dark;
}

.light body
{
  color     : black;
  background: white;
}

.dark body
{
  color     : white;
  background: black;
}
```

---

###### Custom theme switcher

```tsx
'use client'

import { useDarkMode } from '@alessiofrittoli/react-hooks'

export const ThemeSwitcher: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode()

  return (
    <button onClick={ toggleDarkMode }>
      { isDarkMode ? '🌙' : '☀️' }
    </button>
  )
}
```

---

###### Sync Document theme-color for consistent browser styling

Browsers automatically apply colorization using:

```html
<meta name='theme-color' media='(prefers-color-scheme: dark)' />
```

This works based on the OS preference — *not your site theme*. That can cause mismatches if, for example, the system is in dark mode but the user disabled dark mode via a web toggle.

To ensure consistency, `useDarkMode` updates these meta tags dynamically based on the actual mode.

Just make sure to define both `light` and `dark` theme-color tags in your document:

```html
<head>
  <meta name='theme-color' media='(prefers-color-scheme: light)' content='lime'>
  <meta name='theme-color' media='(prefers-color-scheme: dark)' content='aqua'>
</head>
```

</details>

---

##### `useIsPortrait`

Check if device is portrait oriented.

React State get updated when device orientation changes.

<details>

<summary style="cursor:pointer">Returns</summary>

Type: `boolean`

- `true` if the device is portrait oriented.
- `false` otherwise.

</details>

---

<details>

<summary style="cursor:pointer">Usage</summary>

###### Check if user device is in landscape

```tsx
import { useIsPortrait } from '@alessiofrittoli/react-hooks'

const isLandscape = ! useIsPortrait()
```

</details>

---

#### DOM API

##### `useScrollBlock`

Prevent Element overflow.

<details>

<summary style="cursor:pointer">Parameters</summary>

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `target`  | `React.RefObject<HTMLElement\|null>` | `Document.documentElement` | (Optional) The React RefObject target HTMLElement. |

</details>

---

<details>

<summary style="cursor:pointer">Returns</summary>

Type: `[ () => void, () => void ]`

A tuple with block and restore scroll callbacks.

</details>

---

<details>

<summary style="cursor:pointer">Usage</summary>

###### Block Document Overflow

```tsx
import { useScrollBlock } from '@alessiofrittoli/react-hooks'

const [ blockScroll, restoreScroll ] = useScrollBlock()

const openPopUpHandler = useCallback( () => {
  ...
  blockScroll()
}, [ blockScroll ] )

const closePopUpHandler = useCallback( () => {
  ...
  restoreScroll()
}, [ restoreScroll ] )

...
```

---

###### Block HTML Element Overflow

```tsx
const elementRef = useRef<HTMLDivElement>( null )

const [ blockScroll, restoreScroll ] = useScrollBlock( elementRef )

const scrollBlockHandler = useCallback( () => {
  ...
  blockScroll()
}, [ blockScroll ] )

const scrollRestoreHandler = useCallback( () => {
  ...
  restoreScroll()
}, [ restoreScroll ] )

...
```

</details>

---

##### `useFocusTrap`

Trap focus inside the given HTML Element.

This comes pretty handy when rendering a modal that shouldn't be closed without a user required action.

<details>

<summary style="cursor:pointer">Parameters</summary>

| Parameter | Type | Description |
|-----------|------|-------------|
| `target`  | `React.RefObject<HTMLElement\|null>` | The target HTMLElement React RefObject to trap focus within. |
|           |      | If no target is given, you must provide the target HTMLElement when calling `setFocusTrap`. |

</details>

---

<details>

<summary style="cursor:pointer">Returns</summary>

Type: `readonly [ SetFocusTrap, RestoreFocusTrap ]`

A tuple containing:

- `setFocusTrap`: A function to enable the focus trap. Optionally accept an HTMLElement as target.
- `restoreFocusTrap`: A function to restore the previous focus state.

</details>

---

<details>

<summary style="cursor:pointer">Usage</summary>

###### Defining the target on hook initialization

```tsx
import { useFocusTrap } from '@alessiofrittoli/react-hooks'

const modalRef = useRef<HTMLDivElement>( null )
const [ setFocusTrap, restoreFocusTrap ] = useFocusTrap( modalRef )

const modalOpenHandler = useCallback( () => {
  if ( ! modalRef.current ) return
  // ... open modal
  setFocusTrap()
  modalRef.current.focus() // focus the dialog so next tab will focus the next element inside the modal
}, [ setFocusTrap ] )

const modalCloseHandler = useCallback( () => {
  // ... close modal
  restoreFocusTrap() // cancel focus trap and restore focus to the last active element before enablig the focus trap
}, [ restoreFocusTrap ] )
```

---

###### Defining the target ondemand

```tsx
import { useFocusTrap } from '@alessiofrittoli/react-hooks'

const modalRef = useRef<HTMLDivElement>( null )
const modal2Ref = useRef<HTMLDivElement>( null )
const [ setFocusTrap, restoreFocusTrap ] = useFocusTrap()

const modalOpenHandler = useCallback( () => {
  if ( ! modalRef.current ) return
  // ... open modal
  setFocusTrap( modalRef.current )
  modalRef.current.focus()
}, [ setFocusTrap ] )

const modal2OpenHandler = useCallback( () => {
  if ( ! modal2Ref.current ) return
  // ... open modal
  setFocusTrap( modal2Ref.current )
  modal2Ref.current.focus()
}, [ setFocusTrap ] )
```

</details>

---

##### `useInView`

Check if the given target Element is intersecting with an ancestor Element or with a top-level document's viewport.

<details>

<summary style="cursor:pointer">Parameters</summary>

| Parameter | Type | Description |
|-----------|------|-------------|
| `target`  | `React.RefObject<Element\|null>` | The React.RefObject of the target Element to observe. |
| `options` | `UseInViewOptions` | (Optional) An object defining custom `IntersectionObserver` options. |
| `options.root` | `Element\|Document\|false\|null` | (Optional) Identifies the `Element` or `Document` whose bounds are treated as the bounding box of the viewport for the Element which is the observer's target. |
| `options.margin` | `MarginType` | (Optional) A string, formatted similarly to the CSS margin property's value, which contains offsets for one or more sides of the root's bounding box. |
| `options.amount` | `'all'\|'some'\|number\|number[]` | (Optional) The intersecting target thresholds. |
| | | Threshold can be set to: |
| | | - `all` - `1` will be used. |
| | | - `some` - `0.5` will be used. |
| | | - `number` |
| | | - `number[]` |
| `options.once` | `boolean` | (Optional) By setting this to `true` the observer will be disconnected after the target Element enters the viewport. |
| `options.initial` | `boolean` | (Optional) Initial value. This value is used while server rendering then will be updated in the client based on target visibility. Default: `false`. |
| `options.enable` | `boolean` | (Optional) Defines the initial observation activity. Use the returned `setEnabled` to update this state. Default: `true`. |
| `options.onIntersect` | `OnIntersectStateHandler` | (Optional) A custom callback executed when target element's visibility has crossed one or more thresholds. |
| | | This callback is awaited before any state update. |
| | | If an error is thrown the React State update won't be fired. |
| | | ⚠️ Wrap your callback with `useCallback` to avoid unnecessary `IntersectionObserver` recreation. |
| `options.onEnter` | `OnIntersectHandler` | (Optional) A custom callback executed when target element's visibility has crossed one or more thresholds. |
| | | This callback is awaited before any state update. |
| | | If an error is thrown the React State update won't be fired. |
| | | ⚠️ Wrap your callback with `useCallback` to avoid unnecessary `IntersectionObserver` recreation. |
| `options.onExit` | `OnIntersectHandler` | (Optional) A custom callback executed when target element's visibility has crossed one or more thresholds. |
| | | This callback is awaited before any state update. |
| | | If an error is thrown the React State update won't be fired. |
| | | ⚠️ Wrap your callback with `useCallback` to avoid unnecessary `IntersectionObserver` recreation. |

</details>

---

<details>

<summary style="cursor:pointer">Returns</summary>

Type: `UseInViewReturnType`

An object containing:

- `inView`: `boolean` - Indicates whether the target Element is in viewport or not.
- `setInView`: `React.Dispatch<React.SetStateAction<boolean>>` - A React Dispatch SetState action that allows custom state updates.
- `enabled`: `boolean` - Indicates whether the target Element is being observed or not.
- `setEnabled`: `React.Dispatch<React.SetStateAction<boolean>>` - A React Dispatch SetState action that allows to enable/disable observation when needed.
- `observer`: `IntersectionObserver | undefined` - The `IntersectionObserver` instance. It could be `undefined` if `IntersectionObserver` is not available or observation is not enabled.

</details>

---

<details>

<summary style="cursor:pointer">Usage</summary>

###### Basic usage

```tsx
'use client'

import { useRef } from 'react'
import { useInView } from '@alessiofrittoli/react-hooks'

const UseInViewExample: React.FC = () => {

  const targetRef   = useRef<HTMLDivElement>( null )
  const { inView }  = useInView( ref )

  return (
    Array.from( Array( 6 ) ).map( ( value, index ) => (
      <div
        key={ index }
        style={ {
          height          : '50vh',
          border          : '1px solid red',
          display         : 'flex',
          alignItems      : 'center',
          justifyContent  : 'center',
        } }
      >
        <div
          ref={ index === 2 ? targetRef : undefined }
          style={ {
            width           : 150,
            height          : 150,
            borderRadius    : 12,
            display         : 'flex',
            alignItems      : 'center',
            justifyContent  : 'center',
            background      : inView ? '#51AF83' : '#201A1B',
            color           : inView ? '#201A1B' : '#FFFFFF',
          } }
        >{ index + 1 }</div>
      </div>
    ) )
  )

}
```

---

###### Disconnect observer after target enters the viewport

```tsx
'use client'

import { useRef } from 'react'
import { useInView } from '@alessiofrittoli/react-hooks'

const OnceExample: React.FC = () => {

  const targetRef   = useRef<HTMLDivElement>( null )
  const { inView }  = useInView( targetRef, { once: true } )

  useEffect( () => {

    if ( ! inView ) return
    console.count( 'Fired only once: element entered viewport.' )

  }, [ inView ] )

  return (
    <div
      ref={ targetRef }
      style={ {
        height      : 200,
        background  : inView ? 'lime' : 'gray',
      } }
    />
  )

}
```

---

###### Observe target only when needed

```tsx
'use client'

import { useRef } from 'react'
import { useInView } from '@alessiofrittoli/react-hooks'

const OnDemandObservation: React.FC = () => {

  const targetRef = useRef<HTMLDivElement>( null )
  const {
    inView, enabled, setEnabled
  } = useInView( targetRef, { enable: false } )

  return (
    <div>
      <button onClick={ () => setEnabled( prev => ! prev ) }>
        { enabled ? 'Disconnect observer' : 'Observe' }
      </button>
      <div
        ref={ targetRef }
        style={ {
          height      : 200,
          marginTop   : 50,
          background  : inView ? 'lime' : 'gray',
        } }
      />
    </div>
  )

}
```

---

###### Execute custom callback when intersection occurs

```tsx
'use client'

import { useRef } from 'react'
import { useInView, type OnIntersectStateHandler } from '@alessiofrittoli/react-hooks'


const AsyncStartExample: React.FC = () => {

  const targetRef = useRef<HTMLDivElement>( null )
  const onIntersect   = useCallback<OnIntersectStateHandler>( async ( { entry, isEntering } ) => {

    if ( isEntering ) {
      console.log( 'Delaying state update...' )
      await new Promise( resolve => setTimeout( resolve, 1000 ) ) // Simulate delay
      console.log( 'Async task completed. `inView` will now be updated.' )
      return
    }
    
    console.log( 'Delaying state update...' )
    await new Promise( resolve => setTimeout( resolve, 1000 ) ) // Simulate delay
    console.log( 'Async task completed. `inView` will now be updated.' )
  
  }, [] )

  const { inView } = useInView( targetRef, { onIntersect } )

  return (
    <div
      ref={ targetRef }
      style={ {
        height      : 200,
        background  : inView ? 'lime' : 'gray',
      } }
    />
  )
}
```

---

###### Execute custom callback when `onEnter` and `onExit`

```tsx
'use client'

import { useRef } from 'react'
import { useInView, type OnIntersectHandler } from '@alessiofrittoli/react-hooks'


const AsyncStartExample: React.FC = () => {

  const targetRef = useRef<HTMLDivElement>( null )
  const onEnter = useCallback<OnIntersectHandler>( async ( { entry } ) => {
    console.log( 'In viewport - ', entry )
  }, [] )
  const onExit = useCallback<OnIntersectHandler>( async ( { entry } ) => {
    console.log( 'Exited viewport - ', entry )
  }, [] )

  const { inView } = useInView( targetRef, { onEnter, onExit } )

  return (
    <div
      ref={ targetRef }
      style={ {
        height      : 200,
        background  : inView ? 'lime' : 'gray',
      } }
    />
  )
}
```

</details>

---

#### Miscellaneous

##### `useIsClient`

Check if the React Hook or Component where this hook is executed is running in a browser environment.

This is pretty usefull to avoid hydration errors.

<details>

<summary style="cursor:pointer">Returns</summary>

Type: `boolean`

- `true` if the React Hook or Component is running in a browser environment.
- `false` otherwise.

</details>

---

<details>

<summary style="cursor:pointer">Usage</summary>

###### Basic usage

```tsx
'use client'

import { useIsClient } from '@alessiofrittoli/react-hooks'

export const ClientComponent: React.FC = () => {

  const isClient = useIsClient()

  return (
    <div>Running { ! isClient ? 'server' : 'client' }-side</div>
  )

}
```

</details>

---

##### `useIsFirstRender`

Check if is first React Hook/Component render.

<details>

<summary style="cursor:pointer">Returns</summary>

Type: `boolean`

- `true` at the mount time.
- `false` otherwise.

Note that if the React Hook/Component has no state updates, `useIsFirstRender` will always return `true`.

</details>

---

<details>

<summary style="cursor:pointer">Usage</summary>

###### Basic usage

```tsx
'use client'

import { useIsFirstRender } from '@alessiofrittoli/react-hooks'

export const ClientComponent: React.FC = () => {

  const isFirstRender = useIsFirstRender()
  const [ counter, setCounter ] = useState( 0 )

  useEffect( () => {
    const intv = setInterval( () => {
      setCounter( prev => prev + 1 )
    }, 1000 )
    return () => clearInterval( intv )
  }, [] )

  return (
    <div>
      { isFirstRender ? 'First render' : 'Subsequent render' }
      <hr />
      { counter }
    </div>
  )

}
```

</details>

---

##### `useUpdateEffect`

Modified version of `useEffect` that skips the first render.

<details>

<summary style="cursor:pointer">Parameters</summary>

| Parameter | Type                   | Description |
|-----------|------------------------|-------------|
| `effect`  | `React.EffectCallback` | Imperative function that can return a cleanup function. |
| `deps`    | `React.DependencyList` | If present, effect will only activate if the values in the list change. |

</details>

---

<details>

<summary style="cursor:pointer">Usage</summary>

###### Basic usage

```tsx
'use client'

import { useEffect, useState } from 'react'
import { useUpdateEffect } from '@alessiofrittoli/react-hooks'

export const ClientComponent: React.FC = () => {

  const [ count, setCount ] = useState( 0 )

  useEffect( () => {
    const intv = setInterval( () => {
      setCount( prev => prev + 1 )
    }, 1000 )
    return () => clearInterval( intv )
  }, [] )

  useEffect( () => {
    console.log( 'useEffect', count ) // starts from 0
    return () => {
      console.log( 'useEffect - clean up', count ) // starts from 0
    }
  }, [ count ] )

  useUpdateEffect( () => {
    console.log( 'useUpdateEffect', count ) // starts from 1
    return () => {
      console.log( 'useUpdateEffect - clean up', count ) // starts from 1
    }
  }, [ count ] )

  return (
    <div>{ count }</div>
  )

}
```

</details>

---

##### `usePagination`

Get pagination informations based on the given options.

This hook memoize the returned result of the [`paginate`](https://github.com/alessiofrittoli/math-utils/blob/master/docs/helpers/README.md#paginate) function imported from [`@alessiofrittoli/math-utils`](https://npmjs.com/package/@alessiofrittoli/math-utils).

See [`paginate`](https://github.com/alessiofrittoli/math-utils/blob/master/docs/helpers/README.md#paginate) function Documentation for more information about it.

---

### Development

#### Install depenendencies

```bash
npm install
```

or using `pnpm`

```bash
pnpm i
```

#### Build the source code

Run the following command to test and build code for distribution.

```bash
pnpm build
```

#### [ESLint](https://www.npmjs.com/package/eslint)

warnings / errors check.

```bash
pnpm lint
```

#### [Jest](https://npmjs.com/package/jest)

Run all the defined test suites by running the following:

```bash
# Run tests and watch file changes.
pnpm test:watch

# Run tests in a CI environment.
pnpm test:ci
```

- See [`package.json`](./package.json) file scripts for more info.

Run tests with coverage.

An HTTP server is then started to serve coverage files from `./coverage` folder.

⚠️ You may see a blank page the first time you run this command. Simply refresh the browser to see the updates.

```bash
test:coverage:serve
```

---

### Contributing

Contributions are truly welcome!

Please refer to the [Contributing Doc](./CONTRIBUTING.md) for more information on how to start contributing to this project.

Help keep this project up to date with [GitHub Sponsor][sponsor-url].

[![GitHub Sponsor][sponsor-badge]][sponsor-url]

---

### Security

If you believe you have found a security vulnerability, we encourage you to **_responsibly disclose this and NOT open a public issue_**. We will investigate all legitimate reports. Email `security@alessiofrittoli.it` to disclose any security vulnerabilities.

### Made with ☕

<table style='display:flex;gap:20px;'>
  <tbody>
    <tr>
      <td>
        <img alt="avatar" src='https://avatars.githubusercontent.com/u/35973186' style='width:60px;border-radius:50%;object-fit:contain;'>
      </td>
      <td>
        <table style='display:flex;gap:2px;flex-direction:column;'>
          <tbody>
              <tr>
                <td>
                  <a href='https://github.com/alessiofrittoli' target='_blank' rel='noopener'>Alessio Frittoli</a>
                </td>
              </tr>
              <tr>
                <td>
                  <small>
                    <a href='https://alessiofrittoli.it' target='_blank' rel='noopener'>https://alessiofrittoli.it</a> |
                    <a href='mailto:info@alessiofrittoli.it' target='_blank' rel='noopener'>info@alessiofrittoli.it</a>
                  </small>
                </td>
              </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>
