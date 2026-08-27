import { blobatarUri } from "blobatar/uri";

/**
 * Deterministic, version-pinned demo avatars for stories. Pin `gen=1` so the
 * same name renders the same face for the lifetime of this corpus.
 */
const face =
  (species: string) =>
  (name: string): string =>
    blobatarUri(`${species} ${name}`, {
      background: "circle",
      size: 128,
      title: name,
    });

export const agentFace = face("agent");
export const robotFace = face("robot");

/** Demo robot-symbol logo tile a host application would replace. */
export const demoBrand = (product = "Siglata") => ({
  mark: {
    alt: `${product} symbol`,
    src: robotFace(`${product} symbol`),
  },
  text: product,
});
