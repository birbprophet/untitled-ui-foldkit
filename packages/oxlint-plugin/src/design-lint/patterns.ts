// Design-lint patterns. Source: docs/05-design-system/console-tokens.md §7,
// with the reasons in doctrine.md. Oxlint parses JS/TS rather than CSS, so these
// scan string and template literals where a raw value should have been a token.
//
// They cited the PAUTA register until it was retired [R26-260]. Every pattern
// survived unchanged; only where the rule is written down moved.

// Any color hex. In product code every color is var(--color-…); a literal is a
// regression. Both #rgb and #rrggbb(aa).
export const RAW_HEX_RE = /(?<![\w#])#[0-9a-fA-F]{3,8}(?![0-9a-fA-F])/u;

// The three permanently retired inks. Rejected accent candidates under the
// register that is now itself retired — they stay banned because a permanent ban
// outlives the system that issued it, and a resurrected ink would arrive with no
// argument behind it. Reported with a sharper message than a generic raw hex.
export const RETIRED_INKS: readonly string[] = ["#087d78", "#b5541c", "#c6300f"];

// Any px length. Product spacing/size is var(--space-…)/var(--text-…)/…; a raw
// px is a regression.
export const RAW_PX_RE = /(?<!\d)(?:\d+\.?\d*|\.\d+)px(?![\w])/iu;

// box-shadow (kebab or camel). "A box-shadow in a file is a regression, not a
// choice" — no shadow token exists, by law.
export const BOX_SHADOW_RE = /(?<![\w-])box-?shadow(?![\w-])/iu;

// The `margin` property (kebab or camel, any edge). Spacing is padding and gap
// only; CSS `margin` does not appear.
export const MARGIN_RE = /(?<![\w-])margin[a-z-]*\s*[:=]/iu;

// Re-enabling wrap on a value. Numbers never wrap (docs/05 components.md,
// space-and-layout.md); a value that cannot fit abbreviates, it does not wrap.
export const WHITE_SPACE_WRAP_RE =
  /(?:white-space|whiteSpace)\s*[:=]\s*["']?\s*(?:normal|initial|unset)/iu;
export const WORD_BREAK_WRAP_RE =
  /(?:overflow-wrap|overflowWrap|word-break|wordBreak)\s*[:=]\s*["']?\s*(?:anywhere|break-word|break-all)/iu;
