// Fixture for `effect/noReturnNullish`. Bans `return null`, `return undefined`,
// and `return void <expr>` — every way of returning a nullish value.
import * as Option from "effect/Option";

export const missing = (flag: boolean) => {
  if (flag) {
    return null; // EXPECT effect/noReturnNullish
  }
  return undefined; // EXPECT effect/noReturnNullish
};

// `void expr` still evaluates to undefined, so returning one is the same
// nullish return written with a side effect attached.
declare const record: (value: number) => number;
export const discarded = () => {
  return void record(1); // EXPECT effect/noReturnNullish
};

// Absence modelled as a value, and a bare `return` that carries no argument.
export const absent = () => Option.none();
export const early = (flag: boolean) => {
  if (flag) {
    return;
  }
  record(1);
};
