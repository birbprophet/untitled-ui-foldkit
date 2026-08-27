import * as Effect from "effect/Effect";
import { it } from "@effect/vitest";
import { assertTrue, deepStrictEqual } from "@effect/vitest/utils";
import { scanCustomerCopy } from "../src/copy-lint/scan.ts";

// Ruled, accepted copy must pass clean; stale or status-borrowing copy must
// fail. These fixtures are the regression corpus docs/06 §8 requires before a
// copy rule may gate.

const idsFor = (text: string, scope?: "all-customer" | "refusal"): string[] =>
  scanCustomerCopy(text, scope).map((violation) => violation.ruleId);

it.effect("plain product prose passes", () =>
  Effect.sync(() => {
    deepStrictEqual(idsFor("Your monthly report is ready to send."), []);
    deepStrictEqual(idsFor("Seu relatório mensal está pronto para enviar."), []);
  }),
);

it.effect("ordinary English 'effect' is not the product name", () =>
  Effect.sync(() => {
    deepStrictEqual(idsFor("This change takes effect immediately."), []);
  }),
);

// R26-225: `Observation` is contextual in both locales. The word in ordinary
// prose passes; the numbered type label fails. Both directions, both locales,
// because the asymmetry this replaced was a locale asymmetry.
it.effect("ordinary 'observation' / 'observação' passes in both locales", () =>
  Effect.sync(() => {
    deepStrictEqual(idsFor("Add an observation to the delivery note."), []);
    deepStrictEqual(idsFor("Uma observação sobre a entrega foi anexada."), []);
    // Sentence-initial, which is why the case-sensitive `Effect` treatment could
    // not be used for Portuguese.
    deepStrictEqual(idsFor("Observação: a entrega chega na terça."), []);
  }),
);

it.effect("a numbered type label fails in both locales", () =>
  Effect.sync(() => {
    assertTrue(idsFor("Observation #17 was withheld.").includes("customer-type-label"));
    assertTrue(idsFor("A observação nº 17 não foi exibida.").includes("customer-type-label"));
    assertTrue(idsFor("Open Run #1842 to see the result.").includes("customer-type-label"));
    assertTrue(
      idsFor("Abra a execução nº 1842 para ver o resultado.").includes("customer-type-label"),
    );
    // The interpolated form is the one product code actually writes, and masking
    // must not hide it.
    assertTrue(
      idsFor("Observation #{observationId} was withheld.").includes("customer-type-label"),
    );
    // The ordinary action keeps passing — the term is not banned, the label is.
    deepStrictEqual(idsFor("Run again"), []);
    deepStrictEqual(idsFor("Your company runs on the same output every month."), []);
  }),
);

// R26-226: `Recipe` is contextual in both locales. Keep ordinary-language
// fixtures here after the kitchen campaign leaves the shipped catalogue. These
// fixtures are test-only; the numbered type label is still forbidden.
const CULINARY_RECIPE_EN = [
  "The bakery keeps the recipe beside the oven.",
  "A recipe card lists the ingredients and baking time.",
  "The cake follows the recipe on the card.",
  "Recipe notes are clipped to the mixing bowl.",
] as const;
const CULINARY_RECIPE_PT = [
  "A padaria deixa a receita ao lado do forno.",
  "A receita lista os ingredientes e o tempo de forno.",
  "O bolo segue a receita do cartão.",
  "Receita do mês: R$ 4.000.",
] as const;

it.effect("ordinary culinary 'recipe' / 'receita' passes in both locales", () =>
  Effect.sync(() => {
    for (const text of CULINARY_RECIPE_EN) {
      deepStrictEqual(idsFor(text), []);
    }
    for (const text of CULINARY_RECIPE_PT) {
      deepStrictEqual(idsFor(text), []);
    }
  }),
);

it.effect("a numbered Recipe label fails in both locales", () =>
  Effect.sync(() => {
    assertTrue(idsFor("Open Recipe #12 to edit it.").includes("customer-type-label"));
    assertTrue(idsFor("Abra a receita nº 12 para editar.").includes("customer-type-label"));
  }),
);

it.effect("internal mechanism vocabulary fails", () =>
  Effect.sync(() => {
    assertTrue(
      idsFor("Your Enrollment ran and produced an artifact.").includes("mechanism-vocabulary"),
    );
    assertTrue(idsFor("Built on the Effect runtime.").includes("product-name-effect"));
  }),
);

// R26-226: `Mapping` is a retired name [R26-10] for the Enrolment, which this
// same list bans. It now fails in English as it already did in Portuguese —
// in prose, which is where a retired name actually leaks, and which the
// numbered-label gate never reached.
it.effect("the retired 'Mapping' fails in both locales", () =>
  Effect.sync(() => {
    assertTrue(
      idsFor("Edit the mapping between your feed and your robot.").includes("mechanism-vocabulary"),
    );
    assertTrue(idsFor("Two mappings were updated.").includes("mechanism-vocabulary"));
    assertTrue(
      idsFor("Edite o mapeamento entre a sua fonte e o seu robô.").includes("mechanism-vocabulary"),
    );
  }),
);

