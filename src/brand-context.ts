/**
 * Brand asset injection for identity-bearing renderers (logos, wordmarks).
 *
 * Product-specific assets live in the consumer repository. Pass a `BrandContext`
 * into renderers that show identity, or rely on the upstream default.
 */

export interface BrandAssetRef {
  readonly alt: string;
  readonly url: string;
}

export interface BrandContext {
  readonly symbol: BrandAssetRef;
  readonly wordmarkHorizontal?: BrandAssetRef;
}

/** Untitled UI default identity until a host passes project assets. */
export const untitledDefaultBrandContext = {
  symbol: {
    alt: "Untitled UI",
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' rx='6' fill='%237f56d9'/%3E%3C/svg%3E",
  },
} as const satisfies BrandContext;
