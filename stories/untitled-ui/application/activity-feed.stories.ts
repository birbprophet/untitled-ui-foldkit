/* oxlint-disable effect/noSpread, mps/require-is-prefix-for-boolean-schema-field -- Storybook controls retain the upstream `connector` prop name. */
import { blobatarDataUri } from "avatar";
import * as S from "effect/Schema";
import { activityFeed } from "ui/application";
import type { ActivityFeedItem } from "ui/application";

import { componentMeta, matrix, staticStory } from "../story.ts";

const Args = S.Struct({ connector: S.Boolean, size: S.Union([S.Literal("sm"), S.Literal("md")]) });

const phoenix = blobatarDataUri("Phoenix Baker", {
  background: "circle",
  kind: "agent",
  size: 128,
  title: "Phoenix Baker",
});
const lana = blobatarDataUri("Lana Steiner", {
  background: "circle",
  kind: "robot",
  size: 128,
  title: "Lana Steiner",
});

const base: ActivityFeedItem = {
  action: { content: "Added a file to", href: "#", target: "Marketing site redesign" },
  attachment: { name: "Tech requirements.pdf", size: "720 KB", type: "pdf" },
  date: "Just now",
  id: "user-1",
  unseen: true,
  user: { avatarUrl: phoenix, href: "#", name: "Phoenix Baker", status: "online" },
};

export default {
  ...componentMeta("activity-feed"),
  title: "Untitled UI/Application/Activity Feed",
};

export const AllVariants = {
  ...staticStory(Args, (args, h) =>
    matrix(
      [
        ["Action and attachment", [activityFeed({ ...args, item: base }, h)]],
        [
          "Labels",
          [
            activityFeed(
              {
                ...args,
                item: {
                  ...base,
                  attachment: undefined,
                  labels: [
                    { color: "brand", name: "Design" },
                    { color: "success", name: "Approved" },
                  ],
                },
              },
              h,
            ),
          ],
        ],
        [
          "Comment",
          [
            activityFeed(
              {
                ...args,
                item: {
                  ...base,
                  action: undefined,
                  attachment: undefined,
                  comment: "This is starting to look really good.",
                },
              },
              h,
            ),
          ],
        ],
        [
          "Message",
          [
            activityFeed(
              {
                ...args,
                item: {
                  ...base,
                  action: { content: "Sent you a message" },
                  attachment: undefined,
                  message: "We should ask Oli about this today.",
                },
              },
              h,
            ),
          ],
        ],
        [
          "Username",
          [
            activityFeed(
              {
                ...args,
                item: {
                  ...base,
                  action: undefined,
                  attachment: undefined,
                  user: { ...base.user, username: "@phoenix" },
                },
              },
              h,
            ),
          ],
        ],
      ],
      h,
    ),
  ),
  args: { connector: false, size: "md" },
};

export const States = {
  ...staticStory(Args, (args, h) =>
    matrix(
      [
        ["Unseen and online", [activityFeed({ ...args, item: base }, h)]],
        [
          "Seen and offline",
          [
            activityFeed(
              {
                ...args,
                item: {
                  ...base,
                  unseen: false,
                  user: { avatarUrl: lana, href: "#", name: "Lana Steiner", status: "offline" },
                },
              },
              h,
            ),
          ],
        ],
        ["Connected", [activityFeed({ ...args, connector: true, item: base }, h)]],
      ],
      h,
    ),
  ),
  args: { connector: false, size: "sm" },
};

export const Dark = {
  ...staticStory(Args, (args, h) =>
    h.div(
      [h.Class("fixed inset-0 bg-bg-primary p-16"), h.DataAttribute("theme", "dark")],
      [activityFeed({ ...args, item: base }, h)],
    ),
  ),
  args: { connector: true, size: "md" },
};
