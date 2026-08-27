/**
 * The rule-authoring SDK the vendored rules are written against.
 *
 * One module so 68 rules import one path. Upstream vendored this SDK into its own
 * tree; we depend on the published `effect-oxlint` instead, because it is
 * maintained separately and by someone else — vendoring the rules is about owning
 * the *policy*, not about owning a framework somebody else keeps current.
 *
 * Named rather than `export *`: the star pulls the package's whole module graph
 * through this one file, which `oxc/no-barrel-file` counts (109 modules) and
 * which makes every rule's import a load of the entire SDK.
 *
 * Down to two. Every rule now defines itself with oxlint's own `defineRule`, so
 * `Rule`, `Diagnostic`, `RuleContext`, `Visitor` and `Plugin` are gone — the
 * rule-authoring framework is no longer someone else's. What is left is AST
 * matching (`AST.isCallOf`, `AST.isMember`, `AST.narrow`) used by 50 rules and
 * one scope lookup: utilities, not a framework.
 *
 * Deliberately NOT vendored, and this is the decision rather than an oversight.
 * The reason for vendoring was that upstream deleted 47 RULES in a patch release
 * — a policy risk. `narrow`, `isCallOf`, `memberNames` and the rest are thin
 * wrappers over node shapes, they carry no judgement about how Effect code should
 * be written, and every one of them is exercised indirectly by the 66 fixtures in
 * `../../tests/fixtures/`. If a release breaks one, that suite goes red the same
 * day. Owning the rules was the point; owning `narrow` is not.
 */
export { AST, Scope } from "effect-oxlint";
