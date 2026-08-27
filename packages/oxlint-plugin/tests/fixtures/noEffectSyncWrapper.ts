// Fixture for `effect/noEffectSyncWrapper`. Flags `Effect.sync(() => call(...))`
// wrapping a single plain function call.
import * as Effect from "effect/Effect";

declare const randomSeed: () => number;
declare const seed: number;

export const wrapped = Effect.sync(() => randomSeed()); // EXPECT effect/noEffectSyncWrapper

// Not a bare call: an expression the sync block genuinely computes.
export const computed = Effect.sync(() => seed + 1);

// `console.*` is deliberately left to noEffectSyncConsole.
export const logged = Effect.sync(() => console.log("hello"));
