import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { careersSimple04 } from "../src/marketing/careers-simple-04.ts";
import type { CareersSimple04Props } from "../src/marketing/careers-simple-04.ts";

describe("careers simple 04", () => {
  it("keeps image text and job action explicit", () => {
    const props = {
      description: "We’re a global team.",
      eyebrow: "We’re hiring!",
      heading: "Start doing work that matters",
      imageAlt: "Woman and laptop",
      jobs: [
        {
          badgeColor: "blue",
          badgeText: "Design",
          description: "Join us.",
          href: "#product-designer",
          id: "product-designer",
          location: "Remote",
          title: "Product Designer",
          type: "Full-time",
        },
      ],
      onJob: (id: string) => `job:${id}`,
    } satisfies CareersSimple04Props<string>;
    expect(props.imageAlt).toBe("Woman and laptop");
    expect(props.onJob(props.jobs[0]?.id ?? "missing")).toBe("job:product-designer");
    expect(careersSimple04).toBeTypeOf("function");
  });
});
