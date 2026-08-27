// Fixture for `effect/noEffectGenAdapter`. Bans the deprecated adapter parameter
// on the generator passed to `Effect.gen`.
import * as Effect from "effect/Effect";

declare const source: Effect.Effect<number>;

export const legacy = Effect.gen(function* (_) { // EXPECT effect/noEffectGenAdapter
  return yield* source;
});

// No adapter parameter — `yield*` used directly.
export const modern = Effect.gen(function* () {
  return yield* source;
});
