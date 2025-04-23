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
- [API Reference](#api-reference)
  - [Browser API](#browser-api)
  - [DOM API](#dom-api)
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
| `key`          | `string`           | - | The storage item key. |
| `initialValue` | `T`                | - | The storage item initial value. |
| `type`         | `local \| session` | local | (Optional) The storage API to use. |

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
// or
import {
  useStorage, useLocalStorage, useSessionStorage
} from '@alessiofrittoli/react-hooks/browser-api'
// or
import {
  useStorage, useLocalStorage, useSessionStorage
} from '@alessiofrittoli/react-hooks/browser-api/storage'
```

---

###### Reading item value from storage

```tsx
'use client'

import { useStorage } from '@alessiofrittoli/react-hooks/browser-api/storage'

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
import { useStorage } from '@alessiofrittoli/react-hooks/browser-api/storage'

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
import { useStorage } from '@alessiofrittoli/react-hooks/browser-api/storage'

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

| Parameter | Type     | Description |
|-----------|----------|-------------|
| `query`   | `string` | A string specifying the media query to parse into a `MediaQueryList`. |

</details>

---

<details>

<summary style="cursor:pointer">Returns</summary>

Type: `boolean`

- `true` if the document currently matches the media query list.
- `false` otherwise.

</details>

---

<details>

<summary style="cursor:pointer">Usage</summary>

###### Importing the hook

```tsx
import { useMediaQuery } from '@alessiofrittoli/react-hooks'
// or
import { useMediaQuery } from '@alessiofrittoli/react-hooks/browser-api'
```

---

###### Check if user device prefers dark color scheme

```tsx
const isDarkOS = useMediaQuery( '(prefers-color-scheme: dark)' )
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

###### Importing the hook

```tsx
import { useIsPortrait } from '@alessiofrittoli/react-hooks'
// or
import { useIsPortrait } from '@alessiofrittoli/react-hooks/browser-api'
```

---

###### Check if user device is in landscape

```tsx
const isLandscape = ! useIsPortrait()
```

</details>

---

#### DOM API

##### `useScrollBlock`

Prevent Element overflow.

<details>

<summary style="cursor:pointer">Parameters</summary>

| Parameter | Type          | Default | Description |
|-----------|---------------|---------|-------------|
| `target`  | `HTMLElement` | `Document.documentElement` | (Optional) The React RefObject target HTMLElement. |

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

###### Importing the hook

```tsx
import { useScrollBlock } from '@alessiofrittoli/react-hooks'
// or
import { useScrollBlock } from '@alessiofrittoli/react-hooks/dom-api'
```

---

###### Block Document Overflow

```tsx
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
