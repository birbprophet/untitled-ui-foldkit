// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban `new Error()` inside Effect catch handlers.
 *
 * Catches: `.catch(e => new Error(...))`, `.catchTag('X', e => new Error(...))`
 * Use Schema.TaggedError or Data.TaggedError instead.
 *
 * Source: language-service/globalErrorInEffectCatch
 *
 * The vendored list was v3's. `catch`, `catchIf`, `catchCauseIf`, `catchTag`,
 * `catchTags` and `catchDefect` survive into v4 unchanged, so the rule was never
 * fully dead — but `catchAll`/`catchAllCause` are gone, and v4's `catchCause`,
 * `catchCauseFilter`, `catchEager`, `catchFilter`, `catchNoSuchElement`,
 * `catchReason` and `catchReasons` were missing. Names verified against the
 * installed `effect@4.0.0-beta.102`. The v3 names stay for a tree mid-migration.
 */
import { defineRule } from "@oxlint/plugins";
import type { ESTree } from "@oxlint/plugins";
import { AST } from "../sdk.ts";
import * as Arr from "effect/Array";
import * as Option from "effect/Option";
import * as P from "effect/Predicate";

const nativeErrors = new Set([
  "Error",
  "TypeError",
  "RangeError",
  "ReferenceError",
  "SyntaxError",
  "URIError",
  "EvalError",
]);

/**
 * Every combinator whose last argument is a recovery handler.
 *
 * The v4 surface first, then the two v3 names that outlived their module. Each
 * of these takes the handler last in both the data-first and the data-last form,
 * which is what `nativeErrorCallback` relies on.
 */
const catchMethods = new Set([
  "catch",
  "catchCause",
  "catchCauseFilter",
  "catchCauseIf",
  "catchDefect",
  "catchEager",
  "catchFilter",
  "catchIf",
  "catchNoSuchElement",
  "catchReason",
  "catchReasons",
  "catchTag",
  "catchTags",
  // Effect 3 spellings, kept so a leftover still reports.
  "catchAll",
  "catchAllCause",
]);

/** An ESTree node, as far as this rule needs to know. */
const isNode = (candidate: unknown): candidate is ESTree.Node =>
  P.hasProperty(candidate, "type") && P.isString(candidate.type);

/** A named field of a node, present or absent. */
const fieldOf = function fieldOf(node: ESTree.Node, name: string): Option.Option<unknown> {
  if (P.hasProperty(node, name)) {
    return Option.some(node[name]);
  }
  return Option.none();
};

const isNativeErrorNew = (node: ESTree.Node): boolean =>
  Option.isSome(
    Option.filter(
      AST.narrow(node, "NewExpression"),
      (expression) =>
        expression.callee.type === "Identifier" && nativeErrors.has(expression.callee.name),
    ),
  );

const isNativeErrorNode = (candidate: unknown): boolean =>
  isNode(candidate) && isNativeErrorNew(candidate);

/** The one statement a block holds, when it holds exactly one. */
const soleStatement = function soleStatement(block: ESTree.Node): Option.Option<ESTree.Node> {
  const statements = Option.getOrUndefined(fieldOf(block, "body"));
  if (!Arr.isArray(statements) || statements.length !== 1) {
    return Option.none();
  }
  return Option.filter(Arr.head(statements), isNode);
};

/**
 * Check if a function body returns `new Error(...)`.
 */
const bodyReturnsNativeError = function bodyReturnsNativeError(fn: ESTree.Node): boolean {
  const body = Option.getOrUndefined(fieldOf(fn, "body"));
  if (!isNode(body)) {
    return false;
  }
  // Arrow expression body: (e) => new Error(...)
  if (body.type !== "BlockStatement") {
    return isNativeErrorNew(body);
  }
  // Block body: (e) => { return new Error(...) }
  return Option.exists(
    Option.filter(soleStatement(body), (statement) => statement.type === "ReturnStatement"),
    (statement) => Option.exists(fieldOf(statement, "argument"), isNativeErrorNode),
  );
};

/** The catch callback that hands back a native Error, if this call has one. */
const nativeErrorCallback = (call: ESTree.CallExpression): Option.Option<ESTree.Node> =>
  Option.flatMap(AST.narrow(call.callee, "MemberExpression"), AST.memberNames).pipe(
    Option.filter((names) => names[0] === "Effect"),
    Option.filter((names) => catchMethods.has(names[1])),
    // The callback is the last argument
    Option.flatMap(() => Arr.last(call.arguments)),
    Option.filter(
      (handler) =>
        handler.type === "ArrowFunctionExpression" || handler.type === "FunctionExpression",
    ),
    Option.filter(bodyReturnsNativeError),
  );

export const noGlobalErrorInCatch = defineRule({
  create(context) {
    return {
      CallExpression(node) {
        const handler = Option.getOrUndefined(nativeErrorCallback(node));
        if (handler === undefined) {
          return;
        }
        context.report({
          message:
            "Avoid native Error in Effect catch handler. Use Schema.TaggedError or Data.TaggedError.",
          node: handler,
        });
      },
    };
  },
  meta: {
    docs: {
      description:
        "Avoid native Error in Effect catch handlers. Use Schema.TaggedError or Data.TaggedError.",
      recommended: true,
    },
    type: "suggestion",
  },
});
