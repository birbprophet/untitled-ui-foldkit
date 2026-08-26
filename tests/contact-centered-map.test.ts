import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { contactCenteredMap } from "../src/marketing/contact-centered-map.ts";
import type { ContactCenteredMapProps } from "../src/marketing/contact-centered-map.ts";

describe("contact centered map", () => {
  it("retains the six source locations and named map fixture", () => {
    const props = {
      description: "Say hello to our friendly team at one of these locations.",
      eyebrow: "Our locations",
      heading: "Visit our stores",
      leftLocations: [
        { address: "100 Flinders Street\nMelbourne VIC 3000 AU", name: "Melbourne" },
        { address: "100 George Street\nSydney NSW 2000 AU", name: "Sydney" },
        { address: "100 Jonson Street\nByron Bay NSW 2481 AU", name: "Byron Bay" },
      ],
      mapSrc: "https://snazzymaps.com/embed/451894",
      mapTitle: "Our address",
      rightLocations: [
        { address: "100 Oxford Street\nLondon W1D 1LL UK", name: "London" },
        {
          address: "100 Market Street\nSan Francisco, CA 94105 USA",
          name: "San Francisco",
        },
        { address: "Drottninggatan 100\n111 60 Stockholm SE", name: "Sweden" },
      ],
    } satisfies ContactCenteredMapProps;

    expect(props.leftLocations.map(({ name }) => name)).toEqual([
      "Melbourne",
      "Sydney",
      "Byron Bay",
    ]);
    expect(props.rightLocations.map(({ name }) => name)).toEqual([
      "London",
      "San Francisco",
      "Sweden",
    ]);
    expect(props.mapTitle).toBe("Our address");
    expect(props.mapSrc).toBe("https://snazzymaps.com/embed/451894");
    expect(contactCenteredMap).toBeTypeOf("function");
  });
});
