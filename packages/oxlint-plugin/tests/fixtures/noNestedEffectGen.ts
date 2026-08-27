// Fixture for `effect/noNestedEffectGen`. Bans an inner `Effect.gen` yielded
// straight into an outer generator body — its statements belong in the outer one.
//
// The `Effect.fn` outer case is audited DEAD: the depth counter only tracks
// `Effect.gen`, so a gen nested inside an `Effect.fn` never reaches the check.
// It is annotated anyway, so this fixture FAILS until the tracker counts
// `Effect.fn` too — the doc comment names both.
import * as Effect from "effect/Effect";

export const nested = Effect.gen(function* () {
  yield* Effect.gen(function* () { // EXPECT effect/noNestedEffectGen
    yield* Effect.void;
  });
});

export const nestedInFn = Effect.fn(function* () {
  yield* Effect.gen(function* () { // EXPECT effect/noNestedEffectGen
    yield* Effect.void;
  });
});

// Wrapped in another operator, so the inner gen is an argument rather than a
// body that could be hoisted.
export const scoped = Effect.gen(function* () {
  yield* Effect.scoped(
    Effect.gen(function* () {
      yield* Effect.void;
    }),
  );
});
