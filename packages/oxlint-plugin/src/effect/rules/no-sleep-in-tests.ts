// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban fixed sleeps in tests.
 *
 * Tests should wait on deterministic synchronization primitives instead of
 * wall-clock delays. Opt out with `effect/no-sleep-in-tests: allow <reason>`.
 */
import { defineRule } from "@oxlint/plugins";
import type { Comment, ESTree } from "@oxlint/plugins";
import * as Option from "effect/Option";
import * as P from "effect/Predicate";

import { AST } from "../sdk.ts";

const allowPattern = /\beffect\/no-sleep-in-tests:\s*allow\s+\S/u;

const isTestFilename = (filename: string): boolean =>
  /\.test\.tsx?$/u.test(filename) || /\/tests\/.*\.[cm]?tsx?$/u.test(filename);

/**
 * The line one edge of a node sits on.
 *
 * Read structurally: `loc` is not on the node types oxlint declares, and
 * `hasProperty` is the exact spelling of the
 * `x != null && typeof x === "object" && "k" in x` guard upstream used.
 */
const edgeLine = function edgeLine(node: unknown, edge: "end" | "start"): Option.Option<number> {
  if (!P.hasProperty(node, "loc")) {
    return Option.none();
  }
  const { loc } = node;
  if (!P.hasProperty(loc, edge)) {
    return Option.none();
  }
  const point = loc[edge];
  if (!P.hasProperty(point, "line") || !P.isNumber(point.line)) {
    return Option.none();
  }
  return Option.some(point.line);
};

/** Does this comment sit on, or immediately above, the reported line — and allow it? */
const allowsLine = function allowsLine(comment: Comment, startLine: number): boolean {
  const endLine = Option.getOrUndefined(edgeLine(comment, "end"));
  if (endLine === undefined) {
    return false;
  }
  if (endLine !== startLine - 1 && endLine !== startLine) {
    return false;
  }
  return allowPattern.test(comment.value);
};

const hasAllowComment = (node: ESTree.Node, comments: readonly Comment[]): boolean =>
  Option.match(edgeLine(node, "start"), {
    onNone: () => false,
    onSome: (startLine) => comments.some((comment) => allowsLine(comment, startLine)),
  });

export const noSleepInTests = defineRule({
  create(context) {
    if (!isTestFilename(context.filename)) {
      return {};
    }

    return {
      CallExpression(node) {
        if (node.callee.type !== "MemberExpression") {
          return;
        }
        const names = Option.getOrUndefined(AST.memberNames(node.callee));
        if (names === undefined) {
          return;
        }
        const [object, property] = names;
        if (property !== "sleep") {
          return;
        }
        if (object !== "Effect" && object !== "Bun") {
          return;
        }
        if (hasAllowComment(node, context.sourceCode.getAllComments())) {
          return;
        }
        context.report({
          message: `Avoid ${object}.sleep(...) in tests. Wait on Deferred, polling helpers, or test controls instead of fixed delays.`,
          node,
        });
      },
    };
  },
  meta: {
    docs: {
      description: "Avoid fixed sleeps in tests. Use deterministic synchronization.",
      recommended: true,
    },
    type: "problem",
  },
});
