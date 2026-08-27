import * as Testing from "effect-oxlint/testing";
import * as Effect from "effect/Effect";
import { describe, it } from "@effect/vitest";
import { strictEqual } from "@effect/vitest/utils";
import { effectSchemaOnlyRule } from "../src/effect-schema-only/rule.ts";

const namespaceImport = (source: string, local: string) =>
  Testing.importDeclWithSpecifiers(source, [Testing.importNamespaceSpecifier(local)]);
const namedImport = (source: string, imported: string) =>
  Testing.importDeclWithSpecifiers(source, [Testing.importSpecifier(imported)]);

describe("effect-schema-only", () => {
  it.effect("allows an unfamiliar source bound to an unfamiliar name", () =>
    Effect.sync(() => {
      const diagnostics = Testing.runRule(
        effectSchemaOnlyRule,
        "ImportDeclaration",
        namespaceImport("new-check-library", "Check"),
      );

      Testing.expectNoDiagnostics(diagnostics);
    }),
  );

  it.effect("allows a named import from an unfamiliar source", () =>
    Effect.sync(() => {
      const diagnostics = Testing.runRule(
        effectSchemaOnlyRule,
        "ImportDeclaration",
        namedImport("new-library", "parse"),
      );

      Testing.expectNoDiagnostics(diagnostics);
    }),
  );

  it.effect("allows Effect Schema and unrelated imports", () =>
    Effect.sync(() => {
      const diagnostics = Testing.runRuleMulti(effectSchemaOnlyRule, [
        ["ImportDeclaration", namespaceImport("effect/Schema", "Schema")],
        [
          "ImportDeclaration",
          Testing.importDeclWithSpecifiers("drizzle-orm/effect-schema", [
            Testing.importSpecifier("createSelectSchema"),
          ]),
        ],
        [
          "ImportDeclaration",
          Testing.importDeclWithSpecifiers("effect/Effect", [
            Testing.importNamespaceSpecifier("Effect"),
          ]),
        ],
      ]);

      Testing.expectNoDiagnostics(diagnostics);
    }),
  );

  it.effect("allows the PDF reading package and a pdfjs-dist deep path", () =>
    Effect.sync(() => {
      const diagnostics = Testing.runRuleMulti(effectSchemaOnlyRule, [
        ["ImportDeclaration", namedImport("pdf-reading", "readPdfWithReplay")],
        ["ImportDeclaration", namedImport("pdfjs-dist/legacy/build/pdf.mjs", "getDocument")],
      ]);

      Testing.expectNoDiagnostics(diagnostics);
    }),
  );

  it.effect("reports every validation vendor the repository refuses", () =>
    Effect.sync(() => {
      const vendors = [
        "zod",
        "valibot",
        "yup",
        "arktype",
        "io-ts",
        "joi",
        "superstruct",
        "runtypes",
      ];

      const diagnostics = Testing.runRuleMulti(
        effectSchemaOnlyRule,
        vendors.map((vendor) => ["ImportDeclaration", namedImport(vendor, "parse")] as const),
      );

      strictEqual(diagnostics.length, vendors.length);
    }),
  );
});
