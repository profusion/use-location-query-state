import type {
  BaseDecodedState,
  BaseFieldConverters,
  Converter,
  DecodedByFieldConverters,
  EncodedState,
} from '../types.js';

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

export const createFieldBasedConverter = <
  C extends BaseFieldConverters,
  S extends BaseDecodedState = DecodedByFieldConverters<C>,
>(
  converters: C,
): Converter<S> => {
  const getFieldConverter = (fieldName: string) =>
    converters[fieldName] || defaultFieldConverter;
  return {
    encode: (decodedState: S): EncodedState => {
      const params = new URLSearchParams();
      Object.entries(decodedState).forEach(([fieldName, decodedValue]) => {
        params.append(
          fieldName,
          getFieldConverter(fieldName).encode(decodedValue, fieldName),
        );
      });
      return params;
    },
    decode: (encodedState: EncodedState): S =>
      Object.fromEntries(
        Array.from(encodedState).map(([fieldName, encodedValue]) => [
          fieldName,
          getFieldConverter(fieldName).decode(encodedValue, fieldName),
        ]),
      ) as S,
  };
};

export default createFieldBasedConverter;
