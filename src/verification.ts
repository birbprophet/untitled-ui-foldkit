import * as Schema from "effect/Schema";

/** One verification dimension — never over-claim what Storybook or tests have not proved. */
export const VerificationDimension = Schema.Literals(["unverified", "verified"]);

export const VerificationLocale = Schema.Literals([
  "not applicable: no locale-sensitive behavior",
  "unverified",
  "verified in en-US and pt-BR",
]);

export const VerificationResponsive = Schema.Literals([
  "not applicable: source has no responsive branch",
  "unverified",
  "verified at 393, 768, 1024, and 1440",
]);

export const VerificationVisual = Schema.Literals([
  "unverified",
  "automated Chromium comparison at 0.2%",
]);

export class VerificationEvidence extends Schema.Class<VerificationEvidence>(
  "VerificationEvidence",
)({
  accessibility: VerificationDimension,
  documentedVariants: Schema.Array(Schema.String),
  interaction: VerificationDimension,
  locale: VerificationLocale,
  responsive: VerificationResponsive,
  visual: VerificationVisual,
}) {}

export type VerificationEvidenceEncoded = typeof VerificationEvidence.Encoded;

/** Pending components carry no evidence object. Verified entries must decode. */
export const decodeVerificationEvidence = Schema.decodeUnknownSync(VerificationEvidence);

/** Factory for entries that passed a specific gate — defaults stay honest (unverified). */
export const pendingEvidence = (
  documentedVariants: readonly string[],
): VerificationEvidenceEncoded => ({
  accessibility: "unverified",
  documentedVariants: [...documentedVariants],
  interaction: "unverified",
  locale: "not applicable: no locale-sensitive behavior",
  responsive: "not applicable: source has no responsive branch",
  visual: "unverified",
});

/** Evidence map keyed by authenticated Untitled UI component id. */
export const verifiedEvidence: Readonly<Record<string, VerificationEvidenceEncoded>> = {};
