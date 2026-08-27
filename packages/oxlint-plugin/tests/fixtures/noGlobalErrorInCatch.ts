// Fixture for `effect/noGlobalErrorInCatch`. Bans a native `Error` returned from
// an Effect catch handler — the recovery must produce a tagged error.
//
// Ported from v3: the fixture exercised `Effect.catchAll`, a name Effect 4
// removed. `catch` is the v4 spelling, `catchTag` survives unchanged, and the v3
// names stay matched for a tree mid-migration — pinned by `leftover`.
import * as Effect from "effect/Effect";

declare const program: Effect.Effect<number, string>;

export const caught = Effect.catch(program, () => new Error("boom")); // EXPECT effect/noGlobalErrorInCatch
export const tagged = Effect.catchTag(program, "Boom", () => new TypeError("boom")); // EXPECT effect/noGlobalErrorInCatch
export const leftover = Effect.catchAll(program, () => new Error("boom")); // EXPECT effect/noGlobalErrorInCatch

// A tagged failure, and a native Error built somewhere that is not a catch
// handler — neither is this rule's business.
export const recovered = Effect.catch(program, () => Effect.succeed(0));
export const loose = new TypeError("not a catch handler");
