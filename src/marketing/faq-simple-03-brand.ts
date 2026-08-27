/* oxlint-disable effect/noReturnInArrow, effect/noTernary -- Direct FoldKit transcription of the authenticated Untitled UI FAQ section. */
import type { Html, HtmlBuilder } from "foldkit/html";

export type FaqSimple03BrandIcon = "credit-card" | "file" | "heart" | "mail" | "slash" | "switch";

export interface FaqSimple03BrandItem {
  readonly answer: string;
  readonly icon: FaqSimple03BrandIcon;
  readonly id: string;
  readonly question: string;
}

export interface FaqSimple03BrandAvatar {
  readonly alt: string;
  readonly emphasis?: boolean;
  readonly id: string;
  readonly size: "lg" | "xl";
  readonly src: string;
}

export interface FaqSimple03BrandProps<Message> {
  readonly ctaDescription: string;
  readonly ctaHeading: string;
  readonly ctaLabel: string;
  readonly description: string;
  readonly heading: string;
  readonly items: readonly FaqSimple03BrandItem[];
  readonly onCta: NoInfer<Message>;
  readonly avatars: readonly FaqSimple03BrandAvatar[];
  readonly imageAlt: string;
  readonly imageSrc: string;
}

export const faqSimple03BrandDefaultItems = [
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
] as const satisfies readonly FaqSimple03BrandItem[];

export const faqSimple03Brand = <Message>(
  props: FaqSimple03BrandProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const itemNodes = props.items.map((item) =>
    h.keyed("div")(
      item.id,
      [h.Class("flex max-w-sm flex-col")],
      [
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
            [
              h.Class(
                "mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center md:mt-16 md:gap-16",
              ),
            ],
            [
              h.dl([h.Class("flex w-full flex-col gap-8")], itemNodes),
              h.div(
                [h.Class("h-60 md:h-140")],
                [
                  h.img([
                    h.Alt(props.imageAlt),
                    h.Class("size-full object-cover"),
                    h.Src(props.imageSrc),
                  ]),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  );
};
