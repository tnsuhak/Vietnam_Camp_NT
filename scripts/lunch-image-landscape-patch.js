const fs = require('fs');

const FILE = 'index.html';
let html = fs.readFileSync(FILE, 'utf8');

const cssTag = '<link id="tns-lunch-landscape-css" rel="stylesheet" href="/lunch-rotate.css">';
const jsTag = '<script id="tns-lunch-landscape-js" defer src="/lunch-rotate.js"></script>';

html = html.replace(/<link\b[^>]*id=(["'])tns-lunch-landscape-css\1[^>]*>\s*/gi, '');
html = html.replace(/<script\b[^>]*id=(["'])tns-lunch-landscape-js\1[^>]*>[\s\S]*?<\/script>\s*/gi, '');

if (html.includes('</head>')) html = html.replace('</head>', cssTag + '\n</head>');
else html = cssTag + '\n' + html;

if (html.includes('</body>')) html = html.replace('</body>', jsTag + '\n</body>');
else html += '\n' + jsTag;

fs.writeFileSync(FILE, html);
console.log('Added the Nha Trang lunch photo landscape assets.');
