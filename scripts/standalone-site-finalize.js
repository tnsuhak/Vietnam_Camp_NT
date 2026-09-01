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
  html = html.replace(/(<a\b[^>]*href=)(["'])[^"']*\2([^>]*>[\s\S]{0,180}?호치민\s*캠프도\s*보기[\s\S]{0,80}?<\/a>)/i, `$1"${HCMC_TARGET}"$3`);
  return html;
}

let html = fs.readFileSync('index.html', 'utf8');
html = setSeoUrl(html);
html = setHcmcLinks(html);
fs.writeFileSync('index.html', html);

fs.writeFileSync('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${NT}sitemap.xml\n`);
fs.writeFileSync('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${NT}</loc>\n    <lastmod>2026-09-01</lastmod>\n  </url>\n</urlset>\n`);

console.log(`Standalone Nha Trang finalized; HCMC target: ${HCMC_TARGET}`);
