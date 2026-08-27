// Fixture for `effect/noEffectSyncConsole`. Bans a `console.*` call inside
// `Effect.sync` — logging belongs to `Effect.log*`.
import * as Effect from "effect/Effect";

export const logged = Effect.sync(() => console.log("hello")); // EXPECT effect/noEffectSyncConsole

// A sync block with no console call in it.
export const timed = Effect.sync(() => Date.now());
