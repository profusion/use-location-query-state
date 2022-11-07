![developed by](https://img.shields.io/badge/developed%20by-profusion-blue)
![npm bundle size](https://img.shields.io/bundlephobia/min/@profusion/use-location-query-state)
![npm](https://img.shields.io/npm/v/@profusion/use-location-query-state)

# @profusion/use-location-query-state

This is a React hook which wraps `React.useState` and `location.search` in a single hook named as `useLocationQueryState`.

Using this hook, you will have the same `[state, setState]` return, but the hook will internally keep your state "in sync" with the page query string.

When called for the first time, the hook will check for the query string and return its values as initial state, optionally you can also pass a initial state as a "fallback", that will be used when there is no querystring at the page URL.

Finally, when you call a `setState`, the page URL will be updated for you.

This way, you can easily have a state, for example, for your pagination, such as `{ page: 5, limit: 10 }` and this state will be reflected in the page URL as `?page=5&limit=10`. With this your users can refresh the page, bookmark, or share a link to the exact location and state they want to share.

## Installing

```
npm i @profusion/use-location-query-state
// or with yarn
yarn add @profusion/use-location-query-state
```

## Basic Usage

```tsx
const INITIAL_STATE = { _page: 0, _limit: 10 };

const FancyComponent = () => {
  const [state, setState] = useLocationQueryState(INITIAL_STATE);

  const handleNextPage = useCallback(() => {
    setState(currentState => ({
      ...currentState,
      _page: currentState._page + 1
    }))
  }, []);

  return (
    <div>
      Showing page: {state._page}

      <button onClick={handleNextPage}>Next page</button>
    </div>
  )
}
```

## Using custom converters

You can customize how your data is encoded/decoded to be stored/retrieved from the page URL.

To control how your state is converted, you can pass a second argument to the hook with your encode and decode functions.

```ts
useLocationQueryState(
  INITIAL_QUERY_STATE,
  {
    decode: (value) => Object.fromEntries(value.entries()),
    encode: (value) => new URLSearchParams(value),
  }
);
```

Your `decode` function receives a `URLSearchParams` and should return it as a plain javascript object.

While your encoder receives your state object and should return it parsed as `URLSearchParams`.

### Field-level converters

You can also set custom converters at field level. In the example above, if you want to "store" your `_page` in the URL as a binary number, and convert it back to decimal when retrieving from URL, you can set a custom converter to this field:

```ts
import createFieldBasedConverter from '@profusion/use-location-query-state/converters/createFieldBasedConverter';

const converter = createFieldBasedConverter({
  _page: {
    decode: (value, fieldName) => parseInt(value, 2),
    encode: (value, fieldName) => value.toString(2),
  },
});

const INITIAL_STATE = { _page: 0, _limit: 10 };

function FancyComponent() {
  const [state, setState] = useLocationQueryState(INITIAL_STATE, converter);
}
```

This `createFieldBasedConverter` receives an object where each key represents a field in your state.

If you don't specify a custom converter for a field, the default converter will be used (`JSON.stringify` and `JSON.parse`). So, in the example above, you won't lose the `_limit` field.

At the field level, your converters will receive the field name as second argument.

### Full example

We provide a full React application as an example of this library usage.

Take a look at our [GitHub repository](github), in `examples/ts-react-router6` directory.

To run it, clone the repository, go to the example app directory and run `yarn && yarn start`.

Open your browser at the URL given by the start command and play around. :smile:

## Building it

1. At the library dir, install dependencies and peer-dependencies:

```
yarn
yarn install-peers
```

2. Then build

```
yarn build
```

We provide both commonjs and esmodules distributions, so you will see these two different distributions under `dist/` directory.

```
dist
├── cjs
└── esm
```

[github]: https://github.com/profusion/use-location-query-state
