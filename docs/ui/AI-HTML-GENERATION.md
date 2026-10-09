# TAO UI Generation Brief For AI Chatbots

This document is designed to be pasted into or uploaded to an AI chatbot that cannot
read the TAO Hiring Platform repository. Use it as the UI contract when asking for a
new page or a change to an existing page.

## Target Application

Generate an Angular feature page for the TAO Hiring Platform. The application uses
Angular standalone components and the shared `tao-ui` component library, imported by
application code from `@tao/ui`. This is not a request for generic static HTML: the
generated page is intended to run inside the TAO Angular application, where the
`tao-ui` library and global theme stylesheet are already configured.

Use regular semantic HTML for page structure (such as `main`, `section`, `header`,
`h1`, and `p`). For interactive or reusable UI, use the TAO controls below. Do not
render Angular Material controls directly or recreate TAO controls with raw elements.

## Non-Negotiable Rules

1. Use the listed `tao-*` selectors for all matching interactive controls and shared
   UI. Do not generate raw `<button>`, `<input>`, `<textarea>`, `<select>`, Material
   form fields, Material buttons, Material tables, or custom look-alike controls.
2. Do not invent selectors, inputs, outputs, theme variables, icon APIs, data fields,
   event handlers, form names, routes, or business rules. Only bind names supplied in
   the user's task or explicitly shown in this document.
3. If the task needs a control or capability not covered here, do not substitute a
   native or Angular Material control. State what is missing and ask for the actual
   `tao-ui` API or permission to add that capability to `tao-ui`.
4. Use TAO theme tokens for feature-level CSS. Never introduce a new palette, use
   hard-coded color values, or override the internal appearance of a `tao-*` control.
5. Keep the result accessible, responsive, and consistent with an existing business
   application feature page. Avoid marketing-page styling, decorative card stacks, or
   a new visual theme.

## Available TAO Controls

Use the selector matching the need. The class names below are the standalone Angular
components exported by `@tao/ui` when TypeScript imports are requested.

| Purpose                                       | Selector                                                                                  | Angular component export                                                                                                            |
| --------------------------------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Page title and description                    | `<tao-page-header>`                                                                       | `TaoPageHeaderComponent`                                                                                                            |
| Buttons and icon actions                      | `<tao-button>`                                                                            | `TaoButtonComponent`                                                                                                                |
| Text and numeric fields                       | `<tao-input>`                                                                             | `TaoInputComponent`                                                                                                                 |
| Multi-line text fields                        | `<tao-textarea>`                                                                          | `TaoTextareaComponent`                                                                                                              |
| Single or multiple choice                     | `<tao-select>`                                                                            | `TaoSelectComponent`                                                                                                                |
| Search suggestions                            | `<tao-autocomplete>`                                                                      | `TaoAutocompleteComponent`                                                                                                          |
| Data table                                    | `<tao-data-table>` or `<tao-table>`                                                       | `TaoDataTableComponent`                                                                                                             |
| Content grouping                              | `<tao-card>`                                                                              | `TaoCardComponent`                                                                                                                  |
| Empty result state                            | `<tao-empty-state>`                                                                       | `TaoEmptyStateComponent`                                                                                                            |
| Loading state                                 | `<tao-loading-state>`                                                                     | `TaoLoadingStateComponent`                                                                                                          |
| Progress                                      | `<tao-progress>`                                                                          | `TaoProgressComponent`                                                                                                              |
| Confirmation                                  | `<tao-confirm-dialog>`                                                                    | `TaoConfirmDialogComponent`                                                                                                         |
| Application shell                             | `<tao-shell>`                                                                             | `TaoShellComponent`                                                                                                                 |
| Theme switcher                                | `<tao-theme-switcher>`                                                                    | `TaoThemeSwitcherComponent`                                                                                                         |
| Date, tabs, menu, stepper, expandable content | `<tao-date-picker>`, `<tao-tabs>`, `<tao-menu>`, `<tao-stepper>`, `<tao-expansion-panel>` | Corresponding `TaoDatePickerComponent`, `TaoTabsComponent`, `TaoMenuComponent`, `TaoStepperComponent`, `TaoExpansionPanelComponent` |

Use the existing dialog service / `tao-dialog` pattern for dialogs. Do not invent a
dialog's markup or API from its selector alone. For controls whose properties are not
listed below, use only properties explicitly supplied by the user or request the
relevant API details; do not guess.

## Verified Common APIs

### `tao-button`

Supported inputs:

- `label`, `icon`, `tooltip`
- `appearance`: `filled`, `outlined`, `text`, or `icon`
- `color`: `primary`, `accent`, `warn`, or `basic`
- `size`: `small`, `medium`, or `large`
- `type`: `button`, `submit`, or `reset`
- `disabled`, `loading`, `fullWidth`

Example:

```html
<tao-button
  type="submit"
  label="Create campaign"
  appearance="filled"
  color="primary"
  size="small"
/>
```

For icon-only actions, set an accessible `label` and a useful `tooltip` as well as the
icon. Use `(click)` only when the task provides the matching component handler.

### `tao-input`

Common supported inputs: `label`, `labelAbove`, `placeholder`, `required`, `type`,
`hint`, `disabled`, `readonly`, `prefix`, `suffix`, and `showErrors`. It is a form
control; bind it to the host component's existing form model, for example with
`formControlName` when a reactive form is provided.

