import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type {
  NotificationSettingsCheckbox,
  NotificationSettingsCheckboxMenuProps,
} from "../src/application/notification-settings-checkbox-menu.ts";

describe("notification settings checkbox menu", () => {
  it("keeps selection, interval, locale, and slideout actions controlled", () => {
    const selectedSettings: readonly NotificationSettingsCheckbox[] = [
      "in-app-message-mentions",
      "in-app-outstanding-tasks-with-interval",
      "email-message-replies",
    ];
    const props: NotificationSettingsCheckboxMenuProps<string> = {
      id: "notification-settings",
      interval: "24-hours",
      isOpen: true,
      locale: "pt-BR",
      messageForInterval: (interval) => `interval-${interval}`,
      messageForToggle: (setting) => `toggle-${setting}`,
      onCancel: "cancel",
      onDismiss: "dismiss",
      onSave: "save",
      selectedSettings,
    };

    expect(props.selectedSettings).toEqual(selectedSettings);
    expect(props.messageForToggle("email-outstanding-tasks")).toBe(
      "toggle-email-outstanding-tasks",
    );
    expect(props.messageForInterval("1-week")).toBe("interval-1-week");
    expect(props.locale).toBe("pt-BR");
    expect(props.onSave).toBe("save");
  });
});
