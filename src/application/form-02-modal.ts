/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary -- Placeholder copy and the controlled renderer preserve the authenticated responsive company form anatomy. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import type { FileUploadResult } from "./file-upload-base.ts";
import { classifyUploadFiles } from "./file-upload-base.ts";

export interface Form02ModalValues {
  readonly company: string;
  readonly description: string;
  readonly keywords: string;
  readonly username: string;
  readonly website: string;
}

export type Form02ModalField = keyof Form02ModalValues;

export interface Form02ModalProps<Message> {
  readonly avatarUrl?: string;
  readonly id: string;
  readonly isOpen: boolean;
  readonly onAddCompany: NoInfer<Message>;
  readonly onAvatarSelected: (result: FileUploadResult) => NoInfer<Message>;
  readonly onCancel: NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onFieldInput: (field: Form02ModalField, value: string) => NoInfer<Message>;
  readonly values: Form02ModalValues;
}

const closeIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-5"), h.Fill("none"), h.ViewBox("0 0 24 24")],
    [
      h.path([
        h.D("M18 6 6 18M6 6l12 12"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const buildingIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-5"), h.Fill("none"), h.ViewBox("0 0 24 24")],
    [
      h.path([
        h.D("M6 22V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v18M4 22h16M9 6h4M9 10h4M9 14h4M9 18h4"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("1.75"),
      ]),
    ],
  );

const imageIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-9"), h.Fill("none"), h.ViewBox("0 0 24 24")],
    [
      h.path([
        h.D(
          "M12.5 3H7.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C3 5.28 3 6.12 3 7.8v8.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C5.28 21 6.12 21 7.8 21H17c.93 0 1.395 0 1.776-.102a3 3 0 0 0 2.122-2.122C21 18.395 21 17.93 21 17m-2-9V2m-3 3h6M10.5 8.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4.49 3.418-8.459 7.69c-.476.433-.714.649-.735.836a.5.5 0 0 0 .167.431C6.105 21 6.426 21 7.07 21h9.387c1.44 0 2.159 0 2.724-.242a3 3 0 0 0 1.578-1.578c.242-.565.242-1.285.242-2.724 0-.484 0-.726-.053-.952a2.001 2.001 0 0 0-.374-.778c-.143-.182-.332-.333-.71-.636l-2.797-2.237c-.379-.303-.568-.454-.776-.508a1 1 0 0 0-.557.018c-.205.066-.384.23-.743.555Z",
        ),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const uploadIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-5"), h.Fill("none"), h.ViewBox("0 0 24 24")],
    [
      h.path([
        h.D(
          "m8 16 4-4m0 0 4 4m-4-4v9m8-4.257A5.5 5.5 0 0 0 16.5 7a.62.62 0 0 1-.534-.302 7.5 7.5 0 1 0-11.78 9.096",
        ),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const fieldLabel = <Message>(label: string, id: string, mobile: boolean, h: HtmlBuilder<Message>) =>
  h.label(
    [
      h.Class(
        `${mobile ? "sm:hidden" : "hidden w-40 shrink-0 sm:flex"} gap-0.5 text-sm font-medium text-text-secondary`,
      ),
      h.For(id),
    ],
    [label],
  );

const textInput = <Message>(
  props: Form02ModalProps<Message>,
  field: "company" | "website",
  label: string,
  placeholder: string,
  h: HtmlBuilder<Message>,
): Html => {
  const id = `${props.id}-${field}`;
  return h.section(
    [h.Class("flex w-full items-start gap-8")],
    [
      fieldLabel(label, id, false, h),
      h.div(
        [h.Class("flex min-w-0 flex-1 flex-col gap-1.5")],
        [
          fieldLabel(label, id, true, h),
          h.input([
            h.Class(
              "h-10 w-full rounded-lg bg-bg-primary px-3 py-2 text-md text-text-primary shadow-xs ring-1 ring-border-primary ring-inset outline-none placeholder:text-text-placeholder focus:ring-2 focus:ring-border-brand",
            ),
            h.Id(id),
            h.OnInput((value) => props.onFieldInput(field, value)),
            h.Placeholder(placeholder),
            h.Type(field === "website" ? "url" : "text"),
            h.Value(props.values[field]),
          ]),
        ],
      ),
    ],
  );
};

const profilePhoto = <Message>(props: Form02ModalProps<Message>, h: HtmlBuilder<Message>): Html =>
  h.div(
    [
      h.Class(
        "flex size-18 shrink-0 items-center justify-center rounded-full bg-bg-primary p-1 text-fg-quaternary ring-1 ring-border-secondary",
      ),
    ],
    props.avatarUrl === undefined
      ? [
          h.div(
            [
              h.Class(
                "flex size-full items-center justify-center rounded-full bg-bg-secondary ring-1 ring-border-secondary-alt",
              ),
            ],
            [imageIcon(h)],
          ),
        ]
      : [
          h.div(
            [
              h.Class(
                "size-full overflow-hidden rounded-full outline-[0.5px] -outline-offset-[0.5px]",
              ),
            ],
            [
              h.img([
                h.Alt("Company profile"),
                h.Class("size-full object-cover"),
                h.Src(props.avatarUrl),
              ]),
            ],
          ),
        ],
  );

const uploadControl = <Message>(
  props: Form02ModalProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const uploadId = `${props.id}-avatar`;
  const fileInput = (id: string): Html =>
    h.input([
      h.Accept(".svg,.png,.jpg,.jpeg,.gif"),
      h.Class("peer sr-only"),
      h.Id(id),
      h.OnFileChange((files) =>
        props.onAvatarSelected(
          classifyUploadFiles(files, {
            accept: ".svg,.png,.jpg,.jpeg,.gif",
            allowsMultiple: false,
            maxSize: 4_000_000,
          }),
        ),
      ),
      h.Type("file"),
    ]);
  return h.div(
    [h.Class("flex w-full items-center gap-5 sm:items-start")],
    [
      profilePhoto(props, h),
      h.div(
        [
          h.Class(
            "relative hidden h-[74px] min-w-0 flex-1 items-center justify-center rounded-xl bg-bg-primary px-3 text-center ring-1 ring-border-secondary ring-inset sm:flex",
          ),
        ],
        [
          fileInput(`${uploadId}-desktop`),
          h.div(
            [h.Class("flex flex-col gap-1")],
            [
              h.div(
                [h.Class("flex justify-center gap-1 text-sm")],
                [
                  h.label(
                    [
                      h.AriaLabel("Click to upload and attach files"),
                      h.Class(
                        "cursor-pointer font-semibold text-text-brand-secondary outline-focus-ring peer-focus-visible:outline-2",
                      ),
                      h.For(`${uploadId}-desktop`),
                    ],
                    ["Click to upload"],
                  ),
                  h.span([h.Class("text-text-tertiary")], ["or drag and drop"]),
                ],
              ),
              h.p(
                [h.Class("text-xs text-text-tertiary")],
                ["SVG, PNG, JPG or GIF (max. 800×400px)"],
              ),
            ],
          ),
        ],
      ),
      h.div(
        [h.Class("sm:hidden")],
        [
          fileInput(`${uploadId}-mobile`),
          h.label(
            [
              h.Class(
                "flex w-[146.84375px] cursor-pointer items-center gap-1 rounded-lg bg-bg-primary px-3.5 py-2.5 text-sm font-semibold text-text-secondary shadow-xs ring-1 ring-border-primary ring-inset",
              ),
              h.For(`${uploadId}-mobile`),
            ],
            [uploadIcon(h), "Upload photo"],
          ),
        ],
      ),
    ],
  );
};

const usernameField = <Message>(
  props: Form02ModalProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const id = `${props.id}-username`;
  const usernameLabel = (mobile: boolean): Html =>
    h.label(
      [
        h.Class(
          `${mobile ? "sm:hidden" : "hidden w-40 shrink-0 sm:flex"} gap-0.5 text-sm font-medium text-text-secondary`,
        ),
        h.For(id),
      ],
      ["Username", h.span([h.Class("text-text-brand-tertiary")], ["*"])],
    );
  return h.section(
    [h.Class("flex w-full items-start gap-8")],
    [
      usernameLabel(false),
      h.div(
        [h.Class("flex min-w-0 flex-1 flex-col gap-1.5")],
        [
          usernameLabel(true),
          h.div(
            [
              h.Class(
                "flex h-10 w-full overflow-hidden rounded-lg bg-bg-primary shadow-xs ring-1 ring-border-primary ring-inset focus-within:ring-2 focus-within:ring-border-brand",
              ),
            ],
            [
              h.span(
                [
                  h.Class(
                    "flex w-[115.421875px] shrink-0 items-center border-r border-border-primary px-3 text-md text-text-tertiary",
                  ),
                ],
                ["siglata.com/"],
              ),
              h.input([
                h.AriaLabel("Username"),
                h.Class(
                  "min-w-0 flex-1 bg-transparent px-3 py-2 text-md text-text-primary outline-none",
                ),
                h.Id(id),
                h.OnInput((value) => props.onFieldInput("username", value)),
                h.Placeholder("example"),
                h.Type("text"),
                h.Value(props.values.username),
              ]),
            ],
          ),
        ],
      ),
    ],
  );
};

const longField = <Message>(
  props: Form02ModalProps<Message>,
  field: "description" | "keywords",
  label: string,
  placeholder: string,
  h: HtmlBuilder<Message>,
): Html => {
  const id = `${props.id}-${field}`;
  return h.section(
    [h.Class("hidden w-full items-start gap-8 sm:flex")],
    [
      fieldLabel(label, id, false, h),
      h.textarea([
        h.AriaLabel(label),
        h.Class(
          "h-20 min-w-0 flex-1 resize-y rounded-lg bg-bg-primary px-3.5 py-3 text-md text-text-primary shadow-xs ring-1 ring-border-primary ring-inset outline-none placeholder:text-text-placeholder focus:ring-2 focus:ring-border-brand",
        ),
        h.Id(id),
        h.OnInput((value) => props.onFieldInput(field, value)),
        h.Placeholder(placeholder),
        h.Value(props.values[field]),
      ]),
    ],
  );
};

export const form02Modal = <Message>(
  props: Form02ModalProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const titleId = `${props.id}-title`;
  const descriptionId = `${props.id}-description`;
  return h.div(
    [],
    props.isOpen
      ? [
          h.div(
            [
              h.Class(
                "fixed inset-0 z-50 flex min-h-dvh w-full items-center justify-center bg-overlay/70 p-4 outline-hidden backdrop-blur-[6px]",
              ),
              h.DataAttribute("modal-overlay", props.id),
            ],
            [
              h.div([h.AriaHidden(true), h.Class("absolute inset-0"), h.OnClick(props.onDismiss)]),
              h.dialog(
                [
                  h.AriaDescribedBy(descriptionId),
                  h.AriaLabelledBy(titleId),
                  h.Class(
                    "fixed inset-0 mx-auto mt-auto mb-[clamp(16px,8vh,64px)] max-h-[calc(100dvh-32px)] w-[358.421875px] max-w-[calc(100%-32px)] overflow-y-auto rounded-xl border-0 bg-bg-primary p-0 shadow-xl outline-hidden sm:m-auto sm:w-[614.828125px] sm:max-w-[calc(100%-64px)] sm:rounded-2xl",
                  ),
                  h.Id(props.id),
                  h.OnCancel(props.onDismiss),
                ],
                [
                  h.button(
                    [
                      h.AriaLabel("Close dialog"),
                      h.Autofocus(true),
                      h.Class(
                        "absolute top-3 right-3 z-20 flex size-9 cursor-pointer items-center justify-center rounded-lg text-fg-quaternary outline-focus-ring hover:bg-bg-primary-hover focus-visible:outline-2 sm:top-4 sm:right-4",
                      ),
                      h.OnClick(props.onDismiss),
                      h.Type("button"),
                    ],
                    [closeIcon(h)],
                  ),
                  h.header(
                    [h.Class("flex gap-4 px-4 pt-5 sm:px-6 sm:pt-6")],
                    [
                      h.div(
                        [
                          h.Class(
                            "hidden size-10 shrink-0 items-center justify-center rounded-lg bg-bg-primary text-fg-secondary shadow-xs ring-1 ring-border-primary ring-inset sm:flex",
                          ),
                        ],
                        [buildingIcon(h)],
                      ),
                      h.div(
                        [h.Class("z-10 flex min-w-0 flex-col gap-0.5 pr-10")],
                        [
                          h.h2(
                            [h.Class("text-md font-semibold text-text-primary"), h.Id(titleId)],
                            ["Add your company"],
                          ),
                          h.p(
                            [h.Class("text-sm text-text-tertiary"), h.Id(descriptionId)],
                            [
                              "Create your company profile for free ",
                              h.span([h.Class("max-md:hidden")], ["in less than 5 minutes."]),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                  h.div([h.Class("h-5 w-full")]),
                  h.div([h.Class("w-full border-t border-border-secondary")]),
                  h.div(
                    [h.Class("flex flex-col gap-4 px-4 pt-5 sm:px-6")],
                    [
                      textInput(props, "company", "Company name", "e.g. Linear", h),
                      textInput(props, "website", "Website URL", "www.example.com", h),
                      h.div([h.Class("hidden w-full border-t border-border-secondary sm:block")]),
                      h.section(
                        [h.Class("flex w-full items-start gap-8")],
                        [
                          fieldLabel("Profile image", `${props.id}-avatar`, false, h),
                          uploadControl(props, h),
                        ],
                      ),
                      h.div([h.Class("hidden w-full border-t border-border-secondary sm:block")]),
                      usernameField(props, h),
                      longField(
                        props,
                        "keywords",
                        "Keywords",
                        "Add 1–10 keywords that help users find your company. For example, B2B, SaaS, marketplace, design...",
                        h,
                      ),
                      longField(
                        props,
                        "description",
                        "Description",
                        "Write a few sentences about the company...",
                        h,
                      ),
                    ],
                  ),
                  h.footer(
                    [h.Class("z-10 flex flex-col pt-6 pb-4 sm:pt-8 sm:pb-6")],
                    [
                      h.div([h.Class("w-full border-t border-border-secondary")]),
                      h.div([h.Class("h-4 w-full sm:h-6")]),
                      h.div(
                        [
                          h.Class(
                            "flex flex-1 flex-col-reverse gap-3 px-4 sm:grid sm:grid-cols-2 sm:px-6",
                          ),
                        ],
                        [
                          button(
                            {
                              color: "secondary",
                              label: "Cancel",
                              onPress: props.onCancel,
                              size: "md",
                            },
                            h,
                          ),
                          button(
                            {
                              color: "primary",
                              label: "Add company",
                              onPress: props.onAddCompany,
                              size: "md",
                            },
                            h,
                          ),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ]
      : [],
  );
};
