/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary -- The controlled native slideout preserves the authenticated user-profile anatomy. */
import { blobatarDataUri } from "avatar";
import type { Html, HtmlBuilder } from "foldkit/html";

import { avatar } from "../base/avatar.ts";
import { badge } from "../base/badges.ts";
import { button } from "../base/button.ts";

export type ProfileMenuLocale = "en-US" | "pt-BR";

export interface ProfileMenuExperience {
  readonly company: string;
  readonly companySeed: string;
  readonly dateRange: string;
  readonly role: string;
}

export interface ProfileMenuProps<Message> {
  readonly email: string;
  readonly experiences: readonly ProfileMenuExperience[];
  readonly id: string;
  readonly isOpen: boolean;
  readonly locale: ProfileMenuLocale;
  readonly location: string;
  readonly name: string;
  readonly onAddTag: NoInfer<Message>;
  readonly onAddToProject: NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onNewProject: NoInfer<Message>;
  readonly onStudio: NoInfer<Message>;
  readonly profileSeed: string;
  readonly tags: readonly string[];
  readonly website: string;
}

const copy = {
  "en-US": {
    about: "About",
    aboutAfter: "where we help early stage founders and startups take their product from 0→1.",
    aboutBefore: "I'm a Designer based in Melbourne. I co-founded",
    addTag: "Add more",
    addToProject: "Add to project",
    close: "Close slideout menu",
    freelancer: "Freelancer",
    newProject: "New project",
    slideout: "Slideout menu",
    workExperience: "Work experience",
  },
  "pt-BR": {
    about: "Sobre",
    aboutAfter:
      "onde ajudamos fundadores em estágio inicial e startups a levar seus produtos do zero à primeira versão.",
    aboutBefore: "Sou designer em Melbourne. Cofundei a",
    addTag: "Adicionar mais",
    addToProject: "Adicionar ao projeto",
    close: "Fechar menu lateral",
    freelancer: "Freelancer",
    newProject: "Novo projeto",
    slideout: "Menu lateral",
    workExperience: "Experiência profissional",
  },
} as const;

const lineIcon = <Message>(
  kind: "close" | "link" | "location" | "plus",
  h: HtmlBuilder<Message>,
): Html => {
  const paths = {
    close: "M18 6 6 18M6 6l12 12",
    link: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
    location: "M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Zm-8 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
    plus: "M12 5v14M5 12h14",
  } as const;
  return h.svg(
    [
      h.AriaHidden(true),
      h.Class(kind === "plus" ? "size-3 stroke-[3px]" : "size-5 shrink-0"),
      h.Fill("none"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D(paths[kind]),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth(kind === "plus" ? "3" : "2"),
      ]),
    ],
  );
};

const profilePhoto = <Message>(name: string, seed: string, h: HtmlBuilder<Message>): Html =>
  h.div(
    [
      h.Class(
        "relative flex size-24 shrink-0 items-center justify-center rounded-full bg-bg-primary p-1 shadow-xl ring-1 ring-border-secondary-alt",
      ),
    ],
    [
      h.div(
        [
          h.Class(
            "relative size-full overflow-hidden rounded-full outline-[0.75px] -outline-offset-[0.75px] outline-black/16 before:absolute before:inset-0 before:rounded-full before:border-[1.5px] before:border-white/32",
          ),
        ],
        [
          h.img([
            h.Alt(name),
            h.Class("size-full object-cover"),
            h.Src(
              blobatarDataUri(seed, {
                background: "circle",
                kind: "agent",
                size: 192,
                title: name,
              }),
            ),
          ]),
        ],
      ),
      h.span(
        [
          h.AriaLabel("Verified"),
          h.Class(
            "absolute right-1 bottom-1 flex size-4.5 items-center justify-center rounded-full bg-utility-blue-500 text-white ring-2 ring-bg-primary",
          ),
        ],
        [
          h.svg(
            [h.AriaHidden(true), h.Class("size-3"), h.Fill("none"), h.ViewBox("0 0 12 12")],
            [
              h.path([
                h.D("m2.5 6 2.2 2.2L9.5 3.5"),
                h.Stroke("currentColor"),
                h.StrokeLinecap("round"),
                h.StrokeLinejoin("round"),
                h.StrokeWidth("2"),
              ]),
            ],
          ),
        ],
      ),
    ],
  );

