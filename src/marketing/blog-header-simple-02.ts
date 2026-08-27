/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noTernary -- Direct FoldKit transcription of the authenticated Untitled UI blog header. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { pagination } from "../application/pagination.ts";
import { avatar } from "../base/avatar.ts";
import { badgeGroup } from "../base/badges.ts";

export interface BlogHeaderSimple02Article {
  readonly author: { readonly avatarUrl: string; readonly href: string; readonly name: string };
  readonly category: { readonly href: string; readonly name: string };
  readonly href: string;
  readonly id: string;
  readonly publishedAt: string;
  readonly readingTime: string;
  readonly summary: string;
  readonly thumbnailUrl: string;
  readonly title: string;
}

export interface BlogHeaderSimple02Props<Message> {
  readonly articles: readonly BlogHeaderSimple02Article[];
  readonly description: string;
  readonly email: string;
  readonly emailLabel: string;
  readonly emailPlaceholder: string;
  readonly eyebrow: string;
  readonly heading: string;
  readonly id: string;
  readonly onArticle: (id: string) => NoInfer<Message>;
  readonly onEmailInput: (email: string) => NoInfer<Message>;
  readonly onPage: (page: number) => NoInfer<Message>;
  readonly onSubmit: NoInfer<Message>;
  readonly page: number;
  readonly pageCount: number;
  readonly privacyHref: string;
  readonly privacyLabel: string;
  readonly privacyPrefix: string;
  readonly subscribeLabel: string;
}

