import * as Arr from "effect/Array";
import * as Match from "effect/Match";
import * as O from "effect/Option";
import * as Str from "effect/String";

import {
  BORROWED_AUDIT_CLAIM_EN_RE,
  BORROWED_AUDIT_CLAIM_PT_RE,
  CUSTOMER_MECHANISM_HARD_RE,
  CUSTOMER_MECHANISM_PT_HARD_RE,
  CUSTOMER_TYPE_LABEL_PT_RE,
  CUSTOMER_TYPE_LABEL_RE,
  EFFECT_PRODUCT_RE,
  INSTITUTIONAL_EN_RE,
  INSTITUTIONAL_PT_RE,
  REFUSAL_APOLOGY_RE,
  REFUSAL_FIRST_PERSON_EN_RE,
  REFUSAL_FIRST_PERSON_PT_RE,
  REFUSAL_FORBIDDEN_SUBJECT_EN_RE,
  REFUSAL_FORBIDDEN_SUBJECT_PT_RE,
  REFUSAL_FORMATTING_RE,
  REFUSAL_RULE_ID_RE,
  REFUSAL_RULE_TEXT_EN_RE,
  REFUSAL_RULE_TEXT_PT_RE,
  REFUSAL_WRONGNESS_EN_RE,
  REFUSAL_WRONGNESS_PT_RE,
  RELATIVE_DATE_EN_RE,
  RELATIVE_DATE_PT_RE,
  UNRESOLVED_TOKEN_RE,
  WITHHELD_STATE_EN_RE,
  WITHHELD_STATE_PT_RE,
} from "./patterns.ts";

// The two hard-error scopes we enforce without copy-key metadata. Scope-refined
// tiers (claim-bearing, billing, date-strict …) attach when a keyed copy
// catalogue exists; until then every customer string is treated as
// "all-customer" and refusal strings opt into the stricter set explicitly.
export type CopyScope = "all-customer" | "refusal";

export interface CopyViolation {
  readonly ruleId: string;
  readonly index: number;
  readonly match: string;
}

interface Check {
  readonly ruleId: string;
  readonly pattern: RegExp;
}

const UNIVERSAL_CHECKS: readonly Check[] = [
  { pattern: CUSTOMER_MECHANISM_HARD_RE, ruleId: "mechanism-vocabulary" },
  { pattern: CUSTOMER_MECHANISM_PT_HARD_RE, ruleId: "mechanism-vocabulary" },
  { pattern: EFFECT_PRODUCT_RE, ruleId: "product-name-effect" },
  // Not the bare contextual term — those take agent review, never a global ban
  // (docs/06 §8.1) — only the numbered type label, which §8.1 lists as
  // forbidden outright next to the permitted `Run again`.
  { pattern: CUSTOMER_TYPE_LABEL_RE, ruleId: "customer-type-label" },
  { pattern: CUSTOMER_TYPE_LABEL_PT_RE, ruleId: "customer-type-label" },
  { pattern: INSTITUTIONAL_EN_RE, ruleId: "institutional-borrowing" },
  { pattern: INSTITUTIONAL_PT_RE, ruleId: "institutional-borrowing" },
  { pattern: BORROWED_AUDIT_CLAIM_EN_RE, ruleId: "borrowed-audit-claim" },
  { pattern: BORROWED_AUDIT_CLAIM_PT_RE, ruleId: "borrowed-audit-claim" },
  { pattern: UNRESOLVED_TOKEN_RE, ruleId: "unresolved-token" },
];

