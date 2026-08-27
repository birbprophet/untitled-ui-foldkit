import * as Match from "effect/Match";

import {
  BOX_SHADOW_RE,
  MARGIN_RE,
  RAW_HEX_RE,
  RAW_PX_RE,
  RETIRED_INKS,
  WHITE_SPACE_WRAP_RE,
  WORD_BREAK_WRAP_RE,
} from "./patterns.ts";

export interface DesignViolation {
  readonly ruleId: string;
  readonly index: number;
  readonly match: string;
}

interface Probe {
  readonly pattern: RegExp;
  /** What the match is an offence against — a function only because hex is two. */
  readonly ruleId: (match: string) => string;
}

/** The pattern, always global, so `matchAll` can walk every occurrence. */
const globally = (pattern: RegExp): RegExp =>
  Match.value(pattern.flags).pipe(
    Match.when(
      (flags: string) => flags.includes("g"),
      (flags) => new RegExp(pattern.source, flags),
    ),
    Match.orElse((flags) => new RegExp(pattern.source, `${flags}g`)),
  );

/**
 * A retired PAUTA ink and any other raw colour are the same syntax and different
 * offences: one names a value the design system used to hold, the other names a
 * value it never did. Only the ink list can tell them apart.
 */
const hexOffence = (match: string): string =>
  Match.value(match.toLowerCase()).pipe(
    Match.when(
      (hex: string) => RETIRED_INKS.includes(hex),
      () => "retired-ink",
    ),
    Match.orElse(() => "raw-color"),
  );

const always = (ruleId: string) => (): string => ruleId;

/** Every probe, in the order their findings should read. */
const PROBES: readonly Probe[] = [
  { pattern: RAW_HEX_RE, ruleId: hexOffence },
  { pattern: RAW_PX_RE, ruleId: always("raw-space") },
  { pattern: BOX_SHADOW_RE, ruleId: always("box-shadow") },
  { pattern: MARGIN_RE, ruleId: always("margin") },
  { pattern: WHITE_SPACE_WRAP_RE, ruleId: always("numbers-never-wrap") },
  { pattern: WORD_BREAK_WRAP_RE, ruleId: always("numbers-never-wrap") },
];

const collect = (text: string, probe: Probe): readonly DesignViolation[] =>
  // `matchAll` rather than a hand-rolled `exec` loop: it advances the pattern
  // itself, which also removes the zero-width-match guard that loop needed.
  Array.from(text.matchAll(globally(probe.pattern)), (match) => ({
    index: match.index,
    match: match[0],
    ruleId: probe.ruleId(match[0]),
  }));

// Scan one style-bearing string (a CSS-in-JS declaration, an inline style, a
// className-adjacent value) for raw values that should be token references and
// for the properties the design doctrine forbids outright — `doctrine.md`, which
// is where PAUTA's reasoning was kept when the register itself went [R26-260].
export const scanStyleValue = (text: string): DesignViolation[] =>
  PROBES.flatMap((probe) => collect(text, probe));
