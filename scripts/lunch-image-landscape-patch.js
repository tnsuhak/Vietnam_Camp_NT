const fs = require('fs');

const FILE = 'index.html';
let html = fs.readFileSync(FILE, 'utf8');

const lunchStart = html.indexOf('점심');
const snackNear = lunchStart >= 0 ? html.indexOf('간식', lunchStart) : -1;
if (lunchStart < 0 || snackNear < 0 || snackNear - lunchStart > 500) {
  throw new Error('Could not find the Nha Trang lunch/snack section');
}

const imgStart = html.indexOf('<img', snackNear);
if (imgStart < 0 || imgStart - snackNear > 16000) {
  throw new Error('Could not find the lunch photo near the lunch/snack section');
}
const imgEnd = html.indexOf('>', imgStart);
if (imgEnd < 0) throw new Error('Lunch image tag is incomplete');

let tag = html.slice(imgStart, imgEnd + 1);
if (/\bclass\s*=\s*["'][^"']*["']/i.test(tag)) {
  tag = tag.replace(/\bclass\s*=\s*(["'])([^"']*)\1/i, (m, q, classes) => `class=${q}${classes} tns-lunch-landscape-img${q}`);
} else {
  tag = tag.replace(/^<img\b/i, '<img class="tns-lunch-landscape-img"');
}
html = html.slice(0, imgStart) + tag + html.slice(imgEnd + 1);

html = html.replace(/<style\b[^>]*id=(["'])tns-lunch-landscape-styles\1[^>]*>[\s\S]*?<\/style>\s*/gi, '');
const styles = `<style id="tns-lunch-landscape-styles">
.tns-lunch-landscape-img{display:block!important;width:75%!important;height:auto!important;max-width:none!important;max-height:none!important;object-fit:contain!important;transform:rotate(90deg)!important;transform-origin:center center!important;margin:-12.5% auto!important}
</style>`;
if (!html.includes('</head>')) throw new Error('Missing </head> while adding lunch photo rotation style');
html = html.replace('</head>', styles + '\n</head>');

fs.writeFileSync(FILE, html);
console.log('Rotated the Nha Trang lunch photo 90 degrees into landscape orientation.');
