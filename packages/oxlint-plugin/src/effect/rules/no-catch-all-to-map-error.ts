// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban `Effect.catch(e => Effect.fail(f(e)))` — use `Effect.mapError(f)`.
 *
 * Source: language-service/catchAllToMapError
 *
 * Upstream tagged this `effectVersion: "v3"` and matched only the v3 names, so
 * against `effect@4.0.0-beta.102` it could not fire on anything: v4 renamed
 * `catchAll` to `catch` and `catchAllCause` to `catchCause`. Retargeted to the
 * v4 names with the v3 names kept — a leftover `Effect.catchAll` in a tree
 * mid-migration is the same mistake, and neither v3 name was reused for
 * something else in v4; both are simply gone.
 */
import { defineRule } from "@oxlint/plugins";
import type { ESTree } from "@oxlint/plugins";
import { AST } from "../sdk.ts";
import * as Arr from "effect/Array";
import * as Option from "effect/Option";
import * as P from "effect/Predicate";

/** The recover-from-everything combinators, in both the v4 and the v3 spelling. */
const catchNames = new Set(["catch", "catchAll", "catchAllCause", "catchCause"]);

/** The cause-channel variants, which v4 leaves without a collapsed form. */
const causeCatchNames = new Set(["catchAllCause", "catchCause"]);

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

/**
 * Check if a node is `Effect.fail(...)` or `Effect.failCause(...)`.
 */
const isEffectFailCall = (node: ESTree.Node): boolean =>
  Option.isSome(
    Option.filter(
      AST.narrow(node, "CallExpression"),
      (call) =>
        Option.isSome(AST.matchCallOf(call, "Effect", "fail")) ||
        Option.isSome(AST.matchCallOf(call, "Effect", "failCause")),
    ),
  );

const isEffectFailNode = (candidate: unknown): boolean =>
  isNode(candidate) && isEffectFailCall(candidate);

/** The one statement a block holds, when it holds exactly one. */
const soleStatement = function soleStatement(block: ESTree.Node): Option.Option<ESTree.Node> {
  const statements = Option.getOrUndefined(fieldOf(block, "body"));
  if (!Arr.isArray(statements) || statements.length !== 1) {
    return Option.none();
  }
  return Option.filter(Arr.head(statements), isNode);
};

/**
 * Check if a function body is a single `Effect.fail(...)` expression.
 * Handles: `(e) => Effect.fail(f(e))` and `(e) => { return Effect.fail(f(e)) }`
 */
const bodyIsEffectFail = function bodyIsEffectFail(fn: ESTree.Node): boolean {
  const body = Option.getOrUndefined(fieldOf(fn, "body"));
  if (!isNode(body)) {
    return false;
  }
  // Arrow with expression body: (e) => Effect.fail(f(e))
  if (body.type !== "BlockStatement") {
    return isEffectFailCall(body);
  }
  // Block body with single return: (e) => { return Effect.fail(f(e)) }
  return Option.exists(
    Option.filter(soleStatement(body), (statement) => statement.type === "ReturnStatement"),
    (statement) => Option.exists(fieldOf(statement, "argument"), isEffectFailNode),
  );
};

/** The catch method whose handler only re-fails, if this call is one. */
const rewrappedCatchName = (call: ESTree.CallExpression): Option.Option<string> =>
  Option.flatMap(AST.narrow(call.callee, "MemberExpression"), AST.memberNames).pipe(
    Option.filter((names) => names[0] === "Effect" || names[0] === "_"),
    Option.filter((names) => catchNames.has(names[1])),
    Option.filter(() =>
      Option.isSome(
        // The callback is the last argument
        Arr.last(call.arguments).pipe(
          Option.filter(
            (handler) =>
              handler.type === "ArrowFunctionExpression" || handler.type === "FunctionExpression",
          ),
          Option.filter(bodyIsEffectFail),
        ),
      ),
    ),
    Option.map((names) => names[1]),
  );

/**
 * What to tell the author, per combinator.
 *
 * `catch`/`catchAll` collapse to `Effect.mapError`. The cause variants collapsed
 * to `Effect.mapErrorCause` in v3, and v4 ships no such export — verified
 * against the installed `effect@4.0.0-beta.102`, whose only cause-mapping
 * surface is `matchCause`/`tapCause`. The rewrap is still worth reporting, so
 * those get a message that says what is wrong without naming a function the
 * reader cannot call.
 */
const messageFor = function messageFor(name: string): string {
  if (causeCatchNames.has(name)) {
    return `Effect.${name}(cause => Effect.failCause(f(cause))) only rewraps the cause. Build the cause where it is raised — Effect 4 has no mapErrorCause.`;
  }
  return `Use Effect.mapError instead of Effect.${name}(e => Effect.fail(...)).`;
};

export const noCatchAllToMapError = defineRule({
  create(context) {
    return {
      CallExpression(node) {
        const name = Option.getOrUndefined(rewrappedCatchName(node));
        if (name === undefined) {
          return;
        }
        context.report({ message: messageFor(name), node });
      },
    };
  },
  meta: {
    docs: {
      description: "Use Effect.mapError instead of Effect.catch(e => Effect.fail(f(e))).",
      recommended: true,
    },
    type: "suggestion",
  },
});
