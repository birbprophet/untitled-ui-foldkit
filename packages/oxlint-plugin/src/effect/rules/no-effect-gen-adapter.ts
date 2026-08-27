// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban deprecated adapter parameter in `Effect.gen(function*(adapter) {...})`.
 *
 * The adapter parameter is deprecated — just use `yield*` directly.
 *
 * Source: language-service/effectGenUsesAdapter
 *
 * Upstream tagged this `effectVersion: "v3"`. `meta` carries only the fields
 * oxlint knows, so the tag lives here rather than in a field it would discard.
 */
import { defineRule } from "@oxlint/plugins";
import { AST } from "../sdk.ts";
import * as Arr from "effect/Array";
import * as P from "effect/Predicate";

/** `function* (adapter) { ... }` — a generator callback that still takes a parameter. */
const isAdapterGenerator = (candidate: unknown): boolean =>
  P.hasProperty(candidate, "type") &&
  candidate.type === "FunctionExpression" &&
  P.hasProperty(candidate, "generator") &&
  candidate.generator === true &&
  P.hasProperty(candidate, "params") &&
  Arr.isArray(candidate.params) &&
  Arr.isReadonlyArrayNonEmpty(candidate.params);

export const noEffectGenAdapter = defineRule({
  create(context) {
    return {
      CallExpression(node) {
        if (!AST.isCallOf(node, "Effect", "gen")) {
          return;
        }
        const [first] = node.arguments;
        if (!isAdapterGenerator(first)) {
          return;
        }
        context.report({
          message:
            "Deprecated adapter parameter in Effect.gen. Remove the parameter and use `yield*` directly.",
          node,
        });
      },
    };
  },
  meta: {
    docs: {
      description: "Deprecated adapter parameter in Effect.gen. Use `yield*` directly.",
      recommended: true,
    },
    type: "suggestion",
  },
});
