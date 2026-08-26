import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { careersSimple01Brand } from "../src/marketing/careers-simple-01-brand.ts";
import type { CareersSimple01BrandProps } from "../src/marketing/careers-simple-01-brand.ts";

describe("careers simple 01 brand", () => {
  it("keeps the job destination and activation message controlled", () => {
    const props = {
      description: "We’re a 100% remote team spread all across the world. Join us!",
      heading: "Open positions",
      jobs: [
        {
          badgeColor: "blue",
          badgeText: "Design",
          description: "Join our team.",
          href: "#product-designer",
          id: "product-designer",
          location: "Remote",
          title: "Product Designer",
          type: "Full-time",
        },
        {
          badgeColor: "orange",
          description: "This final source fixture is intentionally omitted.",
          href: "#ux-researcher",
          id: "ux-researcher",
          location: "Remote",
          title: "UX Researcher",
          type: "Full-time",
        },
      ],
      onJob: (id: string) => `job:${id}`,
    } satisfies CareersSimple01BrandProps<string>;

    expect(props.onJob(props.jobs[0]?.id ?? "missing")).toBe("job:product-designer");
    expect(props.jobs.slice(0, -1)).toHaveLength(1);
    expect(props.jobs[0]?.href).toBe("#product-designer");
    expect(careersSimple01Brand).toBeTypeOf("function");
  });
});
