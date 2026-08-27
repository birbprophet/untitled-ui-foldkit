/**
 * The Effect rule set, vendored and owned here.
 *
 * ⚠️ **These are not our rules by authorship, and the header on each file says so.**
 * They are the union of `oxlint-plugin-effect` 0.2.3 (66 rules) and 0.6.0 (13:
 * eleven newer implementations of rules 0.2.3 also had, plus
 * `no-test-lifecycle-hooks` from 0.5.0 and `no-as` from 0.6.0). Upstream deleted
 * 47 of the 66 in 0.4.0
 * on the argument that oxlint should own unconditional syntax while Effect tsgo
 * owns type-aware correctness. That argument is defensible and we did not take it:
 * the deleted rules encode judgements about Effect code that nothing else in the
 * spine makes, and a dependency that can delete 47 rules in a patch release is not
 * a dependency for a rule set this one is meant to be load-bearing.
 *
 * Owning them means owning their false positives, and that is now enforced rather
 * than hoped for: every rule has a fixture in `../../tests/fixtures/` checked by
 * `rule-behaviour.test.ts`, which runs the real oxlint binary with only that rule
 * enabled and asserts the reported lines equal the annotated ones. That suite
 * exists because an audit found rules here that fired on nothing, rules that fired
 * on far more than they documented, and a directory the type checker had never
 * looked at. A lint rule reporting nothing is indistinguishable from clean code.
 *
 * They are defined with oxlint's own `defineRule`, not the `effect-oxlint` SDK the
 * upstream project used. Only its `AST` and `Scope` helpers remain.
 *
 * Registered as `effect/*`, the prefix the upstream plugin used, so every existing
 * disable comment and override keeps working. `@mpsuesser/oxlint-plugin-effect`
 * stays a dependency under `mps/*` — it is actively maintained by someone else and
 * vendoring it would buy nothing.
 */
import { definePlugin } from "@oxlint/plugins";

import * as rules from "./rules/index.ts";

export default definePlugin({ meta: { name: "effect" }, rules });
