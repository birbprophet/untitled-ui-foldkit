import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { CareersSimple04BrandProps } from "../src/marketing/careers-simple-04-brand.ts";

describe("careers simple 04 brand", () => {
  it("keeps image text and brand job action explicit", () => {
    const props = {
      description: "We’re a global team.",
      eyebrow: "We’re hiring!",
      heading: "Start doing work that matters",
      imageAlt: "Smiling girl",
      jobs: [
        {
          description: "Join us.",
          href: "#product-designer",
          id: "product-designer",
          location: "Remote",
          title: "Product Designer",
          type: "Full-time",
        },
      ],
      onJob: (id: string) => `job:${id}`,
    } satisfies CareersSimple04BrandProps<string>;
    expect(props.imageAlt).toBe("Smiling girl");
    expect(props.onJob(props.jobs[0]?.id ?? "missing")).toBe("job:product-designer");
  });
});
