/* oxlint-disable effect/noReturnInArrow -- Direct FoldKit transcription of the authenticated Untitled UI testimonial-card section. */
import type { Html, HtmlBuilder } from "foldkit/html";
import { avatar } from "../base/avatar.ts";

export interface TestimonialCardProps {
  readonly avatarAlt: string;
  readonly avatarSrc?: string;
  readonly category: string;
  readonly name: string;
  readonly quote: string;
  readonly role: string;
}

export const testimonialCard = <Message>(
  props: TestimonialCardProps,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("bg-bg-primary py-16 md:py-24"), h.Dir("ltr")],
    [
      h.div(
        [h.Class("mx-auto max-w-container px-4 md:px-8")],
        [
          h.figure(
            [
              h.Class(
                "flex flex-col gap-6 rounded-2xl bg-bg-secondary px-6 py-10 text-center text-balance md:gap-8 md:px-8 md:py-12 lg:p-16",
              ),
            ],
            [
              h.div(
                [h.Class("flex flex-col gap-3")],
                [
                  h.span(
                    [h.Class("text-sm font-semibold text-text-brand-secondary")],
                    [props.category],
                  ),
                  h.blockquote(
                    [
                      h.Class(
                        "text-display-xs font-medium text-text-primary sm:text-display-sm md:text-display-md",
                      ),
                    ],
                    [props.quote],
                  ),
                ],
              ),
              h.figcaption(
                [h.Class("flex justify-center")],
                [
                  h.div(
                    [h.Class("flex flex-col items-center gap-4")],
                    [
                      avatar(
                        {
                          alt: props.avatarAlt,
                          border: true,
                          size: "lg",
                          src: props.avatarSrc,
                        },
                        h,
                      ),
                      h.div(
                        [h.Class("flex flex-col gap-1")],
                        [
                          h.p([h.Class("text-md font-semibold text-text-primary")], [props.name]),
                          h.cite([h.Class("text-sm not-italic text-text-tertiary")], [props.role]),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  );
