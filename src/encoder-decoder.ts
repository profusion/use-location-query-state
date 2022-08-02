import type {
  BaseConverter,
  BaseDecodedState,
  StateTypeOfConverter,
} from './types.js';

export const decodeQueryState = <
  C extends BaseConverter,
  S extends BaseDecodedState = StateTypeOfConverter<C>,
>(
  { decode }: C,
  searchParams: URLSearchParams,
): S => decode(searchParams);

export const encodeQueryState = <
  C extends BaseConverter,
  S extends BaseDecodedState = StateTypeOfConverter<C>,
>(
  { encode }: C,
  state: S,
): URLSearchParams => encode(state);
