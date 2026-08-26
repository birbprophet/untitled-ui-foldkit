import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { careersCard01 } from "../src/marketing/careers-card-01.ts";
import type { CareersCard01Props } from "../src/marketing/careers-card-01.ts";

describe("careers card 01", () => {
  it("keeps department selection and job navigation controlled", () => {
    const props = {
      departments: [
        { id: "all", label: "View all" },
        { id: "design", label: "Design" },
      ],
      description: "We're a 100% remote team spread all across the world. Join us!",
      heading: "Open positions",
      jobs: [
        {
          badgeColor: "blue",
          badgeText: "Design",
          department: "Design",
          description: "We're looking for a mid-level product designer to join our team.",
          href: "#product-designer",
          id: "product-designer",
          location: "Remote",
          title: "Product Designer",
          type: "Full-time",
        },
      ],
      onDepartmentSelect: (id: string) => `department:${id}`,
      onJob: (id: string) => `job:${id}`,
      selectedDepartmentId: "all",
    } satisfies CareersCard01Props<string>;

    expect(props.onDepartmentSelect("design")).toBe("department:design");
    expect(props.onJob(props.jobs[0]?.id ?? "missing")).toBe("job:product-designer");
    expect(props.departments.map(({ label }) => label)).toEqual(["View all", "Design"]);
    expect(careersCard01).toBeTypeOf("function");
  });
});
