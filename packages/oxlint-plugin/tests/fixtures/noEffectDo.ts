// Fixture for `effect/noEffectDo`. Bans the `Effect.Do` builder entry point.
import * as Effect from "effect/Effect";

export const started = Effect.Do; // EXPECT effect/noEffectDo

// A different member of the same namespace.
export const empty = Effect.void;
