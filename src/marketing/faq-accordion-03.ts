/* oxlint-disable effect/noReturnInArrow, effect/noTernary -- Direct FoldKit transcription of the authenticated Untitled UI FAQ accordion. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { avatar } from "../base/avatar.ts";
import { button } from "../base/button.ts";

export interface FaqAccordion03Item {
  readonly answer: string;
  readonly id: string;
  readonly question: string;
}

export interface FaqAccordion03Props<Message> {
  readonly ctaDescription: string;
  readonly ctaHeading: string;
  readonly ctaLabel: string;
  readonly description: string;
  readonly heading: string;
  readonly items: readonly FaqAccordion03Item[];
  readonly onCta: NoInfer<Message>;
  readonly onToggle: (id: string) => NoInfer<Message>;
  readonly openIds: readonly string[];
}

export const faqAccordion03DefaultItems = [
  {
    answer: "Yes, you can try us for free for 30 days.",
    id: "trial",
    question: "Is there a free trial available?",
  },
  {
    answer: "Our pricing scales with your company.",
    id: "plan",
    question: "Can I change my plan later?",
  },
  {
    answer: "You can cancel your plan at any time.",
    id: "cancel",
    question: "What is your cancellation policy?",
  },
  {
    answer: "You can add additional information to invoices.",
    id: "invoice",
    question: "Can other info be added to an invoice?",
  },
  {
    answer: "Plans are per workspace, not per account.",
    id: "billing",
    question: "How does billing work?",
  },
  {
    answer: "You can change the email from your account settings.",
    id: "email",
    question: "How do I change my account email?",
  },
] as const satisfies readonly FaqAccordion03Item[];

const plusIcon = <Message>(open: boolean, h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-6 text-fg-quaternary"),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.StrokeWidth("2"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.circle([h.Cx("12"), h.Cy("12"), h.R("10")]),
      h.line([
        h.Class(
          open
            ? "-rotate-90 origin-center transition duration-150 ease-out"
            : "origin-center rotate-0 transition duration-150 ease-out",
        ),
        h.X1("12"),
        h.X2("12"),
        h.Y1("8"),
        h.Y2("16"),
      ]),
      h.line([h.X1("8"), h.X2("16"), h.Y1("12"), h.Y2("12")]),
    ],
  );

export const faqAccordion03 = <Message>(
  props: FaqAccordion03Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("bg-bg-primary py-16 md:py-24"), h.Dir("ltr")],
    [
      h.div(
        [h.Class("mx-auto max-w-container px-4 md:px-8")],
        [
          h.div(
            [h.Class("mx-auto flex w-full max-w-3xl flex-col items-center text-center")],
            [
              h.h2(
                [h.Class("text-display-sm font-semibold text-text-primary md:text-display-md")],
                [props.heading],
              ),
              h.p(
                [h.Class("mt-4 text-lg text-text-tertiary md:mt-5 md:text-xl")],
                [props.description],
              ),
            ],
          ),
          h.div(
            [h.Class("mx-auto mt-12 max-w-3xl md:mt-16")],
            [
              h.div(
                [h.Class("flex flex-col gap-4")],
                props.items.map((item) => {
                  const open = props.openIds.includes(item.id);
                  return h.keyed("div")(
                    item.id,
                    [
                      h.Class(
                        `rounded-2xl bg-transparent p-5 transition duration-300 ease-in-out md:p-6 ${open ? "bg-bg-secondary" : ""}`,
                      ),
                    ],
                    [
                      h.h3(
                        [],
                        [
                          h.button(
                            [
                              h.AriaExpanded(open),
                              h.Class(
                                "flex w-full cursor-pointer gap-2 rounded-md text-left outline-focus-ring select-none focus-visible:outline-2 focus-visible:outline-offset-2 md:flex-row-reverse md:gap-4",
                              ),
                              h.OnClick(props.onToggle(item.id)),
                              h.Type("button"),
                            ],
                            [
                              h.span(
                                [h.Class("flex-1 text-md font-semibold text-text-primary")],
                                [item.question],
                              ),
                              plusIcon(open, h),
                            ],
                          ),
                        ],
                      ),
                      open
                        ? h.div(
                            [h.Class("overflow-hidden pt-1 pr-8 md:pr-12")],
                            [h.p([h.Class("text-md text-text-tertiary")], [item.answer])],
                          )
                        : h.div([]),
                    ],
                  );
                }),
              ),
            ],
          ),
          h.div(
            [
              h.Class(
                "mt-12 flex flex-col items-center gap-6 rounded-2xl bg-bg-secondary px-6 py-8 text-center md:mt-16 md:gap-8 md:pt-8 md:pb-10",
              ),
            ],
            [
              h.div(
                [h.Class("flex items-end -space-x-4")],
                [
                  h.div(
                    [h.Class("ring-[1.5px] ring-fg-white")],
                    [
                      avatar(
                        {
                          alt: "Marco Kelly",
                          size: "lg",
                          src: "https://www.untitledui.com/images/avatars/marco-kelly?fm=webp&q=80",
                        },
                        h,
                      ),
                    ],
                  ),
                  h.div(
                    [h.Class("z-10 ring-[1.5px] ring-fg-white")],
                    [
                      avatar(
                        {
                          alt: "Amelie Laurent",
                          size: "xl",
                          src: "https://www.untitledui.com/images/avatars/amelie-laurent?fm=webp&q=80",
                        },
                        h,
                      ),
                    ],
                  ),
                  h.div(
                    [h.Class("ring-[1.5px] ring-fg-white")],
                    [
                      avatar(
                        {
                          alt: "Jaya Willis",
                          size: "lg",
                          src: "https://www.untitledui.com/images/avatars/jaya-willis?fm=webp&q=80",
                        },
                        h,
                      ),
                    ],
                  ),
                ],
              ),
              h.div(
                [],
                [
                  h.h4([h.Class("text-xl font-semibold text-text-primary")], [props.ctaHeading]),
                  h.p(
                    [h.Class("mt-2 text-md text-text-tertiary md:text-lg")],
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
