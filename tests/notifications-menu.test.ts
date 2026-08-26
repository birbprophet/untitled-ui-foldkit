import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { notificationsMenuFixture } from "../src/application/notifications-menu.ts";
import type { NotificationsMenuProps } from "../src/application/notifications-menu.ts";

describe("notifications menu", () => {
  it("preserves the authenticated feed order and optional anatomy", () => {
    const items = notificationsMenuFixture("en-US");
    const props: NotificationsMenuProps<string> = {
      id: "notifications-menu",
      isOpen: true,
      items,
      locale: "en-US",
      onDismiss: "dismiss",
    };

    expect(items).toHaveLength(15);
    expect(items.map((item) => item.id)).toEqual([
      "user-1",
      "user-2",
      "user-3",
      "user-4",
      "user-41",
      "user-5",
      "user-511",
      "user-512",
      "user-7",
      "user-70",
      "user-6",
      "user-78",
      "user-71",
      "user-72",
      "user-73",
    ]);
    expect(items.filter((item) => item.unseen === true)).toHaveLength(5);
    expect(items.filter((item) => item.attachment !== undefined)).toHaveLength(3);
    expect(items.filter((item) => item.message !== undefined)).toHaveLength(2);
    expect(items[0]?.attachment).toEqual({
      name: "Tech requirements.pdf",
      size: "720 KB",
      type: "pdf",
    });
    expect(items[12]?.message).toBe(
      "@olivia This is starting to look really good! I'll polish it up a bit and send it.",
    );
    expect(items[3]?.avatarSeed).toBe(items[4]?.avatarSeed);
    expect(items[5]?.avatarSeed).toBe(items[6]?.avatarSeed);
    expect(items[8]?.avatarSeed).toBe(items[9]?.avatarSeed);
    expect(items[11]?.avatarSeed).toBe(items[12]?.avatarSeed);
    expect(props.onDismiss).toBe("dismiss");
  });

  it("localizes visible output without changing deterministic identities", () => {
    const english = notificationsMenuFixture("en-US");
    const portuguese = notificationsMenuFixture("pt-BR");

    expect(portuguese[0]?.date).toBe("Agora");
    expect(portuguese[0]?.action).toEqual({
      content: "Adicionou um arquivo a",
      href: "#",
      target: "Redesign do site de marketing",
    });
    expect(portuguese[8]?.attachment?.name).toBe("Briefing de design e ideias.txt");
    expect(portuguese[10]?.message).toBe('"Devemos perguntar ao Oli sobre isso hoje."');
    expect(portuguese.map((item) => item.avatarSeed)).toEqual(
      english.map((item) => item.avatarSeed),
    );
    expect(portuguese.map((item) => item.avatarKind)).toEqual(
      english.map((item) => item.avatarKind),
    );
  });
});
