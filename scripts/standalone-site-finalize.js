const fs = require('fs');

const NT = 'https://vietnam-camp-nt.netlify.app/';
const HCMC_PROD = 'https://vietnam-camp-hcmc.netlify.app/';
const HCMC_PREVIEW = 'https://deploy-preview-1--vietnam-camp-hcmc.netlify.app/';
const HCMC_TARGET = process.env.CONTEXT === 'deploy-preview' ? HCMC_PREVIEW : HCMC_PROD;

function setSeoUrl(html) {
  html = html.replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${NT}">`);
  html = html.replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${NT}">`);
  return html;
}

function setHcmcLinks(html) {
  const candidates = [
    'https://tnsuhak.github.io/Vietnam_Camp_HCMC/',
    'https://vietnam-camp-hcmc.netlify.app/',
    'https://deploy-preview-1--vietnam-camp-hcmc.netlify.app/'
  ];
  for (const value of candidates) {
    html = html.split(`href="${value}"`).join(`href="${HCMC_TARGET}"`);
    html = html.split(`href='${value}'`).join(`href='${HCMC_TARGET}'`);
  }
  return html;
}

let html = fs.readFileSync('index.html', 'utf8');
html = setSeoUrl(html);
html = setHcmcLinks(html);
fs.writeFileSync('index.html', html);

fs.writeFileSync('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${NT}sitemap.xml\n`);
fs.writeFileSync('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${NT}</loc>\n    <lastmod>2026-09-01</lastmod>\n  </url>\n</urlset>\n`);

const checks = [
  ['AVE YouTube', 'dp-2G-YKfdk'],
  ['ACE YouTube', '8MyLW1HuQyc'],
  ['Early bird', '9월 1일 ~ 10월 31일까지'],
  ['Kakao contact', 'https://open.kakao.com/o/slehLvKi'],
  ['Phone contact', '010-5150-0105'],
  ['HCMC cross-link', HCMC_TARGET]
];
for (const [label, token] of checks) {
  if (!html.includes(token)) throw new Error(`Standalone Nha Trang check failed: ${label}`);
}
const faq = html.match(/<section id="faq"[\s\S]*?<\/section>/i);
const faqCount = faq ? (faq[0].match(/<details>/g) || []).length : 0;
if (faqCount !== 20) throw new Error(`Standalone Nha Trang FAQ count is ${faqCount}, expected 20`);

console.log(`Standalone Nha Trang finalized; HCMC link -> ${HCMC_TARGET}; FAQ=${faqCount}`);
