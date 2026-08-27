/* oxlint-disable @rikalabs/no-low-signal-variable-names, effect/noReturnInArrow, effect/noTernary, effect/noSpread -- Story matrices and typed fixture updates remain direct. */
import type * as Schema from "effect/Schema";
import type { Command } from "foldkit/command";
/* oxlint-disable effect/noNewError, effect/noThrowStatement, mps/avoid-untagged-errors -- An invalid checked-in verified story is a build-time defect, not a recoverable domain failure. */
import type { Html, HtmlBuilder } from "foldkit/html";
import { createFoldkitStory, waitForFoldkitStory } from "storybook-renderer-foldkit";
import { catalog } from "ui/catalog";

export interface TaggedMessage {
  readonly _tag: string;
}

export const waitForStoryReady = (canvasElement: HTMLElement): Promise<HTMLElement> =>
  waitForFoldkitStory(canvasElement);

export const componentMeta = (id: string) => {
  const entry = catalog.find((candidate) => candidate.id === id);
  if (entry === undefined || entry.status !== "verified") {
    throw new Error(`Story requested unverified Untitled UI component ${id}`);
  }
  if (entry.verification === undefined) {
    throw new Error(`Story requested verified Untitled UI component ${id} without evidence`);
  }
  const evidence = entry.verification;
  return {
    parameters: {
      docs: {
        description: {
          component: [
            `Untitled UI component ID: \`${entry.id}\``,
            `Source: \`${entry.sourceVersion}\` at \`${entry.sourcePath}\``,
            `Documentation: ${entry.documentationUrl}`,
            `Documented variants: ${entry.documentedVariants.join(", ")}`,
            `Verification: visual ${evidence.visual}; interaction ${evidence.interaction}; accessibility ${evidence.accessibility}; locales ${evidence.locale}; responsive ${evidence.responsive}.`,
            "Intentional deltas: Untitled purple brand and focus roles use Siglata teal; registered Siglata assets replace upstream identity where applicable.",
          ].join("\n\n"),
        },
      },
      layout: "fullscreen",
      untitledUi: {
        accessLevel: entry.accessLevel,
        componentId: id,
        documentationUrl: entry.documentationUrl,
        documentedVariants: entry.documentedVariants,
        intentionalDeltas: ["brand and focus purple to Siglata teal", "identity assets to Siglata"],
        locales: ["pt-BR", "en-US"],
        paperReference: "01M0QSZSZ0N5X96Z5X8PKDBMD0 · Design system",
        sourcePath: entry.sourcePath,
        sourceVersion: entry.sourceVersion,
        themes: ["light", "dark"],
        verification: evidence,
        viewports: ["mobile", "tablet", "laptop", "desktop"],
      },
    },
    tags: ["autodocs", "foldkit", "verified"],
    title: entry.storybookTitle,
  } as const;
};

export const liveStory = <Args, Model, Message extends TaggedMessage>(definition: {
  readonly Args: Schema.Codec<Args, unknown>;
  readonly Model: Schema.Codec<Model, unknown>;
  readonly init: (args: Args) => Model;
  readonly update: (model: Model, message: Message) => Model;
  readonly view: (model: Model, h: HtmlBuilder<Message>) => Html;
}) =>
  createFoldkitStory<Args, Model, Message>({
    Args: definition.Args,
    Model: definition.Model,
    init: (args) => [definition.init(args), []],
    update: (model, message) => [definition.update(model, message), []],
    view: (model, h) => ({ body: definition.view(model, h) }),
  });

export const liveCommandStory = <Args, Model, Message extends TaggedMessage>(definition: {
  readonly Args: Schema.Codec<Args, unknown>;
  readonly Model: Schema.Codec<Model, unknown>;
  readonly init: (args: Args) => readonly [Model, readonly Command<Message>[]];
  readonly update: (
    model: Model,
    message: Message,
  ) => readonly [Model, readonly Command<Message>[]];
  readonly view: (model: Model, h: HtmlBuilder<Message>) => Html;
}) =>
  createFoldkitStory<Args, Model, Message>({
    Args: definition.Args,
    Model: definition.Model,
    init: definition.init,
    update: definition.update,
    view: (model, h) => ({ body: definition.view(model, h) }),
  });

export const staticStory = <Args>(
  Args: Schema.Codec<Args, unknown>,
  view: (model: Args, h: HtmlBuilder<{ readonly _tag: "Noop" }>) => Html,
) =>
  liveStory({
    Args,
    Model: Args,
    init: (args) => args,
    update: (model) => model,
    view,
  });

export const matrix = <Message>(
  rows: readonly [string, readonly Html[]][],
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("uui-story-matrix")],
    rows.map(([label, specimens]) =>
      h.div(
        [h.Class("uui-story-row")],
        [h.span([h.Class("uui-story-label")], [label]), ...specimens],
      ),
    ),
  );
