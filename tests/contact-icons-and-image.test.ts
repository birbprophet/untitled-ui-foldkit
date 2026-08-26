import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import {
  contactIconsAndImage,
  contactIconsAndImageImage,
  contactIconsAndImageLocations,
} from "../src/marketing/contact-icons-and-image.ts";
import type { ContactIconsAndImageProps } from "../src/marketing/contact-icons-and-image.ts";

describe("contact icons and image", () => {
  it("preserves the authenticated locations and image evidence", () => {
    expect(contactIconsAndImageLocations.map(({ title }) => title)).toEqual([
      "Melbourne",
      "Sydney",
    ]);
    expect(contactIconsAndImageLocations[0]?.subtitle).toContain("\n");
    expect(contactIconsAndImageImage).toEqual({
      alt: "Team discussing a topic",
      src: "https://www.untitledui.com/marketing/smiling-girl-3.webp",
    });
  });

  it("accepts the complete static component contract", () => {
    const props = {
      description: "We'd love to hear from you! Please get in touch.",
      eyebrow: "Contact us",
      heading: "Chat to our friendly team",
      imageAlt: contactIconsAndImageImage.alt,
      imageSrc: contactIconsAndImageImage.src,
      locations: contactIconsAndImageLocations,
    } satisfies ContactIconsAndImageProps;

    expect(props.locations).toHaveLength(2);
    expect(props.heading).toBe("Chat to our friendly team");
    expect(contactIconsAndImage).toBeTypeOf("function");
  });
});
