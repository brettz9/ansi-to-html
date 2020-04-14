'use strict';
const {expect} = require('chai');
const Filter = require('../lib/ansi_to_html.js');

function test(text, result, opts) {
    const f = new Filter(opts);

    function filtered(memo, t) {
        return memo + f.toHtml(t);
    }

    text = typeof text.reduce === 'function' ? text : [text];
    expect(text.reduce(filtered, '')).to.equal(result);
}

describe('ansi to html', function () {
    describe('constructed with no options', function () {
        it('doesn\'t modify the input string', function () {
            const text = 'some text';
            const result = 'some text';

            return test(text, result);
        });

        it('ends early on finding lack of match', function () {
            const text = 'some \r text';
            const result = 'some ';

            test(text, result);
        });

        it('extracts only real text', function () {
            let text = 'some \x1b text';
            let result = 'some  text';

            return test(text, result);
        });

        it('returns plain text when given plain text with linefeed', function () {
            const text = 'test\ntest\n';
            const result = 'test\ntest\n';

            return test(text, result);
        });

        it('returns plain text when given plain text with CR & LF', function () {
            const text = 'testCRLF\r\ntest';
            const result = 'testCRLF\r\ntest';

            return test(text, result);
        });

        it('returns plain text when given plain text with multi CR', function () {
            const text = 'testCRLF\r\r\r\ntest';
            const result = 'testCRLF\r\r\r\ntest';

            return test(text, result);
        });

        it('renders foreground colors', function () {
            const text = 'colors: \x1b[30mblack\x1b[37mwhite';
            const result = 'colors: <a style="color:#000">black<a style="color:#AAA">white</a></a>';

            return test(text, result);
        });

        it('renders light foreground colors', function () {
            const text = 'colors: \x1b[90mblack\x1b[97mwhite';
            const result = 'colors: <a style="color:#555">black<a style="color:#FFF">white</a></a>';

            return test(text, result);
        });

        it('renders background colors', function () {
            const text = 'colors: \x1b[40mblack\x1b[47mwhite';
            const result = 'colors: <a style="background-color:#000">black<a style="background-color:#AAA">white</a></a>';

            return test(text, result);
        });

        it('renders light background colors', function () {
            const text = 'colors: \x1b[100mblack\x1b[107mwhite';
            const result = 'colors: <a style="background-color:#555">black<a style="background-color:#FFF">white</a></a>';

            return test(text, result);
        });

        it('renders strikethrough on', function () {
            const text = 'strike: \x1b[9mthat';
            const result = 'strike: <a style="text-decoration:line-through;">that</a>';

            return test(text, result);
        });

        it('renders strikethrough off', function () {
            const text = 'strike: \x1b[9mthat\x1b[29m, no';
            const result = 'strike: <a style="text-decoration:line-through;">that<a style="text-decoration:none;">, no</a></a>';

            return test(text, result);
        });

        it('renders slow blink', function () {
            const text = 'blink: \x1b[5mwhat';
            const result = 'blink: <a style="animation:blink 1s linear infinite;">what</a>';

            return test(text, result);
        });

        it('renders rapid blink', function () {
            const text = 'blink: \x1b[6mwhat';
            const result = 'blink: <a style="animation:blink 0.3s linear infinite;">what</a>';

            return test(text, result);
        });

        it('renders underline', function () {
            const text = 'underline: \x1b[4mstuff';
            const result = 'underline: <a style="text-decoration:underline;">stuff</a>';

            return test(text, result);
        });

        it('renders bold', function () {
            const text = 'bold: \x1b[1mstuff';
            const result = 'bold: <a style="font-weight:bold;">stuff</a>';

            return test(text, result);
        });

        it('renders lighter', function () {
            const text = 'lighter: \x1b[2mstuff';
            const result = 'lighter: <a style="font-weight:lighter;">stuff</a>';

            return test(text, result);
        });

        it('renders italic', function () {
            const text = 'italic: \x1b[3mstuff';
            const result = 'italic: <a style="font-style:italic;">stuff</a>';

            return test(text, result);
        });

        it('renders conceal', function () {
            const text = 'conceal: \x1b[8mstuff';
            const result = 'conceal: <a style="display:none;">stuff</a>';

            return test(text, result);
        });

        it('renders initial', function () {
            const text = 'initial: \x1b[10mstuff';
            const result = 'initial: <a style="font-family:initial;">stuff</a>';

            return test(text, result);
        });

        it('renders double-underline', function () {
            const text = 'double-underline: \x1b[21mstuff';
            const result = 'double-underline: <a style="text-decoration:underline double;">stuff</a>';

            return test(text, result);
        });

        it('renders bold-off', function () {
            const text = 'bold-off: \x1b[21mstuff';
            const result = 'bold-off: <a style="font-weight:normal;">stuff</a>';

            return test(text, result, {21: 'bold-off'});
        });

        it('renders blink-off', function () {
            const text = 'blink-off: \x1b[25mstuff';
            const result = 'blink-off: <a style="animation:none;">stuff</a>';

            return test(text, result);
        });

        it('renders reveal', function () {
            const text = 'reveal: \x1b[28mstuff';
            const result = 'reveal: <a style="display:inline;">stuff</a>';

            return test(text, result);
        });

        it('handles resets', function () {
            const text = '\x1b[1mthis is bold\x1b[0m, but this isn\'t';
            const result = '<a style="font-weight:bold;">this is bold</a>, but this isn\'t';

            return test(text, result);
        });

        it('handles multiple resets', function () {
            const text = 'normal, \x1b[1mbold, \x1b[4munderline, \x1b[31mred\x1b[0m, normal';
            const result = 'normal, <a style="font-weight:bold;">bold, <a style="text-decoration:underline;">underline, <a style="color:' + '#A00">red</a></a></a>, normal';

            return test(text, result);
        });

        it('handles resets with implicit 0', function () {
            const text = '\x1b[1mthis is bold\x1b[m, but this isn\'t';
            const result = '<a style="font-weight:bold;">this is bold</a>, but this isn\'t';

            return test(text, result);
        });

        it('renders multi-attribute sequences', function () {
            const text = 'normal, \x1b[1;4;31mbold, underline, and red\x1b[0m, normal';
            const result = 'normal, <a style="font-weight:bold;"><a style="text-decoration:underline;"><a style="color:#A00">bold, underline,' + ' and red</a></a></a>, normal';

            return test(text, result);
        });

        it('renders multi-attribute sequences with a semi-colon', function () {
            const text = 'normal, \x1b[1;4;31;mbold, underline, and red\x1b[0m, normal';
            const result = 'normal, <a style="font-weight:bold;"><a style="text-decoration:underline;"><a style="color:#A00">bold, underline, and red</a></a></a>, normal';

            return test(text, result);
        });

        it('eats malformed sequences', function () {
            const text = '\x1b[25oops forgot the \'m\'';
            const result = 'oops forgot the \'m\'';

            return test(text, result);
        });

        it('renders xterm 256 sequences', function () {
            const text = '\x1b[38;5;196mhello';
            const result = '<a style="color:#ff0000">hello</a>';

            return test(text, result);
        });

        it('renders foreground rgb sequences', function () {
            const text = '\x1b[38;2;210;60;114mhello';
            const result = '<a style="color:#d23c72">hello</a>';

            return test(text, result);
        });

        it('renders background rgb sequences', function () {
            const text = '\x1b[48;2;155;42;45mhello';
            const result = '<a style="background-color:#9b2a2d">hello</a>';

            return test(text, result);
        });

        it('handles resetting to default foreground color', function () {
            const text = '\x1b[30mblack\x1b[39mdefault';
            const result = '<a style="color:#000">black<a style="color:#FFF">default</a></a>';

            return test(text, result);
        });

        it('handles resetting to default background color', function () {
            const text = '\x1b[100mblack\x1b[49mdefault';
            const result = '<a style="background-color:#555">black<a style="background-color:#000">default</a></a>';

            return test(text, result);
        });

        it('is able to disable underline', function () {
            const text = 'underline: \x1b[4mstuff\x1b[24mthings';
            const result = 'underline: <a style="text-decoration:underline;">stuff<a style="text-decoration:none;">things</a></a>';

            return test(text, result);
        });

        it('disables underline', function () {
            const text = 'not underline: stuff\x1b[24mthings';
            const result = 'not underline: stuff<a style="text-decoration:none;">things</a>';

            return test(text, result);
        });

        it('renders two escape sequences in sequence', function () {
            const text = 'months remaining\x1b[1;31mtimes\x1b[m\x1b[1;32mmultiplied by\x1b[m $10';
            const result = 'months remaining<a style="font-weight:bold;"><a style="color:#A00">times</a></a><a style="font-weight:bold;"><a style="color:#0A0">multiplied by</a></a> $10';

            return test(text, result);
        });

        it('drops EL code with no parameter', function () {
            const text = '\x1b[Khello';
            const result = 'hello';

            return test(text, result);
        });

        it('drops EL code with 0 parameter', function () {
            const text = '\x1b[0Khello';
            const result = 'hello';

            return test(text, result);
        });

        it('drops EL code with 0 parameter after new line character', function () {
            const text = 'HELLO\n\x1b[0K\u001b[33;1mWORLD\u001b[0m\n';
            const result = 'HELLO\n<a style="color:#A50"><a style="font-weight:bold;">WORLD</a></a>\n';

            return test(text, result);
        });

        it('drops EL code with 1 parameter', function () {
            const text = '\x1b[1Khello';
            const result = 'hello';

            return test(text, result);
        });

        it('drops EL code with 2 parameter', function () {
            const text = '\x1b[2Khello';
            const result = 'hello';

            return test(text, result);
        });

        it('drops ED code with 0 parameter', function () {
            const text = '\x1b[Jhello';
            const result = 'hello';

            return test(text, result);
        });

        it('drops ED code with 1 parameter', function () {
            const text = '\x1b[1Jhello';
            const result = 'hello';

            return test(text, result);
        });

        it('drops HVP code with 0 parameter', function () {
            const text = '\x1b[;fhello';
            const result = 'hello';

            return test(text, result);
        });

        it('drops HVP code with 1 parameter', function () {
            const text = '\x1b[123;fhello';
            const result = 'hello';

            return test(text, result);
        });

        it('drops HVP code with 2 parameter', function () {
            const text = '\x1b[123;456fhello';
            const result = 'hello';

            return test(text, result);
        });

        it('drops setusg0 sequence', function () {
            const text = '\x1b[(Bhello';
            const result = 'hello';

            return test(text, result);
        });

        it('renders un-italic code appropriately', function () {
            const text = '\x1b[3mHello\x1b[23m World';
            const result = '<a style="font-style:italic;">Hello<a style="font-style:normal;"> World</a></a>';

            return test(text, result);
        });

        it('rendering un-italic code appropriately', function () {
            const text = 'Hello\x1b[23m World';
            const result = 'Hello<a style="font-style:normal;"> World</a>';

            return test(text, result);
        });

        it('renders overline on', function () {
            const text = '\x1b[53mHello World';
            const result = '<a style="text-decoration:overline;">Hello World</a>';

            return test(text, result);
        });

        it('renders overline off', function () {
            const text = '\x1b[53mHello \x1b[55mWorld';
            const result = '<a style="text-decoration:overline;">Hello <a style="text-decoration:none;">World</a></a>';

            return test(text, result);
        });

        it('renders normal text', function () {
            const text = '\x1b[22mnormal text';
            const result = '<a style="font-weight:normal;text-decoration:none;font-style:normal;">normal text</a>';

            return test(text, result);
        });
    });

    describe('with escapeXML option enabled', function () {
        it('escapes XML entities', function () {
            const text = 'normal, \x1b[1;4;31;mbold, <underline>, and red\x1b[0m, normal';
            const result = 'normal, <a style="font-weight:bold;"><a style="text-decoration:underline;"><a style="color:#A00">bold, &lt;underline&gt;, and red</a></a></a>, normal';

            return test(text, result, {escapeXML: true});
        });
    });

    describe('with newline option enabled', function () {
        it('renders line breaks', function () {
            const text = 'test\ntest\n';
            const result = 'test<br/>test<br/>';

            return test(text, result, {newline: true});
        });

        it('renders windows styled line breaks (CR+LF)', function () {
            const text = 'testCRLF\r\ntestLF';
            const result = 'testCRLF<br/>testLF';

            return test(text, result, {newline: true});
        });

        it('renders windows styled line breaks (multi CR+LF)', function () {
            const text = 'testCRLF\r\r\r\ntestLF';
            const result = 'testCRLF<br/>testLF';

            return test(text, result, {newline: true});
        });

        it('renders multiple line breaks', function () {
            const text = 'test\n\ntest\n';
            const result = 'test<br/><br/>test<br/>';

            return test(text, result, {newline: true});
        });
    });

    describe('with `space` option enabled', function () {
        it('renders multiple spaces', function () {
            const text = 'test  test  ';
            const result = 'test &#xa0;test &#xa0;';

            return test(text, result, {space: true});
        });
    });

    describe('with `tabs` option enabled', function () {
        it('renders multiple tabs', function () {
            const text = 'test\ttest\t';
            const result = 'test&#xa0;&#xa0;&#xa0;test&#xa0;&#xa0;&#xa0;';

            return test(text, result, {tabs: 3});
        });
    });

    describe('with stream option enabled', function () {
        it('persists styles between toHtml() invocations', function () {
            const text = ['\x1b[31mred', 'also red'];
            const result = '<a style="color:#A00">red</a><a style="color:#A00">also red</a>';

            return test(text, result, {stream: true});
        });

        it('persists styles between more than two toHtml() invocations', function () {
            const text = ['\x1b[31mred', 'also red', 'and red'];
            const result = '<a style="color:#A00">red</a><a style="color:#A00">also red</a><a style="color:#A00">and red</a>';

            return test(text, result, {stream: true});
        });

        it('does not persist styles beyond their usefulness', function () {
            let text = ['\x1b[31mred', 'also red', '\x1b[30mblack', 'and black'];
            let result = '<a style="color:#A00">red</a><a style="color:#A00">also red</a><a style="color:#A00"><a style="color:#000">black</a></a><a style="color:#000">and black</a>';

            test(text, result, {stream: true});

            text = ['\x1b[41mred', 'also red', '\x1b[40mblack', 'and black'];
            result = '<a style="background-color:#A00">red</a><a style="background-color:#A00">also red</a><a style="background-color:#A00"><a style="background-color:#000">black</a></a><a style="background-color:#000">and black</a>';

            test(text, result, {stream: true});

            text = ['\x1b[101mred', 'also red', '\x1b[100mblack', 'and black'];
            result = '<a style="background-color:#F55">red</a><a style="background-color:#F55">also red</a><a style="background-color:#F55"><a style="background-color:#555">black</a></a><a style="background-color:#555">and black</a>';

            return test(text, result, {stream: true});
        });

        it('removes one state when encountering a reset', function () {
            const text = ['\x1b[1mthis is bold\x1b[0m, but this isn\'t', ' nor is this'];
            const result = '<a style="font-weight:bold;">this is bold</a>, but this isn\'t nor is this';

            return test(text, result, {stream: true});
        });

        it('removes multiple state when encountering a reset', function () {
            const text = ['\x1b[1mthis \x1b[9mis bold\x1b[0m, but this isn\'t', ' nor is this'];
            const result = '<a style="font-weight:bold;">this <a style="text-decoration:line-through;">is bold</a></a>, but this isn\'t nor is this';

            return test(text, result, {stream: true});
        });

        it('processes underline, blink and conceal', function () {
            let text = ['\x1b[4munderlined \x1b[5mblink \x1b[8mconceal'];
            let result = '<a style="text-decoration:underline;">underlined <a style="animation:blink 1s linear infinite;">blink <a style="display:none;">conceal</a></a></a>';

            test(text, result, {stream: true});

            // Check coverage for text as array
            text = ['\x1b[4munderlined \x1b[5mblink \x1b[8mconceal'];
            result = '<a style="text-decoration:underline;">underlined <a style="animation:blink 1s linear infinite;">blink <a style="display:none;">conceal</a></a></a>';

            return test([text], result, {stream: true});
        });
    });

    describe('with custom colors enabled', function () {
        it('renders basic colors', function () {
            const text = ['\x1b[31mblue', 'not blue'];
            const result = '<a style="color:#00A">blue</a>not blue';

            return test(text, result, {colors: {1: '#00A'}});
        });

        it('renders basic colors with streaming', function () {
            const text = ['\x1b[31mblue', 'also blue'];
            const result = '<a style="color:#00A">blue</a><a style="color:#00A">also blue</a>';

            return test(text, result, {stream: true, colors: {1: '#00A'}});
        });

        it('renders custom colors and default colors', function () {
            const text = ['\x1b[31mblue', 'not blue', '\x1b[94mlight blue', 'not colored'];
            const result = '<a style="color:#00A">blue</a>not blue<a style="color:#55F">light blue</a>not colored';

            return test(text, result, {colors: {1: '#00A'}});
        });

        it('renders custom colors and default colors together', function () {
            const text = ['\x1b[31mblue', 'not blue', '\x1b[94mlight blue', 'not colored'];
            const result = '<a style="color:#00A">blue</a>not blue<a style="color:#55F">light blue</a>not colored';

            return test(text, result, {colors: {1: '#00A'}});
        });

        it('renders custom 8/ 16 colors', function () {
            // code - 90 + 8 = color
            // so 94 - 90 + 8 = 12
            const text = ['\x1b[94mlighter blue'];
            const result = '<a style="color:#33F">lighter blue</a>';

            return test(text, result, {colors: {12: '#33F'}});
        });

        it('renders custom 256 colors', function () {
            // code - 90 + 8 = color
            // so 94 - 90 + 8 = 12
            const text = ['\x1b[38;5;125mdark red', 'then \x1b[38;5;126msome other color'];
            const result = '<a style="color:#af005f">dark red</a>then <a style="color:#af225f">some other color</a>';

            return test(text, result, {colors: {126: '#af225f'}});
        });
    });

    it('with `alternativeFonts` enabled', function () {
        const text = ['\x1b[11mverdana', '\x1b[12mhelvetica'];
        const result = '<a style="font-family:verdana;">verdana</a><a style="font-family:helvetica;">helvetica</a>';

        return test(text, result, {alternativeFonts: {11: 'verdana', 12: 'helvetica'}});
    });
});
