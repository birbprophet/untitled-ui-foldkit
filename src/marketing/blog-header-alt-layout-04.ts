/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread -- HTML placeholder copy and direct callbacks belong to the authenticated Untitled UI blog header. */
import { blobatarDataUri } from "avatar";
import type { Html, HtmlBuilder } from "foldkit/html";

import { pagination } from "../application/pagination.ts";
import { avatar } from "../base/avatar.ts";
import { button } from "../base/button.ts";

export interface BlogHeaderAltLayout04Article {
  readonly author: {
    readonly href: string;
    readonly name: string;
    readonly seed: string;
  };
  readonly category: {
    readonly href: string;
    readonly name: string;
  };
  readonly href: string;
  readonly id: string;
  readonly publishedAt: string;
  readonly summary: string;
  readonly thumbnailSeed: string;
  readonly title: string;
}

export interface BlogHeaderAltLayout04Props<Message> {
  readonly articles: readonly BlogHeaderAltLayout04Article[];
  readonly currentPage: number;
  readonly description: string;
  readonly email: string;
  readonly emailLabel: string;
  readonly emailPlaceholder: string;
  readonly eyebrow: string;
  readonly heading: string;
  readonly messageForArticle: (id: string) => NoInfer<Message>;
  readonly messageForAuthor: (id: string) => NoInfer<Message>;
  readonly messageForCategory: (id: string) => NoInfer<Message>;
  readonly messageForPage: (page: number) => NoInfer<Message>;
  readonly onEmailInput: (email: string) => NoInfer<Message>;
  readonly onPrivacyPolicy: NoInfer<Message>;
  readonly onSubmit: NoInfer<Message>;
  readonly privacyCopy: string;
  readonly privacyHref: string;
  readonly privacyLabel: string;
  readonly submitLabel: string;
  readonly totalPages: number;
}

const articleCard = <Message>(
  article: BlogHeaderAltLayout04Article,
  props: BlogHeaderAltLayout04Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.article(
    [h.Class("flex flex-col gap-4 xl:flex-row xl:items-start")],
    [
      h.a(
        [
          h.Class(
            "relative shrink-0 overflow-hidden rounded-2xl before:pointer-events-none before:absolute before:inset-0 before:z-10 before:rounded-[inherit] before:ring-[0.5px] before:ring-alpha-black/10 before:ring-inset",
          ),
          h.Href(article.href),
          h.OnClick(props.messageForArticle(article.id)),
          h.Tabindex(-1),
        ],
        [
          h.img([
            h.Alt(article.title),
            h.Class(
              "aspect-[1.5] w-full object-cover transition duration-100 ease-linear hover:scale-105 xl:w-screen xl:max-w-93.5",
            ),
            h.Src(
              blobatarDataUri(article.thumbnailSeed, {
                background: "square",
                kind: "robot",
                size: 560,
                title: article.title,
              }),
            ),
          ]),
        ],
      ),
      h.div(
        [h.Class("flex flex-col gap-5")],
        [
          h.div(
            [h.Class("flex flex-col gap-2")],
            [
              h.span(
                [h.Class("text-sm font-semibold text-text-brand-secondary")],
                [article.category.name],
              ),
              h.div(
                [h.Class("flex flex-col gap-1")],
                [
                  h.a(
                    [
                      h.Class(
                        "flex justify-between gap-x-4 rounded-md text-lg font-semibold text-text-primary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                      ),
                      h.Href(article.category.href),
                      h.OnClick(props.messageForCategory(article.id)),
                    ],
                    [article.title],
                  ),
                  h.p([h.Class("line-clamp-2 text-md text-text-tertiary")], [article.summary]),
                ],
              ),
            ],
          ),
          h.div(
            [h.Class("flex gap-2")],
            [
              h.a(
                [
                  h.Class("group flex"),
                  h.Href(article.author.href),
                  h.OnClick(props.messageForAuthor(article.id)),
                  h.Tabindex(-1),
                ],
                [
                  avatar(
                    {
                      alt: article.author.name,
                      border: true,
                      entityKind: "agent",
                      focusable: true,
                      seed: article.author.seed,
                      size: "md",
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
                      h.OnClick(props.messageForAuthor(article.id)),
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

export const blogHeaderAltLayout04 = <Message>(
  props: BlogHeaderAltLayout04Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("bg-bg-primary"), h.Dir("ltr")],
    [
      h.section(
        [h.Class("bg-bg-primary py-16 md:py-24")],
        [
          h.div(
            [h.Class("mx-auto max-w-container px-4 md:px-8")],
            [
              h.div(
                [h.Class("mx-auto flex w-full max-w-3xl flex-col items-center text-center")],
                [
                  h.span(
                    [h.Class("text-sm font-semibold text-text-brand-secondary md:text-md")],
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
                        "mt-8 grid w-full grid-cols-1 items-start gap-4 sm:mt-12 sm:w-auto sm:grid-cols-[335px_max-content]",
                      ),
                      h.OnSubmit(props.onSubmit),
                    ],
                    [
                      h.div(
                        [h.Class("flex flex-col gap-1.5")],
                        [
                          h.div(
                            [
                              h.Class(
                                "relative flex w-full items-center gap-2 rounded-lg bg-bg-primary px-3.5 py-2.5 text-md shadow-xs ring-1 ring-border-primary ring-inset transition duration-100 ease-linear focus-within:ring-2 focus-within:ring-border-brand",
                              ),
                            ],
                            [
                              h.input([
                                h.AriaLabel(props.emailLabel),
                                h.Class(
                                  "min-w-0 flex-1 bg-transparent text-text-primary outline-none placeholder:text-text-placeholder",
                                ),
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
                            [h.Class("self-start text-sm text-text-tertiary")],
                            [
                              `${props.privacyCopy} `,
                              h.a(
                                [
                                  h.Class(
                                    "rounded-xs underline underline-offset-3 outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                                  ),
                                  h.Href(props.privacyHref),
                                  h.OnClick(props.onPrivacyPolicy),
                                ],
                                [props.privacyLabel],
                              ),
                              ".",
                            ],
                          ),
                        ],
                      ),
                      button({ label: props.submitLabel, size: "xl", type: "submit" }, h),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
      h.section(
        [
          h.Class(
            "mx-auto flex w-full max-w-container flex-col gap-12 bg-bg-primary px-4 pb-16 md:gap-16 md:px-8 md:pb-24",
          ),
        ],
        [
          h.ul(
            [h.Class("mx-auto grid grid-cols-1 gap-x-8 gap-y-12 sm:max-w-lg xl:max-w-3xl")],
            props.articles.map((article) =>
              h.keyed("li")(
                article.id,
                [
                  h.Class("nth-[n+7]:hidden lg:nth-[n+7]:block"),
                  h.DataAttribute("article-id", article.id),
                ],
                [articleCard(article, props, h)],
              ),
            ),
          ),
          pagination(
            {
              messageForPage: props.messageForPage,
              page: props.currentPage,
              total: props.totalPages,
              variant: "page-default",
            },
            h,
          ),
        ],
      ),
    ],
  );
