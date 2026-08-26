/**
 * Brand asset injection for identity-bearing renderers (logos, wordmarks).
 */

export interface BrandAssetRef {
  readonly alt: string;
  readonly url: string;
}

export interface BrandContext {
  readonly symbol: BrandAssetRef;
  readonly wordmarkHorizontal?: BrandAssetRef;
}

export const untitledDefaultBrandContext = {
  symbol: {
    alt: "Untitled UI",
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' rx='6' fill='%237f56d9'/%3E%3C/svg%3E",
  },
} as const satisfies BrandContext;
