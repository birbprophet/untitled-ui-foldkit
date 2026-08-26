/* oxlint-disable effect/noReturnInArrow, effect/noSpread -- Direct FoldKit transcription of the authenticated Untitled UI contact section. */
import type { Html, HtmlBuilder } from "foldkit/html";

export type ContactIconCards03Icon = "chat" | "pin" | "phone";

export interface ContactIconCards03Card {
  readonly cta: string;
  readonly href: string;
  readonly icon: ContactIconCards03Icon;
  readonly id: string;
  readonly subtitle: string;
  readonly title: string;
}

export interface ContactIconCards03Props<Message> {
  readonly badgeLabel: string;
  readonly cards: readonly ContactIconCards03Card[];
  readonly description: string;
  readonly heading: string;
  readonly imageAlt: string;
  readonly imageSrc: string;
  readonly onContact: (id: string) => NoInfer<Message>;
}

const iconPath = (icon: ContactIconCards03Icon): readonly string[] => {
  if (icon === "chat") {
    return [
      "M6.094 11.229A8.01 8.01 0 0 1 6 10c0-4.418 3.605-8 8.053-8 4.447 0 8.052 3.582 8.052 8a7.94 7.94 0 0 1-.52 2.835c-.07.182-.105.274-.12.345a.897.897 0 0 0-.024.194c-.002.073.008.153.028.314l.403 3.27c.043.355.065.532.006.66a.5.5 0 0 1-.257.252c-.13.055-.306.03-.66-.022l-3.184-.467c-.167-.024-.25-.037-.326-.036a.898.898 0 0 0-.2.021 2.989 2.989 0 0 0-.358.122 8.174 8.174 0 0 1-4.07.42M7.632 22C10.597 22 13 19.538 13 16.5S10.597 11 7.632 11c-2.965 0-5.369 2.462-5.369 5.5 0 .61.097 1.198.277 1.747.075.232.113.348.126.427.013.083.015.13.01.213-.005.08-.025.17-.065.351L2 22l2.995-.409c.163-.022.245-.034.316-.033.076 0 .115.005.19.02.07.013.173.05.381.123a5.246 5.246 0 0 0 1.75.299Z",
    ];
  }
  if (icon === "pin") {
    return [
      "M12 12.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
      "M12 22c2-4 8-6.582 8-12a8 8 0 1 0-16 0c0 5.418 6 8 8 12Z",
    ];
  }
  return [
    "M8.38 8.853a14.603 14.603 0 0 0 2.847 4.01 14.603 14.603 0 0 0 4.01 2.847c.124.06.187.09.265.112.28.082.625.023.862-.147.067-.048.124-.105.239-.219.35-.35.524-.524.7-.639a2 2 0 0 1 2.18 0c.176.115.35.29.7.64l.195.194c.532.531.797.797.942 1.082a2 2 0 0 1 0 1.806c-.145.285-.41.551-.942 1.082l-.157.158c-.53.53-.795.794-1.155.997-.4.224-1.02.386-1.478.384-.413-.001-.695-.081-1.26-.241a19.038 19.038 0 0 1-8.283-4.874A19.039 19.039 0 0 1 3.17 7.761c-.16-.564-.24-.846-.241-1.26a3.377 3.377 0 0 1 .384-1.477c.202-.36.467-.625.997-1.155l.157-.158c.532-.53.798-.797 1.083-.941a2 2 0 0 1 1.805 0c.286.144.551.41 1.083.942l.195.194c.35.35.524.525.638.7a2 2 0 0 1 0 2.18c-.114.177-.289.352-.638.701a2.037 2.037 0 0 0-.22.238 1.05 1.05 0 0 0-.147.862c.023.08.053.142.113.266Z",
  ];
};

const featuredIcon = <Message>(icon: ContactIconCards03Icon, h: HtmlBuilder<Message>): Html =>
  h.div(
    [
      h.Class(
        "relative flex size-12 shrink-0 items-center justify-center rounded-[10px] bg-bg-brand-solid text-fg-white shadow-xs-skeuomorphic before:absolute before:inset-px before:rounded-[9px] before:border before:border-utility-brand-200/12 before:mask-b-from-0%",
      ),
      h.DataAttribute("featured-icon", ""),
    ],
    [
      h.svg(
        [
          h.AriaHidden(true),
          h.Class("z-1 size-6"),
          h.DataAttribute("icon", ""),
          h.Fill("none"),
          h.Stroke("currentColor"),
          h.StrokeLinecap("round"),
          h.StrokeLinejoin("round"),
          h.StrokeWidth("2"),
          h.ViewBox("0 0 24 24"),
        ],
        iconPath(icon).map((path) => h.path([h.D(path)])),
      ),
    ],
  );

const contactLink = <Message>(
  card: ContactIconCards03Card,
  message: Message,
  h: HtmlBuilder<Message>,
): Html =>
  h.a(
    [
      h.Class(
        "group relative mt-4 inline-flex h-max cursor-pointer items-center justify-normal gap-1.5 rounded p-0! text-md font-semibold whitespace-pre text-text-brand-secondary outline-focus-ring transition duration-100 ease-linear before:absolute hover:text-text-brand-secondary-hover focus-visible:outline-2 focus-visible:outline-offset-2 md:mt-5",
      ),
      h.Href(card.href),
      h.OnClick(message),
    ],
    [
      h.span(
        [
          h.Class(
            "transition-inherit-all underline decoration-transparent underline-offset-4 hover:decoration-fg-brand-secondary-alt",
          ),
          h.DataAttribute("text", ""),
        ],
        [card.cta],
      ),
    ],
  );

export const contactIconCards03 = <Message>(
  props: ContactIconCards03Props<Message>,
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
              h.span(
                [
                  h.Class(
                    "hidden size-max items-center rounded-full bg-utility-brand-50 px-3 py-1 text-sm font-medium whitespace-nowrap text-utility-brand-700 ring-1 ring-utility-brand-200 ring-inset md:flex",
                  ),
                ],
                [props.badgeLabel],
              ),
              h.span(
                [
                  h.Class(
                    "flex size-max items-center rounded-full bg-utility-brand-50 px-2.5 py-0.5 text-sm font-medium whitespace-nowrap text-utility-brand-700 ring-1 ring-utility-brand-200 ring-inset md:hidden",
                  ),
                ],
                [props.badgeLabel],
              ),
              h.h2(
                [
                  h.Class(
                    "mt-4 text-display-sm font-semibold text-text-primary md:text-display-md",
                  ),
                ],
                [props.heading],
              ),
              h.p(
                [h.Class("mt-4 text-lg text-text-tertiary md:mt-5 md:text-xl")],
                [props.description],
              ),
            ],
          ),
          h.div(
            [h.Class("mt-12 flex flex-col gap-12 md:mt-16 md:gap-24")],
            [
              h.img([
                h.Alt(props.imageAlt),
                h.Class("h-60 w-full object-cover md:h-100 lg:h-140"),
                h.Src(props.imageSrc),
              ]),
              h.ul(
                [h.Class("grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3")],
                props.cards.map((card) =>
                  h.keyed("li")(
                    card.id,
                    [h.Class("flex h-full flex-col items-start bg-bg-secondary p-6")],
                    [
                      featuredIcon(card.icon, h),
                      h.h3(
                        [h.Class("mt-12 text-lg font-semibold text-text-primary md:mt-16")],
                        [card.title],
                      ),
                      h.p([h.Class("mt-1 text-md text-text-tertiary")], [card.subtitle]),
                      contactLink(card, props.onContact(card.id), h),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    ],
  );
