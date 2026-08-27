import { Rule } from "effect-oxlint";
import type { CreateRule, ESTree } from "effect-oxlint";

const message =
  "Program paths cannot read ambient time or entropy; use the pinned Run time or seeded Effect Random.";

const dateNow = Rule.banMember("Date", "now", { message, meta: { type: "problem" } });
const mathRandom = Rule.banMember("Math", "random", { message, meta: { type: "problem" } });

/** Ban both ambient sources while keeping the rule as one Program-path policy. */
export const noWallClockInProgramPathsRule: CreateRule = {
  create(context) {
    const dateVisitor = dateNow.create(context);
    const randomVisitor = mathRandom.create(context);
    return {
      MemberExpression(node: ESTree.MemberExpression) {
        dateVisitor.MemberExpression?.(node);
        randomVisitor.MemberExpression?.(node);
      },
    };
  },
  meta: {
    docs: {
      description: "Forbid Date.now and Math.random on Program execution paths.",
      recommended: true,
    },
    type: "problem",
  },
};
