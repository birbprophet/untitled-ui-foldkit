/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noSpread -- Storybook CSF and play functions use the browser promise API directly. */
import * as S from "effect/Schema";
import { paginationLine } from "ui/application";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory, matrix } from "../story.ts";

const Args = S.Struct({ page: S.Number, total: S.Number });
const Model = Args;
type Model = typeof Model.Type;
type Message = Readonly<{ _tag: "PageChanged"; page: number }>;
const changed = (page: number): Message => ({ _tag: "PageChanged", page });
const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => args,
  update: (model: Model, message: Message): Model => ({ ...model, page: message.page }),
  view: (model: Model, h: Parameters<typeof paginationLine<Message>>[1]) =>
    paginationLine({ ...model, messageForPage: changed }, h),
} as const;

export default {
  ...componentMeta("pagination-line"),
  title: "Untitled UI/Application/Pagination Line",
};

export const AllVariants = {
  ...liveStory({
    ...definition,
    update: (model) => model,
    view: (model, h) =>
      matrix(
        [
          [
            "Sizes",
            (["md", "lg"] as const).map((size) =>
              paginationLine({ ...model, messageForPage: changed, size }, h),
            ),
          ],
          ["Framed", [paginationLine({ ...model, framed: true, messageForPage: changed }, h)]],
        ],
        h,
      ),
  }),
  args: { page: 2, total: 5 },
};

export const States = {
  ...liveStory({
    ...definition,
    update: (model) => model,
    view: (model, h) =>
      matrix([["Ellipsis", [paginationLine({ ...model, messageForPage: changed }, h)]]], h),
  }),
  args: { page: 6, total: 12 },
};

export const Dark = {
  ...liveStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary p-16"), h.DataAttribute("theme", "dark")],
        [paginationLine({ ...model, framed: true, messageForPage: changed }, h)],
      ),
  }),
  args: { page: 2, total: 5 },
};

export const Interactions = {
  ...liveStory(definition),
  args: { page: 2, total: 5 },
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const pageFour = await within(canvasElement).findByRole("button", { name: "Page 4" });
    await userEvent.click(pageFour);
    await waitFor(() => expect(pageFour).toHaveAttribute("aria-current", "page"));
    const pageOne = await within(canvasElement).findByRole("button", { name: "Page 1" });
    pageOne.focus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(pageOne).toHaveAttribute("aria-current", "page"));
  },
};
