import { describe, it } from "@effect/vitest";

import {
  careersCard04,
  careersCard04Categories,
  careersCard04LocationValues,
} from "../src/marketing/careers-card-04.ts";
import type { CareersCard04Props } from "../src/marketing/careers-card-04.ts";
import { expect } from "./assertions.ts";

describe("careers card 04", () => {
  it("preserves the categorized openings and controlled interactions", () => {
    const props = {
      categories: careersCard04Categories,
      description: "Careers",
      heading: "Start doing work that matters",
      imageAlt: "Collaboration",
      imageSrc: "https://www.untitledui.com/marketing/collaboration.webp",
      locationLabel: "Location:",
      locations: careersCard04LocationValues.map((location) => ({
        id: location.id,
        label: location.label,
        onFocus: `focus:${location.id}`,
        onSelect: `select:${location.id}`,
      })),
      onJob: (id: string) => `job:${id}`,
      onLocationOpenChanged: (isOpen: boolean) => `open:${String(isOpen)}`,
      selectedLocationId: "worldwide",
    } satisfies CareersCard04Props<string>;

    expect(careersCard04Categories).toHaveLength(3);
    expect(careersCard04Categories.flatMap(({ jobs }) => jobs)).toHaveLength(6);
    expect(props.locations).toHaveLength(5);
    expect(props.locations[1]?.onSelect).toBe("select:europe");
    expect(props.onJob("product-designer")).toBe("job:product-designer");
    expect(props.onLocationOpenChanged(true)).toBe("open:true");
    expect(props.imageAlt).toBe("Collaboration");
    expect(careersCard04).toBeTypeOf("function");
  });
});
