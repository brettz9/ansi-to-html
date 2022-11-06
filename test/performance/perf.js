'use strict';

const fs = require('fs');
const Convert = require('../../lib/ansi_to_html');

const convert = new Convert();

let content = '';

for (let i = 0; i < 10000; i++) {
    content += '\x1b[30mblack\x1b[37mwhite\r\n\r\n';
}

fs.writeFileSync('./test/performance/bench.html', `
<!DOCTYPE html>
<html>
    <body>
        ${convert.toHtml(content)}
    </body>
</html>
`);
