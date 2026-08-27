import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { CareersSimple02BrandProps } from "../src/marketing/careers-simple-02-brand.ts";

describe("careers simple 02 brand", () => {
  it("keeps brand job selection controlled", () => {
    const props = {
      description: "We’re a global team.",
      eyebrow: "We’re hiring!",
      heading: "Join our team",
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
    } satisfies CareersSimple02BrandProps<string>;
    expect(props.onJob(props.jobs[0]?.id ?? "missing")).toBe("job:product-designer");
  });
});
