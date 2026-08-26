import { it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { catalog, verifiedCatalog } from "../src/catalog.ts";
import { baseComponents } from "../src/registry.ts";
import { verifiedEvidence } from "../src/verification.ts";

it("catalog lists batch-1 base components with honest pending status", () => {
  expect(catalog).toHaveLength(3);
  expect(catalog.map((entry) => entry.id).toSorted()).toEqual(["badge-groups", "badges", "button"]);
  expect(catalog.every((entry) => entry.status === "pending")).toBe(true);
  expect(catalog.every((entry) => entry.verification === undefined)).toBe(true);
  expect(catalog.every((entry) => entry.family !== "date-picker")).toBe(true);
});

it("every catalog entry has public metadata", () => {
  for (const entry of catalog) {
    expect(entry.accessLevel).toBe("authenticated");
    expect(entry.storybookTitle).toMatch(/^Untitled UI\/Base\//u);
    expect(entry.documentationUrl).toContain("untitledui.com");
    expect(entry.sourceVersion).toBe("untitledui@0.1.64/library-v8");
  }
});

it("verified catalog stays empty until evidence is recorded", () => {
  expect(verifiedCatalog).toHaveLength(0);
  expect(Object.keys(verifiedEvidence)).toHaveLength(0);
});

it("registry exposes a renderer for every catalog id", () => {
  expect(Object.keys(baseComponents).toSorted()).toEqual(
    catalog.map((entry) => entry.id).toSorted(),
  );
});
