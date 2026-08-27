// Fixture for `effect/noRunInEffectGen`. Bans `Effect.run*` inside an
// `Effect.gen`/`Effect.fn` body, where running drops the ambient context.
import * as Effect from "effect/Effect";

declare const source: Effect.Effect<number>;

export const inside = Effect.gen(function* () {
  const value = Effect.runSync(source); // EXPECT effect/noRunInEffectGen
  return yield* Effect.succeed(value);
});

// Running at the edge, outside any generator, is what run* is for.
export const edge = Effect.runSync(source);
