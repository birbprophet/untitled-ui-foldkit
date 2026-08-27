// Copy-lint patterns, ported verbatim from docs/06-writing-style.md §8.1–§8.2
// (the HARD-ERROR tiers). The warning tier (§8.3) is deliberately omitted: the
// spec requires it be calibrated against real accepted copy before it may gate
// (§8, "warning thresholds are calibrated against accepted human-edited copy
// … before promotion to a gate"). These guard CUSTOMER-facing copy only.

const unicodeWord = (body: string, flags = "iu"): RegExp =>
  new RegExp(`(?<![\\p{L}\\p{M}\\p{N}_])(?:${body})(?![\\p{L}\\p{M}\\p{N}_])`, flags);

// Fold accents so an accent-insensitive check can run against a shadow copy of
// the input while the original span is what gets reported (docs/06 §8).
export const fold = (input: string): string =>
  input
    .normalize("NFD")
    .replaceAll(/\p{M}+/gu, "")
    .normalize("NFC");

// §8.1 — internal mechanism and retired customer vocabulary. Never in customer
// copy, any locale.
//
// `mappings?` joins this list and leaves the contextual tier [R26-226], so the
// English side finally matches `mapeamentos?` on the pt-BR side. It is the
// mirror of the `Observation` case below and it lands the other way: R26-10
// retired `Mapping` corpus-wide in favour of the Enrolment, which this same list
// hard-bans, so the word is a dead name for a banned type rather than ordinary
// vocabulary that occasionally names one. The contextual tier could not have
// held it either — that tier gates only the numbered label, and a retired name
// leaks in prose. Noun only: `map`, `maps`, `mapped` are untouched, which is what
// the governed kitchen analogy and the SDK's one-time worker ↔ Program mapping
// sentence rely on.
export const CUSTOMER_MECHANISM_HARD_RE = unicodeWord(
  String.raw`enroll?ments?|artifacts?|mappings?|attestations?|provenance|hash(?:es|ed|ing)?|slsa|isolates?|sandboxes?|canonicali[sz](?:e[ds]?|ing|ation)|replay capsules?|renderers?|workerd|bigdecimal|program[ \t]+versions?|workers?|workforces?`,
);
export const CUSTOMER_MECHANISM_PT_HARD_RE = unicodeWord(
  String.raw`enroll?ments?|artefatos?|mapeamentos?|atestaç(?:ão|ões)|proveniências?|hash(?:es)?|isolados?|sandboxes?|canonicalizaç(?:ão|ões)|cápsulas? de replay|renderizadores?|bigdecimal`,
);
// `Effect` is case-sensitive: ordinary `effect` is normal English.
export const EFFECT_PRODUCT_RE = /(?<![\p{L}\p{M}\p{N}_])Effect(?![\p{L}\p{M}\p{N}_])/u;

// §8.1 — context-sensitive candidates: ordinary English and Portuguese in most
// sentences, mechanism only when used as a product type name. The spec gives
// them "key metadata or agent review, never a case-insensitive global ban"
// (vocabulary.md §3), so the bare-term patterns below are carried for that
// review and are not themselves checks.
//
// `observaç(ão|ões)` joins this tier and leaves the pt-BR hard list [R26-225].
// It was the only word the two hard lists disagreed about, and the `Effect`
// exit — ban the capitalized product name, leave the lowercase word alone —
// does not transfer: Portuguese capitalizes the first word of every sentence,
// so a capitalized-only ban fires on `Observação:` opening a line and misses
// `a observação` mid-sentence.
//
// `Program` is the current product noun. `Recipe` remains in this tier only as
// a legacy label guard while old clients can still send it. Culinary `recipe` /
// `receita` remains ordinary language, and `receita` is also the Brazilian noun
// for revenue, so neither bare word can become a global ban.
const CONTEXT_TERMS_EN = String.raw`programs?|recipes?|observations?|runs?|outputs?|feeds?|arrangements?|logs?|replays?|audits?`;
const CONTEXT_TERMS_PT = String.raw`programas?|receitas?|observaç(?:ão|ões)|execuç(?:ão|ões)|saídas?|feeds?|arranjos?|logs?|replays?|auditorias?`;
export const CUSTOMER_MECHANISM_CONTEXT_RE = unicodeWord(CONTEXT_TERMS_EN);
export const CUSTOMER_MECHANISM_CONTEXT_PT_RE = unicodeWord(CONTEXT_TERMS_PT);