export const profileMenu = <Message>(
  props: ProfileMenuProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const text = copy[props.locale];
  const titleId = `${props.id}-title`;
  return h.div(
    [],
    props.isOpen
      ? [
          h.div(
            [
              h.Class(
                "fixed inset-0 z-50 flex min-h-dvh w-full items-center justify-end bg-overlay/70 pl-6 outline-hidden backdrop-blur-[6px] md:pl-10",
              ),
              h.DataAttribute("profile-menu-overlay", props.id),
            ],
            [
              h.button([
                h.AriaHidden(true),
                h.Class("fixed inset-0 cursor-default border-0 bg-transparent p-0"),
                h.OnClick(props.onDismiss),
                h.Tabindex(-1),
                h.Type("button"),
              ]),
              h.dialog(
                [
                  h.AriaLabel(text.slideout),
                  h.Class(
                    "fixed inset-y-0 !right-0 !left-auto m-0 h-full w-[calc(100%-24px)] max-w-100 overflow-hidden border-0 bg-bg-primary p-0 shadow-xl ring-1 ring-border-secondary-alt outline-hidden",
                  ),
                  h.Id(props.id),
                  h.OnCancel(props.onDismiss),
                  h.Open(true),
                  h.Style({ width: "calc(100% - 24px)" }),
                ],
                [
                  h.div(
                    [
                      h.Class(
                        "relative flex size-full flex-col items-start gap-6 overflow-y-auto bg-bg-primary outline-hidden",
                      ),
                    ],
                    [
                      h.header(
                        [h.Class("relative z-1 flex w-full flex-col gap-6")],
                        [
                          h.div(
                            [h.Class("flex flex-col items-start gap-4 px-4 pt-6 md:px-6")],
                            [
                              h.h1(
                                [
                                  h.Class("text-md font-semibold text-text-primary md:text-lg"),
                                  h.Id(titleId),
                                ],
                                [text.freelancer],
                              ),
                            ],
                          ),
                          h.button(
                            [
                              h.AriaLabel(text.close),
                              h.Autofocus(true),
                              h.Class(
                                "absolute top-3 right-3 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-fg-quaternary outline-focus-ring hover:bg-bg-primary-hover hover:text-fg-quaternary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
                              ),
                              h.DataAttribute("profile-menu-close", ""),
                              h.OnClick(props.onDismiss),
                              h.Type("button"),
                            ],
                            [lineIcon("close", h)],
                          ),
                          h.div(
                            [h.Class("flex size-full flex-col")],
                            [
                              h.div(
                                [h.Class("px-2")],
                                [
                                  h.div([
                                    h.AriaHidden(true),
                                    h.Class(
                                      "h-30 w-full rounded-xl bg-linear-to-tr from-[#A6C0FE] to-[#FFEAF6]",
                                    ),
                                  ]),
                                ],
                              ),
                              h.div(
                                [h.Class("-mt-12 flex flex-col gap-4 px-4 md:px-6")],
                                [
                                  h.section(
                                    [h.Class("flex flex-col gap-4")],
                                    [
                                      profilePhoto(props.name, props.profileSeed, h),
                                      h.div(
                                        [h.Class("flex flex-col")],
                                        [
                                          h.p(
                                            [
                                              h.Class(
                                                "flex items-center gap-2 text-lg font-semibold text-text-primary",
                                              ),
                                            ],
                                            [
                                              props.name,
                                              h.span([
                                                h.AriaLabel("Online"),
                                                h.Class(
                                                  "relative size-2 rounded-full bg-fg-success-secondary ring-[1.5px] ring-bg-primary",
                                                ),
                                              ]),
                                            ],
                                          ),
                                          h.p(
                                            [h.Class("text-md text-text-tertiary")],
                                            [props.email],
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                  h.section(
                                    [
                                      h.AriaLabel("Skills"),
                                      h.Class("flex flex-wrap gap-1 md:gap-1.5"),
                                    ],
                                    props.tags
                                      .map((tag) =>
                                        badge(
                                          { color: "gray", label: tag, size: "sm", type: "modern" },
                                          h,
                                        ),
                                      )
                                      .concat(
                                        h.span(
                                          [h.Class("group/profile-tag relative inline-flex")],
                                          [
                                            h.button(
                                              [
                                                h.AriaDescribedBy(`${props.id}-add-tag-tooltip`),
                                                h.AriaLabel(text.addTag),
                                                h.Class(
                                                  "flex size-[22px] cursor-pointer items-center justify-center rounded-md bg-bg-primary text-utility-neutral-500 shadow-xs ring-1 ring-border-primary ring-inset outline-focus-ring hover:bg-bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
                                                ),
                                                h.OnClick(props.onAddTag),
                                                h.Type("button"),
                                              ],
                                              [lineIcon("plus", h)],
                                            ),
                                            h.span(
                                              [
                                                h.Class(
                                                  "pointer-events-none absolute bottom-full left-1/2 z-50 mb-1.5 w-max -translate-x-1/2 rounded-lg bg-bg-primary-solid px-3 py-2 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity group-hover/profile-tag:opacity-100 group-focus-within/profile-tag:opacity-100",
                                                ),
                                                h.Id(`${props.id}-add-tag-tooltip`),
                                                h.Role("tooltip"),
                                              ],
                                              [text.addTag],
                                            ),
                                          ],
                                        ),
                                      ),
                                  ),
                                  h.section(
                                    [h.Class("flex gap-3")],
                                    [
                                      button(
                                        {
                                          color: "secondary",
                                          label: text.addToProject,
                                          onPress: props.onAddToProject,
                                          size: "sm",
                                        },
                                        h,
                                      ),
                                      button(
                                        {
                                          color: "primary",
                                          label: text.newProject,
                                          onPress: props.onNewProject,
                                          size: "sm",
                                        },
                                        h,
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ],
                      ),
                      h.main(
                        [
                          h.Class(
                            "flex size-full flex-col gap-6 overflow-y-auto overscroll-auto px-4 pb-6 md:px-6",
                          ),
                        ],
                        [
                          h.section(
                            [h.Class("flex flex-col")],
                            [
                              h.p(
                                [h.Class("text-sm font-semibold text-text-primary")],
                                [text.about],
                              ),
                              h.p(
                                [h.Class("mt-1 text-sm text-text-tertiary")],
                                [
                                  `${text.aboutBefore} `,
                                  h.a(
                                    [
                                      h.Class(
                                        "rounded-xs underline underline-offset-3 outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                                      ),
                                      h.Href("#layers-studio"),
                                      h.OnClick(props.onStudio),
                                    ],
                                    ["Layers Studio™"],
                                  ),
                                  ` ${text.aboutAfter}`,
                                ],
                              ),
                              h.ul(
                                [h.Class("mt-4 flex flex-col gap-2")],
                                [
                                  h.li(
                                    [h.Class("flex gap-2 text-sm text-text-tertiary")],
                                    [lineIcon("location", h), props.location],
                                  ),
                                  h.li(
                                    [h.Class("flex gap-2 text-sm text-text-tertiary")],
                                    [lineIcon("link", h), props.website],
                                  ),
                                ],
                              ),
                            ],
                          ),
                          h.section(
                            [h.Class("flex flex-col gap-4")],
                            [
                              h.p(
                                [h.Class("text-sm font-semibold text-text-primary")],
                                [text.workExperience],
                              ),
                              ...props.experiences.map((experience) =>
                                h.div(
                                  [h.Class("flex w-full flex-row items-start gap-3")],
                                  [
                                    avatar(
                                      {
                                        alt: `${experience.company} robot logo`,
                                        border: true,
                                        entityKind: "robot",
                                        rounded: false,
                                        seed: experience.companySeed,
                                        size: "lg",
                                      },
                                      h,
                                    ),
                                    h.div(
                                      [h.Class("flex flex-col gap-2")],
                                      [
                                        h.div(
                                          [h.Class("flex flex-col")],
                                          [
                                            h.p(
                                              [
                                                h.Class(
                                                  "text-sm font-semibold text-text-secondary",
                                                ),
                                              ],
                                              [experience.role],
                                            ),
                                            h.p(
                                              [h.Class("text-sm text-text-tertiary")],
                                              [experience.company],
                                            ),
                                          ],
                                        ),
                                        h.p(
                                          [h.Class("text-sm text-text-tertiary")],
                                          [experience.dateRange],
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
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
          ),
        ]
      : [],
  );
};
