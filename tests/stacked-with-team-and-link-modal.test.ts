import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { StackedWithTeamAndLinkModalProps } from "../src/application/stacked-with-team-and-link-modal.ts";

describe("stacked with team and link modal", () => {
  it("keeps locale, team, link state, and actions controlled", () => {
    const props: StackedWithTeamAndLinkModalProps<string> = {
      copied: false,
      id: "invite-team",
      isOpen: true,
      link: "join.siglata.com/organizations/northstar",
      locale: "pt-BR",
      members: [
        { avatarSeed: "ana-costa", name: "Ana Costa" },
        { avatarSeed: "joao-silva", name: "João Silva" },
        { avatarSeed: "bia-rocha", name: "Bia Rocha" },
      ],
      onCancel: "cancel",
      onContinue: "continue",
      onCopy: "copy",
      onDismiss: "dismiss",
      onLinkInput: (value) => `link:${value}`,
    };
    expect(props.locale).toBe("pt-BR");
    expect(props.members).toHaveLength(3);
    expect(props.onLinkInput("join.siglata.com/organizations/atlas")).toBe(
      "link:join.siglata.com/organizations/atlas",
    );
    expect(props.onCopy).toBe("copy");
  });
});
