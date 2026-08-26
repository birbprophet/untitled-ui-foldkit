import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import {
  careersCard02,
  careersCard02Jobs,
  careersCard02Locations,
} from "../src/marketing/careers-card-02.ts";
import type { CareersCard02Props } from "../src/marketing/careers-card-02.ts";

describe("careers card 02", () => {
  it("preserves the authenticated job and location semantics", () => {
    expect(careersCard02Jobs.map(({ title }) => title)).toEqual([
      "Product Designer",
      "Engineering Manager",
      "Customer Success Manager",
      "Account Executive",
      "SEO Marketing Manager",
    ]);
    expect(
      careersCard02Jobs.every(
        ({ location, type }) => location === "Remote" && type === "Full-time",
      ),
    ).toBe(true);
    expect(careersCard02Locations.find(({ id }) => id === "oceania")?.isDisabled).toBe(true);
  });

  it("keeps selection, focus, disclosure, and job activation controlled", () => {
    const props = {
      description: "Build with us.",
      eyebrow: "We're hiring!",
      filterLabel: "Filter by location",
      heading: "Join our team",
      jobs: careersCard02Jobs,
      locations: careersCard02Locations,
      onJob: (id: string) => `job:${id}`,
      onLocationFocus: (id: string) => `focus:${id}`,
      onLocationOpenChanged: (open: boolean) => `open:${String(open)}`,
      onLocationSelect: (id: string) => `select:${id}`,
      selectedLocationId: "worldwide",
    } satisfies CareersCard02Props<string>;

    expect(props.onLocationSelect("europe")).toBe("select:europe");
    expect(props.onLocationFocus("asia")).toBe("focus:asia");
    expect(props.onLocationOpenChanged(true)).toBe("open:true");
    expect(props.onJob("product-designer")).toBe("job:product-designer");
    expect(careersCard02).toBeTypeOf("function");
  });
});
