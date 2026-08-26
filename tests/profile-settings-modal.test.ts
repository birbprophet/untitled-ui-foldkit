import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type {
  ProfileSettingsField,
  ProfileSettingsModalProps,
} from "../src/application/profile-settings-modal.ts";

const fieldInput = (field: ProfileSettingsField, value: string): string => `${field}:${value}`;

describe("profile settings modal", () => {
  it("keeps fields, consent, upload, and actions controlled", () => {
    const props: ProfileSettingsModalProps<string> = {
      consent: false,
      copied: false,
      id: "profile-settings",
      introduction: "",
      isDraggingOver: false,
      isOpen: true,
      onCancel: "cancel",
      onConsent: "consent",
      onCopy: "copy",
      onDismiss: "dismiss",
      onDragState: (dragging) => `drag:${String(dragging)}`,
      onFieldInput: fieldInput,
      onPublish: "publish",
      onUpload: (files) => `upload:${String(files.length)}`,
      username: "@oliviarhye",
    };

    expect(props.onFieldInput("username", "@maya")).toBe("username:@maya");
    expect(props.onDragState(true)).toBe("drag:true");
    expect(props.onUpload([])).toBe("upload:0");
  });
});
