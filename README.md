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
- [What's Changed](#whats-changed)
- [API Reference](#api-reference)
  - [Browser API](#browser-api)
    - [`useStorage`](#usestorage)
    - [`useLocalStorage`](#uselocalstorage)
    - [`useSessionStorage`](#usesessionstorage)
    - [`useConnection`](#useconnection)
    - [`useDarkMode`](#usedarkmode)
    - [`useEventListener`](#useeventlistener)
    - [`useIsPortrait`](#useisportrait)
    - [`useMediaQuery`](#usemediaquery)
  - [DOM API](#dom-api)
    - [`useFocusTrap`](#usefocustrap)
    - [`useInView`](#useinview)
    - [`useScrollBlock`](#usescrollblock)
  - [Miscellaneous](#miscellaneous)
    - [`useInput`](#useinput)
    - [`useDeferCallback`](#usedefercallback)
    - [`useEffectOnce`](#useeffectonce)
    - [`useUpdateEffect`](#useupdateeffect)
    - [`useIsClient`](#useisclient)
    - [`useIsFirstRender`](#useisfirstrender)
    - [`usePagination`](#usepagination)
    - [`useSelection`](#useselection)
  - [Timers](#timers)
    - [`useDebounce`](#usedebounce)
    - [`useInterval`](#useinterval)
    - [`useIntervalWhenVisible`](#useintervalwhenvisible)
    - [`useLightInterval`](#uselightinterval)
    - [`useTimeout`](#usetimeout)
    - [`useLightTimeout`](#uselighttimeout)
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

### What's Changed

#### Updates in the latest release 🎉

- Add `useDeferCallback`. See [API Reference](#usedefercallback) for more info.
- Add missing API Referefence sections.

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

##### `useConnection`

Get states about Internet Connection.

<details>

<summary style="cursor:pointer">Returns</summary>

Type: `UseConnectionReturnType`

An object with the following properties:

- `connection`: `online | offline` - Indicates the connections status.
- `isOnline`: `boolean` - Indicates whether the current device is online.
- `isOffline`: `boolean` - Indicates whether the current device is offline.

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

##### `useEventListener`

Attach a new Event listener to the `Window`, `Document`, `MediaQueryList` or an `HTMLElement`.

<details>

<summary style="cursor:pointer">Parameters</summary>

<details>

<summary style="cursor:pointer">Window events</summary>

| Parameter | Type     | Description |
|-----------|----------|-------------|
| `type`    | `K\|K[]` | The `Window` event name or an array of event names. |
| `options` | `WindowListenerOptions<K>` | An object defining init options. |
| `options.listener` | `WindowEventListener<K>` | The Window Event listener. |
| `options.onLoad` | `() => void` | A custom callback executed before event listener get attached. |
| `options.onCleanUp` | `() => void` | A custom callback executed after event listener get removed. |
| `options.options` | `ListenerOptions` | Specifies characteristics about the event listener. See [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#options). |

</details>

---

<details>

<summary style="cursor:pointer">Document events</summary>

| Parameter | Type     | Description |
|-----------|----------|-------------|
| `type`    | `K\|K[]` | The `Document` event name or an array of event names. |
| `options` | `DocumentListenerOptions<K>` | An object defining init options. |
| `options.target` | `Document\|null\|React.RefObject<Document\|null>` | The `Document` reference or a React RefObject of the `Document`. |
| `options.listener` | `DocumentEventListener<K>` | The Document Event listener. |
| `options.onLoad` | `() => void` | A custom callback executed before event listener get attached. |
| `options.onCleanUp` | `() => void` | A custom callback executed after event listener get removed. |
| `options.options` | `ListenerOptions` | Specifies characteristics about the event listener. See [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#options). |

</details>

---

<details>

<summary style="cursor:pointer">HTMLElement events</summary>

| Parameter | Type     | Description |
|-----------|----------|-------------|
| `type`    | `K\|K[]` | The `HTMLElement` event name or an array of event names. |
| `options` | `ElementListenerOptions<K>` | An object defining init options. |
| `options.target` | `T\|React.RefObject<T\| null>` | The React RefObject of the target where the listener get attached to. |
| `options.listener` | `ElementEventListener<K>` | The HTMLElement Event listener. |
| `options.onLoad` | `() => void` | A custom callback executed before event listener get attached. |
| `options.onCleanUp` | `() => void` | A custom callback executed after event listener get removed. |
| `options.options` | `ListenerOptions` | Specifies characteristics about the event listener. See [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#options). |

</details>

---

<details>

<summary style="cursor:pointer">MediaQuery events</summary>

| Parameter | Type     | Description |
|-----------|----------|-------------|
| `type`    | `change` | The `MediaQueryList` event name. |
| `options` | `MediaQueryListenerOptions` | An object defining init options. |
| `options.query` | `string` | The Media Query string to check. |
| `options.listener` | `MediaQueryChangeListener` | The MediaQueryList Event listener. |
| `options.onLoad` | `() => void` | A custom callback executed before event listener get attached. |
| `options.onCleanUp` | `() => void` | A custom callback executed after event listener get removed. |
| `options.options` | `ListenerOptions` | Specifies characteristics about the event listener. See [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#options). |

</details>

---

<details>

<summary style="cursor:pointer">Custom events</summary>

| Parameter | Type     | Description |
|-----------|----------|-------------|
| `type`    | `K\|K[]` | The custom event name or an array of event names. |
| `options` | `CustomEventListenerOptions<T, K>` | An object defining init options. |
| `options.target` | `Document\|HTMLElement\|null\|React.RefObject<Document\|HTMLElement\|null>` | (Optional) The target where the listener get attached to. If not set, the listener will get attached to the `Window` object. |
| `options.listener` | `( event: T[ K ] ) => void` | The Event listener. |
| `options.onLoad` | `() => void` | A custom callback executed before event listener get attached. |
| `options.onCleanUp` | `() => void` | A custom callback executed after event listener get removed. |
| `options.options` | `ListenerOptions` | Specifies characteristics about the event listener. See [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#options). |

</details>

</details>

---

<details>

<summary style="cursor:pointer">Usage</summary>

###### Attach listeners to the Window object

```tsx
'use client'

import { useCallback } from 'react'
import { useEventListener } from '@alessiofrittoli/react-hooks'

export const MyComponent: React.FC = () => {

  useEventListener( 'popstate', {
    listener: useCallback( event => {
      ...
    }, [] ),
  } )

}
```

---

###### Attach listeners to the Document object

```tsx
'use client'

import { useCallback } from 'react'
import { useEventListener } from '@alessiofrittoli/react-hooks'

export const MyComponent: React.FC = () => {

  useEventListener( 'click', {
    target    : typeof document !== 'undefined' ? document : null,
    listener  : useCallback( event => {
      ...
    }, [] ),
  } )

}
```

---

###### Attach listeners to an HTMLElement

```tsx
'use client'

import { useCallback, useRef } from 'react'
import { useEventListener } from '@alessiofrittoli/react-hooks'

export const MyComponent: React.FC = () => {

  const buttonRef = useRef<HTMLButtonElement>( null )

  useEventListener( 'click', {
    target: buttonRef,
    listener: useCallback( event => {
      ...
    }, [] ),
  } )

  return (
    <button ref={ buttonRef }>Button</button>
  )

}
```

---

###### Attach listeners to a MediaQueryList

```tsx
import { useCallback } from 'react'
import { useEventListener } from '@alessiofrittoli/react-hooks'

export const MyComponent: React.FC = () => {

  useEventListener( 'change', {
    query     : '(max-width: 768px)',
    listener  : useCallback( event => {
      if ( event.matches ) {
        ...
      }
    }, [] )
  } )

}
```

---

###### Listen dispatched custom events

```tsx
import { useCallback } from 'react'
import { useEventListener } from '@alessiofrittoli/react-hooks'

class CustomEvent extends Event
{
  isCustom: boolean

  constructor( type: string, eventInitDict?: EventInit )
  {
    super( type, eventInitDict )
    this.isCustom = true
  }
}


type CustomEventMap = {
  customEventName: CustomEvent
}


export const MyComponent: React.FC = () => {

  const clickHandler = useCallback( () => {
    document.dispatchEvent( new CustomEvent( 'customEventName' ) )
  }, [] )

  useEventListener<CustomEventMap>( 'customEventName', {
    target    : typeof document !== 'undefined' ? document : null,
    listener  : useCallback( event => {
      if ( event.isCustom ) {
        ...
      }
    }, [] )
  } )


  return (
    <button onClick={ clickHandler }>Click me to dispatch custom event</button>
  )

}
```

---

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

#### DOM API

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

#### Miscellaneous

##### `useInput`

Handle input states with ease.

<details>

<summary style="cursor:pointer">Type Parameters</summary>

| Parameter | Description            |
|-----------|------------------------|
| `I`       | The input value type.  |
| `O`       | The output value type. |

</details>

---

<details>

<summary style="cursor:pointer">Parameters</summary>

| Parameter | Type     | Default | Description                 |
|-----------|----------|---------|-----------------------------|
| `options` | `UseInputOptions<I, O>` | `{}` | An object defining custom options. |
| `options.inputRef` | `React.RefObject<InputType>` | - | (Optional) The React HTML input element ref. |
| `options.initialValue` | `O\|null` | - | (Optional) The input initial value. |
| `options.touchTimeout` | `number` | 600 | (Optional) A timeout in milliseconds which will be used to define the input as "touched" thus validations are triggered and errors can be displayed. |
| `options.validate` | `ValidateValueHandler<O>` | - | (Optional) Value validation handler. If `parse` callback is given, the `value` will be parsed before validation. |
| `options.parse` | `ParseValueHandler<I, O>` | - | (Optional) Parse value. |
| `options.onChange` | `ChangeHandler<O>` | - | (Optional) A callable function executed when the `ChangeEvent` is dispatched on the HTML input element. |

</details>

---

<details>

<summary style="cursor:pointer">Returns</summary>

Type: `UseInputOutput<I, O>`

An object containing the following properties:

| Property        | Type | Description |
|-----------------|------|-------------|
| `isEmpty`       | `boolean` | Indicates whether the Input is empty or not. |
| `hasError`      | `boolean` | Indicates whether the input has error or not. |
| | | It will return true if the Input does not pass the validation checks and it has been touched. |
| | | Please refer to the `isValid` property to check the Input validity regardless of whether it has been touched or not. |
| `changeHandler` | `React.ChangeEventHandler<InputType>` | Change handler callback used to handle Input change events. |
| `blurHandler`   | `() => void` | Blur handler callback used to handle Input blur events. |
| `setValue`      | `( value: O ) => void` | Call `setValue` method to update input value. |
| `submit`        | `() => void` | Call `submit` method to re-run validations and ensure error state is updated successfully. |
| `reset`         | `() => void` | Call `reset` method to reset the Input state. |
| `focus`         | `() => void` | Call `focus` method to focus the Input Element. `inputRef` must be provided in the input options. |

</details>

---

<details>

<summary style="cursor:pointer">Usage</summary>

###### Basic usage

```tsx
const MyComponent: React.FC = () => {

  const input = useInput<string>()

  return (
    <input
      type='text'
      value={ input.value || '' }
      onChange={ input.changeHandler }
      onBlur={ input.blurHandler }
    />
  )

}
```

---

###### Displaying custom error messages

```tsx
import { useInput, type ValidateValueHandler } from '@alessiofrittoli/react-hooks'

const isNotEmpty: ValidateValueHandler<string> = value => (
  ! value ? false : value.trim().length > 0
)

const MyComponent: React.FC = () => {

  const input = useInput<string>( {
    validate: isNotEmpty,
  } )

  return (
    <>
      <input
        value={ input.value || '' }
        onChange={ input.changeHandler }
        onBlur={ input.blurHandler }
      />
      { input.hasError && (
        <span>The input cannot be empty.</span>
      ) }
    </>
  )

}
```

---

###### Parsing and validating parsed value

```tsx
import { formatDate, isValidDate } from '@alessiofrittoli/date-utils'
import { useInput, type ValidateValueHandler, type ParseValueHandler } from '@alessiofrittoli/react-hooks'

const parseStringToDate: ParseValueHandler<string, Date> = value => (
  value ? new Date( value ) : undefined
)


const validateInputDate: ValidateValueHandler<Date> = value => (
  isValidDate( value ) && value.getTime() > Date.now()
)


const MyComponent: React.FC = () => {

  const input = useInput<string, Date>( {
    parse     : parseStringToDate,
    validate  : validateInputDate,
  } )
  

  return (
    <>
      <input
        type='datetime-local'
        value={ input.value ? formatDate( input.value, 'Y-m-dTH:i' ) : '' }
        onChange={ input.changeHandler }
        onBlur={ input.blurHandler }
      />
      { input.hasError && (
        <span>Please choose a date no earlier than today</span>
      ) }
    </>
  )

}
```

</details>

---

##### `useDeferCallback`

`useDeferCallback` will return a memoized and deferred version of the callback that only changes if one of the `inputs` in the dependency list has changed.

Since [`deferCallback`](https://npmjs.com/package/@alessiofrittoli/web-utils?activeTab=readme#deferCallback) returns a new function when called, it may cause your child components to uselessly re-validate when a state update occurs in the main component.
To avoid these pitfalls you can memoize and defer your task with `useDeferCallback`.

Take a look at [`deferTask`](https://npmjs.com/package/@alessiofrittoli/web-utils?activeTab=readme#deferTask) to defer single tasks in a function handler.

<details>

<summary style="cursor:pointer">Type Parameters</summary>

| Parameter | Description                  |
|-----------|------------------------------|
| `T`       | The task function definition. `unknown` types will be inherited by your function type definition. |
| `U`       | The task function arguments. `unknown` types will be inherited by your function type. |

</details>

---

<details>

<summary style="cursor:pointer">Parameters</summary>

| Parameter | Type     | Description                 |
|-----------|----------|-----------------------------|
| `task`    | `T`      | The task callable function. |

</details>

---

<details>

<summary style="cursor:pointer">Returns</summary>

Type: `( ...args: U ) => Promise<Awaited<ReturnType<T>>>`

A new memoized handler which returns a new Promise that returns the `task` result once fulfilled.

</details>

---

<details>

<summary style="cursor:pointer">Usage</summary>

```tsx
const MyComponent: React.FC = () => {

  const clickHandler = useDeferCallback<React.MouseEventHandler>(
    event => { ... }, []
  )

  return (
    <button onClick={ clickHandler }>Button</button>
  )

}
```

</details>

---

##### `useEffectOnce`

Modified version of `useEffect` that only run once on intial load.

<details>

<summary style="cursor:pointer">Parameters</summary>

| Parameter | Type                   | Description |
|-----------|------------------------|-------------|
| `effect`  | `React.EffectCallback` | Imperative function that can return a cleanup function. |

</details>

---

<details>

<summary style="cursor:pointer">Usage</summary>

```tsx
'use client'

import { useEffect, useState } from 'react'
import { useEffectOnce } from '@alessiofrittoli/react-hooks'

export const ClientComponent: React.FC = () => {

  const [ count, setCount ] = useState( 0 )

  useEffect( () => {
    const intv = setInterval( () => {
      setCount( prev => prev + 1 ) // update state each 1s
    }, 1000 )
    return () => clearInterval( intv )
  }, [] )

  useEffectOnce( () => {
    console.log( 'Component did mount' )
    return () => {
      console.log( 'Component did unmount' )
    }
  } )

  return (
    <div>{ count }</div>
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

##### `usePagination`

Get pagination informations based on the given options.

This hook memoize the returned result of the [`paginate`](https://github.com/alessiofrittoli/math-utils/blob/master/docs/helpers/README.md#paginate) function imported from [`@alessiofrittoli/math-utils`](https://npmjs.com/package/@alessiofrittoli/math-utils).

See [`paginate`](https://github.com/alessiofrittoli/math-utils/blob/master/docs/helpers/README.md#paginate) function Documentation for more information about it.

---

##### `useSelection`

A React hook for managing selection states in an array.

Provides functionality for single and group selection, as well as resetting the selection.

<details>

<summary style="cursor:pointer">Type Parameters</summary>

| Parameter | Description                  |
|-----------|------------------------------|
| `V`       | The type of the values in the `array`. |

</details>

---

<details>

<summary style="cursor:pointer">Parameters</summary>

| Parameter | Type  | Default | Description                  |
|-----------|-------|---------|-----------------------------|
| `array`   | `V[]` | -      | The array of items to manage selection for. |
| `initial` | `V[]` | []     | The initial selection state. |

</details>

---

<details>

<summary style="cursor:pointer">Returns</summary>

An object containing the selection state and handlers.

- `selection`: `V[]` - The current selected items.
- `hasSelection`: `boolean` - Indicates whether `selection` is not empty. Short-hand for `selection.length > 0`.
- `isSelected`: `IsSelectedHandler<V>` - Check if the given `entry` is in the selection.
- `setSelection`: `SetSelectionHandler<V>` - A React Dispatch SetStateAction that allows custom selection update.
- `select`: `SelectHandler<V>` - Update selection by adding a new `entry` or removing the given `entry` if already exists in the selection.
- `groupSelect`: `GroupSelectHandler<V>` - Select all items from the given `array` starting from the first item in the selection up to the given `entry`.
- `selectAll`: `SelectAllHandler` - Add all entries from the given `array` to the selection.
- `resetSelection`: `ResetSelectionHandler` - Removes all entries from the selection.

</details>

---

<details>

<summary style="cursor:pointer">Usage</summary>

```tsx
'use client'

import { useCallback, useMemo } from 'react'
import { useSelection } from '@alessiofrittoli/react-hooks'

interface Item
{
  id    : number
  name  : string
}

const items: Item[] = [
  {
    id    : 1,
    name  : 'item-1',
  },
  {
    id    : 2,
    name  : 'item-2',
  },
  {
    id    : 3,
    name  : 'item-3',
  },
  {
    id    : 4,
    name  : 'item-4',
  },
  {
    id    : 5,
    name  : 'item-5',
  },
]


const MyComponent: React.FC = () => {

  const {
    setSelection, select, groupSelect, isSelected
  } = useSelection( useMemo( () => items.map( item => item.id ), [] ) )

  const clickHandler = useCallback( ( id: Item[ 'id' ] ) => (
    ( event: React.MouseEvent<HTMLButtonElement> ) => {
      if ( event.shiftKey ) {
        return groupSelect( id ) // group select
      }
      if ( event.metaKey || event.ctrlKey ) {
        return select( id ) // toggle single item in selection
      }
      setSelection( prev => (
        prev.includes( id ) ? [] : [ id ] // toggle single item selection
      ) )
    }
  ), [ select, groupSelect, setSelection ] )

  return (
    <ul>
      { items.map( item => (
        <li key={ item.id }>
          <button
            onClick={ clickHandler( item.id ) }
            style={ {
              border: isSelected( item.id ) ? '1px solid red' : ' 1px solid black'
            } }
          >{ item.name }</button>
        </li>
      ) ) }
    </ul>
  )

}
```

</details>

---

#### Timers

#### `useDebounce`

Debounce a value by a specified delay.

This hook returns a debounced version of the input value, which only updates
after the specified delay has passed without any changes to the input value.

It is useful for scenarios like search input fields or other cases where
frequent updates should be minimized.

The `Timeout` automatically restarts when the given `value` changes.

<details>

<summary style="cursor:pointer">Type Parameters</summary>

| Parameter | Description              |
|-----------|--------------------------|
| `T`       | The type of the `value`. |

</details>

---

<details>

<summary style="cursor:pointer">Parameters</summary>

| Parameter | Type     | Default | Description                 |
|-----------|----------|---------|-----------------------------|
| `value`   | `T`      | -       | The value to debounce. This can be of any type. |
| `delay`   | `number` | 500     | The debounce delay in milliseconds. |

</details>

---

<details>

<summary style="cursor:pointer">Returns</summary>

Type: `T`

The debounced value, which updates only after the delay has passed.

</details>

---

<details>

<summary style="cursor:pointer">Usage</summary>

```tsx
'use client'

import { useEffect, useState } from 'react'
import { useDebounce } from '@alessiofrittoli/react-hooks'

const MyComponent: React.FC = () => {

  const [ query, setQuery ] = useState( '' )
  const debouncedQuery = useDebounce( query )

  useEffect( () => {
    if ( ! debouncedQuery ) return

    fetch( '...', {
      // ...
      body: JSON.stringify( { query: debouncedQuery } )
    } )

  }, [ debouncedQuery ] )

  return (
    <input
      onChange={ event => setQuery( event.target.value ) }
    />
  )

}
```

</details>

---

#### `useInterval`

Schedules repeated execution of `callback` every `delay` milliseconds.

When `delay` is larger than `2147483647` or less than `1` or `NaN`, the `delay` will be set to `1`. Non-integer delays are truncated to an integer.
If `callback` is not a function, a `TypeError` will be thrown.

The `Timeout` is automatically cancelled on unmount.

<details>

<summary style="cursor:pointer">Type Parameters</summary>

| Parameter | Description              |
|-----------|--------------------------|
| `T`       | An Array defining optional arguments passed to the `callback`. |

</details>

---

<details>

<summary style="cursor:pointer">Parameters</summary>

| Parameter | Type     | Default | Description                 |
|-----------|----------|---------|-----------------------------|
| `callback`| `TimerHandler<T>` | - | The function to call when the timer elapses. |
| `options` | `TimerOptions<T>` | - | (Optional) An object defining custom timer options. |
| `options.delay` | `number` | `1` | The number of milliseconds to wait before calling the `callback`. |
| `options.args` | `T` | - | Optional arguments to pass when the `callback` is called. |
| `options.autoplay` | `boolean` | `true` | Indicates whether auto start the timer. |
| `options.updateState` | `boolean` | `false` | Whether to update React state about Timer running status. |
| `options.runOnStart` | `boolean` | `false` | Indicates whether to execute the callback when timer starts. |

</details>

---

<details>

<summary style="cursor:pointer">Returns</summary>

Type: `TimerReturnType | StateTimerReturnType`

An object with timer utilities.

- start: `StartTimer` - Manually start the timer.
- stop: `StopTimer` - Manually stop the timer.

If `updateState` is set to `true` then the following property is added in the returned object.

- isActive: `boolean` - Indicates whether the timer is active.

</details>

---

<details>

<summary style="cursor:pointer">Usage</summary>

##### Basic usage

```tsx
'use client'

import { useCallback } from 'react'
import { useInterval } from '@alessiofrittoli/react-hooks'

const MyComponent: React.FC = () => {

  const { stop } = useInterval( useCallback( () => {
    console.log( 'tick timer' )
  }, [] ), { delay: 1000 } )

  return (
    <button onClick={ stop }>Stop timer</button>
  )

}
```

---

##### Rely on state updates

```tsx
'use client'

import { useCallback } from 'react'
import { useInterval } from '@alessiofrittoli/react-hooks'

const MyComponent: React.FC = () => {

  const { isActive, start, stop } = useInterval( useCallback( () => {
    console.log( 'tick timer' )
  }, [] ), {
    delay       : 1000,
    autoplay    : false,
    runOnStart  : true,
    updateState : true,
  } )

  return (
    <>
      { ! isActive && (
        <button onClick={ start }>Start timer</button>
      ) }
      { isActive && (
        <button onClick={ stop }>Stop timer</button>
      ) }
    </>
  )

}
```

</details>

---

#### `useIntervalWhenVisible`

Schedules repeated execution of `callback` every `delay` milliseconds when `Document` is visible.

This hook automatically starts and stops the interval based on the `Document` visibility.

This hook has the same API of [`useInterval`](#useinterval) and automatically starts and stops timers based on `Document` visibility.
Refer to [`useInterval`](#useinterval) API Reference for more info.

---

#### `useLightInterval`

Schedules repeated execution of `callback` every `delay` milliseconds.

This is a lighter version of [`useInterval`](#useinterval) and is suggested to use when a basic functionality is enough (no manual start/stop or state updates).

<details>

<summary style="cursor:pointer">Type Parameters</summary>

| Parameter | Description              |
|-----------|--------------------------|
| `T`       | An Array defining optional arguments passed to the `callback`. |

</details>

---

<details>

<summary style="cursor:pointer">Parameters</summary>

| Parameter | Type     | Default | Description                 |
|-----------|----------|---------|-----------------------------|
| `callback`| `TimerHandler<T>` | - | The function to call when the timer elapses. |
| `options` | `BasicTimerOptions<T>` | - | (Optional) An object defining custom timer options. |
| `options.delay` | `number` | `1` | The number of milliseconds to wait before calling the `callback`. |
| `options.args` | `T` | - | Optional arguments to pass when the `callback` is called. |

</details>

---

<details>

<summary style="cursor:pointer">Usage</summary>

```tsx
'use client'

import { useCallback } from 'react'
import { useLightInterval } from '@alessiofrittoli/react-hooks'

const MyComponent: React.FC = () => {

  useLightInterval( useCallback( () => {
    console.log( 'tick timer' )
  }, [] ), { delay: 1000 } )

}
```

</details>

---

#### `useTimeout`

Schedules execution of a one-time `callback` after `delay` milliseconds.

The `callback` will likely not be invoked in precisely `delay` milliseconds.

Node.js makes no guarantees about the exact timing of when callbacks will fire,
nor of their ordering. The callback will be called as close as possible to the
time specified.

When `delay` is larger than `2147483647` or less than `1` or `NaN`, the `delay`
will be set to `1`. Non-integer delays are truncated to an integer.

If `callback` is not a function, a `TypeError` will be thrown.

The `Timeout` is automatically cancelled on unmount.

<details>

<summary style="cursor:pointer">Type Parameters</summary>

| Parameter | Description              |
|-----------|--------------------------|
| `T`       | An Array defining optional arguments passed to the `callback`. |

</details>

---

<details>

<summary style="cursor:pointer">Parameters</summary>

| Parameter | Type     | Default | Description                 |
|-----------|----------|---------|-----------------------------|
| `callback`| `TimerHandler<T>` | - | The function to call when the timer elapses. |
| `options` | `TimerOptions<T>` | - | (Optional) An object defining custom timer options. |
| `options.delay` | `number` | `1` | The number of milliseconds to wait before calling the `callback`. |
| `options.args` | `T` | - | Optional arguments to pass when the `callback` is called. |
| `options.autoplay` | `boolean` | `true` | Indicates whether auto start the timer. |
| `options.updateState` | `boolean` | `false` | Whether to update React state about Timer running status. |
| `options.runOnStart` | `boolean` | `false` | Indicates whether to execute the callback when timer starts. |

</details>

---

<details>

<summary style="cursor:pointer">Returns</summary>

Type: `TimerReturnType | StateTimerReturnType`

An object with timer utilities.

- start: `StartTimer` - Manually start the timer.
- stop: `StopTimer` - Manually stop the timer.

If `updateState` is set to `true` then the following property is added in the returned object.

- isActive: `boolean` - Indicates whether the timer is active.

</details>

---

<details>

<summary style="cursor:pointer">Usage</summary>

##### Basic usage

```tsx
'use client'

import { useCallback } from 'react'
import { useTimeout } from '@alessiofrittoli/react-hooks'

const MyComponent: React.FC = () => {

  const { stop } = useTimeout( useCallback( () => {
    console.log( 'tick timer' )
  }, [] ), { delay: 1000 } )

  return (
    <button onClick={ stop }>Stop timer</button>
  )

}
```

---

##### Rely on state updates

```tsx
'use client'

import { useCallback } from 'react'
import { useTimeout } from '@alessiofrittoli/react-hooks'

const MyComponent: React.FC = () => {

  const { isActive, start, stop } = useTimeout( useCallback( () => {
    console.log( 'tick timer' )
  }, [] ), {
    delay       : 1000,
    autoplay    : false,
    runOnStart  : true,
    updateState : true,
  } )

  return (
    <>
      { ! isActive && (
        <button onClick={ start }>Start timer</button>
      ) }
      { isActive && (
        <button onClick={ stop }>Stop timer</button>
      ) }
    </>
  )

}
```

</details>

---

#### `useLightTimeout`

Schedules execution of a one-time `callback` after `delay` milliseconds.

This is a lighter version of [`useTimeout`](#usetimeout) and is suggested to use when a basic functionality is enough (no manual start/stop or state updates).

<details>

<summary style="cursor:pointer">Type Parameters</summary>

| Parameter | Description              |
|-----------|--------------------------|
| `T`       | An Array defining optional arguments passed to the `callback`. |

</details>

---

<details>

<summary style="cursor:pointer">Parameters</summary>

| Parameter | Type     | Default | Description                 |
|-----------|----------|---------|-----------------------------|
| `callback`| `TimerHandler<T>` | - | The function to call when the timer elapses. |
| `options` | `BasicTimerOptions<T>` | - | (Optional) An object defining custom timer options. |
| `options.delay` | `number` | `1` | The number of milliseconds to wait before calling the `callback`. |
| `options.args` | `T` | - | Optional arguments to pass when the `callback` is called. |

</details>

---

<details>

<summary style="cursor:pointer">Usage</summary>

```tsx
'use client'

import { useCallback } from 'react'
import { useLightTimeout } from '@alessiofrittoli/react-hooks'

const MyComponent: React.FC = () => {

  useLightTimeout( useCallback( () => {
    console.log( 'tick timer' )
  }, [] ), { delay: 1000 } )

}
```

</details>

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
