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
        {
          avatarUrl:
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Crect width='96' height='96' fill='%237f56d9'/%3E%3C/svg%3E",
          name: "Ana Costa",
        },
        {
          avatarUrl:
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Crect width='96' height='96' fill='%239e77ed'/%3E%3C/svg%3E",
          name: "João Silva",
        },
        {
          avatarUrl:
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Crect width='96' height='96' fill='%23b692f6'/%3E%3C/svg%3E",
          name: "Bia Rocha",
        },
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
