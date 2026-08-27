import { defineRule } from "@oxlint/plugins";
import * as Arr from "effect/Array";
import * as P from "effect/Predicate";

import { scanStyleValue } from "./scan.ts";

// Reported on style-bearing strings and template literals (CSS-in-JS, inline
// styles). Oxlint parses JS/TS, not CSS, so raw values living in .css files are
// a separate concern; this rule guards the CSS-in-JS surface.
const messages: Record<string, string> = {
  "box-shadow": "box-shadow is forbidden — no shadow token exists, by law (docs/05 tokens.md §7).",
  margin: "margin is forbidden — spacing is padding and gap only (docs/05 tokens.md §7).",
  "numbers-never-wrap":
    'Wrap re-enabled by "{{match}}" — numbers never wrap; a value abbreviates, it does not wrap (docs/05 components.md).',
  "raw-color":
    'Raw color "{{match}}" — reference a --color token, never a literal (docs/05 tokens.md).',
  "raw-space":
    'Raw length "{{match}}" — reference a --space/--text/--leading token, never a literal px (docs/05 tokens.md).',
  "retired-ink":
    'Retired ink "{{match}}" — a permanent ban, not a variant awaiting a token (docs/05 color.md §2).',
};

export const designLintRule = defineRule({
  create(context) {
    // Reporting is the one genuinely effectful step in a lint rule, so it is the
    // only place a side-effecting traversal belongs. Everything upstream of it —
    // finding the violations — is a pure function of the text.
    type ReportedNode = NonNullable<Parameters<typeof context.report>[0]["node"]>;

    const reportAll = (text: string, node: ReportedNode): void => {
      Arr.forEach(scanStyleValue(text), (violation) => {
        context.report({
          data: { match: violation.match },
          messageId: violation.ruleId,
          node,
        });
      });
    };

    return {
      Literal(node) {
        if (P.isString(node.value)) {
          reportAll(node.value, node);
        }
      },
      TemplateLiteral(node) {
        // Each quasi is reported against itself, so the caret lands on the
        // literal segment that offended rather than on the whole template.
        Arr.forEach(node.quasis, (quasi) => {
          reportAll(quasi.value.cooked ?? quasi.value.raw, quasi);
        });
      },
    };
  },
  meta: {
    docs: {
      description:
        "Forbid raw design values and banned properties in CSS-in-JS; require token references.",
      recommended: true,
    },
    messages,
    type: "problem",
  },
});
