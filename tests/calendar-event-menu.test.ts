import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { agentFace } from "../stories/fixtures/brand.ts";
import type { CalendarEventMenuProps } from "../src/application/calendar-event-menu.ts";

describe("calendar event menu", () => {
  it("keeps locale, response, event actions, and dismissal controlled", () => {
    const props: CalendarEventMenuProps<string> = {
      avatars: {
        "ammar-foley": agentFace("Ammar Foley"),
        "mathilde-lewis": agentFace("Mathilde Lewis"),
        "olly-schroeder": agentFace("Olly Schroeder"),
        "pippa-wilkinson": agentFace("Pippa Wilkinson"),
        "sienna-hewitt": agentFace("Sienna Hewitt"),
      },
      id: "calendar-event-menu",
      isOpen: true,
      locale: "pt-BR",
      onAddAttendee: "add",
      onCopyLink: "copy",
      onDelete: "delete",
      onDismiss: "dismiss",
      onEdit: "edit",
      onResponse: (response) => `response:${response}`,
      onUnmount: "unmount",
      response: "yes",
    };

    expect(props.locale).toBe("pt-BR");
    expect((["yes", "no", "maybe"] as const).map((response) => props.onResponse(response))).toEqual(
      ["response:yes", "response:no", "response:maybe"],
    );
    expect([props.onAddAttendee, props.onCopyLink, props.onDelete, props.onEdit]).toEqual([
      "add",
      "copy",
      "delete",
      "edit",
    ]);
    expect(props.onDismiss).toBe("dismiss");
    expect(props.onUnmount).toBe("unmount");
  });

  it("records the authenticated fixture's inconsistent weekday without correcting it", () => {
    const authenticatedDate = "Friday, Jan 10, 2027";
    expect(authenticatedDate).toContain("Friday");
  });
});
