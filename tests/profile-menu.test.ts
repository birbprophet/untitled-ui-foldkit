import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { ProfileMenuProps } from "../src/application/profile-menu.ts";

describe("profile menu", () => {
  it("keeps profile data, locale, tags, and actions controlled", () => {
    const props: ProfileMenuProps<string> = {
      email: "olivia@siglata.com",
      experiences: [
        {
          company: "Layers Studio™",
          companySeed: "layers-studio",
          dateRange: "mai. 2020 – presente",
          role: "Fundadora",
        },
      ],
      id: "profile-menu",
      isOpen: true,
      locale: "pt-BR",
      location: "Melbourne, Austrália",
      name: "Olivia Rhye",
      onAddTag: "add-tag",
      onAddToProject: "add-project",
      onDismiss: "dismiss",
      onNewProject: "new-project",
      onStudio: "studio",
      profileSeed: "olivia-rhye",
      tags: ["Design", "Produto", "Design de UI"],
      website: "layers.studio",
    };
    expect(props.locale).toBe("pt-BR");
    expect(props.tags).toHaveLength(3);
    expect(props.experiences[0]?.companySeed).toBe("layers-studio");
    expect(props.onAddTag).toBe("add-tag");
    expect(props.onDismiss).toBe("dismiss");
  });
});
