## Ansi to Html

[![](https://img.shields.io/travis/brettz9/ansi-to-html.svg)](https://travis-ci.org/brettz9/ansi-to-html/branches)
[![](https://img.shields.io/npm/v/@brettz9/ansi-to-html.svg)](https://www.npmjs.com/package/@brettz9/ansi-to-html)
![](https://img.shields.io/npm/dm/@brettz9/ansi-to-html.svg)

**This is a fork of [ansi-to-html](https://github.com/rburns/ansi-to-html)**

This was originally a port of the ansi to html converter from
[bcat](https://github.com/rtomayko/bcat/blob/master/lib/bcat/ansi.rb) to
JavaScript. It has since undergone quite a lot of modification.

It has a few additions:

* The API has been altered to accept options in the constructor, and input in `toHtml()`.
* ANSI codes for setting the foreground or background color to default are handled
* the 'erase in line' escape code (`\x1b[K`) is dropped from the output.

## Installation

```bash
npm install @brettz9/ansi-to-html
```

## Usage

```javascript
const Convert = require('@brettz9/ansi-to-html');
const convert = new Convert();

console.log(convert.toHtml('\x1b[30mblack\x1b[37mwhite'));

/*
    prints:
    <a style="color:#000">black<a style="color:#AAA">white</a></a>
*/
```

## Command line usage

When using ansi-to-html from the command line the stream option is set to `true`.
Other options can be provided. See `ansi-to-html -h` for more detail.

### Process a file

```bash
ansi-to-html the_filename
```

### From STDIN

```bash
git log | ansi-to-html
```

## Options

Options can be be passed to the constructor to customize behaviour.

**fg** `<CSS color values>`. The default foreground color used when reset color codes are encountered.

**bg** `<CSS color values>`. The default background color used when reset color codes are encountered.

**newline** `true` or `false`. Convert newline characters to `<br/>`.

**space** `true` or `false`. Convert any two sequential spaces to ` &#xa0;` (a space followed by a non-breaking space). You will probably wish to use this with a fixed with font, e.g., `font-family: monospace;`.

**escapeXML** `true` or `false`. Generate HTML/XML entities.

**stream** `true` or `false`. Save style state across invocations of `toHtml()`.

**colors** `Object`/`Array` (with values 0 - 255 containing CSS color values). Can override specific colors or the entire ANSI palette

### Default options

```javascript
{
    fg: '#FFF',
    bg: '#000',
    newline: false,
    escapeXML: false,
    stream: false
}
```

## Development

Once you have the git repository cloned, install the dependencies:

```bash
cd ansi-to-html
npm install
```

Lint

```bash
npm run lint
```

Build

```bash
npm run build
```

Test

```bash
npm test
```
