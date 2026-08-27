/* oxlint-disable effect/noReturnInArrow -- Direct FoldKit transcription of the authenticated Untitled UI dropdown menu. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import {
  marketingDropdownMenuHorizontalPost,
  marketingDropdownMenuItemLink,
  marketingDropdownMenuShell,
} from "./marketing-dropdown-shared.ts";
import type {
  MarketingDropdownMenuItem,
  MarketingDropdownMenuPost,
} from "./marketing-dropdown-shared.ts";

export interface DropdownMenuFeaturedPostsProps<Message> {
  readonly allPostsLabel: string;
  readonly columnTitle: string;
  readonly items: readonly MarketingDropdownMenuItem[];
  readonly onAllPosts: NoInfer<Message>;
  readonly onItem: (id: string) => NoInfer<Message>;
  readonly onPost: (id: string) => NoInfer<Message>;
  readonly posts: readonly MarketingDropdownMenuPost[];
  readonly postsTitle: string;
}

export const dropdownMenuFeaturedPosts = <Message>(
  props: DropdownMenuFeaturedPostsProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  marketingDropdownMenuShell(
    [
      h.div(
        [h.Class("flex flex-col gap-4 p-4 md:flex-row md:gap-6 md:p-6")],
        [
          h.div(
            [h.Class("flex flex-1 flex-col gap-0.5")],
            [
              h.h3(
                [h.Class("mb-1 px-3 text-sm font-semibold text-text-brand-tertiary md:px-0")],
                [props.columnTitle],
              ),
              h.ul(
                [h.Class("flex flex-col gap-0.5")],
                props.items.map((item) =>
                  h.keyed("li")(
                    item.id,
                    [],
                    [marketingDropdownMenuItemLink(item, props.onItem, h)],
                  ),
                ),
              ),
            ],
          ),
          h.div(
            [
              h.Class(
                "flex flex-1 flex-col gap-3 border-t border-border-secondary pt-4 md:border-t-0 md:border-l md:pt-0 md:pl-6",
              ),
            ],
            [
              h.h3([h.Class("text-sm font-semibold text-text-brand-tertiary")], [props.postsTitle]),
              h.ul(
                [h.Class("flex flex-col gap-0.5")],
                props.posts.map((post) =>
                  h.keyed("li")(
                    post.id,
                    [],
                    [marketingDropdownMenuHorizontalPost(post, props.onPost, h)],
                  ),
                ),
              ),
              button(
                {
                  color: "link-color",
                  label: props.allPostsLabel,
                  onPress: props.onAllPosts,
                  size: "md",
                },
                h,
              ),
            ],
          ),
        ],
      ),
    ],
    h,
  );