const REFUSAL_CHECKS: readonly Check[] = [
  { pattern: REFUSAL_FIRST_PERSON_EN_RE, ruleId: "refusal-first-person" },
  { pattern: REFUSAL_FIRST_PERSON_PT_RE, ruleId: "refusal-first-person" },
  { pattern: REFUSAL_FORBIDDEN_SUBJECT_EN_RE, ruleId: "refusal-forbidden-subject" },
  { pattern: REFUSAL_FORBIDDEN_SUBJECT_PT_RE, ruleId: "refusal-forbidden-subject" },
  { pattern: REFUSAL_APOLOGY_RE, ruleId: "refusal-apology" },
  { pattern: REFUSAL_WRONGNESS_EN_RE, ruleId: "refusal-wrongness" },
  { pattern: REFUSAL_WRONGNESS_PT_RE, ruleId: "refusal-wrongness" },
  { pattern: RELATIVE_DATE_EN_RE, ruleId: "refusal-relative-date" },
  { pattern: RELATIVE_DATE_PT_RE, ruleId: "refusal-relative-date" },
  { pattern: REFUSAL_FORMATTING_RE, ruleId: "refusal-formatting" },
];

const CHECKS_BY_SCOPE: Readonly<Record<CopyScope, readonly Check[]>> = {
  "all-customer": UNIVERSAL_CHECKS,
  // `Arr.appendAll` rather than a spread, which `effect/noSpread` bans.
  refusal: Arr.appendAll(UNIVERSAL_CHECKS, REFUSAL_CHECKS),
};

const checksFor = (scope: CopyScope): readonly Check[] => CHECKS_BY_SCOPE[scope];

/** The pattern, always global, so `matchAll` can walk every occurrence. */
const globally = (pattern: RegExp): RegExp =>
  Match.value(pattern.flags).pipe(
    Match.when(
      (flags: string) => flags.includes("g"),
      (flags) => new RegExp(pattern.source, flags),
    ),
    Match.orElse((flags) => new RegExp(pattern.source, `${flags}g`)),
  );

const collect = (text: string, check: Check): readonly CopyViolation[] =>
  // `matchAll` rather than a hand-rolled `exec` loop: it advances the pattern
  // itself, which also removes the zero-width-match guard that loop needed.
  Array.from(text.matchAll(globally(check.pattern)), (match) => ({
    index: match.index,
    match: match[0],
    ruleId: check.ruleId,
  }));

// ---------------------------------------------------------------------------
// Masking (lint-reference.md §2.2)
// ---------------------------------------------------------------------------

// A named interpolation: `{fileName}`, `{allowedBytes}`. Doubled braces are
// deliberately excluded — `{{worker_noun_pt_br}}` is stale substitution syntax
// that `UNRESOLVED_TOKEN_RE` exists to catch, and masking it would hide it.
const INTERPOLATION_RE = /(?<!\{)\{[^{}\n]+\}(?!\})/gu;

/**
 * Authored static segments, with every interpolation value blanked.
 *
 * The replacement is the same length as what it replaces, so every reported
 * index still points at the original string (§2, "reporting the original span").
 * `z` because it is a letter — it keeps the word boundaries the interpolation
 * had — and because it is the one letter that is neither a Roman numeral nor a
 * unit, so a masked value cannot become a list leader under
 * `REFUSAL_FORMATTING_RE`.
 */
export const maskInterpolations = (text: string): string =>
  text.replaceAll(INTERPOLATION_RE, (value) => "z".repeat(value.length));

// ---------------------------------------------------------------------------
// Structural validators (lint-reference.md §4.1)
// ---------------------------------------------------------------------------

interface Span {
  readonly index: number;
  readonly text: string;
}

// `text` here is already masked, so a whole-string violation reports the masked
// form. That is the string the validators judged, and its indices are the
// original's.
interface Refusal {
  readonly text: string;
  readonly sentences: readonly Span[];
}

// Sentence segmentation runs on masked text, so an interpolated value carrying a
// full stop — a filename, a decimal — cannot invent a sentence boundary.
const SENTENCE_RE = /[^.!?]+[.!?]*/gu;

const EMPTY_SPAN: Span = { index: 0, text: "" };

const sentencesOf = (text: string): readonly Span[] =>
  Arr.filter(
    Array.from(text.matchAll(SENTENCE_RE), (match) => ({
      index: match.index,
      text: match[0].trim(),
    })),
    (span) => Str.isNonEmpty(span.text),
  );

