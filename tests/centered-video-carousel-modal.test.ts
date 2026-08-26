import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { CenteredVideoCarouselModalProps } from "../src/application/centered-video-carousel-modal.ts";

describe("centered video carousel modal", () => {
  it("keeps slide and video state controlled", () => {
    const props: CenteredVideoCarouselModalProps<string> = {
      id: "video-onboarding",
      isOpen: true,
      messageForSlide: (index) => `slide-${String(index)}`,
      messageForVideoAction: (index, action) => `${String(index)}-${action.type}`,
      onDismiss: "dismiss",
      onFinish: "finish",
      onSkip: "skip",
      selectedIndex: 1,
      videoState: {
        currentTime: 0,
        duration: 3,
        isFullscreen: false,
        isMuted: false,
        isPlaying: false,
        playbackRate: 1,
        showThumbnail: true,
        volume: 1,
      },
    };
    expect(props.messageForSlide(2)).toBe("slide-2");
    expect(props.messageForVideoAction(1, { type: "toggle-play" })).toBe("1-toggle-play");
    expect(props.videoState.showThumbnail).toBe(true);
  });
});
