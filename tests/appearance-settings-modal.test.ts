import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { AppearanceSettingsModalProps } from "../src/application/appearance-settings-modal.ts";

describe("appearance settings modal", () => {
  it("keeps every selection and action controlled", () => {
    const props: AppearanceSettingsModalProps<string> = {
      brandColor: "#0B7D74",
      customColor: "#0B7D74",
      id: "appearance",
      isApplyToAllTeams: false,
      isOpen: true,
      mode: "system",
      onApplyToAllTeams: "apply",
      onBrandColor: (color) => `brand:${color}`,
      onCancel: "cancel",
      onCustomColor: (color) => `custom:${color}`,
      onDismiss: "dismiss",
      onMode: (mode) => `mode:${mode}`,
      onSave: "save",
    };
    expect(props.onBrandColor("#E04F16")).toBe("brand:#E04F16");
    expect(props.onCustomColor("#269B8F")).toBe("custom:#269B8F");
    expect(props.onMode("dark")).toBe("mode:dark");
    expect(props.onApplyToAllTeams).toBe("apply");
    expect(props.onSave).toBe("save");
  });
});
