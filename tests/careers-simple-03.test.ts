import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { careersSimple03 } from "../src/marketing/careers-simple-03.ts";
import type { CareersSimple03Props } from "../src/marketing/careers-simple-03.ts";

describe("careers simple 03", () => {
  it("keeps every displayed job actionable through the consumer", () => {
    const props = {
      description: "We're a 100% remote team spread all across the world. Join us!",
      eyebrow: "Open positions",
      heading: "We're looking for talented people",
      jobs: [
        {
          badgeColor: "blue",
          badgeText: "Design",
          description: "Join us.",
          href: "#ux-researcher",
          id: "ux-researcher",
          location: "Remote",
          title: "UX Researcher",
          type: "Full-time",
        },
      ],
      onJob: (id: string) => `job:${id}`,
    } satisfies CareersSimple03Props<string>;
    expect(props.onJob(props.jobs[0]?.id ?? "missing")).toBe("job:ux-researcher");
    expect(careersSimple03).toBeTypeOf("function");
  });
});
