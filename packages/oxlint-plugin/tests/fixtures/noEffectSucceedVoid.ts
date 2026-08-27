// Fixture for `effect/noEffectSucceedVoid`. Bans `Effect.succeed(undefined)` and
// `Effect.succeed(void 0)` — both are `Effect.void`.
import * as Effect from "effect/Effect";

export const nothing = Effect.succeed(undefined); // EXPECT effect/noEffectSucceedVoid
export const voided = Effect.succeed(void 0); // EXPECT effect/noEffectSucceedVoid

// A real value, and the idiomatic replacement.
export const counted = Effect.succeed(0);
export const already = Effect.void;
