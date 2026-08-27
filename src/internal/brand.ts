/* oxlint-disable mps/prefer-option-over-null -- Data-only identity contract shared by brand-aware sections; optional logo slots model upstream absence. */

/**
 * A square-ish symbol image a consuming application supplies, e.g. the host
 * product's robot mark rendered inside its own rounded-square tile.
 */
export interface BrandMark {
  readonly alt: string;
  readonly src: string;
}

/**
 * A logo lockup slot: the mark plus either a stylized wordmark image or plain
 * live text next to it. The library never bakes product artwork in.
 */
export interface BrandLockup {
  readonly mark: BrandMark;
  readonly text?: string;
  readonly wordmarkSrc?: string;
}
