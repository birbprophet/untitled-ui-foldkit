import { defineConfig } from "vite-plus";
// The lint spine, five plugin surfaces deep. Counts are exact, not approximate — a
// header that rounds is a header nobody re-checks.
//
//   ultracite/oxlint/core          530 rules over eslint, typescript, unicorn,
//                                  oxc, import, jsdoc, node and promise.
//   oxlint-plugin-effect (cevr)     VENDORED, not depended on — 67 rules in
//                                  `packages/oxlint-plugin/src/effect`, 63 of
//                                  them enforced. Upstream's own recommended set
//                                  is 13 as of 0.6.0: 0.4.0 deleted 47 of the
//                                  original 66 on the argument that oxlint owns
//                                  unconditional syntax while Effect tsgo owns
//                                  type-aware correctness. We keep the deleted
//                                  rules — they are unconditional-syntax rules by
//                                  construction, which is the half that argument
//                                  assigns to oxlint — and track upstream's
//                                  additions: `noTestLifecycleHooks` (0.5.0) and
//                                  `noAs` (0.6.0) are both vendored. `noAs` is
//                                  OFF; see presets.ts for why.
//   @mpsuesser/oxlint-plugin-effect 57 rules, namespaced `mps/*` because it also
//                                  claims `effect/*` and the two would collide.
//                                  This is where the Effect v4 doctrine now
//                                  lives — services over ambient capability,
//                                  Option over null, Match over tag equality.
//   @rikalabs/oxlint-standards      40 of its 85, in the two families below.
//   @foldkit/oxlint-plugin           upstream FoldKit rules, exact-pinned and
//                                  configured explicitly as `foldkit/*` below.
//
// `mps/*` and the vendored `effect/*` set enter the base config at warn and are
// raised to error by the `DRAINED` override, which now names `**/*.ts` and
// `**/*.tsx` — the whole tree. Nothing is left at warn. The ratchet that took
// them there one area at a time has finished; what the two base severities buy
// now is a single place to subtract from, which is what `SILENCED` does.
//
// The bespoke per-repo rules: copy-lint is copy-aware and runs on customer-
// facing app strings; design-lint guards CSS-in-JS in the same surface, while
// `apps/app/tests/stylesheet.test.ts` runs `scanStyleValue` over `app.css`.
//
// copy-lint visits JSX text, string literals, and template literals — not
// identifiers or import bindings — so it can cover `apps/app/src` without
// firing on `import * as Effect` or a field named `contentHash`. design-lint
// cannot parse `.css`; Oxlint parses JS/TS only (`design-lint/rule.ts`).
import ultraciteCore from "ultracite/oxlint/core";
import mpsEffect from "@mpsuesser/oxlint-plugin-effect";
import { houseDefault as effectHouse } from "oxlint-plugin/effect-presets";

// @rikalabs/oxlint-standards ships 85 house rules under the `@rikalabs/*`
// namespace. We adopt two families by name (every id below is verified present
// in the pinned plugin, so no "rule not found" pruning is needed):
// `no-hardcoded-secrets` is upstream, so its typed-object coverage is guarded by
// `packages/oxlint-plugin/tests/rule-behaviour.test.ts` rather than copied
// into the house plugin. Keep that test when changing the pinned version.
//
//   effect-service-hygiene — the Effect v4 doctrine: tagged errors, no raw
//     promises/async-await/try-catch/throw in services, gen over flatMap
//     chains, no provide/layer in domain or leaf modules. Guards engine code;
//     inert on the DOM app and tooling, which contain no Effect.
//   anti-slop — catches machine slop everywhere: placeholder implementations,
//     commented-out code, hardcoded secrets, TODOs without an issue, anemic
//     errors, copy-pasted exports, low-signal names.
const RIKA_EFFECT_SERVICE_HYGIENE = [
  "effect-no-or-die",
  "effect-no-terminal-runners",
  "effect-prefer-runmain-entrypoint",
  "effect-no-async-inside-sync",
  "effect-no-raw-promises",
  "effect-no-try-catch",
  "effect-no-async-await",
  "effect-no-generic-error-fail",
  "effect-require-tagged-errors",
  "effect-no-throw-in-services",
  "effect-prefer-gen-over-flatmap-chain",
  "effect-no-effect-return-in-map",
  "effect-no-tacit-usage",
  "effect-no-fire-and-forget-fork",
  "effect-no-looped-effects",
  "effect-no-mutable-ref-in-gen",
  "effect-no-promise-service-methods",
  "effect-no-provide-in-domain",
  "effect-no-layer-in-leaf-modules",
  "no-import-then-reexport",
  "no-vague-verbs",
  "no-duplicate-context",
  "no-is-record-helpers",
  "no-as-never",
];
const RIKA_ANTI_SLOP = [
  "no-placeholder-implementation",
  "no-disable-without-rationale",
  "no-todo-without-issue",
  "no-anemic-errors",
  "no-low-signal-public-names",
  "no-generic-module-names",
  "no-identical-branches",
  "no-copy-paste-exports",
  "no-redundant-const-assertion",
  "no-tutorial-comments",
  "no-commented-out-code",
  "no-debug-residue-filenames",
  "no-low-signal-variable-names",
  "no-standalone-classes",
  "no-hardcoded-secrets",
  "no-sql-string-concat",
];
const rikaRules = Object.fromEntries(
  [...RIKA_EFFECT_SERVICE_HYGIENE, ...RIKA_ANTI_SLOP].map((id) => [`@rikalabs/${id}`, "error"]),
);

/**
 * FoldKit's upstream rule set. Keep the ids explicit: its published preset
 * turns these off in test files, while this repository measures every rule
 * against the whole lint surface and records its current severity below.
 */
