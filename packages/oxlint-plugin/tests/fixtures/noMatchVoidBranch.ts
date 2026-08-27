// Fixture for `effect/noMatchVoidBranch`. Bans a Match branch whose whole body
// is `Effect.void` — a no-op branch that says nothing about the case it covers.
import * as Effect from "effect/Effect";
import * as Match from "effect/Match";

export const matched = Match.type<string>().pipe(
  Match.when("skip", () => Effect.void), // EXPECT effect/noMatchVoidBranch
  Match.orElse(() => Effect.void), // EXPECT effect/noMatchVoidBranch
);

// A branch that produces a value, and one that fails — both say something.
export const useful = Match.type<string>().pipe(
  Match.when("one", () => Effect.succeed(1)),
  Match.orElse((other) => Effect.fail(other)),
);
