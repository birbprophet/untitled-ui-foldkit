import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { monthDates, weekdays } from "../src/application/calendar-month.ts";

describe("calendar month locale", () => {
  it("renders en-US and pt-BR weekday headers from Intl", () => {
    const enUs = weekdays("en-US");
    const ptBr = weekdays("pt-BR");

    expect(enUs.length).toBe(7);
    expect(ptBr.length).toBe(7);
    expect(enUs[0]).toBe("Sun");
    expect(enUs[6]).toBe("Sat");
    expect(ptBr[0]).toBe("dom.");
    expect(ptBr[1]).toBe("seg.");
    expect(ptBr[2]).toBe("ter.");
  });

  it("grids a Sunday-start month regardless of locale", () => {
    const dates = monthDates("2026-08-15", "en-US");

    expect(dates.length).toBe(42);
    expect(dates[0]).toBe("2026-07-26");
    expect(dates.includes("2026-08-15")).toBe(true);
    expect(monthDates("2026-08-15", "pt-BR")[0]).toBe(dates[0]);
  });
});
