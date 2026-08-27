// Fixture for `effect/noThrowStatement`. Bans every `throw` statement.
import * as Effect from "effect/Effect";

export const boom = (flag: boolean) => {
  if (flag) {
    throw new Error("boom"); // EXPECT effect/noThrowStatement
  }
  return 1;
};

// The same failure as a value: constructed, never thrown.
export const failed = Effect.fail(new Error("boom"));
