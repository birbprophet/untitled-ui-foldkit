// Fixture for `effect/noMultipleEffectProvide`. Audited DEAD for the shapes its
// own header advertises — it requires three or more pipe arguments, so the
// two-argument `.pipe(provide, provide)` form never reaches the check, and the
// nested form is not a pipe at all. Expected to FAIL until the rule is fixed.
import * as Effect from "effect/Effect";
import { pipe } from "effect/Function";
import * as Layer from "effect/Layer";

declare const source: Effect.Effect<number>;
declare const first: Layer.Layer<never>;
declare const second: Layer.Layer<never>;

export const method = source.pipe(Effect.provide(first), Effect.provide(second)); // EXPECT effect/noMultipleEffectProvide
export const nested = Effect.provide(Effect.provide(source, first), second); // EXPECT effect/noMultipleEffectProvide
export const bare = pipe(source, Effect.provide(first), Effect.provide(second)); // EXPECT effect/noMultipleEffectProvide

// One provide, with the layers merged up front.
export const merged = source.pipe(Effect.provide(Layer.merge(first, second)));
