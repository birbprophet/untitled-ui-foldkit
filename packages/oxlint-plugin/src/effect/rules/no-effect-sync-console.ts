// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban `console.*` inside `Effect.sync(...)`.
 *
 * Use Effect.log* instead.
 *
 * Source: biome-effect-linting-rules/no-effect-sync-console
 */
import { defineRule } from "@oxlint/plugins";
import type { ESTree } from "@oxlint/plugins";
import { AST } from "../sdk.ts";
import * as Arr from "effect/Array";
import * as Option from "effect/Option";
import * as P from "effect/Predicate";

const consoleMethods = new Set(["log", "warn", "error", "info", "debug", "trace"]);

/** An ESTree node, as far as a generic walk needs to know. */
const isNode = (candidate: unknown): candidate is ESTree.Node =>
  P.hasProperty(candidate, "type") && P.isString(candidate.type);

/** A named field of a node, present or absent — the walk reads several. */
const fieldOf = function fieldOf(node: ESTree.Node, name: string): Option.Option<unknown> {
  if (P.hasProperty(node, name)) {
    return Option.some(node[name]);
  }
  return Option.none();
};

/** A branch of a node is either one child or a list of them. */
const branchesOf = function branchesOf(branch: unknown): readonly unknown[] {
  if (Arr.isArray(branch)) {
    return branch;
  }
  return [branch];
};

const branchesIn = (node: ESTree.Node, name: string): readonly unknown[] =>
  Option.match(fieldOf(node, name), {
    onNone: (): readonly unknown[] => [],
    onSome: branchesOf,
  });

/** Only a list counts here — `arguments` and `expressions` are read as one or not at all. */
const listIn = function listIn(node: ESTree.Node, name: string): readonly unknown[] {
  const found = Option.getOrUndefined(fieldOf(node, name));
  if (Arr.isArray(found)) {
    return found;
  }
  return [];
};

/**
 * `console.log(...)` and friends.
 *
 * Deliberately blind to `computed`: `console[log](...)` counts, exactly as it
 * did before this rule was reshaped.
 */
const isConsoleCall = (node: ESTree.Node): boolean =>
  Option.isSome(
    AST.narrow(node, "CallExpression").pipe(
      Option.flatMap((call) => AST.narrow(call.callee, "MemberExpression")),
      Option.filter(
        (member) => member.object.type === "Identifier" && member.object.name === "console",
      ),
      Option.flatMap((member) => AST.narrow(member.property, "Identifier")),
      Option.filter((property) => consoleMethods.has(property.name)),
    ),
  );

/**
 * Is there a `console.*` call anywhere under this node?
 *
 * A guard-and-recurse function rather than `Match`: matching over an `unknown`
 * input widens the whole pipe to `any`, and a walk that silently returns `any`
 * is one that stops being checked at all.
 */
const containsConsoleCall = function containsConsoleCall(candidate: unknown): boolean {
  if (!isNode(candidate)) {
    return false;
  }
  if (isConsoleCall(candidate)) {
    return true;
  }
  // Recurse into body/arguments
  if (Arr.some(branchesIn(candidate, "body"), containsConsoleCall)) {
    return true;
  }
  if (Option.exists(fieldOf(candidate, "argument"), containsConsoleCall)) {
    return true;
  }
  if (Arr.some(listIn(candidate, "arguments"), containsConsoleCall)) {
    return true;
  }
  if (Option.exists(fieldOf(candidate, "expression"), containsConsoleCall)) {
    return true;
  }
  return Arr.some(listIn(candidate, "expressions"), containsConsoleCall);
};

export const noEffectSyncConsole = defineRule({
  create(context) {
    return {
      CallExpression(node) {
        const offending = AST.narrow(node, "CallExpression").pipe(
          Option.filter((call) => AST.isCallOf(call, "Effect", "sync")),
          Option.filter((call) => Arr.some(call.arguments, containsConsoleCall)),
        );
        if (Option.isSome(offending)) {
          context.report({
            message: "Avoid console.* inside Effect.sync. Use Effect.log, Effect.logWarning, etc.",
            node,
          });
        }
      },
    };
  },
  meta: {
    docs: {
      description: "Avoid console.* inside Effect.sync. Use Effect.log* instead.",
      recommended: true,
    },
    type: "suggestion",
  },
});
