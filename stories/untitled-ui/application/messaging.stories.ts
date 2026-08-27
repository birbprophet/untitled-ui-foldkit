/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/no-nested-ternary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks, mps/require-is-prefix-for-boolean-schema-field -- Story state stays in the FoldKit Model while the fixture mirrors the source message branches. */
import * as S from "effect/Schema";
import { messaging } from "ui/application";
import type { MessagingAction, MessagingMessage } from "ui/application";
import { expect, userEvent, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory } from "../story.ts";

const Args = S.Struct({ showUserLabel: S.Boolean });
const Model = S.Struct({
  ...Args.fields,
  audioPlaying: S.Boolean,
  reactionCount: S.Number,
});
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "Action"; action: MessagingAction; id: string }>
  | Readonly<{ _tag: "Reacted"; content: string; id: string }>;

const action = (id: string, selectedAction: MessagingAction): Message => ({
  _tag: "Action",
  action: selectedAction,
  id,
});
const reacted = (id: string, content: string): Message => ({ _tag: "Reacted", content, id });
const image =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 360'%3E%3Crect width='640' height='360' fill='%23e9eaeb'/%3E%3Cpath d='M0 290 155 150l95 78 80-56 180 118Z' fill='%23a4a7ae'/%3E%3Ccircle cx='490' cy='105' r='46' fill='%23f5f5f5'/%3E%3C/svg%3E";

const fixture = (model: Model): readonly MessagingMessage[] => [
  {
    id: "incoming-text",
    sentAt: "10:24 AM",
    status: "sent",
    text: "Hey Olivia, can you review the latest report before the Run starts?",
    user: { name: "Phoenix Baker", seed: "messaging-phoenix", status: "online" },
  },
  {
    id: "outgoing-reply",
    reactions: [{ content: "👍", count: model.reactionCount }],
    readAt: "10:28 AM",
    reply: { text: "Can you review the latest report?" },
    sentAt: "10:27 AM",
    status: "read",
    text: "Absolutely. I have opened the Document and I am checking it now.",
    user: { me: true, name: "Olivia Rhye" },
  },
  {
    id: "url-preview",
    sentAt: "10:31 AM",
    text: "The source checklist is here:",
    urlPreview: {
      description: "The exact inputs and validation rules for this Assignment.",
      title: "Run source checklist",
    },
    user: { name: "Phoenix Baker", seed: "messaging-phoenix", status: "online" },
  },
  {
    id: "image",
    image: {
      alt: "Abstract landscape preview",
      name: "report-preview.jpg",
      size: "1.2 MB",
      src: image,
    },
    sentAt: "10:32 AM",
    user: { name: "Phoenix Baker", seed: "messaging-phoenix", status: "online" },
  },
  {
    audio: { duration: model.audioPlaying ? "0:12 / 0:42" : "0:42" },
    id: "audio",
    sentAt: "10:34 AM",
    user: { name: "Phoenix Baker", seed: "messaging-phoenix", status: "online" },
  },
  {
    attachment: { name: "management-report.pdf", size: "4.8 MB", type: "pdf" },
    id: "attachment",
    sentAt: "10:36 AM",
    user: { name: "Phoenix Baker", seed: "messaging-phoenix", status: "online" },
  },
  {
    id: "failed",
    sentAt: "10:38 AM",
    status: "failed",
    text: "The final note could not be sent.",
    user: { me: true, name: "Olivia Rhye" },
  },
  {
    id: "typing",
    typing: true,
    user: { name: "Phoenix Baker", seed: "messaging-phoenix", status: "online" },
  },
];

const update = (model: Model, message: Message): Model =>
  message._tag === "Action" && message.action === "play"
    ? { ...model, audioPlaying: !model.audioPlaying }
    : message._tag === "Reacted"
      ? { ...model, reactionCount: model.reactionCount + 1 }
      : model;

const view = (model: Model, h: Parameters<typeof messaging<Message>>[1]) =>
  h.div(
    [h.Class("fixed inset-0 overflow-auto bg-bg-secondary p-4 md:p-8")],
    [
      h.ul(
        [h.Class("mx-auto grid max-w-5xl items-start gap-8 md:grid-cols-2")],
        fixture(model).map((message) =>
          h.div(
            [h.Class("rounded-xl bg-bg-primary p-5 shadow-xs ring-1 ring-border-secondary")],
            [
              messaging(
                {
                  message,
                  onAction: action,
                  onReaction: reacted,
                  showUserLabel: model.showUserLabel,
                },
                h,
              ),
            ],
          ),
        ),
      ),
    ],
  );

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({ ...args, audioPlaying: false, reactionCount: 2 }),
  update,
  view,
} as const;
const args: typeof Args.Type = { showUserLabel: true };

export default {
  ...componentMeta("messaging"),
  argTypes: { showUserLabel: { control: "boolean" } },
  title: "Untitled UI/Application/Messaging",
};

export const AllVariants = { ...liveStory(definition), args };
export const States = { ...liveStory(definition), args: { showUserLabel: false } };
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model, h) => h.div([h.DataAttribute("theme", "dark")], [view(model, h)]),
  }),
  args,
};
export const Responsive = { ...liveStory(definition), args };
export const Interactions = {
  ...liveStory(definition),
  args,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole("button", { name: "Play audio message" }));
    await expect(await canvas.findByText("0:12 / 0:42")).toBeVisible();
    await userEvent.click(await canvas.findByRole("button", { name: "👍 2" }));
    await expect(await canvas.findByRole("button", { name: "👍 3" })).toBeVisible();
  },
};
