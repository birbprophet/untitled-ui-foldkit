// Fixture for `effect/noEffectFnGenerator`. Bans `Effect.fn(function* () {...})`
// called with a bare generator and no trace span name.
import * as Effect from "effect/Effect";

declare const source: Effect.Effect<number>;

export const unnamed = Effect.fn(function* () { // EXPECT effect/noEffectFnGenerator
  return yield* source;
});

// The span-named form is the one the message asks for.
export const named = Effect.fn("named")(function* () {
  return yield* source;
});
