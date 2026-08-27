import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { agentFace } from "../stories/fixtures/brand.ts";
import { notificationsMenuFixture } from "../src/application/notifications-menu.ts";
import type { NotificationsMenuProps } from "../src/application/notifications-menu.ts";

const faces = {
  "Ava Wright": agentFace("Ava Wright"),
  "Candice Wu": agentFace("Candice Wu"),
  "Demi Wilkinson": agentFace("Demi Wilkinson"),
  "Drew Cano": agentFace("Drew Cano"),
  "Eve Leroy": agentFace("Eve Leroy"),
  "Kate Morrison": agentFace("Kate Morrison"),
  "Koray Okumus": agentFace("Koray Okumus"),
  "Lana Steiner": agentFace("Lana Steiner"),
  "Natali Craig": agentFace("Natali Craig"),
  "Orlando Diggs": agentFace("Orlando Diggs"),
  "Phoenix Baker": agentFace("Phoenix Baker"),
};

describe("notifications menu", () => {
  it("preserves the authenticated feed order and optional anatomy", () => {
    const items = notificationsMenuFixture("en-US", faces);
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
    const expectedFaces = [
      faces["Phoenix Baker"],
      faces["Lana Steiner"],
      faces["Demi Wilkinson"],
      faces["Candice Wu"],
      faces["Candice Wu"],
      faces["Natali Craig"],
      faces["Natali Craig"],
      faces["Orlando Diggs"],
      faces["Drew Cano"],
      faces["Drew Cano"],
      faces["Kate Morrison"],
      faces["Koray Okumus"],
      faces["Koray Okumus"],
      faces["Ava Wright"],
      faces["Eve Leroy"],
    ];
    expect(items.map((item) => item.avatarUrl)).toEqual(expectedFaces);
    expect(items[3]?.avatarUrl).toBe(items[4]?.avatarUrl);
    expect(items[5]?.avatarUrl).toBe(items[6]?.avatarUrl);
    expect(items[8]?.avatarUrl).toBe(items[9]?.avatarUrl);
    expect(items[11]?.avatarUrl).toBe(items[12]?.avatarUrl);
    expect(props.onDismiss).toBe("dismiss");
  });

  it("localizes visible output while identities come from the supplied avatars", () => {
    const english = notificationsMenuFixture("en-US", faces);
    const portuguese = notificationsMenuFixture("pt-BR", faces);

    expect(portuguese[0]?.date).toBe("Agora");
    expect(portuguese[0]?.action).toEqual({
      content: "Adicionou um arquivo a",
      href: "#",
      target: "Redesign do site de marketing",
    });
    expect(portuguese[8]?.attachment?.name).toBe("Briefing de design e ideias.txt");
    expect(portuguese[10]?.message).toBe('"Devemos perguntar ao Oli sobre isso hoje."');
    expect(portuguese.map((item) => item.avatarUrl)).toEqual(english.map((item) => item.avatarUrl));
    expect(portuguese[0]?.avatarUrl).toBe(faces["Phoenix Baker"]);
    expect(portuguese[3]?.user.name).toBe(english[3]?.user.name);
  });
});
