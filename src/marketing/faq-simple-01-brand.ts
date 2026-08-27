/* oxlint-disable effect/noReturnInArrow, effect/noTernary -- Direct FoldKit transcription of the authenticated Untitled UI FAQ section. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { avatar } from "../base/avatar.ts";
import { button } from "../base/button.ts";

export type FaqSimple01BrandIcon = "credit-card" | "file" | "heart" | "mail" | "slash" | "switch";

export interface FaqSimple01BrandItem {
  readonly answer: string;
  readonly icon: FaqSimple01BrandIcon;
  readonly id: string;
  readonly question: string;
}

export interface FaqSimple01BrandAvatar {
  readonly alt: string;
  readonly emphasis?: boolean;
  readonly id: string;
  readonly size: "lg" | "xl";
  readonly src: string;
}

export interface FaqSimple01BrandProps<Message> {
  readonly ctaDescription: string;
  readonly ctaHeading: string;
  readonly ctaLabel: string;
  readonly description: string;
  readonly heading: string;
  readonly items: readonly FaqSimple01BrandItem[];
  readonly onCta: NoInfer<Message>;
  readonly avatars: readonly FaqSimple01BrandAvatar[];
}

export const faqSimple01BrandDefaultItems = [
  {
    answer: "Yes, you can try us for free for 30 days.",
    icon: "heart",
    id: "trial",
    question: "Is there a free trial available?",
  },
  {
    answer: "Our pricing scales with your company.",
    icon: "switch",
    id: "plan",
    question: "Can I change my plan later?",
  },
  {
    answer: "You can cancel your plan at any time.",
    icon: "slash",
    id: "cancel",
    question: "What is your cancellation policy?",
  },
  {
    answer: "You can add additional information to invoices.",
    icon: "file",
    id: "invoice",
    question: "Can other info be added to an invoice?",
  },
  {
    answer: "Plans are per workspace, not per account.",
    icon: "credit-card",
    id: "billing",
    question: "How does billing work?",
  },
  {
    answer: "You can change the email from your account settings.",
    icon: "mail",
    id: "email",
    question: "How do I change my account email?",
  },
] as const satisfies readonly FaqSimple01BrandItem[];

const iconPaths: Record<FaqSimple01BrandIcon, readonly string[]> = {
  "credit-card": [
    "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3Z",
  ],
  file: [
    "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z",
    "M14 2v6h6M16 13H8M16 17H8M10 9H8",
  ],
  heart: ["M19.5 12.572l-7.5 7.428-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 1 1 7.5 6.572"],
  mail: [
    "m2 7 8.165 5.715c.661.463.992.695 1.351.784a2 2 0 0 0 .968 0c.36-.09.69-.32 1.351-.784L22 7M6.8 20h10.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C22 17.72 22 16.88 22 15.2V8.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C19.72 4 18.88 4 17.2 4H6.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C2 6.28 2 7.12 2 8.8v6.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C4.28 20 5.12 20 6.8 20Z",
  ],
  slash: [
    "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z",
    "m4.93 4.93 14.14 14.14",
  ],
  switch: ["M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"],
};

const featuredIcon = <Message>(
  kind: FaqSimple01BrandIcon,
  size: "md" | "lg",
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [
      h.Class(
        `${size === "lg" ? "hidden size-12 md:flex" : "flex size-10 md:hidden" 
          } items-center justify-center rounded-lg ${ 
          true
            ? "bg-bg-brand-solid text-fg-white shadow-xs-skeuomorphic"
            : "bg-bg-secondary text-fg-quaternary ring-1 ring-border-secondary ring-inset"}`,
      ),
      h.DataAttribute("featured-icon", kind),
    ],
    [
      h.svg(
        [
          h.AriaHidden(true),
          h.Class(size === "lg" ? "size-6" : "size-5"),
          h.Fill("none"),
          h.Stroke("currentColor"),
          h.StrokeLinecap("round"),
          h.StrokeLinejoin("round"),
          h.StrokeWidth("2"),
          h.ViewBox("0 0 24 24"),
        ],
        iconPaths[kind].map((path) => h.path([h.D(path)])),
      ),
    ],
  );

const avatarNode = <Message>(entry: FaqSimple01BrandAvatar, h: HtmlBuilder<Message>): Html =>
  avatar({ alt: entry.alt, size: entry.size, src: entry.src }, h);

export const faqSimple01Brand = <Message>(
  props: FaqSimple01BrandProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const itemNodes = props.items.map((item) =>
    h.keyed("div")(
      item.id,
      [h.Class("flex max-w-sm flex-col items-center text-center")],
      [
        featuredIcon(item.icon, "lg", h),
        featuredIcon(item.icon, "md", h),

        h.dt(
          [
            h.Class(
              "mt-4 text-md font-semibold text-lg font-semibold text-text-primary_on-brand md:mt-5",
            ),
          ],
          [item.question],
        ),
        h.dd([h.Class("mt-1 text-md text-text-tertiary_on-brand")], [item.answer]),
      ],
    ),
  );

  return h.section(
    [h.Class("bg-bg-brand-section py-16 md:py-24"), h.Dir("ltr")],
    [
      h.div(
        [h.Class("mx-auto max-w-container px-4 md:px-8")],
        [
          h.div(
            [h.Class("mx-auto flex w-full max-w-3xl flex-col items-center text-center")],
            [
              h.h2(
                [
                  h.Class(
                    "text-display-sm font-semibold text-text-primary_on-brand md:text-display-md",
                  ),
                ],
                [props.heading],
              ),
              h.p(
                [h.Class("mt-4 text-lg text-text-tertiary_on-brand md:mt-5 md:text-xl")],
                [props.description],
              ),
            ],
          ),
          h.div(
            [h.Class("mt-12 md:mt-16")],
            [
              h.dl(
                [
                  h.Class(
                    "grid w-full grid-cols-1 justify-items-center gap-x-8 gap-y-10 sm:grid-cols-2 md:gap-y-16 lg:grid-cols-3",
                  ),
                ],
                itemNodes,
              ),
            ],
          ),
          h.div(
            [
              h.Class(
                "mt-12 flex flex-col items-center gap-6 rounded-2xl bg-bg-brand-section_subtle px-6 py-8 text-center md:mt-16 md:gap-8 md:px-8 md:py-8 md:pb-10",
              ),
            ],
            [
              h.div(
                [h.Class("flex items-end -space-x-4")],
                props.avatars.map((avatar) =>
                  h.keyed("div")(
                    avatar.id,
                    [
                      h.Class(
                        avatar.emphasis === true
                          ? "z-10 ring-[1.5px] ring-white"
                          : "ring-[1.5px] ring-white",
                      ),
                    ],
                    [avatarNode(avatar, h)],
                  ),
                ),
              ),
              h.div(
                [],
                [
                  h.h4(
                    [h.Class("text-xl font-semibold text-text-primary_on-brand")],
                    [props.ctaHeading],
                  ),
                  h.p(
                    [h.Class("mt-2 text-md text-text-tertiary_on-brand md:text-lg")],
                    [props.ctaDescription],
                  ),
                ],
              ),
              button({ label: props.ctaLabel, onPress: props.onCta, size: "xl" }, h),
            ],
          ),
        ],
      ),
    ],
  );
};
