/* oxlint-disable effect/noReturnInArrow -- Direct FoldKit transcription of the authenticated Untitled UI marketing menu. */
import type { Html, HtmlBuilder } from "foldkit/html";

import {
  marketingMenuBlogPostHorizontal,
  type MarketingMenuBlogPost,
  type MarketingMenuCategoryItem,
} from "./marketing-menu-shared.ts";

export interface MenuBlogPostsWithSidebarProps<Message> {
  readonly categoriesTitle: string;
  readonly categoryItems: readonly MarketingMenuCategoryItem[];
  readonly isMobile?: boolean;
  readonly onCategory: (id: string) => NoInfer<Message>;
  readonly onPost: (id: string) => NoInfer<Message>;
  readonly posts: readonly MarketingMenuBlogPost[];
}

export const menuBlogPostsWithSidebar = <Message>(
  props: MenuBlogPostsWithSidebarProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const visiblePosts = props.isMobile === true ? props.posts.slice(0, 4) : props.posts.slice(0, 6);

  return h.section([h.Class("relative overflow-hidden bg-bg-primary md:shadow-lg"), h.Dir("ltr")], [
    h.div([h.Class("mx-auto flex max-w-container flex-col md:flex-row md:gap-16 md:px-8")], [
      h.div([h.Class("relative z-10 flex min-w-50 flex-col gap-3 py-4 md:pt-6 md:pb-8")], [
        h.h3([h.Class("px-4 text-sm font-semibold text-text-brand-tertiary md:px-0")], [props.categoriesTitle]),
        h.ul(
          [h.Class("flex flex-col gap-0.5")],
          props.categoryItems.map((item) =>
            h.li([
              h.keyed("li")(
                item.id,
                [],
                [
                  h.a(
                    [
                      h.Class(
                        "flex gap-3 rounded-lg px-4 py-2.5 outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary_hover focus-visible:outline-2 md:px-3",
                      ),
                      h.Href(item.href),
                      h.OnClick(props.onCategory(item.id)),
                    ],
                    [h.span([h.Class("text-sm font-semibold text-text-secondary")], [item.title])],
                  ),
                ],
              ),
            ]),
          ),
        ),
      ]),
      h.ul(
        [h.Class("grid flex-1 grid-cols-1 gap-1 pb-5 md:pt-5 md:pb-6 lg:grid-cols-2")],
        visiblePosts.map((post) =>
          h.li([h.keyed("li")(post.id, [], [marketingMenuBlogPostHorizontal(post, h)])]),
        ),
      ),
    ]),
  ]);
};