/**
 * What is gated from that tier is the one usage the spec forbids outright: the
 * numbered customer type label. `Run again` is ordinary customer language;
 * `Run #1842` exposes the internal type (vocabulary.md §3, the canonical worked
 * pair). The label leader — `#`, or the Brazilian `nº` / `n.º` — is what turns
 * one of these words into a name for an internal record, so the leader plus a
 * following character is the shape matched, never the bare term. A masked
 * interpolation satisfies that character, so `Observation #{id}` is caught the
 * same as `Observation #17`.
 */
const typeLabel = (body: string): RegExp =>
  new RegExp(
    `(?<![\\p{L}\\p{M}\\p{N}_])(?:${body})[ \\t]*(?:#|n[º°]\\.?)[ \\t]*[\\p{L}\\p{N}]`,
    "iu",
  );
export const CUSTOMER_TYPE_LABEL_RE = typeLabel(CONTEXT_TERMS_EN);
export const CUSTOMER_TYPE_LABEL_PT_RE = typeLabel(CONTEXT_TERMS_PT);

// §8.1 — institutional and status borrowing.
export const INSTITUTIONAL_EN_RE = unicodeWord(
  String.raw`certificates?|certified|certifications?|accredit(?:ed|ation)|notari[sz](?:ed|ation)|test reports?|expert reports?|chains? of custody|timestamp seals?`,
);
export const INSTITUTIONAL_PT_RE = unicodeWord(
  String.raw`certificad[oa]s?|certificaç(?:ão|ões)|credenciad[oa]s?|notarizad[oa]s?|notarizaç(?:ão|ões)|laudos?|perícias?|ensaios?|aferiç(?:ão|ões)|relatórios? de ensaio|carimbos? do tempo|cadeias? de custódia|cartórios?|tabeli(?:ão|ães)|notários?|notarial|atas? notariais|fé pública`,
);
export const BORROWED_AUDIT_CLAIM_EN_RE = unicodeWord(
  String.raw`audited|audit-certified|independently audited`,
);
export const BORROWED_AUDIT_CLAIM_PT_RE = unicodeWord(
  String.raw`auditad[oa]s?|auditoria independente`,
);

// §8.1 — legacy worker-placeholder residue: no locale may ship stale tokens.
export const UNRESOLVED_TOKEN_RE = /\{\{\s*(?:worker|workforce)_noun_pt_br(?:_plural)?\s*\}\}/iu;

// §8.2 — refusal strings (scope: refusal). A refusal never speaks in the first
// person, never apologises, never names the engine as its subject, never says
// something is wrong, and never carries a relative date.
export const REFUSAL_FIRST_PERSON_EN_RE = unicodeWord(
  String.raw`we|we['’]re|we['’]ve|we['’]ll|us|our|ours|ourselves|i|i['’]m|i['’]ve|i['’]ll|me|my|mine|myself`,
);
export const REFUSAL_FIRST_PERSON_PT_RE = unicodeWord(
  String.raw`nós|nos|conosco|nosso|nossa|nossos|nossas|a gente|eu|meu|minha|meus|minhas`,
);
export const REFUSAL_FORBIDDEN_SUBJECT_EN_RE =
  /^\s*(?:the system|the engine|engine|siglata|the worker|the agent)(?![\p{L}\p{M}\p{N}_])/iu;
export const REFUSAL_FORBIDDEN_SUBJECT_PT_RE =
  /^\s*(?:o sistema|o motor|motor|a siglata|siglata|o robô|o agente)(?![\p{L}\p{M}\p{N}_])/iu;
