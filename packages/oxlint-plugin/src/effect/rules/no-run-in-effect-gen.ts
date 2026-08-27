// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban `Effect.run*` and `Runtime.run*` calls inside `Effect.gen`/`Effect.fn`.
 *
 * Running an effect inside a generator drops the ambient context — fibers,
 * services, tracing, and memoized layers. Just `yield*` the child effect;
 * for callback boundaries use `Effect.callback`, for fork use `Effect.forkScoped`
 * (v4 has no bare `Effect.fork`).
 *
 * Explicitly allowed inside gen: `Effect.runForkWith`, `Effect.runPromiseWith`,
 * `Effect.runSyncWith` (they take services explicitly — legitimate at
 * callback boundaries) and `managedRuntime.runX` on identifier callees
 * (can't be discriminated syntactically).
 *
 * The `Effect.run*` half is live on v4: all four names are still exported. The
 * `Runtime.run*` half is not — v4's `Runtime` module has no runners at all — and
 * is kept only so a leftover v3 call still reports.
 *
 * Source: language-service/runEffectInsideEffect, extended for v4.
 */
import { defineRule } from "@oxlint/plugins";

import { AST } from "../sdk.ts";
import { makeEffectContextTracker } from "./_effect-context.ts";

const effectRunMethods = ["runSync", "runPromise", "runFork", "runCallback"];
const runtimeRunMethods = ["runSync", "runPromise", "runFork", "runCallback"];

const EFFECT_RUN_MESSAGE =
  "Avoid Effect.run* inside Effect.gen/fn. `yield*` the child effect, or use Effect.forkScoped for concurrency.";
const RUNTIME_RUN_MESSAGE =
  "Avoid Runtime.run* inside Effect.gen/fn. The ambient context already has your services — `yield*` the child effect.";

export const noRunInEffectGen = defineRule({
  create(context) {
    const tracker = makeEffectContextTracker();
    return {
      CallExpression(node) {
        // Counted first, matching the old `Visitor.merge(tracker, handler)` order.
        tracker.enter(node);
        if (tracker.depth() <= 0) {
          return;
        }
        if (AST.isCallOf(node, "Effect", effectRunMethods)) {
          context.report({ message: EFFECT_RUN_MESSAGE, node });
          return;
        }
        if (AST.isCallOf(node, "Runtime", runtimeRunMethods)) {
          context.report({ message: RUNTIME_RUN_MESSAGE, node });
        }
      },
      "CallExpression:exit"(node) {
        tracker.exit(node);
      },
    };
  },
  meta: {
    docs: {
      description:
        "Running effects inside Effect.gen/fn drops the ambient context. Use yield* instead.",
      recommended: true,
    },
    type: "problem",
  },
});
