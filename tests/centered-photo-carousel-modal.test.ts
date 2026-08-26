import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { CenteredPhotoCarouselModalProps } from "../src/application/centered-photo-carousel-modal.ts";

describe("centered photo carousel modal", () => {
  it("keeps slide selection and dismissal controlled", () => {
    const props: CenteredPhotoCarouselModalProps<string> = {
      id: "onboarding",
      isOpen: true,
      messageForSlide: (index) => `slide-${String(index)}`,
      onDismiss: "dismiss",
      onFinish: "finish",
      onSkip: "skip",
      selectedIndex: 2,
    };
    expect(props.selectedIndex).toBe(2);
    expect(props.messageForSlide(3)).toBe("slide-3");
    expect(props.onFinish).toBe("finish");
  });
});
