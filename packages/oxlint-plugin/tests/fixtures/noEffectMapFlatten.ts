// Fixture for `effect/noEffectMapFlatten`. Bans an `Effect.map` immediately
// followed by an `Effect.flatMap` in the same pipe — the two can be fused.
import * as Effect from "effect/Effect";

declare const source: Effect.Effect<number>;

export const fusable = source.pipe( // EXPECT effect/noEffectMapFlatten
  Effect.map((n) => n + 1),
  Effect.flatMap((n) => Effect.succeed(n * 2)),
);

// `map` followed by something other than `flatMap` is not fusable.
export const kept = source.pipe(
  Effect.map((n) => n + 1),
  Effect.tap((n) => Effect.logInfo(n)),
);
