// Fixture for `effect/noEffectMapVoid`. Bans `Effect.map` with a callback that
// only produces `undefined` — that is `Effect.asVoid`.
import * as Effect from "effect/Effect";

declare const source: Effect.Effect<number>;

export const discarded = source.pipe(Effect.map(() => undefined)); // EXPECT effect/noEffectMapVoid
export const blocked = source.pipe(Effect.map(() => {})); // EXPECT effect/noEffectMapVoid

// A map that actually produces a value.
export const doubled = source.pipe(Effect.map((n) => n * 2));
