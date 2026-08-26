import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { Form02ModalProps } from "../src/application/form-02-modal.ts";

describe("form 02 modal", () => {
  it("keeps profile fields, file selection, and actions controlled", () => {
    const props: Form02ModalProps<string> = {
      id: "company",
      isOpen: true,
      onAddCompany: "add",
      onAvatarSelected: (result) => result.accepted.at(0)?.name ?? "empty",
      onCancel: "cancel",
      onDismiss: "dismiss",
      onFieldInput: (field, value) => `${field}:${value}`,
      values: {
        company: "",
        description: "",
        keywords: "",
        username: "siglata",
        website: "",
      },
    };
    expect(props.onFieldInput("company", "Linear")).toBe("company:Linear");
    expect(props.onAvatarSelected({ accepted: [], oversized: [], unaccepted: [] })).toBe("empty");
  });
});
