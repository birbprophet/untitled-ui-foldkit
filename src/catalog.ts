import type { VerificationEvidenceEncoded } from "./verification.ts";
import { verifiedEvidence } from "./verification.ts";

export type CatalogCategory = "base" | "application" | "marketing";
export type VerificationStatus = "pending" | "verified";

export interface CatalogEntry {
  readonly accessLevel: "authenticated";
  readonly category: CatalogCategory;
  readonly dependencies: readonly string[];
  readonly documentationUrl: string;
  readonly documentedVariants: readonly string[];
  readonly family: string;
  readonly id: string;
  readonly sourcePath: string;
  readonly sourceVersion: "untitledui@0.1.64/library-v8";
  readonly status: VerificationStatus;
  readonly storybookTitle: string;
  readonly verification?: VerificationEvidenceEncoded;
}

type CatalogSourceEntry = Omit<
  CatalogEntry,
  "accessLevel" | "dependencies" | "documentedVariants" | "storybookTitle" | "verification"
>;

const categoryTitles: Record<CatalogCategory, string> = {
  application: "Application",
  base: "Base",
  marketing: "Marketing",
};

const titleFromSlug = (slug: string): string =>
  slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

/** Derive family from source path; never fall back to an unrelated default. */
const catalogFamily = (entry: CatalogSourceEntry): string => {
  if (entry.family !== "root") {
    return entry.family;
  }
  const sourceFamily = entry.sourcePath.split("/").at(3);
  return sourceFamily ?? entry.id;
};

const catalogSource = [
  {
    category: "base",
    documentationUrl: "https://www.untitledui.com/react/components/badges",
    family: "root",
    id: "badges",
    sourcePath: "src/components/base/badges/badges.tsx",
    sourceVersion: "untitledui@0.1.64/library-v8",
    status: "pending",
  },
  {
    category: "base",
    documentationUrl: "https://www.untitledui.com/react/components/badge-groups",
    family: "root",
    id: "badge-groups",
    sourcePath: "src/components/base/badges/badge-groups.tsx",
    sourceVersion: "untitledui@0.1.64/library-v8",
    status: "pending",
  },
  {
    category: "base",
    documentationUrl: "https://www.untitledui.com/react/components/buttons",
    family: "root",
    id: "button",
    sourcePath: "src/components/base/buttons/button.tsx",
    sourceVersion: "untitledui@0.1.64/library-v8",
    status: "pending",
  },
] as const satisfies readonly CatalogSourceEntry[];

const toCatalogEntry = (entry: CatalogSourceEntry): CatalogEntry => {
  const family = catalogFamily(entry);
  const storybookTitle = `Untitled UI/${categoryTitles[entry.category]}/${titleFromSlug(entry.id)}`;
  const verification = verifiedEvidence[entry.id];
  if (verification !== undefined) {
    return {
      accessLevel: "authenticated",
      category: entry.category,
      dependencies: ["foldkit", "effect"],
      documentationUrl: entry.documentationUrl,
      documentedVariants: verification.documentedVariants,
      family,
      id: entry.id,
      sourcePath: entry.sourcePath,
      sourceVersion: entry.sourceVersion,
      status: "verified",
      storybookTitle,
      verification,
    };
  }
  return {
    accessLevel: "authenticated",
    category: entry.category,
    dependencies: [],
    documentationUrl: entry.documentationUrl,
    documentedVariants: [],
    family,
    id: entry.id,
    sourcePath: entry.sourcePath,
    sourceVersion: entry.sourceVersion,
    status: entry.status,
    storybookTitle,
  };
};

export const catalog: readonly CatalogEntry[] = catalogSource.map(toCatalogEntry);

export const verifiedCatalog = catalog.filter((entry) => entry.status === "verified");
