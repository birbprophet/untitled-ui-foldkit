// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban `Effect.succeed("...")` with string literal arguments.
 *
 * Return domain values (Option/Either/tagged unions) instead.
 *
 * Source: biome-effect-linting-rules/no-string-sentinel-return
 */
import { defineRule } from "@oxlint/plugins";
import { AST } from "../sdk.ts";
import * as Arr from "effect/Array";
import * as P from "effect/Predicate";

/** A quoted string literal. */
const isQuotedLiteral = (candidate: unknown): boolean =>
  P.hasProperty(candidate, "type") &&
  candidate.type === "Literal" &&
  P.hasProperty(candidate, "value") &&
  P.isString(candidate.value);

/**
 * A template literal that is a string literal in everything but the quote mark.
 *
 * Only an interpolation-free template counts. `` `${x}` `` computes its value at
 * runtime, so it is not a sentinel written into the source — it is the variable
 * case, which belongs to `noEffectSucceedVariable` rather than to this rule.
 */
const isPlainTemplate = (candidate: unknown): boolean =>
  P.hasProperty(candidate, "type") &&
  candidate.type === "TemplateLiteral" &&
  P.hasProperty(candidate, "expressions") &&
  Arr.isArray(candidate.expressions) &&
  Arr.isReadonlyArrayEmpty(candidate.expressions);

/** A string literal, written either way — the backtick spelling is still one. */
const isStringLiteral = (candidate: unknown): boolean =>
  isQuotedLiteral(candidate) || isPlainTemplate(candidate);

export const noEffectSucceedString = defineRule({
  create(context) {
    return {
      CallExpression(node) {
        if (!AST.isCallOf(node, "Effect", "succeed") || node.arguments.length !== 1) {
          return;
        }
        const [only] = node.arguments;
        if (!isStringLiteral(only)) {
          return;
        }
        context.report({
          message:
            "Avoid Effect.succeed with string literals. Use tagged unions, Option, or Either.",
          node,
        });
      },
    };
  },
  meta: {
    docs: {
      description:
        "Avoid Effect.succeed with string literals. Return domain values (tagged unions, Option, Either).",
      recommended: true,
    },
    type: "suggestion",
  },
});