const foldkitRules: Record<string, "error" | "warn"> = {
  "foldkit/command-binding-matches-name": "error",
  "foldkit/command-define-pascal-const": "error",
  "foldkit/got-prefix-requires-submodel-payload": "error",
  "foldkit/got-submodel-message-name": "error",
  "foldkit/got-wrapper-carries-only-routing": "error",
  "foldkit/keyed-required-for-mapped-rows": "error",
  "foldkit/lazy-view-stable-references": "error",
  "foldkit/mount-factory-must-use-element": "error",
  "foldkit/no-array-index-view-keys": "error",
  "foldkit/no-child-message-construction-in-root": "error",
  "foldkit/no-disabling-dev-guardrails": "error",
  "foldkit/no-duplicate-onmount-per-element": "error",
  // Off at error: Diffusal/ADR-0021 omits this until `h.div([])` typechecks.
  "foldkit/no-empty-children-array": "warn",
  "foldkit/no-empty-object-tagged-call": "error",
  "foldkit/no-hand-rolled-command-struct": "error",
  "foldkit/no-hardcoded-route-strings": "error",
  "foldkit/no-module-level-mutable-state": "error",
  "foldkit/no-noop-message": "error",
  "foldkit/no-raw-dom-event-attributes": "error",
  "foldkit/no-spread-in-evo": "error",
  "foldkit/prefer-callable-message-constructor": "error",
  "foldkit/require-rel-for-external-link": "error",
  "foldkit/selection-submodel-factory-at-module-scope": "error",
  "foldkit/wrap-child-output-in-got-message": "error",
};

/**
 * The mpsuesser set, renamespaced. Warn is the base severity only — the `DRAINED`
 * override below raises every id here to error across the whole tree.
 *
 * Renamespaced because the plugin publishes its rules under `effect/*`, the same
 * prefix cevr's uses — registering both as `effect` would have one silently shadow
 * the other. Derived from its own `recommended` config rather than a hand-copied
 * list, so a rule added upstream arrives rather than being missed.
 */
