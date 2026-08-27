// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban `Effect.callback`, the callback bridge.
 *
 * Use `Stream` or structured Effect lifecycles (acquire/use/release).
 *
 * Source: biome-effect-linting-rules/no-effect-async
 *
 * Ported from v3: upstream banned `Effect.async`, which Effect 4 renamed to
 * `Effect.callback` (verified against the installed `effect@4.0.0-beta.102`,
 * which exports `callback` and no `async`). Both names are banned — the v3
 * spelling is not a different operator in v4, it is absent, so a leftover is
 * still worth naming.
 */
import { defineRule } from "@oxlint/plugins";
import { AST } from "../sdk.ts";

/** Both spellings of the callback bridge, so a leftover v3 call still reports. */
const bannedNames = ["async", "callback"];

const message =
  "Avoid Effect.callback (Effect.async in v3). Use Stream or structured Effect lifecycles.";

export const noEffectAsync = defineRule({
  create(context) {
    return {
      MemberExpression(node) {
        // Static members only — `AST.isMember` rejects a computed one, exactly as
        // the `Rule.banMember` helper this replaces did.
        if (AST.isMember(node, "Effect", bannedNames)) {
          context.report({ message, node });
        }
      },
    };
  },
  meta: {
    docs: { description: message, recommended: true },
    type: "suggestion",
  },
});
