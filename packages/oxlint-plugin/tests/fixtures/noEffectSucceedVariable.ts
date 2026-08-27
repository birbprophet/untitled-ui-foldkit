// Fixture for `effect/noEffectSucceedVariable`. Bans `Effect.succeed(someVar)`
// where the argument is a plain identifier.
import * as Effect from "effect/Effect";

declare const config: { readonly value: number };

const value = 1;
export const wrapped = Effect.succeed(value); // EXPECT effect/noEffectSucceedVariable

// `undefined` is an identifier too, but it belongs to `noEffectSucceedVoid`.
// This rule should stay silent here; today it does not.
export const nothing = Effect.succeed(undefined);

// A member expression is not a plain identifier.
export const nested = Effect.succeed(config.value);
