// Fixture for `effect/noReturnInArrow`. Bans an explicit `return` inside an
// arrow function body — a callback that is one expression should say so.
import * as Schema from "effect/Schema";

export const doubled = (value: number): number => {
  return value * 2; // EXPECT effect/noReturnInArrow
};

// The expression body, and a Schema.filter predicate, where `return` is the
// required shape and the rule steps aside.
export const trebled = (value: number): number => value * 3;
export const NonEmpty = Schema.String.pipe(
  Schema.filter((value) => {
    return value.length > 0;
  }),
);