export const REFUSAL_APOLOGY_RE = unicodeWord(
  String.raw`sorry|apolog(?:y|ies|ize|ise|ized|ised|izing|ising)|unfortunately|regrettably|we were unable to|desculp[\p{L}\p{M}]*|pedimos desculpas|infelizmente|não conseguimos|não foi possível|lamentamos|sentimos muito`,
);
export const REFUSAL_WRONGNESS_EN_RE = unicodeWord(
  String.raw`wrong|invalid|failed|failure|errors?|incorrect`,
);
export const REFUSAL_WRONGNESS_PT_RE = unicodeWord(
  String.raw`errad[oa]s?|inválid[oa]s?|falh(?:a|as|ou|aram)|erros?|incorret[oa]s?`,
);
export const RELATIVE_DATE_EN_RE = unicodeWord(
  String.raw`today|yesterday|tomorrow|this (?:week|month|year)|last (?:night|week|month|year)|next (?:week|month|year|monday|tuesday|wednesday|thursday|friday|saturday|sunday)|recently|a while ago|soon|earlier|\d+ days? ago`,
);
export const RELATIVE_DATE_PT_RE = unicodeWord(
  String.raw`hoje|ontem|amanhã|esta semana|este mês|este ano|semana passada|mês passado|ano passado|próxima semana|próximo mês|semana que vem|mês que vem|ano que vem|recentemente|há pouco|em breve|daqui a \d+ dias?`,
);
// Verbatim from lint-reference.md §4. Bullets, ordered-list leaders, and
// parentheses — including the fullwidth pair — in one pattern: a Refusal must
// survive being read aloud.
export const REFUSAL_FORMATTING_RE =
  /(?:^|\n)[ \t]*(?:(?:[-*+•‣◦–—]|(?:\d+|[a-z]|[ivxlcdm]+)[.)])[ \t]+)|[()（）]/iu;

// §4.1 structural validators. These are not "does this string contain a bad
// word" — they are "is this string shaped like a Refusal", so each one below is
// a recognizer the validators in `scan.ts` compose, never a violation on its own.

/**
 * Slot one names the rule. Either as a `RuleId` — kebab-case, three segments or
 * more, which is the shape every identifier in `error-contracts.md` §4 takes —
 * or in prose. The prose nouns are the ones the register itself permits as the
 * slot-one subject: the rule, or the published limit that *is* the rule
 * (`refusal-templates.md` §1, "the rule, the limit, the file, or the setting").
 * Requiring the literal word `rule` / `regra` would reject 28 of the 74 authored
 * templates: every per-file resource limit names `the published … limit` and
 * `o limite publicado`, which is the rule it states.
 */
export const REFUSAL_RULE_ID_RE =
  /(?<![\p{L}\p{M}\p{N}_])[a-z0-9]+(?:-[a-z0-9]+){2,}(?![\p{L}\p{M}\p{N}_])/u;
export const REFUSAL_RULE_TEXT_EN_RE = unicodeWord(String.raw`rules?|limits?`);
export const REFUSAL_RULE_TEXT_PT_RE = unicodeWord(String.raw`regras?|limites?`);

/**
 * The withheld state: what did not happen, stated agentlessly.
 *
 * `registers.md` §4.1 lists `withheld`, `not shown`, `not produced`,
 * `not written` (`retido`, `não exibido`, `não produzido`, `não gravado`) as
 * **preferred** outcomes; `vocabulary.md` §7.1 calls the same list **permitted**.
 * As a closed list of exact phrases it rejects 66 of the 74 authored templates —
 * `nothing was written` is not the string `not written`, and `nada foi gravado`
 * is not `não gravado`. Widened to "one of those participles, however negated",
 * it still rejects 14: `no source was asked`, `nothing was charged`, `the
 * document was not sent`, `nenhum convite foi enviado`. Those are withheld
 * states by any reading, in verbs the list does not carry.
 *
 * So what is matched is the shape the four listed forms are instances of: an
 * agentless negation carrying an outcome verb. The list is read as exemplary,
 * which is what `registers.md` says ("preferred") and what the templates do.
 * `vocabulary.md` §7.1's "permitted" is the wording that needs amending.
 */
export const WITHHELD_STATE_EN_RE = unicodeWord(
  String.raw`withheld|not shown|not produced|not written|(?:was|were) not \p{L}+|(?:nothing|no(?:\s+\p{L}+){1,3}) (?:was|were) \p{L}+`,
);
export const WITHHELD_STATE_PT_RE = unicodeWord(
  String.raw`retid[oa]s?|não exibid[oa]s?|não produzid[oa]s?|não gravad[oa]s?|não (?:foi|foram) \p{L}+|(?:nada|nenhum(?:as?|os)?(?:\s+\p{L}+){1,3}) (?:foi|foram) \p{L}+`,
);
