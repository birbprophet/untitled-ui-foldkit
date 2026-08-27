/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/no-nested-ternary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks, mps/require-is-prefix-for-boolean-schema-field -- Storybook CSF exposes the exact upstream boolean props and its play function is promise-based. */
import * as S from "effect/Schema";
import * as Match from "effect/Match";
import { codeSnippet } from "../../../src/application.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory, matrix } from "../story.ts";

const Args = S.Struct({
  code: S.String,
  language: S.String,
  maxHeight: S.Number,
  showLineNumbers: S.Boolean,
  variant: S.Literals(["plain", "modern", "tabs"]),
});
const Model = S.Struct({
  code: S.String,
  copied: S.Boolean,
  expanded: S.Boolean,
  focusedTab: S.String,
  language: S.String,
  maxHeight: S.Number,
  selectedTab: S.String,
  showLineNumbers: S.Boolean,
  variant: S.Literals(["plain", "modern", "tabs"]),
});
type Args = typeof Args.Type;
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "Copy" }>
  | Readonly<{ _tag: "Expand" }>
  | Readonly<{ _tag: "ToggleExpanded" }>
  | Readonly<{ _tag: "FocusTab"; id: string }>
  | Readonly<{ _tag: "SelectTab"; id: string }>;

const copy: Message = { _tag: "Copy" };
const expand: Message = { _tag: "Expand" };
const toggleExpanded: Message = { _tag: "ToggleExpanded" };
const focusTab = (id: string): Message => ({ _tag: "FocusTab", id });
const selectTab = (id: string): Message => ({ _tag: "SelectTab", id });

const sample = `import { Button } from "@/components/base/buttons/button";

export const Example = () => (
  <Button color="primary">Run report</Button>
);`;
const shell = `bunx untitledui@0.1.64 add button
bun run storybook:dev`;
const tabs = [
  { code: sample, id: "tsx", label: "React" },
  { code: shell, id: "shell", label: "Shell" },
] as const;

const definition = {
  Args,
  Model,
  init: (args: Args): Model => ({
    ...args,
    copied: false,
    expanded: false,
    focusedTab: "tsx",
    selectedTab: "tsx",
  }),
  update: (model: Model, message: Message): Model =>
    Match.value(message).pipe(
      Match.when({ _tag: "Copy" }, () => ({ ...model, copied: true })),
      Match.when({ _tag: "Expand" }, () => ({ ...model, expanded: true })),
      Match.when({ _tag: "ToggleExpanded" }, () => ({ ...model, expanded: !model.expanded })),
      Match.when({ _tag: "FocusTab" }, ({ id }) => ({ ...model, focusedTab: id })),
      Match.when({ _tag: "SelectTab" }, ({ id }) => ({
        ...model,
        focusedTab: id,
        selectedTab: id,
      })),
      Match.exhaustive,
    ),
  view: (model: Model, h: Parameters<typeof codeSnippet<Message>>[1]) =>
    codeSnippet(
      {
        code: model.code,
        copied: model.copied,
        expanded: model.expanded,
        focusedTab: model.focusedTab,
        language: model.language,
        maxHeight: model.maxHeight,
        onCopy: copy,
        onExpand: expand,
        onFocusTab: focusTab,
        onSelectTab: selectTab,
        onToggleExpanded: toggleExpanded,
        selectedTab: model.selectedTab,
        showLineNumbers: model.showLineNumbers,
        tabs,
        variant: model.variant,
      },
      h,
    ),
} as const;

export default {
  ...componentMeta("code-snippet"),
  title: "Untitled UI/Application/Code Snippet",
};

