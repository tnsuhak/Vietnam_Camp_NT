const fs = require('fs');

function replaceOnceOrAlready(html, from, to, label) {
  if (html.includes(to)) return html;
  if (!html.includes(from)) throw new Error('Missing label target: ' + label);
  return html.replace(from, to);
}

let html = fs.readFileSync('index.html', 'utf8');
html = replaceOnceOrAlready(
  html,
  '<b>NHA TRANG · 2027 WINTER</b>',
  '<b>NHA TRANG · 2027 WINTER CAMP</b>',
  'Nha Trang top logo'
);
html = replaceOnceOrAlready(
  html,
  '<p class="hero__kicker">2027 <em>Winter</em><br>Nha Trang</p>',
  '<p class="hero__kicker">2027 <em>Winter Camp</em><br>Nha Trang</p>',
  'Nha Trang hero kicker'
);
html = replaceOnceOrAlready(
  html,
  '<a class="hdr__other" href="#" data-site-href="hcmUrl">호치민 캠프 →</a>',
  '<a class="hdr__other" href="#" data-site-href="hcmUrl">호치민 캠프도 보기 →</a>',
  'Nha Trang city switch'
);
fs.writeFileSync('index.html', html);
console.log('Verified Nha Trang 2027 WINTER CAMP labels and HCMC switch button.');
