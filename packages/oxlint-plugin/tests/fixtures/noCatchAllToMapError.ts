// Fixture for `effect/noCatchAllToMapError`. Bans a `catch` whose callback body
// is nothing but `Effect.fail(...)` — that is `Effect.mapError` written long.
//
// Ported from v3: the rule arrived matching `catchAll`/`catchAllCause`, names
// Effect 4 renamed to `catch`/`catchCause`, so it could not fire on any code in
// this tree. The positives below are the v4 spellings; the v3 names stay matched
// for a tree mid-migration and are pinned by `leftover` so widening the rule
// cannot silently drop them again.
import * as Effect from "effect/Effect";

declare const source: Effect.Effect<number, string>;

export const remapped = source.pipe(
  Effect.catch((error) => Effect.fail({ _tag: "Wrapped" as const, error })), // EXPECT effect/noCatchAllToMapError
);

export const rewrappedCause = source.pipe(
  Effect.catchCause((cause) => Effect.failCause(cause)), // EXPECT effect/noCatchAllToMapError
);

// The v3 spelling, still reported so a leftover is not invisible.
export const leftover = Effect.catchAll(source, (error) => Effect.fail(error)); // EXPECT effect/noCatchAllToMapError

// Recovers with a value instead of re-failing — mapError would be wrong here.
export const recovered = source.pipe(Effect.catch(() => Effect.succeed(0)));
