/* oxlint-disable effect/noReturnInArrow -- Direct FoldKit transcription preserves the authenticated contact-card anatomy. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";

export type ContactIconCards02Icon = "chat" | "location" | "phone";

export interface ContactIconCards02Card {
  readonly cta: string;
  readonly href: string;
  readonly icon: ContactIconCards02Icon;
  readonly id: string;
  readonly subtitle: string;
  readonly title: string;
}

export interface ContactIconCards02Props<Message> {
  readonly cards: readonly ContactIconCards02Card[];
  readonly description: string;
  readonly eyebrow: string;
  readonly heading: string;
  readonly onContact: (cardId: string) => NoInfer<Message>;
}

export const contactIconCards02Cards: readonly ContactIconCards02Card[] = [
  {
    cta: "sales@siglata.com",
    href: "mailto:sales@siglata.com",
    icon: "chat",
    id: "sales",
    subtitle: "Speak to our friendly team.",
    title: "Chat to sales",
  },
  {
    cta: "support@siglata.com",
    href: "mailto:sales@siglata.com",
    icon: "chat",
    id: "support",
    subtitle: "We're here to help.",
    title: "Chat to support",
  },
  {
    cta: "100 Smith St, \nCollingwood VIC 3066 AU",
    href: "https://goo.gl/maps/zTXmPKVdUvCQH9Wd6",
    icon: "location",
    id: "office",
    subtitle: "Visit our office HQ.",
    title: "Visit us",
  },
  {
    cta: "+1 (555) 000-0000",
    href: "tel:+1 (555) 000-0000",
    icon: "phone",
    id: "phone",
    subtitle: "Mon-Fri from 8am to 5pm.",
    title: "Call us",
  },
];

const iconPath: Readonly<Record<ContactIconCards02Icon, readonly string[]>> = {
  chat: [
    "M6.094 11.229A8.01 8.01 0 0 1 6 10c0-4.418 3.605-8 8.053-8 4.447 0 8.052 3.582 8.052 8a7.94 7.94 0 0 1-.52 2.835c-.07.182-.105.274-.12.345a.897.897 0 0 0-.024.194c-.002.073.008.153.028.314l.403 3.27c.043.355.065.532.006.66a.5.5 0 0 1-.257.252c-.13.055-.306.03-.66-.022l-3.184-.467c-.167-.024-.25-.037-.326-.036a.898.898 0 0 0-.2.021 2.989 2.989 0 0 0-.358.122 8.174 8.174 0 0 1-4.07.42M7.632 22C10.597 22 13 19.538 13 16.5S10.597 11 7.632 11c-2.965 0-5.369 2.462-5.369 5.5 0 .61.097 1.198.277 1.747.075.232.113.348.126.427.013.083.015.13.01.213-.005.08-.025.17-.065.351L2 22l2.995-.409c.163-.022.245-.034.316-.033.076 0 .115.005.19.02.07.013.173.05.381.123a5.246 5.246 0 0 0 1.75.299Z",
  ],
  location: [
    "M12 12.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
    "M12 22c2-4 8-6.582 8-12a8 8 0 1 0-16 0c0 5.418 6 8 8 12Z",
  ],
  phone: [
    "M8.38 8.853a14.603 14.603 0 0 0 2.847 4.01 14.603 14.603 0 0 0 4.01 2.847c.124.06.187.09.265.112.28.082.625.023.862-.147.067-.048.124-.105.239-.219.35-.35.524-.524.7-.639a2 2 0 0 1 2.18 0c.176.115.35.29.7.64l.195.194c.532.531.797.797.942 1.082a2 2 0 0 1 0 1.806c-.145.285-.41.551-.942 1.082l-.157.158c-.53.53-.795.794-1.155.997-.4.224-1.02.386-1.478.384-.413-.001-.695-.081-1.26-.241a19.038 19.038 0 0 1-8.283-4.874A19.039 19.039 0 0 1 3.17 7.761c-.16-.564-.24-.846-.241-1.26a3.377 3.377 0 0 1 .384-1.477c.202-.36.467-.625.997-1.155l.157-.158c.532-.53.798-.797 1.083-.941a2 2 0 0 1 1.805 0c.286.144.551.41 1.083.942l.195.194c.35.35.524.525.638.7a2 2 0 0 1 0 2.18c-.114.177-.289.352-.638.701a2.037 2.037 0 0 0-.22.238 1.05 1.05 0 0 0-.147.862c.023.08.053.142.113.266Z",
  ],
};

const cardIcon = <Message>(kind: ContactIconCards02Icon, h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-6 text-icon-fg-brand"),
      h.Fill("none"),
      h.ViewBox("0 0 24 24"),
    ],
    iconPath[kind].map((path) =>
      h.path([
        h.D(path),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ),
  );

export const contactIconCards02 = <Message>(
  props: ContactIconCards02Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("bg-bg-primary py-16 md:py-24"), h.Dir("ltr")],
    [
      h.div(
        [
          h.Class(
            "m-auto grid max-w-container grid-cols-1 gap-12 px-4 md:grid-cols-3 md:gap-8 md:px-8",
          ),
        ],
        [
          h.div(
            [h.Class("col-span-1 flex max-w-3xl flex-col")],
            [
              h.span(
                [h.Class("text-sm font-semibold text-text-brand-secondary md:text-md")],
                [props.eyebrow],
              ),
              h.h2(
                [
                  h.Class(
                    "mt-3 text-display-sm font-semibold text-text-primary md:text-display-md",
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
          h.ul(
            [h.Class("col-span-2 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8")],
            props.cards.map((card) =>
              h.keyed("li")(
                card.id,
                [
                  h.Class("flex h-full flex-col items-start bg-bg-secondary p-6"),
                  h.DataAttribute("contact-card-id", card.id),
                ],
                [
                  cardIcon(card.icon, h),
                  h.h3(
                    [h.Class("mt-8 text-lg font-semibold text-text-primary md:mt-12")],
                    [card.title],
                  ),
                  h.p([h.Class("mt-1 text-md text-text-tertiary")], [card.subtitle]),
                  button(
                    {
                      className: "mt-4 whitespace-pre md:mt-5 md:whitespace-nowrap",
                      color: "link-color",
                      href: card.href,
                      label: card.cta,
                      onPress: props.onContact(card.id),
                      size: "lg",
                    },
                    h,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    ],
  );
