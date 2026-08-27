import { definePlugin } from "@oxlint/plugins";
import { accessLayerRule } from "./access-layer/rule.ts";
import { boundedExchangesRule } from "./bounded-exchanges/rule.ts";
import { copyLintRule } from "./copy-lint/rule.ts";
import { designLintRule } from "./design-lint/rule.ts";
import { effectSchemaOnlyRule } from "./effect-schema-only/rule.ts";
import { noRawVitestImportsRule } from "./no-raw-vitest-imports/rule.ts";
import { noWallClockInProgramPathsRule } from "./no-wall-clock-in-program-paths/rule.ts";
import { testClockRule } from "./test-clock/rule.ts";
import { unrunEffectRule } from "./unrun-effect/rule.ts";

// The Siglata house Oxlint plugin. Rules resolve as `siglata/access-layer`,
// `siglata/copy-lint`, `siglata/design-lint`, `siglata/bounded-exchanges`,
// `siglata/effect-schema-only`, `siglata/no-raw-vitest-imports`,
// `siglata/no-wall-clock-in-program-paths`, `siglata/test-clock` and
// `siglata/unrun-effect`; the root vite.config enables each rule on its
// intended surface, and bounded-exchanges also self-scopes to apps/app/src.
export default definePlugin({
  meta: { name: "siglata" },
  rules: {
    "access-layer": accessLayerRule,
    "bounded-exchanges": boundedExchangesRule,
    "copy-lint": copyLintRule,
    "design-lint": designLintRule,
    "effect-schema-only": effectSchemaOnlyRule,
    "no-raw-vitest-imports": noRawVitestImportsRule,
    "no-wall-clock-in-program-paths": noWallClockInProgramPathsRule,
    "test-clock": testClockRule,
    "unrun-effect": unrunEffectRule,
  },
});
