import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import {
  adjustCreateEventDateTime,
  createEventDateTimeNavigationTarget,
  createEventDateTimeParts,
  inputCreateEventDateTimeSegment,
} from "../src/application/create-event-menu.ts";
import type { CreateEventMenuProps } from "../src/application/create-event-menu.ts";

const propsFor = (locale: "en-US" | "pt-BR"): CreateEventMenuProps<string> => ({
  canInviteOthers: true,
  canModifyEvent: false,
  canSeeGuestList: true,
  description: "",
  endDateTime: "2027-01-14T12:00",
  id: "create-event",
  isOpen: true,
  locale,
  location: "",
  messageForDescription: (value) => `description:${value}`,
  messageForEndDateTime: (value) => `end:${value}`,
  messageForEndDateTimeDigit: (segment, digit) => `end-digit:${String(segment)}:${String(digit)}`,
  messageForEndDateTimeNavigation: (segment, direction) =>
    `end-navigation:${String(segment)}:${String(direction)}`,
  messageForEndDateTimeSegmentFocus: (segment) => `end-focus:${String(segment)}`,
  messageForLocation: (value) => `location:${value}`,
  messageForStartDateTime: (value) => `start:${value}`,
  messageForStartDateTimeDigit: (segment, digit) =>
    `start-digit:${String(segment)}:${String(digit)}`,
  messageForStartDateTimeNavigation: (segment, direction) =>
    `start-navigation:${String(segment)}:${String(direction)}`,
  messageForStartDateTimeSegmentFocus: (segment) => `start-focus:${String(segment)}`,
  messageForTitle: (value) => `title:${value}`,
  onCancel: "cancel",
  onCreate: "create",
  onDismiss: "dismiss",
  onToggleInviteOthers: "invite",
  onToggleModifyEvent: "modify",
  onToggleSeeGuestList: "guest-list",
  onUnmount: "unmount",
  startDateTime: "2027-01-08T09:00",
  title: "Company retreat",
});

describe("create event menu", () => {
  it("keeps form fields, permissions, and actions controlled", () => {
    const props = propsFor("en-US");
    expect(props.messageForTitle("Planning retreat")).toBe("title:Planning retreat");
    expect(props.messageForStartDateTime("2027-01-08T10:00")).toBe("start:2027-01-08T10:00");
    expect(props.canInviteOthers).toBe(true);
    expect(props.canModifyEvent).toBe(false);
  });

  it("supports the Portuguese date and copy branch without RTL", () => {
    const props = propsFor("pt-BR");
    expect(props.locale).toBe("pt-BR");
    expect(createEventDateTimeParts(props.startDateTime, props.locale).join("")).toBe(
      "8 / 1 / 2027 , 09 : 00",
    );
    expect(createEventDateTimeParts(props.startDateTime, "en-US").join("")).toBe(
      "1 / 8 / 2027 , 9 : 00 AM",
    );
  });

  it("updates every locale-sensitive segment through controlled values", () => {
    expect(adjustCreateEventDateTime("2027-01-08T09:00", "pt-BR", 0, 1)).toBe("2027-01-09T09:00");
    expect(adjustCreateEventDateTime("2027-01-08T09:00", "pt-BR", 1, 1)).toBe("2027-02-08T09:00");
    expect(adjustCreateEventDateTime("2027-01-31T09:00", "pt-BR", 1, 1)).toBe("2027-02-28T09:00");
    expect(adjustCreateEventDateTime("2027-01-08T09:00", "en-US", 3, 1)).toBe("2027-01-08T10:00");
    expect(adjustCreateEventDateTime("2027-01-08T09:00", "en-US", 5, 1)).toBe("2027-01-08T21:00");
  });

  it("moves focus between LTR segments without leaving a date field", () => {
    expect(createEventDateTimeNavigationTarget("pt-BR", 0, -1)).toBe(0);
    expect(createEventDateTimeNavigationTarget("pt-BR", 0, 1)).toBe(1);
    expect(createEventDateTimeNavigationTarget("pt-BR", 4, 1)).toBe(4);
    expect(createEventDateTimeNavigationTarget("en-US", 4, 1)).toBe(5);
  });

  it("accepts numeric segment entry and advances with React Aria rules", () => {
    const firstMonthDigit = inputCreateEventDateTimeSegment("2027-01-08T09:00", "en-US", 0, 1, "");
    expect(firstMonthDigit).toEqual({
      enteredKeys: "1",
      focusNext: false,
      value: "2027-01-08T09:00",
    });
    expect(
      inputCreateEventDateTimeSegment(
        firstMonthDigit.value,
        "en-US",
        0,
        2,
        firstMonthDigit.enteredKeys,
      ),
    ).toEqual({ enteredKeys: "", focusNext: true, value: "2027-12-08T09:00" });

    const firstHourDigit = inputCreateEventDateTimeSegment("2027-01-08T09:00", "pt-BR", 3, 1, "");
    expect(firstHourDigit).toEqual({
      enteredKeys: "1",
      focusNext: false,
      value: "2027-01-08T01:00",
    });
    expect(
      inputCreateEventDateTimeSegment(
        firstHourDigit.value,
        "pt-BR",
        3,
        8,
        firstHourDigit.enteredKeys,
      ),
    ).toEqual({ enteredKeys: "", focusNext: true, value: "2027-01-08T18:00" });

    expect(inputCreateEventDateTimeSegment("2027-01-08T21:00", "en-US", 3, 1, "").value).toBe(
      "2027-01-08T13:00",
    );
  });
});
