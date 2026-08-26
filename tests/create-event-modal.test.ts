import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { CreateEventModalProps } from "../src/application/create-event-modal.ts";

describe("create event modal", () => {
  it("keeps form, range, locale, and dialog actions controlled", () => {
    const props: CreateEventModalProps<string> = {
      attendeesCanInvite: false,
      description: "",
      endDateTime: "2027-01-14T12:00",
      focusedDate: "2027-01-08",
      id: "create-event",
      isOpen: true,
      locale: "pt-BR",
      location: "",
      messageForDescription: (value) => value,
      messageForEndDateTime: (value) => value,
      messageForFocusDate: (value) => value,
      messageForLocation: (value) => value,
      messageForPreset: (value) => value.start,
      messageForSelectDate: (value) => value,
      messageForStartDateTime: (value) => value,
      messageForTitle: (value) => value,
      month: 1,
      onCancel: "cancel",
      onCreate: "create",
      onDismiss: "dismiss",
      onNextMonth: "next",
      onPreviousMonth: "previous",
      onToggleAttendeeInvites: "toggle",
      range: { end: "2027-01-14", start: "2027-01-08" },
      startDateTime: "2027-01-08T10:00",
      title: "Company retreat",
      today: "2027-01-08",
      year: 2027,
    };
    expect(props.locale).toBe("pt-BR");
    expect(props.range).toEqual({ end: "2027-01-14", start: "2027-01-08" });
    expect(props.messageForTitle("Retiro da empresa")).toBe("Retiro da empresa");
  });
});
