/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor -- Storybook CSF and controlled notification state remain direct. */
import { blobatarDataUri } from "avatar";
import * as S from "effect/Schema";
import { notification } from "ui/application";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory, matrix } from "../story.ts";

const Args = S.Struct({ description: S.String, title: S.String });
const Model = S.Struct({ description: S.String, isVisible: S.Boolean, title: S.String });
type Model = typeof Model.Type;
type Message = Readonly<{ _tag: "Close" | "Confirm" }>;
const close: Message = { _tag: "Close" };
const confirm: Message = { _tag: "Confirm" };
const avatar = blobatarDataUri("Olivia Rhye", {
  background: "circle",
  kind: "agent",
  size: 128,
  title: "Olivia Rhye",
});
const image =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='496' height='240' viewBox='0 0 496 240'%3E%3Crect width='496' height='240' fill='%23d5faf3'/%3E%3Ccircle cx='248' cy='120' r='72' fill='%23008f7a'/%3E%3C/svg%3E";

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({ ...args, isVisible: true }),
  update: (model: Model): Model => ({ ...model, isVisible: false }),
  view: (model: Model, h: Parameters<typeof notification<Message>>[1]) =>
    model.isVisible
      ? notification(
          {
            confirmLabel: "View changes",
            description: model.description,
            kind: "icon",
            onClose: close,
            onConfirm: confirm,
            title: model.title,
          },
          h,
        )
      : h.div([h.AriaLive("polite")], ["Notification dismissed"]),
} as const;

export default {
  ...componentMeta("notifications"),
  title: "Untitled UI/Application/Notifications",
};

export const AllVariants = {
  ...liveStory({
    ...definition,
    update: (model: Model) => model,
    view: (model, h) =>
      matrix(
        [
          [
            "Icon",
            [
              notification(
                {
                  confirmLabel: "View changes",
                  description: model.description,
                  kind: "icon",
                  onClose: close,
                  onConfirm: confirm,
                  title: model.title,
                },
                h,
              ),
            ],
          ],
          [
            "Avatar",
            [
              notification(
                {
                  avatar,
                  confirmLabel: "Reply",
                  content: "Mentioned you in a comment",
                  date: "2m ago",
                  kind: "avatar",
                  name: "Olivia Rhye",
                  onClose: close,
                  onConfirm: confirm,
                },
                h,
              ),
            ],
          ],
          [
            "Image",
            [
              notification(
                {
                  confirmLabel: "View project",
                  description: model.description,
                  imageDesktop: image,
                  imageMobile: image,
                  kind: "image",
                  onClose: close,
                  onConfirm: confirm,
                  title: model.title,
                },
                h,
              ),
            ],
          ],
        ],
        h,
      ),
  }),
  args: {
    description: "Your team has been updated with the latest permissions.",
    title: "We've just released a new feature",
  },
};

export const States = {
  ...liveStory({
    ...definition,
    update: (model: Model) => model,
    view: (model, h) =>
      matrix(
        [
          [
            "Brand",
            [
              notification(
                {
                  color: "brand",
                  confirmLabel: "View changes",
                  description: model.description,
                  kind: "icon",
                  onClose: close,
                  onConfirm: confirm,
                  title: model.title,
                },
                h,
              ),
            ],
          ],
          [
            "Error",
            [
              notification(
                {
                  color: "error",
                  description: model.description,
                  kind: "icon",
                  onClose: close,
                  title: model.title,
                },
                h,
              ),
            ],
          ],
          [
            "Progress",
            [
              notification(
                {
                  description: "Uploading report.pdf",
                  kind: "icon",
                  onClose: close,
                  progress: 64,
                  title: "Upload in progress",
                },
                h,
              ),
            ],
          ],
        ],
        h,
      ),
  }),
  args: {
    description: "Your team has been updated with the latest permissions.",
    title: "We've just released a new feature",
  },
};

export const Dark = {
  ...liveStory({
    ...definition,
    update: (model: Model) => model,
    view: (model: Model, h: Parameters<typeof notification<Message>>[1]) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary p-16"), h.DataAttribute("theme", "dark")],
        [definition.view(model, h)],
      ),
  }),
  args: {
    description: "Your team has been updated with the latest permissions.",
    title: "We've just released a new feature",
  },
};
export const Responsive = {
  ...liveStory({
    ...definition,
    update: (model: Model) => model,
    view: (model, h) =>
      notification(
        {
          confirmLabel: "View project",
          description: model.description,
          imageDesktop: image,
          imageMobile: image,
          kind: "image",
          onClose: close,
          onConfirm: confirm,
          title: model.title,
        },
        h,
      ),
  }),
  args: {
    description: "Your team has been updated with the latest permissions.",
    title: "We've just released a new feature",
  },
};
export const Interactions = {
  ...liveStory(definition),
  args: {
    description: "Your team has been updated with the latest permissions.",
    title: "We've just released a new feature",
  },
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByText("Dismiss", { selector: "button" }));
    await waitFor(() => expect(canvas.getByText("Notification dismissed")).toBeVisible());
  },
};