const mpsRules = Object.fromEntries(
  Object.keys(mpsEffect.configs.recommended.rules).map((id) => [
    id.replace(/^effect\//u, "mps/"),
    "warn",
  ]),
);

/**
 * The vendored Effect set — all 67, at the same base severity as `mps/*`.
 *
 * Warn was the ratchet's starting point, back when the combined surface at error
 * was 1215 violations. The ratchet has finished: `DRAINED` covers the whole tree,
 * so every id here is an error except the one `SILENCED` subtracts.
 */
const effectRules = effectHouse("warn");

/**
 * Where the house rules are errors rather than warnings: everywhere.
 *
 * This began as a list of drained areas, because a warn nobody has to fix decays
 * into a warn nobody reads and 1,647 of them decay into a build that reports
 * nothing. Each area ratcheted as it reached zero. They all have, so the list is
 * now the tree — which also means a new file starts at error instead of
 * inheriting a grace period nobody would remember to end.
 *
 * The only way to reintroduce a violation is deliberately, with a rationale
 * comment that `@rikalabs/no-disable-without-rationale` insists on, or a named
 * override below with its argument written down.
 */
const DRAINED = ["**/*.ts", "**/*.tsx"];

/**
 * House rules the base config turns off outright, with their argument stated at
 * the `rules` block below.
 *
 * Named here so `drainedRules` can subtract them. An override beats a base rule,
 * so without this subtraction the ratchet quietly resurrects every rule that was
 * argued off — which is exactly what it did on the first attempt, turning
 * `noNodeBuiltinImport` back into an error across `tools/` after the base config
 * had disabled it on purpose.
 */
const SILENCED = new Set(["effect/noNodeBuiltinImport"]);

/**
 * The drained areas' rules, at error — the same set, one severity up.
 *
 * Typed as the literal rather than inferred, because `Object.fromEntries` widens
 * "error" to `string` and an override's severity is a literal union.
 */
const drainedRules: Record<string, "error"> = Object.fromEntries(
  Object.keys({ ...effectHouse("warn"), ...mpsRules })
    .filter((id) => !SILENCED.has(id))
    .map((id) => [id, "error"] as const),
);

export default defineConfig({
  fmt: {
    // Three exemptions, one argument each, and all three are files whose bytes
    // something other than a person decides.
    //
    // drizzle-kit owns the exact bytes of its generated migrations and
    // snapshot.json (it diffs them on the next generate), so the formatter must
    // not touch that directory. The rule fixtures are deliberately-bad code laid
    // out to trip exactly one rule apiece, and `rule-behaviour.test.ts` matches the
    // line each report lands on against a `// EXPECT` marker on that same line —
    // reformatting them would move the reports without changing what the rules do.
    //
    // The vendored Effect rules used to be exempt here too, on the argument that
    // reformatting would make diffs against upstream unreadable. That argument
    // does not survive the decision to vendor: upstream deleted 47 of these rules
    // in a patch release, which is why they were copied in the first place, so
    // there is no upstream to stay diffable with. We own them, and code we own is
    // held to the house standard — which is also how a broken import and 76 type
    // errors sat in this directory unnoticed while a comment claimed otherwise.
    // Runtime modules under `packages/loader/src` are generated artifacts —
    // the runner bundle, the SDK bundle, and the Effect tree the isolate ships
    // as path-shaped modules. Formatting them would rewrite files whose whole
    // value is being byte-for-byte what the build emitted.
    // `tools/check-runner-bundle.test.ts` is what checks them.
    ignorePatterns: [
      "**/migrations/**",
      "packages/oxlint-plugin/tests/fixtures/**",
      "**/runner.bundle.js",
      "**/runtime/sdk.bundle.js",
      "**/runtime/effect/**",
      // Astro writes generated ambient types under apps/landing/.astro on build.
      "**/.astro/**",
      // Blume owns its hidden Astro runtime; apps/docs/content is the source.
      "**/.blume/**",
    ],
  },
  lint: {
    categories: { correctness: "error", suspicious: "error" },
    // Rule fixtures are deliberately-bad code whose whole purpose is to be
    // reported by exactly one rule, measured by tests/rule-behaviour.test.ts.
    // Linting them normally would report all of it, every time. Runtime bundles
    // are generated Effect/SDK graphs: thousands of reports about code nobody
    // wrote, checked instead by `tools/check-runner-bundle.test.ts`.
    ignorePatterns: [
      "packages/oxlint-plugin/tests/fixtures/**",
      // The lint spine defines itself here: its spreads and string rule tables
      // are data, and oxlint refuses override-relaxation on the configuring
      // file. Formatting and tsc still cover this module via tsconfig include.
      "vite.config.ts",
    ],
    jsPlugins: [
      { name: "vite-plus", specifier: "vite-plus/oxlint-plugin" },
      { name: "effect", specifier: "oxlint-plugin/effect" },
      { name: "@rikalabs", specifier: "@rikalabs/oxlint-standards/plugin" },
      { name: "siglata", specifier: "oxlint-plugin" },
      { name: "mps", specifier: "@mpsuesser/oxlint-plugin-effect/oxlint" },
      { name: "foldkit", specifier: "@foldkit/oxlint-plugin" },
    ],
    options: { typeAware: true, typeCheck: true },
    overrides: [
      {
        // FIRST, deliberately. A drained area holds the whole set at error, but
        // every override below still gets to relax a specific rule for a specific
        // reason — a test's `Map` double, a build script's `writeFileSync`. Put
        // this last instead and it silently re-enables all of those, turning
        // arguments that were already had into errors nobody agreed to.
        //
        // Order is the entire mechanism: this raises the floor, the rest carve out.
        files: DRAINED,
        rules: drainedRules,
      },
      {
        // A test's lifecycle hooks, where the resource is not an Effect.
        //
        // The rule's argument is good and R26-123 exists because we have already
        // been bitten: `beforeEach`/`afterEach` detach setup from teardown, so a
        // test failing between them leaks whatever was acquired, while an Effect
        // scope ties release to acquisition and runs it regardless. A leaked
        // workerd process is a real problem here.
        //
        // These five sites hold nothing an Effect scope can express:
        // `vi.restoreAllMocks()` is a vitest global, and the `miniflare.dispose()`
        // calls release a runtime deliberately shared by a whole file. Wrapping a
        // shared process in a per-test scope would stand up one workerd instance
        // per test — slower, and no safer.
        //
        // ⚠️ Where the resource IS an Effect, use a scope. This exemption is about
        // vitest globals and file-scoped processes, not a general licence.
        files: ["**/tests/**/*.ts", "**/*.test.ts"],
        rules: { "effect/noTestLifecycleHooks": "off" },
      },
      {
        // Wire shapes stay `Schema.Struct`.
        //
        // `Schema.Class` gives a decoded value an identity — a constructor,
        // `instanceof`, methods — so a domain object is a thing rather than a bag
        // of fields. That is right for a domain object and wrong for these four.
        //
        // A `RevisionManifest` is read from an object store and handed back
        // unchanged; the engine's failure body and query answer are decoded off a
        // transport and passed straight on. Instance semantics on values nobody
        // instantiates buy nothing, and they would break the structural equality
        // between what was written and what is read that the revision compare-and-
        // swap leans on.
        //
        // Named files rather than a glob: a `Schema.Struct` that appears elsewhere
        // should still be argued for. This exemption existed before, was deleted
        // only because cevr dropped the rule in 0.4.0, and came back with the
        // vendoring — its return was an accident, not a new decision.
        //
        // The two Neon files are the same species one transport over. The Neon
        // batch body and a `current_setting` answer are read off the wire,
        // asserted on and dropped; a constructor and `instanceof` on either
        // would be identity for a value nobody keeps.
        files: [
          "packages/db/tests/neon-live.test.ts",
          "packages/loader/tests/determinism.test.ts",
          "packages/loader/tests/run.test.ts",
          "packages/sdk/tests/define.test.ts",
          "packages/store/src/engine.ts",
          "packages/store/src/revision.ts",
        ],
        rules: { "effect/noSchemaStruct": "off" },
      },
      {
        // Tests get a narrow exemption, not a broad one.
        //
        // ⚠️ The three rules that fire hardest here — `noPromiseControlFlowInTests`
        // (182), `noAsyncFunction` (167) and `mps/effect-run-in-body` (166) — are
        // NOT exempt, deliberately. They are aimed at test code specifically: they
        // want `it.effect` from `@effect/vitest`, which is already in the stack,
        // rather than an async function calling `Effect.runPromise`. Turning them
        // off in tests would leave them enforcing nothing anywhere. They are work,
        // not noise, and they are on the ratchet.
        //
        // What IS exempt is the set describing production concerns that do not
        // apply to a test: building a fixture is not a domain model needing
        // Option and Match.
        //
        // Three more were exempt here and are not any more, because the tree
        // reached zero on them without anyone noticing: `avoid-direct-tag-checks`,
        // `no-barrel-imports` and `prefer-namespace-imports` were each measured at
        // 0 findings across every test file. An exemption nothing uses is an
        // exemption that hides the next violation.
        files: ["**/tests/**/*.ts", "**/*.test.ts"],
        rules: {
          // A test constructs fixtures; `Object.entries` over a literal is not the
          // collection handling the rule is written for.
          "mps/avoid-native-object-helpers": "off",
          // Fixture-building loops and length assertions are the test's subject
          // matter, not incidental imperative style.
          "mps/imperative-loops": "off",
          "mps/no-length-comparison": "off",
        },
      },

      {
        // This config names anti-slop rules in string literals and comments, so
        // their word-scanners flag their own definition: `no-hardcoded-secrets`
        // reports the literal `"@rikalabs/no-hardcoded-secrets"` three times over,
        // and `no-placeholder-implementation` reports two of the ids in the
        // `RIKA_ANTI_SLOP` list above. They stay at error everywhere else in the
        // tree.
        //
        // A third anti-slop rule was off here — the one that wants an issue link on
        // a deferred-work comment. It scans comments rather than string literals,
        // and this file has no deferred-work comments, so the only thing it had ever
        // reported was the line that turned it off. An exemption whose sole cause
        // was its own existence, and the reason to measure rather than assume.
        files: ["vite.config.ts"],
        rules: {
          "@rikalabs/no-hardcoded-secrets": "off",
          "@rikalabs/no-placeholder-implementation": "off",
        },
      },
      {
        // The house plugin's pattern and message files name the very vocabulary
        // they forbid (rule ids, prohibited words, substitution tokens), so the
        // word-scanners flag its own definition. The rules stay at error
        // everywhere else.
        files: ["packages/oxlint-plugin/**"],
        rules: {
          "@rikalabs/no-hardcoded-secrets": "off",
          "@rikalabs/no-placeholder-implementation": "off",
          "@rikalabs/no-todo-without-issue": "off",
          // `test-clock` walks an AST generically, by every property of every
          // node. `R.values` wants a `Record`, which an ESTree node union is not,
          // so the replacement this rule names does not typecheck at the one site
          // that needs it.
          "mps/avoid-native-object-helpers": "off",
        },
      },

      {
        // ⚠️ ITS OWN BLOCK, BECAUSE AN OVERRIDE CANNOT SAY "AND TO NOTHING
        // DEEPER". The three rules below were written for the vitest setup file
        // and the comment above them said they "belong to the Postgres setup file
        // named above and to nothing deeper" — but they sat in an override whose
        // `files` also lists `apps/*/src/worker.ts`, so `noAsyncFunction`,
        // `noGlobals` and `avoid-process-env` were switched off for every Worker
        // entrypoint in the repository. An override applies its rules to every
        // entry in its list; the only way to scope them is a list of one.
        //
        // vitest hands the setup file a promise-returning contract and forks its
        // workers only after that promise settles, which is why the async and the
        // single environment write live there.
        //
        // `testing-neon-live.ts` is here because narrowing this block proved it
        // needs the same three — it reads its endpoint from the environment and
        // awaits a live driver. That was not visible while the exemptions were
        // riding on a list that included every Worker: the harness was covered by
        // accident, and the comment claiming "nothing deeper" was already untrue
        // when it was written. Both files are named individually so a third one
        // cannot inherit this silently.
        // `testing-neon.ts` needs only the async one: it replaces the driver's
        // `fetchFunction` hook, whose contract returns a promise, so `async` is
        // how a canned synchronous response becomes one. It is listed here rather
        // than given a fourth block because three named harness files sharing one
        // exemption is legible, and the property that matters — no Worker is in
        // this list — holds either way.
        files: [
          "packages/db/src/testing-postgres-setup.ts",
          "packages/db/src/testing-neon-live.ts",
          "packages/db/src/testing-neon.ts",
        ],
        rules: {
          "effect/noAsyncFunction": "off",
          "effect/noGlobals": "off",
          "mps/avoid-process-env": "off",
        },
      },
      {
        // Better Auth's configuration surface, which is not an Effect program and
        // is not becoming one — the same argument as `containers/**` above, for the
        // same reason.
        //
        // This file imports no `effect/*` module at all, and that is load-bearing:
        // the `@rikalabs` Effect rules activate on files that import Effect, so
        // adding one to satisfy a style rule turns `effect-no-async-await` and
        // `effect-no-raw-promises` ON as ERRORS. Both alternatives were built and
        // measured — the Effect version produced 6 errors, the `.then()` version
        // 14 — so every escape here is strictly worse than the code it replaces.
        //
        // Two of these are contract, not taste. `verifyActiveContext` must answer
        // `ActiveContext | null` because `apps/api/src/authenticated-api.ts` derives
        // `ResolveContext` from its return type. And the `plugins` array cannot
        // become `Match`: Better Auth infers the whole server type from that
        // literal, and a function boundary widens it away — reproduced as a
        // TS2339 on `session.activeOrganizationId`.
        //
        // Named file, not a glob: the rest of `packages/auth/src` is at zero and
        // stays at error.
        files: ["packages/auth/src/auth.ts"],
        rules: {
          "effect/noAsyncFunction": "off",
          "effect/noNewPromise": "off",
          "effect/noReturnInArrow": "off",
          "effect/noReturnNullish": "off",
          "effect/noTernary": "off",
          "mps/prefer-option-over-null": "off",
        },
      },
      {
        // Billing B1 is a pure account/program transition table. The machine
        // returns `Result` for every refusal and takes the clock as a parameter;
        // commercial amounts stay optional fields on configuration objects.
        //
        // Wrapping every optional millis/plan field in `Option` at the domain
        // boundary would force every caller (and the future Drizzle row mapper
        // in B2) through encode/decode with no product gain — the Schema classes
        // already model absence as `Schema.optional`. Ternaries and early
        // returns are the readable form of a transition table; Match over eight
        // phase strings for every exit is ceremony without a discriminator tag.
        //
        // Named file, not a glob: the rest of `packages/billing` stays at error.
        files: ["packages/billing/src/lifecycle.ts", "packages/billing/tests/**/*.ts"],
        rules: {
          "effect/noReturnInArrow": "off",
          "effect/noTernary": "off",
          "eslint/no-nested-ternary": "off",
          "mps/avoid-option-getorthrow": "off",
          "mps/casting-awareness": "off",
          "mps/no-length-comparison": "off",
          "mps/prefer-arr-match": "off",
          "mps/prefer-option-over-null": "off",
        },
      },
      {
        // The loader's one reach for a platform primitive, isolated into a
        // 21-line module so this exemption names a file rather than a rule.
        //
        // Same ground as `packages/storage/src/content-hash.ts`: `Crypto.digest`
        // does not exist — `effect/Crypto` in v4 is randomness only — and SHA-256
        // in a Worker is `crypto.subtle.digest`, which is async, so the `await`
        // follows from the primitive. Both escapes are hard errors:
        // `promise/prefer-await-to-then` and `effect-no-terminal-runners`.
        //
        // Re-check when `effect/Crypto` grows a digest.
        files: ["packages/loader/src/digest.ts", "packages/admission/src/digest.ts"],
        rules: {
          "effect/noAsyncFunction": "off",
          "effect/noGlobals": "off",
        },
      },
      {
        // Program admission is a static text scan plus one shell-out to the house
        // bundler. Character walks over source, temp-dir bundling, and length
        // checks on finding lists are the domain — not Effect collection
        // pipelines over business records. Named files rather than a package
        // glob so the next admission module still opts in.
        files: [
          "packages/admission/src/admit.ts",
          "packages/admission/src/bundle.ts",
          "packages/admission/src/rules.ts",
          "packages/admission/src/surface.ts",
          "packages/admission/tests/**/*.ts",
        ],
        rules: {
          "effect/noExtendsNativeError": "off",
          "effect/noInstanceofSchema": "off",
          "effect/noReturnInArrow": "off",
          "effect/noReturnNullish": "off",
          "effect/noTernary": "off",
          "effect/noThrowStatement": "off",
          "effect/noTryCatch": "off",
          "eslint/complexity": "off",
          "eslint/prefer-destructuring": "off",
          "eslint/prefer-named-capture-group": "off",
          "mps/avoid-direct-tag-checks": "off",
          "mps/avoid-sync-fs": "off",
          "mps/avoid-try-catch": "off",
          "mps/avoid-untagged-errors": "off",
          "mps/casting-awareness": "off",
          "mps/effect-promise-vs-trypromise": "off",
          "mps/effect-run-in-body": "off",
          "mps/imperative-loops": "off",
          "mps/no-length-comparison": "off",
          "mps/prefer-arr-match": "off",
          "mps/prefer-effect-is": "off",
          "mps/prefer-option-over-null": "off",
          "mps/use-command-executor-service": "off",
          "mps/use-filesystem-service": "off",
          "mps/use-path-service": "off",
          "mps/use-temp-file-scoped": "off",
          "mps/yield-in-for-loop": "off",
          "unicorn/custom-error-definition": "off",
        },
      },
      {
        // Fault attribution decides whether a failed compilation is the source's
        // doing or the platform's, and it reads the shape of what the host threw.
        // The host is the subject here, so this file has to build the exact
        // objects Node throws — `new Error` with `status`, `signal`, `code` —
        // and it has to make the compiler genuinely unstartable, which is the
        // process search path and nothing else. The path is swapped inside an
        // `Effect.acquireRelease` and restored whatever the test does.
        files: ["packages/admission/tests/fault-attribution.test.ts"],
        rules: {
          "effect/noGlobals": "off",
          "effect/noNewError": "off",
          "mps/avoid-process-env": "off",
        },
      },
      {
        // Better Auth's persistence contract is the other kind of boundary: it
        // is Promise-shaped and generic in a row type the adapter never sees, so
        // running the Effect and naming the one unprovable crossing belong
        // exactly here. That crossing is confined to `asRow`, and everything the
        // database returns is still validated where Siglata reads it.
        files: ["packages/auth/src/adapter.ts"],
        rules: {
          "@rikalabs/effect-no-provide-in-domain": "off",
          "@rikalabs/effect-no-terminal-runners": "off",
          // Twin of `typescript/no-unsafe-type-assertion` below, on the same
          // crossing. `asRow` has no non-`as` spelling: `as never` is banned by
          // `@rikalabs/no-as-never` and an `any` return by `mps/avoid-any`.
          "mps/casting-awareness": "off",
          // The mpsuesser twin of the rule above — same rule, same argument. This
          // is the third block it was missed in; they are published by different
          // plugins under different names and only one of them gets remembered.
          "mps/effect-run-in-body": "off",
          "typescript/no-unnecessary-type-parameters": "off",
          "typescript/no-unsafe-type-assertion": "off",
        },
      },

      {
        // The adapter contract test joins this group for the same reason and one
        // more: it stands up a real D1 through miniflare to exercise the bound-
        // parameter cap, which SQLite does not have — so it owns a workerd process
        // it must tear down whatever happens (R26-123), and Better Auth's own API
        // is promise-shaped on both sides of it.
        //
        // The Better Auth integration is a third-party boundary whose config
        // options and api responses are broadly/loosely typed, so an unsafe-*
        // type rule fires on that surface even though the SIGLATA-owned code
        // around it stays fully type-safe. That rule stays at error everywhere
        // else; here it is off for the Better Auth boundary files only.
        //
        // ⚠️ This block listed seven more rules and every one of them measured 0:
        // `noGlobals`, `noNewError`, `noThrowStatement`, `noTryCatch`,
        // `no-unsafe-argument`, `no-unsafe-call` and `no-unsafe-member-access`.
        // Their comments described a `new Date(0)`, a fixture guard that throws and
        // a try/finally that these three files no longer contain, and the claim that
        // the unsafe-* family "fires on that surface" was true of exactly one of the
        // four. Only `no-unsafe-assignment` still has anything to report.
        files: [
          "packages/auth/src/auth.ts",
          "packages/auth/tests/adapter-postgres.test.ts",
          "packages/auth/tests/auth-server.test.ts",
        ],
        rules: {
          // The test's Better Auth secret and password are fixtures, not real
          // credentials.
          "@rikalabs/no-hardcoded-secrets": "off",
          "typescript/no-unsafe-assignment": "off",
        },
      },
      {
        // ⚠️ A COMPOSITION ROOT, AND THE ONLY EFFECT PROGRAM IN `tools/` OUTSIDE
        // `local/`. The block above says a future Effect-based tool must opt out
        // deliberately rather than inherit an exemption; this is that opt-out,
        // named as one file and holding the three rules that point at a boundary
        // rather than at domain code — the same argument as `tools/local/serve.ts`.
        //
        // `inherited-gate-verdict.ts` is a CI step. It reads GitHub over HTTP,
        // decides whether the tree `main` just received has already passed this
        // gate, and writes one line to `$GITHUB_OUTPUT`. Its decision is a pure
        // total function and its reads are Effects; what is exempt here is the
        // ten lines at the bottom that build the `FetchHttpClient` layer and run
        // them, which is where a program that is a process has to end.
        files: ["tools/deploy/inherited-gate-verdict.ts"],
        rules: {
          "@rikalabs/effect-no-async-await": "off",
          "@rikalabs/effect-no-provide-in-domain": "off",
          "@rikalabs/effect-no-terminal-runners": "off",
          "mps/effect-run-in-body": "off",
        },
      },
      {
        // ⚠️ A DEV SERVER, NOT PRODUCT CODE, AND THE PLATFORM IT DRIVES IS
        // PROMISE-SHAPED. `tools/local/serve.ts` exists because nothing else can
        // run this application: `bun run dev` is the SPA's Vite server with no
        // proxy, and `apps/api` has no dev script — so the client could not be
        // opened before it was deployed, and the deploy has never succeeded.
        //
        // It earned itself immediately. The first request it served answered
        // `GET /app` with `307 → /`, because the Worker asked the asset service
        // for `/index.html` and Cloudflare canonicalises that to `/`. Every page
        // and every deep link, and an infinite loop on a deployment where `/`
        // redirects to `/app`. No test could see it: a stub that never redirects
        // cannot disagree with a service that does.
        //
        // Miniflare's API and D1's are Promise-based and its config is a plain
        // object literal, so the Effect and key-ordering rules describe a
        // boundary here rather than a choice. Named directory, not a glob over
        // `tools/`, so the rest stays at error.
        // `no-await-in-loop` is off because the loop it names applies database
        // migrations, where each statement depends on the one before it: the
        // sequencing IS the correctness, and the alternatives the rule pushes
        // toward are a `reduce` that `no-array-reduce` then bans. The two rules
        // are mutually exclusive here, and the readable one wins.
        // `serve.ts` adds the rest: it is a composition root that builds a layer
        // and runs it (`effect-run-in-body`, `effect-no-terminal-runners`,
        // `effect-no-provide-in-domain` all describe domain code, and this is the
        // boundary they point at), it reads files with a `try` because a missing
        // asset is the fallback rather than a failure, and it hands workerd's
        // `ExecutionContext` two callbacks that do nothing because nothing here
        // defers work past a response.
        files: ["tools/local/*.ts"],
        rules: {
          "@rikalabs/effect-no-async-await": "off",
          "@rikalabs/effect-no-provide-in-domain": "off",
          "@rikalabs/effect-no-terminal-runners": "off",
          "@rikalabs/effect-no-try-catch": "off",
          "effect/noNewPromise": "off",
          "eslint/no-await-in-loop": "off",
          "eslint/no-empty-function": "off",
          "eslint/sort-keys": "off",
          // `serve.ts` names the one shape it calls on the Worker, whose own
          // types live in a package `tools/` does not depend on. The assertion is
          // three lines at an import boundary; the alternative is workerd's
          // globals over Node's for every script in this directory.
          "mps/avoid-any": "off",
          "mps/effect-promise-vs-trypromise": "off",
          "mps/effect-run-in-body": "off",
          "mps/prefer-effect-fn": "off",
          "typescript/no-unsafe-assignment": "off",
          "typescript/no-unsafe-call": "off",
          "typescript/no-unsafe-type-assertion": "off",
        },
      },
      {
        // The prelude is tested by running it inside a real Dynamic Worker, because
        // every finding it encodes contradicted what its source looks like it does.
        // Miniflare's API and the loaded worker's replies are Promise-based, and the
        // generated prelude is a JavaScript string rather than a module — so the
        // rules about Effect control flow and dynamic globals describe a boundary
        // here rather than a choice.
        files: [
          "packages/loader/tests/isolate.test.ts",
          "packages/loader/tests/prelude.test.ts",
          "tools/measure-global-surface.ts",
        ],
        rules: {
          // `noNewError` and `noThrowStatement` were off here too and reported
          // nothing on any of the three files; the boundary these tests cross turns
          // out to be Promise shape and dynamic globals, not error construction.
          //
          // try/finally is how the measurement tool guarantees it disposes of the
          // workerd process it started, which Effect's scoping would express better
          // but is not available to a standalone script.
          "effect/noTryCatch": "off",
          // The loaded worker replies with JSON whose shape is the test's own
          // probe, decoded at the boundary rather than through a schema.
          "typescript/no-unsafe-type-assertion": "off",
        },
      },

      {
        // A timing assertion under a frozen clock is a test that cannot fail, and
        // the four bounded-time guards in `packages/sdk` are one tidy-up away from
        // becoming exactly that. Scoped to test files: the rule has nothing to say
        // about anything else.
        files: ["**/tests/**/*.ts", "**/*.test.ts"],
        rules: {
          "siglata/test-clock": "error",
        },
      },

      {
        // The same failure one step further along: a bare `it` handed an
        // `Effect.gen(...)` builds a description vitest never runs, so every
        // assertion inside it is unreachable and the case reports green whatever
        // the code does. Two were — `packages/loader/tests/runner.test.ts` and
        // `packages/storage/tests/storage.test.ts` — and both were found only by
        // mutating the code under test and watching the suite stay at 64/64.
        files: ["**/tests/**/*.ts", "**/*.test.ts"],
        rules: {
          "siglata/no-raw-vitest-imports": "error",
          "siglata/unrun-effect": "error",
        },
      },
      {
        // `packages/i18n` is the copy catalogue: JSON message files plus one tiny
        // scope module, and it depends on nothing. That is deliberate and worth
        // keeping — it is the package most likely to be read or vendored by
        // someone who does not want the rest of the stack.
        //
        // `Arr.sort` is the correct answer to this rule everywhere else, and it
        // would mean adding `effect` here to change how one line of one test
        // sorts. The mutation the rule guards against cannot bite at that site:
        // `Object.keys` hands back a fresh array nothing else holds.
        files: ["packages/i18n/**"],
        rules: {
          "mps/prefer-arr-sort": "off",
        },
      },
      {
        // A per-Organization data-access layer exposes one list/find/insert per
        // table; that CRUD symmetry is required structure, not copied slop. The
        // real shared logic lives in `access-kit.ts`, so the near-identical-body
        // scan (meant to catch machine slop) only fires on the irreducible
        // per-table call sites.
        //
        // ⚠️ MEASURED, 2026-08-06, against the then-single `database.ts`.
        // 138 findings: 69 pairs reported both ways over 21 exported functions,
        // every one a single-expression `findOne`/`findMany` wrapper. Two probes
        // against scratch copies with the rule lifted:
        //
        //   Delete one accessor and change nothing else → 138 drops to 118. The
        //   count is QUADRATIC in how many tables the layer exposes, so one new
        //   table with one `find` costs 20 findings and zero copied logic.
        //
        //   Hoist one inline query into a named builder — identical SQL, moved
        //   two lines, sharing nothing → 138 drops to 128. Ten findings vanish
        //   because the function changed stylistic camps. Nothing was extracted.
        //
        // The perverse direction is real too: making that file MORE uniform, by
        // hoisting all 11 inline queries to match the idiom the other 8 already
        // used, would have merged two cliques into one and pushed the count
        // toward 260.
        //
        // Collapsing the accessors would need table and column names as string
        // parameters, which `@rikalabs/no-sql-string-concat` forbids and which
        // would hide the `organizationId` predicate R26-116 requires be visible
        // in each query. Off for the access-layer files; error everywhere else.
        files: [
          "packages/*/src/database.ts",
          "packages/*/src/access-kit.ts",
          "packages/*/src/*-access.ts",
        ],
        rules: {
          "@rikalabs/no-copy-paste-exports": "off",
        },
      },
      {
        // Untitled UI stories are the browser-facing port of the reference
        // library. Their Storybook model uses the deliberate spread and
        // callable-builder forms documented by the component contract.
        files: ["stories/untitled-ui/**/*.ts"],
        rules: {
          "effect/noSpread": "off",
          "foldkit/prefer-callable-message-constructor": "off",
          "mps/require-is-prefix-for-boolean-schema-field": "off",
        },
      },
      {
        files: ["stories/untitled-ui/story.ts"],
        rules: {
          "effect/noNewError": "off",
          "effect/noThrowStatement": "off",
          "mps/avoid-untagged-errors": "off",
        },
      },
      {
        // Vendored house-plugin test suites and this config intentionally sit at
        // the node boundary: they name rules in string literals, read fixtures
        // from disk, and shell out to oxlint. The Effect service doctrine does
        // not apply to tooling that must run before services exist. Upstream
        // carries the same two test-file exemptions; vite.config.ts joins them
        // here because the lint spine itself is defined in this file.
        files: [
          "packages/oxlint-plugin/tests/rule-behaviour.test.ts",
          "packages/oxlint-plugin/tests/copy-lint-scope.test.ts",
          "vite.config.ts",
        ],
        rules: {
          "@rikalabs/effect-no-throw-in-services": "off",
          "effect/noGlobals": "off",
          "effect/noReturnInArrow": "off",
          "effect/noNewError": "off",
          "effect/noThrowStatement": "off",
          "mps/avoid-direct-json": "off",
          "mps/avoid-native-object-helpers": "off",
          "mps/avoid-sync-fs": "off",
          "mps/avoid-untagged-errors": "off",
          "mps/prefer-arr-match": "off",
          "mps/use-command-executor-service": "off",
          "mps/use-filesystem-service": "off",
          "mps/use-path-service": "off",
        },
      },
    ],
    plugins: ultraciteCore.plugins,
    rules: {
      ...ultraciteCore.rules,
      ...effectRules,
      ...rikaRules,
      ...mpsRules,
      ...foldkitRules,
      // `noNodeBuiltinImport` rejects the `node:` imports the toolchain and
      // config legitimately use. Its replacement is sharper anyway: mpsuesser's
      // `mps/avoid-node-imports` and the `use-*-service` family say which Effect
      // service replaces which builtin, rather than banning the prefix.
      "effect/noNodeBuiltinImport": "off",
      // TypeScript allows a value and a type to share an exported name. Oxlint
      // 1.79 reports that valid pair as a redeclaration, so this rule cannot
      // describe the checked tree.
      "eslint/no-redeclare": "off",
      // Effect models errors, schemas, and services as classes (Data.TaggedError,
      // Schema.Class, Context.Tag), and the @rikalabs effect-require-tagged-errors
      // rule above mandates tagged-error classes. Grouping a few related ones in
      // one module is idiomatic, so the one-class-per-file cap is off. The
      // @rikalabs no-standalone-classes rule still catches a class that should be
      // a function.
      "max-classes-per-file": "off",
      "siglata/access-layer": "error",
      "siglata/effect-schema-only": "error",
      // Effect wraps promises in `Effect.promise(() => thunk())` thunks that must
      // NOT be async — the @rikalabs effect-no-async-await rule forbids async and
      // await in Effect code. typescript/promise-function-async would autofix
      // `async` onto those thunks, so the two rules oscillate with no stable
      // fixpoint under `check --fix`. The Effect doctrine wins; this rule is off.
      "typescript/promise-function-async": "off",
      // Effect's data-first combinators — Effect.flatMap(self, fn),
      // Effect.forEach(items, fn), Effect.map(self, fn) — are two-argument calls
      // on a `.flatMap`/`.map`/`.forEach` property, which this unicorn rule
      // misreads as an array method invoked with a `thisArg`. It fires on
      // idiomatic Effect and never on a real array here, so it is off.
      // `Effect.forEach` is not `Array#forEach`, and this rule cannot tell them
      // apart once `mps/no-barrel-imports` has turned `import { Effect }` into
      // `import * as Effect from "effect/Effect"` — every one of its 14 hits is
      // the Effect combinator. Two rules the repo enables disagree; the one
      // arguing from a name it can no longer resolve loses.
      "unicorn/no-array-for-each": "off",
      "unicorn/no-array-method-this-argument": "off",
      // `effect/noSpread` bans `...`; `unicorn/prefer-spread` bans both
      // `Array.from()` and `.concat()`. Between them no spelling of "join these
      // two arrays" is legal, so the pair has no fixpoint — the same defect as
      // `typescript/promise-function-async` above, and resolved the same way. The
      // Effect doctrine wins, so `noSpread` is the one that stays; the Effect
      // helpers (`Arr.appendAll`, `Arr.fromIterable`, `Arr.append`) remain the
      // house spelling and are better than either banned form anyway.
      "unicorn/prefer-spread": "off",
      // `throw-new-error` matches on a callee NAMED like an error, and Effect's
      // error-class constructor is named `Schema.TaggedError` — so the rule
      // "fixes" `class X extends Schema.TaggedError<X>()("X", {...})` into
      // `extends new Schema.TaggedError...`, which fails to typecheck (TS7009:
      // the factory's result is already a class, not a constructable call). It
      // fired 40+ times the day `effect` beta.105 renamed `TaggedErrorClass` to
      // `TaggedError`, and every firing was this false positive. The house error
      // constructors (`Schema.TaggedError`, `Data.TaggedError`) are factories by
      // design, and the Effect rules above already ban native-Error throws, so
      // the rule's true-positive space here is empty. Revisit only if unicorn
      // learns to tell a class factory from a throw site.
      "unicorn/throw-new-error": "off",
      "vite-plus/prefer-vite-plus-imports": "error",
    },
  },
  run: {
    cache: {
      scripts: false,
      tasks: true,
    },
    tasks: {},
    /**
     * ⚠️ A TASK RUNS IN A CLEAN ENVIRONMENT, AND THAT SILENTLY UNDID THE
     * HARNESS'S CI PATH. Vite Task passes through only a small set of common
     * variables — PATH, HOME, CI — so `SIGLATA_TEST_POSTGRES_URL` never reached
     * the test processes `vp run -r test` spawns. The harness saw no named
     * server, started a container instead, and the gate died on
     * `spawn docker ENOENT` inside a Sandbox that has none. Measured by running
     * the same suite two ways in that image: `vp test` directly saw the variable
     * and passed; through `vp run -r test` it did not.
     *
     * Fingerprinted rather than untracked: a different database is a different
     * run, and a cached result from another one is the wrong answer rather than
     * a stale one.
     */
  },
  /**
   * Format what is being committed, before it costs a round trip.
   *
   * `"*"` has covered TypeScript, JSON and Markdown for as long as this
   * repository has been configured, and it works — `vp fmt --check` reports zero
   * drift across 1255 files. Rust had no entry at all. `vp check` is oxfmt,
   * oxlint and tsgo, and not one of the three reads a `.rs` file, so the 33 files
   * under `apps/siglata-cli`, `apps/siglata-desktop/src-tauri` and
   * `crates/installer` were formatted by nothing at commit time. The first thing
   * that looked was `bun run ready:rust`, at `cargo fmt --all -- --check`, by
   * which point the round trip is spent: the agent pushes, the gate goes red on
   * whitespace, and a second dispatch runs the formatter the first could have.
   *
   * STAGED FILES ONLY, and `vp staged` is what makes that true — it hands the
   * task the staged paths and re-stages what the task rewrote, so the commit that
   * lands is the formatted one rather than a commit plus a follow-up nobody
   * makes. Do NOT widen this to a repository-wide `cargo fmt --all`: it would
   * rewrite files no commit touched and collide with every open pull request and
   * every live agent branch.
   *
   * One caveat, measured rather than assumed. Stable rustfmt has no
   * `--skip-children` — it is nightly-only — so formatting a module root such as
   * `lib.rs` also rewrites the modules it declares. A sibling holding unstaged
   * edits therefore comes back formatted in the working tree. Staging `lib.rs`
   * while `args.rs` held unstaged edits confirmed the bounds: the sibling is not
   * committed, `vp staged` restores the rest of the tree without conflict, and
   * the rewrite is the same formatting `ready:rust` demands regardless.
   */
  staged: {
    "*": "vp check --fix",
    // Bare `rustfmt`, with no `--edition` flag, because `rustfmt.toml` pins it.
    // A flag here would be a second copy of the edition to keep in step with
    // Cargo.toml and with the `cargo fmt --all` the gate runs.
  },
  test: {
    /**
     * Root `vp test` is the tools/ suite — repository invariants — plus the
     * migrated runs/tools ledger tests (formerly bun:test). Package suites stay
     * in their own vite configs and run through `vp run -r test`.
     *
     * ⚠️ `.worktrees/**` IS EXCLUDED BECAUSE A CHECKOUT OF THIS REPO INSIDE THIS
     * REPO IS STILL THIS REPO TO A GLOB. A `git worktree` placed under
     * `.worktrees/` carries its own `packages/**` and `apps/**`, so a run from
     * the repository root collects every suite twice — once from the working
     * tree and once from each worktree, at whatever commit that worktree sits
     * on. The second copy fails for reasons that have nothing to do with the
     * change under test: on 2026-08-16 a root run reported
     * `Cannot read properties of undefined (reading 'config')` across ten files,
     * every failing path was under `.worktrees/`, and two sessions spent real
     * time concluding the tree was broken when only the glob was.
     */
    exclude: ["**/node_modules/**", "**/dist/**", "**/.worktrees/**"],
    include: ["tests/**/*.test.ts"],
  },
});
