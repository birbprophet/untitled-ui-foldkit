// Fixture for `effect/noFlatmapLadder`. Bans an `Effect.flatMap` whose callback
// body is another `Effect.flatMap`.
import * as Effect from "effect/Effect";

declare const source: Effect.Effect<number>;

export const laddered = Effect.flatMap(source, (a) => // EXPECT effect/noFlatmapLadder
  Effect.flatMap(source, (b) => Effect.succeed(a + b)),
);

// A single flatMap is the shape the rule is asking for.
export const flat = Effect.flatMap(source, (a) => Effect.succeed(a + 1));
