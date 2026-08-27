// Fixture for `effect/noInlineProvide`. Bans `Effect.provide` inside an
// Effect.gen/fn body — layers are supplied at the boundary, not mid-generator.
import * as Effect from "effect/Effect";
import type * as Layer from "effect/Layer";

declare const layer: Layer.Layer<never>;
declare const program: Effect.Effect<number>;

export const deep = Effect.gen(function* () {
  return yield* Effect.provide(program, layer); // EXPECT effect/noInlineProvide
});

// The same call at the boundary, which is where it belongs.
export const atBoundary = Effect.provide(program, layer);
