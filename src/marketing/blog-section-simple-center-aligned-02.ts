/* oxlint-disable effect/noReturnInArrow -- Direct FoldKit transcription of the authenticated Untitled UI blog section. */
import { blobatarDataUri } from "avatar";
import type { Html, HtmlBuilder } from "foldkit/html";

import { avatar } from "../base/avatar.ts";

export interface BlogSectionSimpleCenterAligned02Article {
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

export interface BlogSectionSimpleCenterAligned02Props<Message> {
  readonly articles: readonly BlogSectionSimpleCenterAligned02Article[];
  readonly description: string;
  readonly heading: string;
  readonly messageForArticle: (id: string) => NoInfer<Message>;
  readonly messageForAuthor: (id: string) => NoInfer<Message>;
  readonly messageForCategory: (id: string) => NoInfer<Message>;
}

const articleCard = <Message>(
  article: BlogSectionSimpleCenterAligned02Article,
  props: BlogSectionSimpleCenterAligned02Props<Message>,
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
              "aspect-[1.5] w-full object-cover transition duration-100 ease-linear hover:scale-105 xl:w-80",
            ),
            h.Src(
              blobatarDataUri(article.thumbnailSeed, {
                background: "square",
                kind: "robot",
                size: 480,
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

export const blogSectionSimpleCenterAligned02 = <Message>(
  props: BlogSectionSimpleCenterAligned02Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("bg-bg-primary py-16 md:py-24"), h.Dir("ltr")],
    [
      h.div(
        [h.Class("mx-auto max-w-container px-4 md:px-8")],
        [
          h.div(
            [h.Class("mx-auto max-w-3xl text-center")],
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
          h.ul(
            [h.Class("mt-12 grid grid-cols-1 gap-x-8 gap-y-12 md:mt-16 md:grid-cols-2")],
            props.articles
              .slice(0, 4)
              .map((article) =>
                h.keyed("li")(
                  article.id,
                  [h.DataAttribute("article-id", article.id)],
                  [articleCard(article, props, h)],
                ),
              ),
          ),
        ],
      ),
    ],
  );
