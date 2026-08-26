import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { BannerAppearanceModalProps } from "../src/application/banner-appearance-modal.ts";

describe("banner appearance modal", () => {
  it("keeps selection and actions controlled", () => {
    const props: BannerAppearanceModalProps<string> = {
      appearance: "simplified",
      id: "banner-appearance",
      isOpen: true,
      onAppearance: (appearance) => `appearance:${appearance}`,
      onCancel: "cancel",
      onDismiss: "dismiss",
      onEditCss: "edit-css",
      onHelp: "help",
      onSave: "save",
    };
    expect(props.onAppearance("custom")).toBe("appearance:custom");
    expect(props.onEditCss).toBe("edit-css");
    expect(props.onSave).toBe("save");
  });
});
