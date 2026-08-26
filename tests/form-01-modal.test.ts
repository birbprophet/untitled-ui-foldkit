import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { Form01ModalProps } from "../src/application/form-01-modal.ts";

describe("form 01 modal", () => {
  it("keeps fields, selections, step, and actions controlled", () => {
    const props: Form01ModalProps<string> = {
      id: "experience",
      isCompanyOpen: false,
      isLocationOpen: false,
      isOpen: true,
      onAddExperience: "add",
      onDismiss: "dismiss",
      onFieldInput: (field, value) => `${field}:${value}`,
      onNext: "next",
      onPrevious: "previous",
      onSaveDraft: "save",
      onSelect: (field, id) => `${field}:${id}`,
      onSelectFocus: (field, id) => `focus:${field}:${id}`,
      onSelectOpenChanged: (field, isOpen) => `${field}:${String(isOpen)}`,
      selectedStep: 0,
      values: {
        companyId: "",
        companyQuery: "",
        description: "",
        employmentId: "fulltime",
        locationId: "",
        locationQuery: "",
        secondTitle: "",
        title: "",
        website: "",
      },
    };
    expect(props.onFieldInput("title", "Product designer")).toBe("title:Product designer");
    expect(props.onSelect("employmentId", "parttime")).toBe("employmentId:parttime");
  });
});
