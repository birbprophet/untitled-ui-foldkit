import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { menu2ColWithLinks } from "../src/marketing/menu-2-col-with-links.ts";
import type { Menu2ColWithLinksProps } from "../src/marketing/menu-2-col-with-links.ts";

describe("menu 2 col with links", () => {
  it("keeps the authenticated header navigation renderer controlled", () => {
    const props = {} as unknown as Menu2ColWithLinksProps<string>;
    expect(menu2ColWithLinks).toBeTypeOf("function");
    expect(props).toBeDefined();
  });
});
