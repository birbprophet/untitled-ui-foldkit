import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { careersCard03, careersCard03Categories } from "../src/marketing/careers-card-03.ts";
import type { CareersCard03Props } from "../src/marketing/careers-card-03.ts";

describe("careers card 03", () => {
  it("preserves categorized openings and controlled links", () => {
    const props = {
      categories: careersCard03Categories,
      description: "Remote",
      heading: "We're looking for talented people",
      imageAlt: "Woman artist",
      onJob: (id: string) => `job:${id}`,
    } satisfies CareersCard03Props<string>;
    expect(careersCard03Categories).toHaveLength(3);
    const jobs = careersCard03Categories.flatMap(({ jobs }) => jobs);
    expect(jobs).toHaveLength(6);
    expect(new Set(jobs.map(({ id }) => id)).size).toBe(6);
    expect(jobs.every(({ href, location }) => href === "#" && location.countryCode === "AU")).toBe(
      true,
    );
    expect(props.imageAlt).toBe("Woman artist");
    expect(props.onJob("ux-designer")).toBe("job:ux-designer");
    expect(careersCard03).toBeTypeOf("function");
  });
});