const spanOr = (span: O.Option<Span>): Span => O.getOrElse(span, () => EMPTY_SPAN);

/** The last clause of a sentence: what follows its final semicolon, or all of it. */
const finalClauseOf = (sentence: string): string => sentence.slice(sentence.lastIndexOf(";") + 1);

const matchesAny = (text: string, patterns: readonly RegExp[]): boolean =>
  Arr.some(patterns, (pattern) => pattern.test(text));

/** Slot one names the rule — by identifier, or in prose in either locale. */
const namesTheRule = (text: string): boolean =>
  matchesAny(text, [REFUSAL_RULE_ID_RE, REFUSAL_RULE_TEXT_EN_RE, REFUSAL_RULE_TEXT_PT_RE]);

const statesWithholding = (text: string): boolean =>
  matchesAny(text, [WITHHELD_STATE_EN_RE, WITHHELD_STATE_PT_RE]);

// registers.md §4.1 and vocabulary.md §7.1: "one to three sentences" *total*.
// lint-reference.md §4.1 says "one to three sentences plus the final clause",
// which reads as up to four. The stricter reading is enforced because it is the
// one two of the three sources state outright, and every authored template is
// three sentences.
const MIN_SENTENCES = 1;
const MAX_SENTENCES = 3;

const spanCheck = (
  span: Span,
  ruleId: string,
  holds: (text: string) => boolean,
): readonly CopyViolation[] =>
  Arr.filter([{ index: span.index, match: span.text, ruleId }], () => !holds(span.text));

const ruleInSlotOne = (refusal: Refusal): readonly CopyViolation[] =>
  spanCheck(spanOr(Arr.head(refusal.sentences)), "refusal-rule-in-slot-one", namesTheRule);

const withheldState = (refusal: Refusal): readonly CopyViolation[] =>
  spanCheck({ index: 0, text: refusal.text }, "refusal-withheld-state", statesWithholding);

// Slot four is last: the withheld state (slot three) may not be the closing
// clause. What positively counts as an outcome-changing clause — an imperative,
// or the statement that nothing changes it — has no mechanical signature in
// either locale, so the ordering is what is enforced.
const outcomeClauseLast = (refusal: Refusal): readonly CopyViolation[] =>
  spanCheck(
    spanOr(Arr.last(refusal.sentences)),
    "refusal-outcome-clause-last",
    (sentence) => !statesWithholding(finalClauseOf(sentence)),
  );

const sentenceCount = (refusal: Refusal): readonly CopyViolation[] =>
  Arr.filter(
    [{ index: 0, match: refusal.text, ruleId: "refusal-sentence-count" }],
    () => refusal.sentences.length < MIN_SENTENCES || refusal.sentences.length > MAX_SENTENCES,
  );

const VALIDATORS: readonly ((refusal: Refusal) => readonly CopyViolation[])[] = [
  ruleInSlotOne,
  withheldState,
  outcomeClauseLast,
  sentenceCount,
];

const validate = (refusal: Refusal): readonly CopyViolation[] =>
  Arr.flatMap(VALIDATORS, (validator) => validator(refusal));

const STRUCTURAL_BY_SCOPE: Readonly<Record<CopyScope, (text: string) => readonly CopyViolation[]>> =
  {
    "all-customer": () => [],
    refusal: (text) => validate({ sentences: sentencesOf(text), text }),
  };

const scanMasked = (masked: string, scope: CopyScope): readonly CopyViolation[] =>
  Arr.appendAll(
    Arr.flatMap(checksFor(scope), (check) => collect(masked, check)),
    STRUCTURAL_BY_SCOPE[scope](masked),
  );

// Scan one authored customer string. Interpolation values are masked before any
// pattern runs, so a filename or exact source value never fails for containing a
// prohibited word and never invents a sentence boundary (lint-reference.md §2.2,
// "lint authored static segments separately from interpolation values").
export const scanCustomerCopy = (
  text: string,
  scope: CopyScope = "all-customer",
): readonly CopyViolation[] => scanMasked(maskInterpolations(text), scope);
