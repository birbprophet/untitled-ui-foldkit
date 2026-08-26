import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import {
  addCalendarDays,
  calendarWeekStart,
  eventsForDate,
} from "../src/application/calendar-types.ts";

describe("application calendar", () => {
  it("localizes the first weekday", () => {
    expect(calendarWeekStart("2026-08-24", "en-US")).toBe("2026-08-23");
    expect(calendarWeekStart("2026-08-24", "pt-BR")).toBe("2026-08-23");
  });

  it("navigates dates without runtime time dependence", () => {
    expect(addCalendarDays("2026-08-24", 7)).toBe("2026-08-31");
  });

  it("includes events that overlap a date", () => {
    const events = [
      {
        end: "2026-08-25T10:00:00-03:00",
        id: "one",
        start: "2026-08-24T09:00:00-03:00",
        title: "Review",
      },
    ];
    expect(eventsForDate(events, "2026-08-24")).toHaveLength(1);
    expect(eventsForDate(events, "2026-08-26")).toHaveLength(0);
  });
});