it.effect("retired customer vocabulary fails while Robot remains current", () =>
  Effect.sync(() => {
    assertTrue(idsFor("Open Program Version 12 to edit it.").includes("mechanism-vocabulary"));
    assertTrue(idsFor("A worker is ready.").includes("mechanism-vocabulary"));
    assertTrue(idsFor("Open the Workforce page.").includes("mechanism-vocabulary"));
    deepStrictEqual(idsFor("The robot is ready."), []);
  }),
);

it.effect("the verb 'map' is not the retired noun", () =>
  Effect.sync(() => {
    deepStrictEqual(idsFor("Each step maps to something the robot really does."), []);
    deepStrictEqual(idsFor("Cada passo corresponde ao que o robô faz."), []);
  }),
);

it.effect("borrowed institutional status fails in both locales", () =>
  Effect.sync(() => {
    assertTrue(idsFor("A certified, notarized report.").includes("institutional-borrowing"));
    assertTrue(idsFor("Um laudo com fé pública.").includes("institutional-borrowing"));
    assertTrue(idsFor("Independently audited results.").includes("borrowed-audit-claim"));
  }),
);

it.effect("stale worker-noun substitution token fails", () =>
  Effect.sync(() => {
    assertTrue(idsFor("Um {{worker_noun_pt_br}} por receita.").includes("unresolved-token"));
  }),
);

// The old fixture here — "Column 3 is missing a date. Add it and the report
// resumes." — was written before the §4.1 structural validators existed, and it
// is not a conformant Refusal: slot one names no rule and no sentence states the
// withheld outcome. It is kept below as a failing case rather than deleted; the
// passing fixture is now a refusal that satisfies all four slots.
const COMPLIANT_EN =
  "The date rule requires a date in every row, and column 3 carries none. The number was not shown. Add the date and the report resumes.";
const COMPLIANT_PT =
  "A regra de datas exige uma data em cada linha, e a coluna 3 está sem data. O número não foi exibido. Preencha a data e o relatório segue.";

it.effect("a compliant refusal passes; a first-person apology fails", () =>
  Effect.sync(() => {
    deepStrictEqual(idsFor(COMPLIANT_EN, "refusal"), []);
    deepStrictEqual(idsFor(COMPLIANT_PT, "refusal"), []);
    const bad = idsFor("Sorry, we could not finish today.", "refusal");
    assertTrue(bad.includes("refusal-apology"));
    assertTrue(bad.includes("refusal-first-person"));
    assertTrue(bad.includes("refusal-relative-date"));
  }),
);

it.effect("a refusal that names no rule in slot one fails", () =>
  Effect.sync(() => {
    assertTrue(
      idsFor(
        "Column 3 carries no date. The number was not shown. Add the date.",
        "refusal",
      ).includes("refusal-rule-in-slot-one"),
    );
    // A published limit is the rule, and is what the two per-file limit templates
    // name instead of the word `rule` (refusal-templates.md §1).
    deepStrictEqual(
      idsFor(
        "The published size limit allows 5 bytes, and the file reaches 9 bytes. The file was not read. Send a smaller file.",
        "refusal",
      ),
      [],
    );
  }),
);

it.effect("a refusal that never states the withheld outcome fails", () =>
  Effect.sync(() => {
    assertTrue(
      idsFor(
        "The date rule requires a date in every row. Add the date to column 3.",
        "refusal",
      ).includes("refusal-withheld-state"),
    );
  }),
);

it.effect("a refusal that ends on the withheld state, not on the action, fails", () =>
  Effect.sync(() => {
    assertTrue(
      idsFor(
        "The date rule requires a date in every row, and column 3 carries none. Add the date. The number was not shown.",
        "refusal",
      ).includes("refusal-outcome-clause-last"),
    );
  }),
);

it.effect("a refusal longer than three sentences fails", () =>
  Effect.sync(() => {
    assertTrue(
      idsFor(
        "The date rule requires a date in every row. Column 3 carries none. The number was not shown. Add the date and the report resumes.",
        "refusal",
      ).includes("refusal-sentence-count"),
    );
  }),
);

it.effect("bullets and parentheses fail a refusal", () =>
  Effect.sync(() => {
    assertTrue(idsFor(`${COMPLIANT_EN} (see the sheet)`, "refusal").includes("refusal-formatting"));
    assertTrue(idsFor(`- one\n- two`, "refusal").includes("refusal-formatting"));
  }),
);

it.effect("interpolation values are masked, authored prose is not", () =>
  Effect.sync(() => {
    // A filename carrying a full stop must not invent a fourth sentence, and an
    // interpolated value carrying a banned word must not fail the string.
    deepStrictEqual(
      idsFor(
        "The published size limit allows {allowedBytes} bytes, and {fileName} reaches {observedBytes} bytes. The file was not read. Send a smaller file.",
        "refusal",
      ),
      [],
    );
    deepStrictEqual(idsFor("Um relatório sobre {artifact_name}."), []);
    // The stale double-brace token is substitution syntax, not an interpolation:
    // masking must leave it visible.
    assertTrue(idsFor("Um {{worker_noun_pt_br}} por receita.").includes("unresolved-token"));
  }),
);
