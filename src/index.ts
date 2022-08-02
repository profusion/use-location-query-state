import type { Dispatch, SetStateAction } from 'react';

import createFieldBasedConverter from './converters/createFieldBasedConverter.js';
import browserWindowLocationOptions from './options/browserWindowLocationOptions.js';
import type {
  BaseConverter,
  BaseDecodedState,
  StateTypeOfConverter,
} from './types.js';
import useLocationQueryState from './useLocationQueryState.js';

const defaultConverter = createFieldBasedConverter({});

const useWrappedLocationQueryState = <
  C extends BaseConverter,
  S extends BaseDecodedState = StateTypeOfConverter<C>,
>(
  init?: S,
  converter: C = defaultConverter as C,
  {
    getSearchParams = browserWindowLocationOptions.getSearchParams,
    setSearchParams = browserWindowLocationOptions.setSearchParams,
  }: {
    getSearchParams?: () => URLSearchParams;
    setSearchParams?: (searchParams: URLSearchParams) => void;
  } = browserWindowLocationOptions,
): [S, Dispatch<SetStateAction<S>>] => {
  return useLocationQueryState(init, converter, {
    getSearchParams,
    setSearchParams,
  });
};

export default useWrappedLocationQueryState;
