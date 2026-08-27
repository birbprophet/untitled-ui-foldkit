// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban `Option.as`.
 *
 * Use `Option.map` or `Option.match` with explicit value return.
 *
 * Source: biome-effect-linting-rules/no-option-as
 */
import { defineRule } from "@oxlint/plugins";
import { AST } from "../sdk.ts";
import * as Option from "effect/Option";

const message = "Avoid Option.as. Use Option.map or Option.match instead.";

export const noOptionAs = defineRule({
  create(context) {
    return {
      MemberExpression(node) {
        // Static `Option.as` only — `AST.matchMember` rejects a computed member,
        // exactly as the `Rule.banMember` helper this replaces did.
        if (Option.isNone(AST.matchMember(node, "Option", "as"))) {
          return;
        }
        context.report({ message, node });
      },
    };
  },
  meta: {
    docs: { description: message, recommended: true },
    type: "suggestion",
  },
});
