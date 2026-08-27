import * as Arr from "effect/Array";
import * as Effect from "effect/Effect";
import { describe, it } from "@effect/vitest";
import { assertFalse, assertTrue, deepStrictEqual, strictEqual } from "@effect/vitest/utils";
import effectPlugin from "../src/effect/plugin.ts";
import { everything, houseDefault, ruleNames, notEnabledNames } from "../src/effect/presets.ts";

/**
 * The vendored Effect rules, checked as a set.
 *
 * These 67 rules arrived from someone else's repository, and the whole reason for
 * vendoring is that upstream deleted 47 of them in a patch release. That makes
 * *presence* the thing worth testing: a rule that quietly stops being registered,
 * or a preset that quietly stops naming it, is the failure this vendoring exists
 * to prevent — and it would look exactly like a green build.
 *
 * Behavioural tests for individual rules belong beside the rules they cover, using
 * `effect-oxlint/testing`. This file guards the wiring: that every rule in the
 * directory reaches the plugin, and every rule in the plugin reaches a preset.
 */

const EXPECTED_RULE_COUNT = 67;

describe("the vendored rule set", () => {
  it.effect("registers every rule the directory defines", () =>
    Effect.sync(() => {
      // The count is asserted rather than derived, so losing a rule to a bad merge
      // or a missed index entry fails here instead of silently reducing coverage.
      strictEqual(ruleNames().length, EXPECTED_RULE_COUNT);
    }),
  );

  it.effect("registers the rules upstream deleted, which is the point of vendoring", () =>
    Effect.sync(() => {
      // These five were removed in 0.4.0. Each fires on this codebase today —
      // `noSchemaStruct` 6 times, `noReturnNullish` 13, `noStringSentinelConst` 23,
      // `noPromiseControlFlowInTests` 173 — so losing them is losing real signal.
      for (const name of [
        "noCatchAllToMapError",
        "noPromiseControlFlowInTests",
        "noReturnNullish",
        "noSchemaStruct",
        "noStringSentinelConst",
      ]) {
        assertTrue(ruleNames().includes(name), `${name} is missing`);
      }
    }),
  );

  it.effect("registers the rule 0.5.0 added, which the 0.2.3 set alone would miss", () =>
    Effect.sync(() => {
      assertTrue(ruleNames().includes("noTestLifecycleHooks"));
    }),
  );

  it.effect("registers the rule 0.6.0 added, so the set tracks upstream rather than a tag", () =>
    Effect.sync(() => {
      assertTrue(ruleNames().includes("noAs"));
    }),
  );

  it.effect("gives every rule a name and a create function", () =>
    Effect.sync(() => {
      // A rule object that lost its implementation still registers and still
      // reports nothing, which is the quietest way for a lint rule to fail.
      for (const [name, rule] of Object.entries(effectPlugin.rules)) {
        assertTrue("create" in rule, `${name} has no create`);
      }
    }),
  );
});

describe("the presets", () => {
  it.effect("names every registered rule in `everything`", () =>
    Effect.sync(() => {
      // A rule in the plugin but in no preset is enforced nowhere — the exact
      // condition `copy-lint` and `design-lint` were already in.
      strictEqual(Object.keys(everything("warn")).length, EXPECTED_RULE_COUNT);
    }),
  );

  it.effect("omits exactly the rules that were argued off, and no others", () =>
    Effect.sync(() => {
      const house = new Set(Object.keys(houseDefault("warn")));
      const excluded = notEnabledNames();

      strictEqual(house.size, EXPECTED_RULE_COUNT - excluded.length);
      for (const name of excluded) {
        assertFalse(house.has(`effect/${name}`), `${name} should not be in the house default`);
      }
    }),
  );

  it.effect("keeps noAs out of the house default, which upstream's recommended has at error", () =>
    Effect.sync(() => {
      // The one place this set deliberately departs from 0.6.0's `recommended`.
      // The rule reports every `TSAsExpression`, 132 here and 72 of them `as const`,
      // for which `satisfies` is not a replacement. Adopting upstream's preset
      // wholesale would turn it on; this pins the argument in `presets.ts` instead.
      assertFalse(Object.keys(houseDefault("warn")).includes("effect/noAs"));
      assertTrue(Object.keys(everything("warn")).includes("effect/noAs"));
    }),
  );

  it.effect("keeps noTernary enforced, which its author still recommends", () =>
    Effect.sync(() => {
      // The sibling of `noIfStatement`, and deliberately not excused with it: cevr
      // kept it in 0.5.0's recommended, and nested ternaries genuinely do read
      // worse than Match. A future edit that lumps the two together fails here.
      assertTrue(Object.keys(houseDefault("warn")).includes("effect/noTernary"));
    }),
  );

  it.effect("carries the severity it was asked for", () =>
    Effect.sync(() => {
      const severities = new Set(Object.values(houseDefault("error")));

      // `Arr.fromIterable` rather than a spread, which `effect/noSpread` bans.
      deepStrictEqual(Arr.fromIterable(severities), ["error"]);
    }),
  );

  it.effect("prefixes every rule so the ids match the disable comments already in the tree", () =>
    Effect.sync(() => {
      // Registered as `effect/*` deliberately: the upstream plugin used that prefix,
      // and every existing override and inline disable names it. A rename here would
      // silently un-suppress exemptions that were argued for.
      for (const id of Object.keys(everything("warn"))) {
        assertTrue(id.startsWith("effect/"), `${id} is not namespaced`);
      }
    }),
  );
});
