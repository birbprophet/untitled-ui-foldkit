import * as Effect from "effect/Effect";
import { describe, it } from "@effect/vitest";
import { assertFalse, assertTrue } from "@effect/vitest/utils";
import { isBareTestCallee, isInertEffectMember } from "../src/unrun-effect/scan.ts";

/**
 * The pure half of `siglata/unrun-effect`.
 *
 * The traversal half needs no unit test for the same reason `test-clock.test.ts`
 * gives: the codebase is the fixture. Changing
 * `packages/loader/tests/runner.test.ts` back to a bare `it` makes this rule
 * report at error — measured 2026-08-03, with the exact message the rule intends:
 * "`it` does not run an Effect, so `Effect.gen` is built and discarded".
 *
 * That is also how the rule came to exist. Two cases in this repo were written
 * with a bare `it` around an `Effect.gen`, and both passed forever: replacing the
 * guard one of them exercised with a version that provably accepted the forgery
 * left the suite at `64 passed (64)`. Nothing about a green suite distinguishes a
 * test that verified something from a test that never ran.
 */

describe("which callees run what they are handed", () => {
  it.effect("names the bare test declarations", () =>
    Effect.sync(() => {
      assertTrue(isBareTestCallee("it"));
      assertTrue(isBareTestCallee("test"));
      assertTrue(isBareTestCallee("bench"));
    }),
  );

  it.effect("says nothing about the suite-level forms, which take a body of statements", () =>
    Effect.sync(() => {
      // `describe`'s callback is not awaited either, but it registers cases rather
      // than asserting, so an Effect there would be a different mistake.
      assertFalse(isBareTestCallee("describe"));
      assertFalse(isBareTestCallee("beforeEach"));
    }),
  );
});

describe("which Effect members leave a description behind", () => {
  it.effect("treats the combinators as inert — nothing runs them", () =>
    Effect.sync(() => {
      assertTrue(isInertEffectMember("Effect", "gen"));
      assertTrue(isInertEffectMember("Effect", "fn"));
      assertTrue(isInertEffectMember("Effect", "succeed"));
      assertTrue(isInertEffectMember("Effect", "flip"));
    }),
  );

  it.effect("exempts the runners that hand vitest something it awaits or evaluates", () =>
    Effect.sync(() => {
      // A false positive here would fire on a test that WORKS: `it("…", () =>
      // Effect.runPromise(program))` returns a real promise and vitest awaits it.
      assertFalse(isInertEffectMember("Effect", "runPromise"));
      assertFalse(isInertEffectMember("Effect", "runSync"));
      assertFalse(isInertEffectMember("Effect", "runPromiseExit"));
      assertFalse(isInertEffectMember("Effect", "runPromiseWith"));
    }),
  );

  it.effect("does NOT exempt runFork or runCallback — neither is awaited", () =>
    Effect.sync(() => {
      // Measured 2026-08-03: `runFork` answers an object and `runCallback` a
      // function, and vitest awaits neither. A bare `it` returning one finishes
      // before the work it started, so its assertions are exactly as unreachable
      // as an un-run `Effect.gen`. These were exempt in the first version of this
      // set, which put a false negative inside the rule's own remit.
      assertTrue(isInertEffectMember("Effect", "runFork"));
      assertTrue(isInertEffectMember("Effect", "runForkWith"));
      assertTrue(isInertEffectMember("Effect", "runCallback"));
    }),
  );

  it.effect("does not fire on a same-named member of something else", () =>
    Effect.sync(() => {
      // `Stream.gen` and `Layer.succeed` are not what this rule is about, and a
      // rule enforced at error must not guess.
      assertFalse(isInertEffectMember("Stream", "gen"));
      assertFalse(isInertEffectMember("Layer", "succeed"));
    }),
  );
});
