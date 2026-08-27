import * as Effect from "effect/Effect";
import { describe, it } from "@effect/vitest";
import { assertFalse, assertTrue, strictEqual } from "@effect/vitest/utils";
import { isFrozenClockRead, isFrozenRunner, liveCounterpart } from "../src/test-clock/scan.ts";

/**
 * The pure half of `siglata/test-clock`.
 *
 * The traversal half has no unit test and does not need one: the four bounded-time
 * guards in `packages/sdk/tests/read/xlsx-robustness.test.ts` are the live fixture.
 * Converting any of them to `it.effect` makes this rule fire at error, which is
 * the whole point — the protection and its test are the same thing.
 *
 * That traversal was wrong when first written and a compiling rule did not reveal
 * it: this AST carries parent back-references, so the walk climbed out of the
 * subtree and crashed oxlint with a stack overflow. It went unnoticed because
 * nothing in the tree invoked it until a probe file with an `it.effect` call
 * existed. A rule that reports nothing looks exactly like a rule that passes.
 */

describe("which runners freeze the clock", () => {
  it.effect("names the two that install a TestContext", () =>
    Effect.sync(() => {
      assertTrue(isFrozenRunner("effect"));
      assertTrue(isFrozenRunner("scoped"));
    }),
  );

  it.effect("leaves the live runners alone — measuring time there is honest", () =>
    Effect.sync(() => {
      assertFalse(isFrozenRunner("live"));
      assertFalse(isFrozenRunner("scopedLive"));
    }),
  );

  it.effect("says nothing about unrelated properties", () =>
    Effect.sync(() => {
      assertFalse(isFrozenRunner("each"));
      assertFalse(isFrozenRunner("skip"));
      assertFalse(isFrozenRunner("layer"));
    }),
  );
});

describe("which reads a TestClock freezes", () => {
  it.effect("catches Effect's Clock", () =>
    Effect.sync(() => {
      assertTrue(isFrozenClockRead("Clock", "currentTimeMillis"));
      assertTrue(isFrozenClockRead("Clock", "currentTimeNanos"));
    }),
  );

  it.effect("does NOT catch Date.now, which TestClock never intercepts", () =>
    Effect.sync(() => {
      // Measured 2026-07-30: under `it.effect`, `Date.now()` advances normally
      // while `Clock.currentTimeMillis` is pinned at 0. Flagging `Date.now` would
      // fire on every test that stamps an id, and this rule is enforced at error.
      assertFalse(isFrozenClockRead("Date", "now"));
      assertFalse(isFrozenClockRead("performance", "now"));
    }),
  );

  it.effect("does not fire on a same-named property of something else", () =>
    Effect.sync(() => {
      assertFalse(isFrozenClockRead("TestClock", "currentTimeMillis"));
      assertFalse(isFrozenClockRead("Clock", "sleep"));
    }),
  );
});

describe("the suggestion", () => {
  it.effect("pairs each frozen runner with its live counterpart", () =>
    Effect.sync(() => {
      strictEqual(liveCounterpart("effect"), "live");
      strictEqual(liveCounterpart("scoped"), "scopedLive");
    }),
  );
});
