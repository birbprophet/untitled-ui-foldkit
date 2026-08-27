// Fixture for `effect/noEffectAsync`. Bans the `Effect.callback` callback bridge.
//
// Ported from v3: the rule banned `Effect.async`, which Effect 4 renamed to
// `Effect.callback`. The v4 name is the positive; the v3 name stays banned so a
// leftover still reports, which `leftover` pins. `Effect.async` no longer type
// checks — the rule matches on the member name alone, and fixtures are excluded
// from `tsconfig.json`, so the dead spelling can still be written out here.
import * as Effect from "effect/Effect";

export const listened = Effect.callback<number>((resume) => { // EXPECT effect/noEffectAsync
  resume(Effect.succeed(1));
});

export const leftover = Effect.async; // EXPECT effect/noEffectAsync

// The structured alternatives are untouched.
export const attempted = Effect.tryPromise(() => Promise.resolve(1));
