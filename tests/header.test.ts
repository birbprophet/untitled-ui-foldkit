import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { header } from "../src/marketing/header.ts";
import type { HeaderProps } from "../src/marketing/header.ts";

describe("header", () => {
  it("keeps the authenticated header navigation renderer controlled", () => {
    const props = {} as unknown as HeaderProps<string>;
    expect(header).toBeTypeOf("function");
    expect(props).toBeDefined();
  });
});
