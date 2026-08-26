import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { careersSimple03Brand } from "../src/marketing/careers-simple-03-brand.ts";
import type { CareersSimple03BrandProps } from "../src/marketing/careers-simple-03-brand.ts";

describe("careers simple 03 brand", () => {
  it("keeps brand job selection controlled", () => {
    const props = {
      description: "We're a 100% remote team spread all across the world. Join us!",
      eyebrow: "Open positions",
      heading: "We're looking for talented people",
      jobs: [
        {
          description: "Join us.",
          href: "#ux-researcher",
          id: "ux-researcher",
          location: "Remote",
          title: "UX Researcher",
          type: "Full-time",
        },
      ],
      onJob: (id: string) => `job:${id}`,
    } satisfies CareersSimple03BrandProps<string>;
    expect(props.onJob(props.jobs[0]?.id ?? "missing")).toBe("job:ux-researcher");
    expect(careersSimple03Brand).toBeTypeOf("function");
  });
});
