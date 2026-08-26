import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { careersSimple02 } from "../src/marketing/careers-simple-02.ts";
import type { CareersSimple02Props } from "../src/marketing/careers-simple-02.ts";

describe("careers simple 02", () => {
  it("keeps the authenticated job action controlled", () => {
    const props = {
      description: "We’re a global team.",
      eyebrow: "We’re hiring!",
      heading: "Join our team",
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
    } satisfies CareersSimple02Props<string>;
    expect(props.onJob(props.jobs[0]?.id ?? "missing")).toBe("job:product-designer");
    expect(props.jobs[0]?.badgeText).toBe("Design");
    expect(careersSimple02).toBeTypeOf("function");
  });
});
