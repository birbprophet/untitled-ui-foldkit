/* oxlint-disable effect/noReturnInArrow, effect/noTernary -- Direct FoldKit transcription of the authenticated vector-map contact section. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { badge } from "../base/badges.ts";

export interface ContactVectorMap03Pin {
  readonly address: string;
  readonly flagSrc: string;
  readonly id: string;
  readonly location: string;
  readonly x: number;
  readonly y: number;
}

export interface ContactVectorMap03Contact {
  readonly cta: string;
  readonly href: string;
  readonly id: string;
  readonly subtitle: string;
  readonly title: string;
}

export interface ContactVectorMap03Props<Message> {
  readonly badgeLabel: string;
  readonly contacts: readonly ContactVectorMap03Contact[];
  readonly description: string;
  readonly heading: string;
  readonly mapDarkSrc: string;
  readonly mapLightSrc: string;
  readonly onContact: (id: string) => NoInfer<Message>;
  readonly onPinActivate: (id: string) => NoInfer<Message>;
  readonly pins: readonly ContactVectorMap03Pin[];
}

export const contactVectorMap03Pins = [
  {
    address: "911 E Pike Street, Capitol Hill, Seattle, WA 98122",
    flagSrc: "https://www.untitledui.com/images/flags/US.svg",
    id: "seattle",
    location: "Seattle, USA",
    x: 130,
    y: 157,
  },
  {
    address: "2201 Valencia Street, Mission District, San Francisco, CA 94110",
    flagSrc: "https://www.untitledui.com/images/flags/US.svg",
    id: "san-francisco",
    location: "San Francisco, USA",
    x: 158,
    y: 204,
  },
  {
    address: "85 Redchurch Street, Shoreditch, London E2 7DJ",
    flagSrc: "https://www.untitledui.com/images/flags/GB.svg",
    id: "london",
    location: "London, GB",
    x: 521,
    y: 97,
  },
  {
    address: "17 Weserstraße, Neukölln, 12045 Berlin",
    flagSrc: "https://www.untitledui.com/images/flags/DE.svg",
    id: "berlin",
    location: "Berlin, DE",
    x: 581,
    y: 73,
  },
  {
    address: "12 Via del Pigneto, Pigneto, 00176 Roma RM",
    flagSrc: "https://www.untitledui.com/images/flags/IT.svg",
    id: "rome",
    location: "Rome, IT",
    x: 513,
    y: 176,
  },
  {
    address: "21 Pali Hill Road, Bandra West, Mumbai, Maharashtra 400050",
    flagSrc: "https://www.untitledui.com/images/flags/IN.svg",
    id: "mumbai",
    location: "Mumbai, IN",
    x: 678,
    y: 224,
  },
  {
    address: "3-15-7 Jingumae, Shibuya-ku, Tokyo 150-0001",
    flagSrc: "https://www.untitledui.com/images/flags/JP.svg",
    id: "tokyo",
    location: "Tokyo, JP",
    x: 843,
    y: 199,
  },
  {
    address: "100 Smith Street Collingwood VIC 3066 AU",
    flagSrc: "https://www.untitledui.com/images/flags/AU.svg",
    id: "melbourne",
    location: "Melbourne, AUS",
    x: 885,
    y: 406,
  },
  {
    address: "42 Ponsonby Road, Ponsonby, Auckland 1011",
    flagSrc: "https://www.untitledui.com/images/flags/NZ.svg",
    id: "auckland",
    location: "Auckland, NZ",
    x: 958,
    y: 424,
  },
] as const satisfies readonly ContactVectorMap03Pin[];

const pinTooltip = <Message>(
  pin: ContactVectorMap03Pin,
  index: number,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [
      h.Class(
        "pointer-events-none absolute -top-3 left-1/2 -translate-x-1/2 -translate-y-[calc(100%-4px)] scale-95 opacity-0 transition duration-150 ease-in will-change-transform group-hover:pointer-events-auto group-hover:-translate-y-full group-hover:scale-100 group-hover:opacity-100 group-hover:ease-out group-focus-within:pointer-events-auto group-focus-within:-translate-y-full group-focus-within:scale-100 group-focus-within:opacity-100 group-focus-within:ease-out",
      ),
    ],
    [
      h.div(
        [
          h.Class(
            "relative flex w-max max-w-45 flex-col items-center rounded-lg bg-bg-primary px-4 py-3 text-center shadow-lg ring-1 ring-border-secondary_alt",
          ),
          h.Id(`vector-map-pin-${String(index)}`),
        ],
        [
          h.img([
            h.Alt(pin.location),
            h.AriaHidden(true),
            h.Class("size-5 max-w-none rounded-full"),
            h.Src(pin.flagSrc),
          ]),
          h.p([h.Class("mt-2 text-xs font-semibold text-text-primary")], [pin.location]),
          h.p([h.Class("mt-1 text-xs text-text-tertiary")], [pin.address]),
        ],
      ),
    ],
  );

const mapPin = <Message>(
  pin: ContactVectorMap03Pin,
  index: number,
  props: ContactVectorMap03Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.keyed("div")(
    pin.id,
    [h.Class("fixed"), h.Style({ left: `${String(pin.x)}px`, top: `${String(pin.y)}px` })],
    [
      h.div(
        [h.Class("group relative")],
        [
          pinTooltip(pin, index, h),
          h.button(
            [
              h.AriaDescribedBy(`vector-map-pin-${String(index)}`),
              h.AriaLabel(`View ${pin.location}`),
              h.Class(
                "flex size-10 cursor-pointer items-center justify-center overflow-visible outline-hidden",
              ),
              h.OnClick(props.onPinActivate(pin.id)),
              h.Type("button"),
            ],
            [
              h.span([
                h.AriaHidden(true),
                h.Class(
                  "absolute size-10 rounded-full bg-fg-brand-secondary/10 transition duration-150 ease-linear group-focus-within:scale-[1.15] group-hover:scale-[1.15]",
                ),
              ]),
              h.span([
                h.AriaHidden(true),
                h.Class(
                  "absolute size-6 rounded-full bg-fg-brand-secondary/20 transition duration-150 ease-linear group-focus-within:scale-[1.15] group-hover:scale-[1.15]",
                ),
              ]),
              h.span([
                h.AriaHidden(true),
                h.Class("absolute size-2 rounded-full bg-fg-brand-secondary"),
              ]),
            ],
          ),
        ],
      ),
    ],
  );

export const contactVectorMap03 = <Message>(
  props: ContactVectorMap03Props<Message>,
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
              h.div(
                [h.Class("max-md:hidden")],
                [
                  badge(
                    { color: "brand", label: props.badgeLabel, size: "lg", type: "pill-color" },
                    h,
                  ),
                ],
              ),
              h.div(
                [h.Class("md:hidden")],
                [
                  badge(
                    { color: "brand", label: props.badgeLabel, size: "md", type: "pill-color" },
                    h,
                  ),
                ],
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
            [h.Class("mt-12 flex flex-col gap-16 md:mt-16")],
            [
              h.svg(
                [
                  h.Class("mx-auto hidden w-full max-w-5xl overflow-visible lg:block"),
                  h.DataAttribute("chromatic", "ignore"),
                  h.Fill("none"),
                  h.Height("488"),
                  h.ViewBox("0 0 1025 483"),
                ],
                [
                  h.image([
                    h.Class("dark:hidden"),
                    h.Href(props.mapLightSrc),
                    h.Width("100%"),
                    h.X("0"),
                    h.Y("0"),
                  ]),
                  h.image([
                    h.Class("not-dark:hidden"),
                    h.Href(props.mapDarkSrc),
                    h.Width("100%"),
                    h.X("0"),
                    h.Y("0"),
                  ]),
                  h.foreignObject(
                    [
                      h.Class("overflow-visible"),
                      h.Height("100%"),
                      h.Width("100%"),
                      h.X("0"),
                      h.Y("0"),
                    ],
                    props.pins.map((pin, index) => mapPin(pin, index, props, h)),
                  ),
                ],
              ),
              h.ul(
                [
                  h.Class(
                    "grid w-full grid-cols-1 justify-items-center gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3",
                  ),
                ],
                props.contacts.map((contact) =>
                  h.keyed("li")(
                    contact.id,
                    [h.Class("flex max-w-sm flex-col items-center text-center")],
                    [
                      h.h3([h.Class("text-lg font-semibold text-text-primary")], [contact.title]),
                      h.p([h.Class("mt-1 text-md text-text-tertiary")], [contact.subtitle]),
                      h.a(
                        [
                          h.Class(
                            "mt-4 inline-flex h-max items-center whitespace-pre rounded text-md font-semibold text-text-brand-secondary outline-focus-ring transition duration-100 ease-linear hover:text-text-brand-secondary-hover focus-visible:outline-2 focus-visible:outline-offset-2 md:mt-5",
                          ),
                          h.Href(contact.href),
                          h.OnClick(props.onContact(contact.id)),
                        ],
                        [contact.cta],
                      ),
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
