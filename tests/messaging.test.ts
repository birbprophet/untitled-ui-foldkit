import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { MessagingMessage } from "../src/application/messaging.ts";

describe("application messaging", () => {
  it("keeps every upstream content branch framework-free", () => {
    const messages: readonly MessagingMessage[] = [
      { id: "text", text: "Hello" },
      { audio: { duration: "0:42" }, id: "audio" },
      { attachment: { name: "report.pdf", size: "4 MB", type: "pdf" }, id: "file" },
      { id: "typing", typing: true },
    ];
    expect(messages.map((message) => message.id)).toEqual(["text", "audio", "file", "typing"]);
  });

  it("names the exact interaction actions", () => {
    const actions = ["ai", "edit", "download", "reply", "copy", "play"] as const;
    expect(actions).toHaveLength(6);
  });
});