### `tao-textarea`

Common supported inputs: `label`, `labelAbove`, `placeholder`, `rows`, `required`,
`maxLength`, `disabled`, `showErrors`, and `footerMessage`. Bind it to the supplied
form model.

### `tao-select`

Common supported inputs: `label`, `labelAbove`, `multiple`, `placeholder`, `required`,
`disabled`, `hint`, `showErrors`, `options`, `optionLabel`, and `optionValue`. The
options and label/value functions must be provided by the host component; do not
fabricate them.

### `tao-autocomplete`

Common supported inputs: `label`, `placeholder`, `options` (string list), `required`,
`hint`, and `disabled`.

### `tao-page-header` and `tao-card`

`tao-page-header` supports `kicker`, `title`, and `description`, with projected content
available for the page's supplied action area. `tao-card` supports a `title` and
projected body content.

### `tao-empty-state`, `tao-loading-state`, and `tao-progress`

- `tao-empty-state`: `title`, `message`.
- `tao-loading-state`: `label`, `loading`.
- `tao-progress`: `value`, `label`.

Use these for the corresponding page states rather than building look-alikes. Bind
values only to state that exists in the supplied host component.

### `tao-data-table`

Bind `[columns]`, `[rows]`, and optionally `[config]`. The host TypeScript provides
`TaoTableColumn<T>[]` and `TaoTableConfig` from `@tao/ui`. Available table outputs are
`(sortChange)`, `(pageChange)`, `(rowClick)`, and `(selectionChange)`. Use only when
these data and handlers are part of the user's supplied page context; never create a
raw `<table>` or Material table to approximate it.

## Angular Integration Contract

- The page's standalone component must import every `tao-ui` component it uses from
  `@tao/ui` and include those components in its `imports` array. If the user asks for
  HTML only, return the template and separately list the required component imports.
- Form directives such as `[formGroup]` and `formControlName` require the host
  component's existing form and the appropriate Angular forms module. Do not invent
  form state, validation rules, or field names. If those details are absent, ask for
  them or label the required host bindings clearly as placeholders.
- Angular bindings and control flow are expected: use `@if`, `@for`, and `@switch` for
  dynamic states. Provide stable `track` expressions for repeated items.
- Do not return a claim that generated markup compiles unless the required component
  imports, bindings, and TypeScript context were supplied and checked.
- If asked for plain static HTML that cannot run Angular components, explain briefly
  that TAO controls require the TAO Angular application; do not silently replace them
  with regular HTML controls.

## Theme Tokens And CSS

The page inherits TAO's active theme. Reuse the `--tao-*` CSS custom properties; do
not hard-code `#hex`, `rgb()`, or named color values. These are examples of existing
tokens:

| Use                      | Token examples                                                               |
| ------------------------ | ---------------------------------------------------------------------------- |
| Font                     | `var(--tao-font-family)`                                                     |
| Primary / focus color    | `var(--tao-color-319667)`, `var(--tao-color-54a87d)`                         |
| Main / muted text        | `var(--tao-color-172033)`, `var(--tao-color-6e7a8e)`                         |
| Surface / subtle surface | `var(--tao-color-fff)`, `var(--tao-color-f8fbf9)`, `var(--tao-color-f1f3f2)` |
| Border / error           | `var(--tao-color-d5ded9)`, `var(--tao-color-b3261e)`                         |
| Radius                   | `var(--tao-radius-6px)`, `var(--tao-radius-7px)`, `var(--tao-radius-8px)`    |

Use tokens for page layout and surrounding content only. Do not style the internal
elements of `tao-button`, `tao-input`, `tao-select`, tables, or other shared controls.
Do not create new `--tao-*` variables. A feature stylesheet may define responsive
layout, spacing, and page-specific composition while retaining the application's
existing token-based visual language.

Example of permitted feature-level styling:

```scss
.page {
  font-family: var(--tao-font-family);
  color: var(--tao-color-172033);
}

.page-section {
  border: 1px solid var(--tao-color-d5ded9);
  border-radius: var(--tao-radius-8px);
  background: var(--tao-color-f8fbf9);
}
```

## Copy/Paste Prompt

Paste the following along with the description of the page you want:

> Generate a page for the TAO Hiring Platform using the TAO UI Generation Brief I
> provided. This is an Angular page for an application that already has `@tao/ui`
> installed. Use the documented `tao-*` controls for all interactive/shared UI; never
> replace them with raw HTML or Angular Material controls. Use only documented
> selectors, inputs, outputs, and `--tao-*` theme tokens. Do not invent TypeScript
> state, handlers, routes, data fields, form names, validation, or unsupported control
> APIs. If required details or a control are missing, ask me or report the gap instead
> of guessing. Return the Angular template first, any feature-level SCSS separately,
> and a short list of required `@tao/ui` imports and host bindings. Keep styling within
> the established TAO theme, responsive, and accessible.

## Final Review Checklist

- All interactive/shared controls use a listed `tao-*` component.
- No raw HTML or Angular Material control was used as a substitute.
- Every binding, handler, option list, and form field comes from supplied context or is
  explicitly identified as a required placeholder.
- Feature CSS uses existing `--tao-*` tokens and does not restyle control internals.
- Labels, accessible names, keyboard behavior, validation and loading states are
  preserved where relevant.
- The output is described as Angular integration code, not standalone static HTML.
