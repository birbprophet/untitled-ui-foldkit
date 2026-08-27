// Fixture for `effect/noEffectInOrElseSucceed`. Bans a fallback thunk that contains
// a sequencing combinator (flatMap/tap/andThen/...).
//
// Ported from v3, where the rule matched `Effect.orElse` — a name Effect 4 removed
// entirely, leaving `orElseSucceed` as the only survivor of the family. The
// laddering the rule was named for has no v4 form; what `orElseSucceed` can still
// hold is a sequencing chain in a slot that wants a plain success value, which
// silently yields `Effect<Effect<…>>`. `leftover` pins that the v3 name still
// reports; fixtures are excluded from `tsconfig.json`, so it can be written out.
import * as Effect from "effect/Effect";

declare const source: Effect.Effect<number, string>;

export const nested = source.pipe(
  Effect.orElseSucceed(() => Effect.flatMap(source, (n) => Effect.succeed(n))), // EXPECT effect/noEffectInOrElseSucceed
);

export const leftover = source.pipe(
  Effect.orElse(() => Effect.flatMap(source, (n) => Effect.succeed(n))), // EXPECT effect/noEffectInOrElseSucceed
);

// A fallback that is a value, which is what the slot is for.
export const terminal = source.pipe(Effect.orElseSucceed(() => 0));
