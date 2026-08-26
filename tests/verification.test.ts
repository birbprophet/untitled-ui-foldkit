import { it } from "@effect/vitest";
import * as Schema from "effect/Schema";
import { expect } from "./assertions.ts";

import {
  VerificationEvidence,
  decodeVerificationEvidence,
  pendingEvidence,
} from "../src/verification.ts";

it("pending evidence defaults every dimension to unverified", () => {
  const evidence = pendingEvidence(["primary", "secondary"]);
  expect(evidence.accessibility).toBe("unverified");
  expect(evidence.interaction).toBe("unverified");
  expect(evidence.visual).toBe("unverified");
  expect(evidence.documentedVariants).toEqual(["primary", "secondary"]);
});

it("verified evidence must decode through Effect Schema", () => {
  const encoded = {
    accessibility: "verified",
    documentedVariants: ["sm", "md"],
    interaction: "verified",
    locale: "verified in en-US and pt-BR",
    responsive: "verified at 393, 768, 1024, and 1440",
    visual: "automated Chromium comparison at 0.2%",
  };
  const decoded = decodeVerificationEvidence(encoded);
  expect(Schema.encodeSync(VerificationEvidence)(decoded)).toEqual(encoded);
});

it("rejects over-claimed evidence with invalid dimension values", () => {
  let rejected = false;
  try {
    decodeVerificationEvidence({
      accessibility: "verified",
      documentedVariants: [],
      interaction: "verified",
      locale: "verified in en-US and pt-BR",
      responsive: "verified at 393, 768, 1024, and 1440",
      visual: "probably fine",
    });
  } catch {
    rejected = true;
  }
  expect(rejected).toBe(true);
});
