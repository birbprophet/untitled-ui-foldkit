import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type {
  NotificationChannel,
  NotificationIntervalUnit,
  NotificationSetting,
  NotificationSettingsButtonMenuProps,
} from "../src/application/notification-settings-button-menu.ts";

const channels: Readonly<Record<NotificationSetting, NotificationChannel>> = {
  "message-mentions": "email",
  "message-replies": "email",
  "new-projects": "in-app",
  "new-team-members": "in-app",
  "outstanding-tasks": "in-app",
};

describe("notification settings button menu", () => {
  it("keeps every channel and interval control in the consuming FoldKit model", () => {
    const props: NotificationSettingsButtonMenuProps<string> = {
      channels,
      focusedChannels: {
        "message-mentions": "none",
        "message-replies": "none",
        "new-projects": "none",
        "new-team-members": "none",
        "outstanding-tasks": "none",
      },
      id: "notification-settings-button-menu",
      intervalAmount: "24",
      intervalUnit: "hours",
      isOpen: true,
      locale: "en-US",
      onAddCustom: "add-custom",
      onCancel: "cancel",
      onChannelChange: (setting, channel) => `${setting}:${channel}`,
      onChannelFocus: (setting, channel) => `focus:${setting}:${channel}`,
      onDismiss: "dismiss",
      onIntervalAmountInput: (value) => `amount:${value}`,
      onIntervalUnitChange: (unit) => `unit:${unit}`,
      onSave: "save",
    };
    const ptBr: NotificationSettingsButtonMenuProps<string>["locale"] = "pt-BR";
    const unit: NotificationIntervalUnit = "weeks";

    expect(props.channels).toEqual(channels);
    expect(props.onChannelChange("message-replies", "none")).toBe("message-replies:none");
    expect(props.onChannelFocus("message-replies", "in-app")).toBe("focus:message-replies:in-app");
    expect(props.onIntervalAmountInput("48")).toBe("amount:48");
    expect(props.onIntervalUnitChange(unit)).toBe("unit:weeks");
    expect([props.onAddCustom, props.onCancel, props.onDismiss, props.onSave]).toEqual([
      "add-custom",
      "cancel",
      "dismiss",
      "save",
    ]);
    expect(ptBr).toBe("pt-BR");
  });
});
