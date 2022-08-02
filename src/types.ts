export type EncodedState = Readonly<URLSearchParams>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BaseDecodedState = Readonly<Record<string, any>>;

export type FieldConverter<T> = {
  decode: (encodedValue: string, fieldName: string) => T;
  encode: (decodedValue: T, fieldName: string) => string;
};

export type Converter<S extends BaseDecodedState> = Readonly<{
  encode: (decodedState: S) => EncodedState;
  decode: (encodedState: EncodedState) => S;
}>;

/* eslint-disable @typescript-eslint/no-explicit-any */
export type BaseFieldConverters = Readonly<Record<string, FieldConverter<any>>>;
export type BaseConverter = Converter<any>;

export type StateTypeOfConverter<C extends BaseConverter> = C extends Converter<
  infer S
>
  ? S
  : never;

export type DecodedByFieldConverters<C extends BaseFieldConverters> = Readonly<
  Partial<{
    [K in Extract<keyof C, string>]: C[K] extends FieldConverter<infer T>
      ? T
      : never;
  }>
>;
