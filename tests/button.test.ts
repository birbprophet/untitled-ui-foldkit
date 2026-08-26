import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { ButtonProps } from "../src/base/button.ts";

describe("button", () => {
  it("accepts the upstream variant surface", () => {
    const props: ButtonProps<string> = {
      color: "primary-destructive",
      iconLeading: true,
      isLoading: true,
      label: "Delete",
      onPress: "pressed",
      size: "lg",
    };
    expect(props.label).toBe("Delete");
    expect(props.size).toBe("lg");
  });
});
