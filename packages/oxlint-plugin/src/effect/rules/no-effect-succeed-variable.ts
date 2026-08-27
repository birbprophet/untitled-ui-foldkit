// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban `Effect.succeed(someVariable)` where the argument is a plain identifier.
 *
 * Suggests selecting a plain value (Option/Match), then running one Effect pipeline.
 *
 * Source: biome-effect-linting-rules/no-effect-succeed-variable
 */
import { defineRule } from "@oxlint/plugins";
import { AST } from "../sdk.ts";
import * as P from "effect/Predicate";

/**
 * The global constants this AST spells as identifiers.
 *
 * `undefined`, `NaN` and `Infinity` parse as `Identifier`, not as literals, so a
 * bare type check on the argument swept them in. `Effect.succeed(undefined)` is
 * `noEffectSucceedVoid`'s to report, and none of the three is a variable whose
 * selection could move out of the pipeline — which is the whole advice here.
 */
const globalConstants = new Set(["undefined", "NaN", "Infinity"]);

/** A bare identifier reference to something that is actually a variable. */
const isIdentifier = (candidate: unknown): boolean =>
  P.hasProperty(candidate, "type") &&
  candidate.type === "Identifier" &&
  P.hasProperty(candidate, "name") &&
  P.isString(candidate.name) &&
  !globalConstants.has(candidate.name);

export const noEffectSucceedVariable = defineRule({
  create(context) {
    return {
      CallExpression(node) {
        if (!AST.isCallOf(node, "Effect", "succeed") || node.arguments.length !== 1) {
          return;
        }
        const [only] = node.arguments;
        if (!isIdentifier(only)) {
          return;
        }
        context.report({
          message:
            "Avoid Effect.succeed(variable). Select value with Option/Match, then run one Effect pipeline.",
          node,
        });
      },
    };
  },
  meta: {
    docs: {
      description:
        "Avoid Effect.succeed with a plain variable. Select value with Option/Match, then run one Effect pipeline.",
      recommended: true,
    },
    type: "suggestion",
  },
});
