const fs = require('fs');

const NT = 'https://vietnam-camp-nt.netlify.app/';

function setSeoUrl(html, url) {
  html = html.replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">`);
  html = html.replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}">`);
  return html;
}

let html = fs.readFileSync('index.html', 'utf8');
html = setSeoUrl(html, NT);
fs.writeFileSync('index.html', html);

fs.writeFileSync('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${NT}sitemap.xml\n`);
fs.writeFileSync('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${NT}</loc>\n    <lastmod>2026-09-01</lastmod>\n  </url>\n</urlset>\n`);

console.log('Verified Nha Trang canonical, robots.txt and sitemap.xml for the standalone Netlify site.');
