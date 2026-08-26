import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { DatePickerModalProps } from "../src/application/date-picker-modal.ts";

describe("date picker modal", () => {
  it("keeps range, locale, and dialog actions controlled", () => {
    const props: DatePickerModalProps<string> = {
      focusedDate: "2027-01-08",
      id: "picker",
      isOpen: true,
      locale: "pt-BR",
      messageForFocusDate: (date) => date,
      messageForPreset: (range) => range.start,
      messageForSelectDate: (date) => date,
      month: 1,
      onApply: "apply",
      onCancel: "cancel",
      onDismiss: "dismiss",
      onNextMonth: "next",
      onPreviousMonth: "previous",
      range: { end: "2027-01-08", start: "2027-01-01" },
      today: "2027-01-08",
      year: 2027,
    };
    expect(props.locale).toBe("pt-BR");
    expect(props.messageForPreset(props.range)).toBe("2027-01-01");
    expect(props.onApply).toBe("apply");
  });
});
