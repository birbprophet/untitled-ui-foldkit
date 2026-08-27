import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { CalendarEventModalProps } from "../src/application/calendar-event-modal.ts";

const attendeeAvatar = (fill: string): string =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Crect width='96' height='96' fill='%23${fill}'/%3E%3C/svg%3E`;

describe("calendar event modal", () => {
  it("keeps locale, identities, and response actions controlled", () => {
    const attendees = [
      { avatarUrl: attendeeAvatar("7f56d9"), name: "Sienna Hewitt" },
      { avatarUrl: attendeeAvatar("9e77ed"), name: "Ammar Foley" },
      { avatarUrl: attendeeAvatar("b692f6"), name: "Pippa Wilkinson" },
      { avatarUrl: attendeeAvatar("d6bbfb"), name: "Olly Schroeder" },
      { avatarUrl: attendeeAvatar("f4ebff"), name: "Mathilde Lewis" },
    ];
    const props: CalendarEventModalProps<string> = {
      attendees,
      id: "calendar-event",
      isOpen: true,
      locale: "pt-BR",
      onAccept: "accept",
      onAddAttendee: "add",
      onDecline: "decline",
      onDismiss: "dismiss",
      onMaybe: "maybe",
      organizer: { avatarUrl: attendeeAvatar("444ce0"), name: "Sienna Hewitt" },
      organizerEmail: "sienna@siglata.com",
    };
    expect(props.locale).toBe("pt-BR");
    expect(props.onAccept).toBe("accept");
    expect(props.onAddAttendee).toBe("add");
    expect(props.attendees).toHaveLength(5);
    expect(props.organizer.name).toBe("Sienna Hewitt");
  });
});