export const AllVariants = {
  ...liveStory<typeof Args.Type, Model, Message>({
    ...definition,
    view: (model, h) =>
      matrix(
        [
          [
            "Line numbers",
            [
              codeSnippet(
                { code: model.code, language: model.language, onCopy: copy, showLineNumbers: true },
                h,
              ),
            ],
          ],
          [
            "Modern",
            [
              codeSnippet(
                {
                  code: model.code,
                  language: model.language,
                  onCopy: copy,
                  onExpand: expand,
                  showLineNumbers: false,
                  variant: "modern",
                },
                h,
              ),
            ],
          ],
          [
            "Tabs",
            [
              codeSnippet(
                {
                  code: model.code,
                  language: model.language,
                  onCopy: copy,
                  onFocusTab: focusTab,
                  onSelectTab: selectTab,
                  selectedTab: model.selectedTab,
                  showLineNumbers: false,
                  tabs,
                  variant: "tabs",
                },
                h,
              ),
            ],
          ],
        ],
        h,
      ),
  }),
  args: { code: sample, language: "text", maxHeight: 132, showLineNumbers: true, variant: "plain" },
};

export const States = {
  ...liveStory<typeof Args.Type, Model, Message>({
    ...definition,
    view: (model, h) =>
      matrix(
        [
          [
            "Collapsed",
            [
              codeSnippet(
                {
                  code: model.code,
                  expanded: false,
                  language: model.language,
                  maxHeight: model.maxHeight,
                  onToggleExpanded: toggleExpanded,
                  showLineNumbers: false,
                  variant: "modern",
                },
                h,
              ),
            ],
          ],
          [
            "Expanded and copied",
            [
              codeSnippet(
                {
                  code: model.code,
                  copied: true,
                  expanded: true,
                  language: model.language,
                  maxHeight: model.maxHeight,
                  onCopy: copy,
                  onToggleExpanded: toggleExpanded,
                  showLineNumbers: false,
                  variant: "modern",
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
    code: sample,
    language: "text",
    maxHeight: 132,
    showLineNumbers: false,
    variant: "modern",
  },
};

export const Dark = {
  ...liveStory<typeof Args.Type, Model, Message>({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary p-16"), h.DataAttribute("theme", "dark")],
        [
          codeSnippet(
            {
              code: model.code,
              language: model.language,
              onCopy: copy,
              showLineNumbers: false,
              variant: "modern",
            },
            h,
          ),
        ],
      ),
  }),
  args: {
    code: sample,
    language: "text",
    maxHeight: 132,
    showLineNumbers: false,
    variant: "modern",
  },
};

export const Responsive = {
  ...liveStory(definition),
  args: { code: sample, language: "text", maxHeight: 132, showLineNumbers: true, variant: "plain" },
};

export const Interactions = {
  ...liveStory<typeof Args.Type, Model, Message>({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("flex w-full max-w-3xl flex-col gap-8")],
        [
          codeSnippet(
            {
              code: model.code,
              copied: model.copied,
              focusedTab: model.focusedTab,
              language: model.language,
              onCopy: copy,
              onFocusTab: focusTab,
              onSelectTab: selectTab,
              selectedTab: model.selectedTab,
              showLineNumbers: false,
              tabs,
              variant: "tabs",
            },
            h,
          ),
          codeSnippet(
            {
              code: model.code,
              expanded: model.expanded,
              language: model.language,
              maxHeight: model.maxHeight,
              onToggleExpanded: toggleExpanded,
              showLineNumbers: false,
              variant: "modern",
            },
            h,
          ),
        ],
      ),
  }),
  args: { code: sample, language: "text", maxHeight: 88, showLineNumbers: false, variant: "tabs" },
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    const reactTab = await canvas.findByRole("tab", { name: "React" });
    const shellTab = await canvas.findByRole("tab", { name: "Shell" });
    reactTab.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(shellTab).toHaveFocus();
    await expect(reactTab).toHaveAttribute("aria-selected", "true");
    await userEvent.keyboard("{Enter}");
    await waitFor(() =>
      expect(canvas.getByRole("tab", { name: "Shell" })).toHaveAttribute("aria-selected", "true"),
    );
    const copyButtons = await canvas.findAllByRole("button", { name: "Copy" });
    await userEvent.click(copyButtons[0]);
    const copiedButtons = await canvas.findAllByRole("button", { name: "Copied" });
    await expect(copiedButtons[0]).toBeVisible();
    await userEvent.click(await canvas.findByRole("button", { name: "Show more" }));
    await expect(await canvas.findByRole("button", { name: "Show less" })).toBeVisible();
  },
};
