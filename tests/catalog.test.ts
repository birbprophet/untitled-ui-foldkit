/* oxlint-disable effect/noGlobals, mps/avoid-direct-json, mps/avoid-sync-fs, mps/casting-awareness, mps/use-filesystem-service, typescript/no-unsafe-type-assertion -- This structural gate reads checked-in package metadata and source text synchronously before tests run. */
import { readdirSync, readFileSync } from "node:fs";
import { it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { catalog, verifiedCatalog } from "../src/catalog.ts";
import {
  verifiedApplicationComponents,
  verifiedBaseComponents,
  verifiedMarketingComponents,
} from "../src/registry.ts";
import { verifiedEvidence } from "../src/verification.ts";

it("the supported catalog excludes the authenticated RTL-only demonstration", () => {
  expect(catalog).toHaveLength(619);
  expect(catalog.filter((entry) => entry.category === "base")).toHaveLength(48);
  expect(catalog.filter((entry) => entry.category === "application")).toHaveLength(128);
  expect(catalog.filter((entry) => entry.category === "marketing")).toHaveLength(443);
  expect(new Set(catalog.map((entry) => `${entry.category}:${entry.id}`)).size).toBe(619);
  expect(catalog.some((entry) => entry.id === "rtl-demo")).toBe(false);
});

it("every visible component has verification evidence", () => {
  expect(verifiedCatalog.map((entry) => entry.id).toSorted()).toEqual(
    Object.keys(verifiedEvidence).toSorted(),
  );
});

it("every catalog entry records its public catalog metadata", () => {
  for (const entry of catalog) {
    expect(entry.accessLevel).toBe("authenticated");
    expect(entry.storybookTitle).toMatch(/^Untitled UI\/(?:Base|Application|Marketing)\//u);
    expect(entry.sourcePath).not.toBe("");
    expect(entry.documentationUrl).not.toBe("");
    expect(entry.family).not.toBe("root");
  }
  const verified = catalog.filter((entry) => entry.status === "verified");
  expect(verified.every((entry) => entry.dependencies.at(0) !== undefined)).toBe(true);
  expect(verified.every((entry) => entry.documentedVariants.at(0) !== undefined)).toBe(true);
  expect(verified.every((entry) => entry.verification !== undefined)).toBe(true);
  expect(
    catalog
      .filter((entry) => entry.status === "pending")
      .every((entry) => entry.verification === undefined),
  ).toBe(true);
});

it("marketing entries use their exact public family documentation route", () => {
  for (const entry of catalog.filter((candidate) => candidate.category === "marketing")) {
    expect(entry.documentationUrl).toContain("/react/marketing/");
    expect(entry.documentationUrl.endsWith(`/${entry.id}`)).toBe(true);
    expect(entry.storybookTitle).toMatch(/^Untitled UI\/Marketing\/[^/]+\/[^/]+$/u);
  }
});

it("every verified story declares the catalog title for static CSF indexing", () => {
  for (const entry of verifiedCatalog) {
    const story = readFileSync(
      new URL(`../stories/untitled-ui/${entry.category}/${entry.id}.stories.ts`, import.meta.url),
      "utf-8",
    );
    expect(story).toContain(`title: "${entry.storybookTitle}"`);
  }
});

it("verified components alone have public renderers", () => {
  const rendererFiles = readdirSync(new URL("../src/base/", import.meta.url)).filter((name) =>
    name.endsWith(".ts"),
  );
  const publicBase = readFileSync(new URL("../src/base.ts", import.meta.url), "utf-8");
  const exportedFiles = Array.from(publicBase.matchAll(/from "\.\/base\/(?<file>[^"]+\.ts)"/gu))
    .map((match) => match.groups?.file ?? "")
    .filter((name) => name !== "")
    .filter((name, index, files) => files.indexOf(name) === index)
    .toSorted();
  expect(rendererFiles.toSorted()).toEqual(exportedFiles);
  expect(Object.keys(verifiedBaseComponents).toSorted()).toEqual(
    verifiedCatalog
      .filter((entry) => entry.category === "base")
      .map((entry) => entry.id)
      .toSorted(),
  );
  expect(Object.keys(verifiedApplicationComponents).toSorted()).toEqual(
    verifiedCatalog
      .filter((entry) => entry.category === "application")
      .map((entry) => entry.id)
      .toSorted(),
  );
  expect(Object.keys(verifiedMarketingComponents).toSorted()).toEqual(
    verifiedCatalog
      .filter((entry) => entry.category === "marketing")
      .map((entry) => entry.id)
      .toSorted(),
  );
});

it("the public package has no React or React Aria runtime", () => {
  const manifest = JSON.parse(
    readFileSync(new URL("../package.json", import.meta.url), "utf-8"),
  ) as { dependencies?: Record<string, string> };
  expect(
    Object.keys(manifest.dependencies ?? {}).filter((name) => /react|aria/iu.test(name)),
  ).toEqual([]);
});

it("the FoldKit source contains no raw upstream purple brand values or generic fallback", () => {
  const source = readdirSync(new URL("../src/base/", import.meta.url))
    .filter((name) => name.endsWith(".ts"))
    .map((name) => readFileSync(new URL(`../src/base/${name}`, import.meta.url), "utf-8"))
    .join("\n");
  expect(source).not.toMatch(
    /(?:#7f56d9|127\s+86\s+217|createComponentRenderer|fallback specimen)/iu,
  );
});

it("the category exports expose no pending implementation", () => {
  const manifest = readFileSync(new URL("../package.json", import.meta.url), "utf-8");
  expect(manifest).toContain('"./application": "./src/application.ts"');
  expect(manifest).toContain('"./marketing": "./src/marketing.ts"');
  const publicMarketing = readFileSync(new URL("../src/marketing.ts", import.meta.url), "utf-8");
  const exportedMarketingFiles = Array.from(
    publicMarketing.matchAll(/from "\.\/marketing\/(?<file>[^".]+)\.ts"/gu),
  )
    .map((match) => match.groups?.file ?? "")
    .filter((name) => name !== "")
    .filter((name, index, files) => files.indexOf(name) === index)
    .toSorted();
  expect(exportedMarketingFiles).toEqual(
    verifiedCatalog
      .filter((entry) => entry.category === "marketing")
      .map((entry) => entry.id)
      .toSorted(),
  );
  expect(publicMarketing).not.toContain(".pending");
});
