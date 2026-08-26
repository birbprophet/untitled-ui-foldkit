import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { CalendarEventModalProps } from "../src/application/calendar-event-modal.ts";

describe("calendar event modal", () => {
  it("keeps locale and response actions controlled", () => {
    const props: CalendarEventModalProps<string> = {
      id: "calendar-event",
      isOpen: true,
      locale: "pt-BR",
      onAccept: "accept",
      onAddAttendee: "add",
      onDecline: "decline",
      onDismiss: "dismiss",
      onMaybe: "maybe",
    };
    expect(props.locale).toBe("pt-BR");
    expect(props.onAccept).toBe("accept");
    expect(props.onAddAttendee).toBe("add");
  });
});
