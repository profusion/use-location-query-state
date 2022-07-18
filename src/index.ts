import { useLayoutEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

export type FieldConverter<T> = {
  decode: (encodedValue: string, fieldName: string) => T;
  encode: (decodedValue: T, fieldName: string) => string;
};

const defaultFieldConverter = {
  decode: (encodedValue: string): unknown => {
    try {
      return JSON.parse(encodedValue);
    } catch (e) {
      return encodedValue;
    }
  },
  encode: (decodedValue: unknown): string => JSON.stringify(decodedValue),
} as const;

type EncodedState = Readonly<URLSearchParams>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BaseDecodedState = Readonly<Record<string, any>>;
export type Converter<S extends BaseDecodedState> = Readonly<{
  encode: (decodedState: S) => EncodedState;
  decode: (encodedState: EncodedState) => S;
}>;

/* eslint-disable @typescript-eslint/no-explicit-any */
type BaseFieldConverters = Readonly<Record<string, FieldConverter<any>>>;
type BaseConverter = Converter<any>;
/* eslint-enable @typescript-eslint/no-explicit-any */

type StateTypeOfConverter<C extends BaseConverter> = C extends Converter<
  infer S
>
  ? S
  : never;

type DecodedByFieldConverters<C extends BaseFieldConverters> = Readonly<
  Partial<{
    [K in Extract<keyof C, string>]: C[K] extends FieldConverter<infer T>
      ? T
      : never;
  }>
>;

const decodeQueryState = <
  C extends BaseConverter,
  S extends BaseDecodedState = StateTypeOfConverter<C>
>(
  { decode }: C,
  searchParams: URLSearchParams
): S => decode(searchParams);

const encodeQueryState = <
  C extends BaseConverter,
  S extends BaseDecodedState = StateTypeOfConverter<C>
>(
  { encode }: C,
  state: S
): URLSearchParams => encode(state);

export const createConverter = <
  C extends BaseFieldConverters,
  S extends BaseDecodedState = DecodedByFieldConverters<C>
>(
  converters: C
): Converter<S> => {
  const getFieldConverter = (fieldName: string) =>
    converters[fieldName] || defaultFieldConverter;
  return {
    encode: (decodedState: S): EncodedState => {
      const params = new URLSearchParams();
      Object.entries(decodedState).forEach(([fieldName, decodedValue]) => {
        params.append(
          fieldName,
          getFieldConverter(fieldName).encode(decodedValue, fieldName)
        );
      });
      return params;
    },
    decode: (encodedState: EncodedState): S =>
      Object.fromEntries(
        Array.from(encodedState).map(([fieldName, encodedValue]) => [
          fieldName,
          getFieldConverter(fieldName).decode(encodedValue, fieldName),
        ])
      ) as S,
  };
};

const defaultConverter = createConverter({});

const hasSearchParams = (searchParams: URLSearchParams): boolean =>
  !!searchParams.toString();

const defaultOptions = {
  getSearchParams: () => new URLSearchParams(window.location.search),
  setSearchParams: (searchParams: URLSearchParams) => {
    const url = new URL(window.location.href);
    url.search = searchParams.toString();
    window.history.pushState({}, "", url);
  },
} as const;

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
  S extends BaseDecodedState = StateTypeOfConverter<C>
>(
  converter: C = defaultConverter as C,
  init?: S,
  {
    getSearchParams = defaultOptions.getSearchParams,
    setSearchParams = defaultOptions.setSearchParams,
  }: {
    getSearchParams?: () => URLSearchParams;
    setSearchParams?: (searchParams: URLSearchParams) => void;
  } = defaultOptions
): [S, Dispatch<SetStateAction<S>>] => {
  const context = { converter, getSearchParams, setSearchParams };
  const contextRef = useRef(context);
  contextRef.current = context;

  const searchParams = getSearchParams();

  const [state, setState] = useState(
    init && !hasSearchParams(searchParams)
      ? init
      : decodeQueryState<C, S>(converter, searchParams)
  );
  useLayoutEffect(() => {
    const newSearchParams = encodeQueryState<C, S>(
      contextRef.current.converter,
      state
    );
    contextRef.current.setSearchParams(newSearchParams);
  }, [state]);

  return [state, setState];
};

export default useLocationQueryState;
