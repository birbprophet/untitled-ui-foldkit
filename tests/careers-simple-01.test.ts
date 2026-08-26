import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { careersSimple01 } from "../src/marketing/careers-simple-01.ts";
import type { CareersSimple01Props } from "../src/marketing/careers-simple-01.ts";

describe("careers simple 01", () => {
  it("keeps each semantic job link action controlled by the FoldKit program", () => {
    const props = {
      description: "We're a 100% remote team spread all across the world. Join us!",
      heading: "Open positions",
      jobs: [
        {
          badgeColor: "blue",
          badgeText: "Design",
          description: "We're looking for a mid-level product designer to join our team.",
          href: "#product-designer",
          id: "product-designer",
          location: "Remote",
          title: "Product Designer",
          type: "Full-time",
        },
      ],
      onJob: (id: string) => `job:${id}`,
    } satisfies CareersSimple01Props<string>;

    expect(props.onJob(props.jobs[0]?.id ?? "missing")).toBe("job:product-designer");
    expect(props.jobs[0]?.href).toBe("#product-designer");
    expect(props.jobs[0]?.badgeText).toBe("Design");
    expect(careersSimple01).toBeTypeOf("function");
  });
});
