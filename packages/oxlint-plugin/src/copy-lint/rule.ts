import { defineRule } from "@oxlint/plugins";
import * as Arr from "effect/Array";
import * as P from "effect/Predicate";

import { scanCustomerCopy } from "./scan.ts";

// Reported on inline strings and JSX text in product code. Customer copy should
// travel through the i18n catalogue, where the calibration test validates it;
// this rule catches mechanism vocabulary, retired customer vocabulary, and
// borrowed status that leak into hardcoded strings and bypass the catalogue.
const messages: Record<string, string> = {
  "borrowed-audit-claim": '"{{match}}" claims an audit that did not happen (docs/06 §8.1).',
  "customer-type-label":
    '"{{match}}" names an internal type in a customer label — the action is ordinary customer language, the numbered label exposes the type (docs/06 §8.1).',
  "institutional-borrowing":
    '"{{match}}" borrows institutional status Siglata does not hold — a Document is not a certificate (docs/06 §8.1).',
  "mechanism-vocabulary":
    'Internal or retired customer word "{{match}}" in customer copy — never in customer-facing text (docs/06 §8.1).',
  "product-name-effect":
    '"{{match}}" names the Effect library — a mechanism detail that stays out of customer copy (docs/06 §8.1).',
  "unresolved-token":
    'Unresolved token "{{match}}" — the worker noun is settled; no locale ships stale substitution syntax (docs/06 §8.1).',
};

const isImportSource = (node: {
  readonly parent?: { readonly type?: string; readonly source?: unknown };
}): boolean =>
  node.parent !== undefined &&
  (node.parent.type === "ImportDeclaration" ||
    node.parent.type === "ExportNamedDeclaration" ||
    node.parent.type === "ExportAllDeclaration" ||
    node.parent.type === "ImportExpression") &&
  "source" in node.parent &&
  node.parent.source === node;

const isObjectKey = (node: {
  readonly parent?: { readonly type?: string; readonly key?: unknown };
}): boolean => node.parent?.type === "Property" && "key" in node.parent && node.parent.key === node;

const isNamedCallArgument = (
  node: {
    readonly parent?: {
      readonly type?: string;
      readonly callee?: {
        readonly type?: string;
        readonly name?: string;
        readonly property?: { readonly type?: string; readonly name?: string };
      };
    };
  },
  name: string,
): boolean =>
  node.parent?.type === "CallExpression" &&
  ((node.parent.callee?.type === "Identifier" && node.parent.callee.name === name) ||
    (node.parent.callee?.type === "MemberExpression" &&
      node.parent.callee.property?.type === "Identifier" &&
      node.parent.callee.property.name === name));

const isTagValue = (node: {
  readonly parent?: {
    readonly type?: string;
    readonly key?: { readonly type?: string; readonly name?: string };
  };
}): boolean =>
  node.parent?.type === "Property" &&
  node.parent.key?.type === "Identifier" &&
  node.parent.key.name === "_tag";

const isInternalRouteLiteral = (node: {
  readonly parent?: {
    readonly type?: string;
    readonly callee?: {
      readonly type?: string;
      readonly name?: string;
      readonly property?: { readonly type?: string; readonly name?: string };
    };
  };
}): boolean =>
  isTagValue(node) ||
  isNamedCallArgument(node, "Href") ||
  isNamedCallArgument(node, "literal") ||
  isNamedCallArgument(node, "navClass") ||
  isNamedCallArgument(node, "r");

const isCopyLiteral = (node: {
  readonly parent?: { readonly type?: string; readonly source?: unknown; readonly key?: unknown };
}): boolean =>
  node.parent === undefined ||
  (!isImportSource(node) && !isObjectKey(node) && !isInternalRouteLiteral(node));

export const copyLintRule = defineRule({
  create(context) {
    // Reporting is the one genuinely effectful step in a lint rule, so it is the
    // only place a side-effecting traversal belongs. Everything upstream of it —
    // finding the violations — is a pure function of the text.
    type ReportedNode = NonNullable<Parameters<typeof context.report>[0]["node"]>;

    const reportAll = (text: string, node: ReportedNode): void => {
      Arr.forEach(scanCustomerCopy(text), (violation) => {
        context.report({
          data: { match: violation.match },
          messageId: violation.ruleId,
          node,
        });
      });
    };

    return {
      JSXText(node) {
        reportAll(node.value, node);
      },
      Literal(node) {
        if (P.isString(node.value) && isCopyLiteral(node)) {
          reportAll(node.value, node);
        }
      },
      TemplateLiteral(node) {
        if (!isCopyLiteral(node)) {
          return;
        }
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
        "Forbid internal and retired customer vocabulary and borrowed institutional status in customer-facing strings.",
      recommended: true,
    },
    messages,
    type: "problem",
  },
});
