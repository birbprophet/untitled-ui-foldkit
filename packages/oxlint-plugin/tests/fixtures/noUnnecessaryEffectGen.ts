// Fixture for `effect/noUnnecessaryEffectGen`. Bans an `Effect.gen` whose whole
// body is `return yield* effect` — the effect can be used directly.
import * as Effect from "effect/Effect";

declare const source: Effect.Effect<number>;

export const wrapped = Effect.gen(function* () { // EXPECT effect/noUnnecessaryEffectGen
  return yield* source;
});

// Two statements, so the generator is earning its keep.
export const useful = Effect.gen(function* () {
  const value = yield* source;
  return value + 1;
});