const arrow = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("mt-0.5 size-6 shrink-0 text-fg-quaternary"),
      h.Fill("none"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D("M7 17 17 7m0 0H7m10 0v10"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const articleCard = <Message>(
  article: BlogHeaderSimple02Article,
  onArticle: (id: string) => Message,
  h: HtmlBuilder<Message>,
): Html =>
  h.article(
    [h.Class("flex flex-col gap-4")],
    [
      h.a(
        [
          h.Class(
            "relative overflow-hidden rounded-2xl before:pointer-events-none before:absolute before:inset-0 before:z-10 before:rounded-[inherit] before:ring-[0.5px] before:ring-alpha-black/10 before:ring-inset",
          ),
          h.Href(article.href),
          h.OnClick(onArticle(article.id)),
        ],
        [
          h.img([
            h.Alt(article.title),
            h.Class(
              "aspect-[1.5] w-full object-cover transition duration-100 ease-linear hover:scale-105",
            ),
            h.Src(article.thumbnailUrl),
          ]),
        ],
      ),
      h.div(
        [h.Class("flex flex-col gap-5")],
        [
          h.div(
            [h.Class("flex flex-col items-start gap-3")],
            [
              badgeGroup(
                {
                  addonText: "Design",
                  color: "brand",
                  label: article.readingTime,
                  size: "md",
                  theme: "light",
                },
                h,
              ),
              h.div(
                [h.Class("flex flex-col gap-1")],
                [
                  h.a(
                    [
                      h.Class(
                        "flex justify-between gap-x-4 rounded-md text-lg font-semibold text-text-primary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                      ),
                      h.Href(article.href),
                      h.OnClick(onArticle(article.id)),
                    ],
                    [article.title, arrow(h)],
                  ),
                  h.p(
                    [h.Class("line-clamp-2 text-md text-text-tertiary md:line-clamp-none")],
                    [article.summary],
                  ),
                ],
              ),
            ],
          ),
          h.div(
            [h.Class("flex gap-2")],
            [
              h.a(
                [h.Class("flex"), h.Href(article.author.href)],
                [
                  avatar(
                    {
                      alt: article.author.name,
                      border: true,
                      focusable: true,
                      size: "md",
                      src: article.author.avatarUrl,
                    },
                    h,
                  ),
                ],
              ),
              h.div(
                [],
                [
                  h.a(
                    [
                      h.Class(
                        "block rounded-xs text-sm font-semibold text-text-primary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                      ),
                      h.Href(article.author.href),
                    ],
                    [article.author.name],
                  ),
                  h.time([h.Class("block text-sm text-text-tertiary")], [article.publishedAt]),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  );

export const blogHeaderSimple02 = <Message>(
  props: BlogHeaderSimple02Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("bg-bg-primary"), h.Dir("ltr")],
    [
      h.section(
        [h.Class("bg-bg-secondary pt-16 pb-32 md:pt-24 md:pb-40")],
        [
          h.div(
            [h.Class("mx-auto max-w-container px-4 md:px-8")],
            [
              h.div(
                [h.Class("mx-auto flex w-full max-w-3xl flex-col items-center text-center")],
                [
                  h.span(
                    [h.Class("text-sm font-semibold text-brand-secondary md:text-md")],
                    [props.eyebrow],
                  ),
                  h.h2(
                    [
                      h.Class(
                        "mt-3 text-display-md font-semibold text-text-primary md:text-display-lg",
                      ),
                    ],
                    [props.heading],
                  ),
                  h.p(
                    [h.Class("mt-4 text-lg text-text-tertiary md:mt-6 md:text-xl")],
                    [props.description],
                  ),
                  h.form(
                    [
                      h.Class(
                        "mt-8 grid w-full grid-cols-1 items-start gap-4 sm:mt-12 sm:w-auto sm:grid-cols-[345px_max-content]",
                      ),
                      h.Id(`${props.id}-form`),
                      h.OnSubmit(props.onSubmit),
                    ],
                    [
                      h.div(
                        [h.Class("flex flex-col gap-1.5 text-start")],
                        [
                          h.div(
                            [
                              h.Class(
                                "relative flex w-full flex-row place-content-center place-items-center rounded-lg bg-bg-primary py-0.5 shadow-xs ring-1 ring-border-primary ring-inset transition-shadow duration-100 ease-linear focus-within:ring-2 focus-within:ring-border-brand",
                              ),
                            ],
                            [
                              h.input([
                                h.AriaLabel(props.emailLabel),
                                h.Class(
                                  "m-0 w-full bg-transparent px-3.5 py-2.5 text-md text-text-primary ring-0 outline-hidden placeholder:text-text-placeholder autofill:rounded-lg autofill:text-text-primary",
                                ),
                                h.Id(`${props.id}-email`),
                                h.Name("email"),
                                h.OnInput(props.onEmailInput),
                                h.Placeholder(props.emailPlaceholder),
                                h.Required(true),
                                h.Type("email"),
                                h.Value(props.email),
                              ]),
                            ],
                          ),
                          h.span(
                            [h.Class("flex w-full text-sm text-text-tertiary")],
                            [
                              `${props.privacyPrefix} `,
                              h.a(
                                [
                                  h.Class(
                                    "rounded-xs underline underline-offset-3 outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                                  ),
                                  h.Href(props.privacyHref),
                                ],
                                [props.privacyLabel],
                              ),
                              ".",
                            ],
                          ),
                        ],
                      ),
                      h.button(
                        [
                          h.Class(
                            "group relative inline-flex h-max cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-brand-solid px-4.5 py-3 text-md font-semibold text-white shadow-xs-skeuomorphic ring-1 ring-transparent ring-inset outline-focus-ring transition duration-100 ease-linear before:absolute before:inset-px before:rounded-[7px] before:border before:border-white/12 before:mask-b-from-0% hover:bg-brand-solid-hover focus-visible:outline-2 focus-visible:outline-offset-2",
                          ),
                          h.Type("submit"),
                        ],
                        [h.span([h.Class("px-0.5")], [props.subscribeLabel])],
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
            "mx-auto -mt-16 flex w-full max-w-container flex-col gap-12 px-4 pb-16 md:-mt-24 md:px-8 md:pb-24 lg:gap-16",
          ),
        ],
        [
          h.ul(
            [
              h.Class(
                "grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 md:gap-y-12 lg:grid-cols-3",
              ),
            ],
            props.articles.map((article, index) =>
              h.keyed("li")(
                article.id,
                [h.Class(index >= 6 ? "max-lg:hidden" : "")],
                [articleCard(article, props.onArticle, h)],
              ),
            ),
          ),
          pagination(
            {
              messageForPage: props.onPage,
              page: props.page,
              rounded: true,
              total: props.pageCount,
              variant: "page-default",
            },
            h,
          ),
        ],
      ),
    ],
  );
