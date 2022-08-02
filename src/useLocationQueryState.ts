import { useLayoutEffect, useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

import { encodeQueryState, decodeQueryState } from './encoder-decoder.js';

import type {
  BaseConverter,
  BaseDecodedState,
  StateTypeOfConverter,
} from './types.js';

const hasSearchParams = (searchParams: URLSearchParams): boolean =>
  !!searchParams.toString();

/**
 * Manages the browser's location query (search) parameters as object providing
 * an API similar to React's useState().
 *
 * @param converter converts between `URLSearchParams` and the desired
 *        state object. There is a helper @ref createConverter that gets
 *        a converter per field, defaults to `JSON.stringify()` and
 *        `JSON.parse()`, but it may be anything, such as a converter based
 *        on [ajv](https://ajv.js.org/) and JSON schema.
 *        Changing this object does NOT invalidate the state, it's kept as a
 *        reference (`useRef()`) and only used when the component is mounted
 *        (`decode`) or `setState()` is called (via `useLayoutEffect()`).
 * @param init if defined will be used as the initial state *if and only if*
 *        there are no searchParams (ie: it's empty).
 * @param options defines how to get and set the URLSearchParams, defaults
 *        to `window.location.search` and `window.history.pushState()`, but
 *        one may use https://reactrouter.com/docs/en/v6/hooks/use-search-params
 *
 * @return tuple with the `state` and the `setState` function, similar to useState()
 *
 * @note a parameter key appearing multiple times will override the previous one,
 *       handle lists with proper converters.
 */
const useLocationQueryState = <
  C extends BaseConverter,
  S extends BaseDecodedState = StateTypeOfConverter<C>,
>(
  init: S | undefined,
  converter: C,
  {
    getSearchParams,
    setSearchParams,
  }: {
    getSearchParams: () => URLSearchParams;
    setSearchParams: (searchParams: URLSearchParams) => void;
  },
): [S, Dispatch<SetStateAction<S>>] => {
  const context = { converter, getSearchParams, setSearchParams };
  const contextRef = useRef(context);
  contextRef.current = context;

  const searchParams = getSearchParams();

  const [state, setState] = useState(
    init && !hasSearchParams(searchParams)
      ? init
      : decodeQueryState<C, S>(converter, searchParams),
  );
  useLayoutEffect(() => {
    const newSearchParams = encodeQueryState<C, S>(
      contextRef.current.converter,
      state,
    );
    contextRef.current.setSearchParams(newSearchParams);
  }, [state]);

  return [state, setState];
};

export default useLocationQueryState;
