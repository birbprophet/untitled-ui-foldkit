import { describe, it } from "@effect/vitest";

import {
  contactSimpleIcons04,
  contactSimpleIcons04Locations,
} from "../src/marketing/contact-simple-icons-04.ts";
import type { ContactSimpleIcons04Props } from "../src/marketing/contact-simple-icons-04.ts";
import { expect } from "./assertions.ts";

describe("contact-simple-icons-04", () => {
  it("keeps the authenticated six-location fixture and source ordering", () => {
    expect(contactSimpleIcons04Locations).toHaveLength(6);
    expect(contactSimpleIcons04Locations.map(({ name }) => name)).toEqual([
      "Melbourne",
      "Sydney",
      "Byron Bay",
      "London",
      "San Francisco",
      "Sweden",
    ]);
  });

  it("exposes only the source-controlled static content props", () => {
    const props: ContactSimpleIcons04Props = {
      description: "Find us at these locations.",
      eyebrow: "Our locations",
      heading: "Visit our stores",
      locations: contactSimpleIcons04Locations,
    };
    expect(props.locations).toBe(contactSimpleIcons04Locations);
    expect(contactSimpleIcons04).toBeTypeOf("function");
  });
});
