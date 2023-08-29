# Code

The `code` block allows you create a formatted block of programming code, complete with language specific syntax highlighting.

The text within the block _must_ be monospaced, else the block will not render at all and an error logged to to LANA. See "Tips" for more details.

## Variants

Any variants not included below are assumed to be language variants, e.g. `javascript`.

Size variants follows [Consonant's Code Typography](https://consonant.adobe.com/1975e5ba1/p/216c7e-typography/t/244b88):

- `large`
- `medium` (default)
- `small`

Code uses [highlight.js](https://highlightjs.org/) and has support for [themes](https://highlightjs.org/examples) by specifying the `code-theme-name` document metadata property.

## Tips

The text within the `code` block _must_ be monospaced but this is not always rendered as `<pre><code>` by Franklin.

If pasting to Microsoft Word, first copy monospaced text and then paste using `shift-command-v`, which should remove formatting, but retain spacing. Then select text and assign any monospaced font.

## Also see

- [gist](../gist/)
