const fs = require('fs');

const videos = [
  {
    mp4: '/media/nha-trang-ave-2026.mp4',
    id: 'dp-2G-YKfdk',
    title: '베트남 나트랑 2027 윈터캠프 AVE 아카데미 영상',
    heading: 'AVE Academy 캠프 현장 영상',
    description: 'AVE Academy의 학교 환경과 프로그램 현장을 영상으로 확인해 보세요.'
  },
  {
    mp4: '/media/nha-trang-preschool-2026.mp4',
    id: '8MyLW1HuQyc',
    title: '베트남 나트랑 2027 윈터캠프 ACE 캠프 영상',
    heading: 'ACE 캠프 현장 영상',
    description: '나트랑·깜란 ACE 캠프의 수업과 활동 현장을 영상으로 확인해 보세요.'
  }
];

let html = fs.readFileSync('index.html', 'utf8');
const css = `<style id="youtube-camp-video-styles">
.field-video__embed{position:relative;width:100%;aspect-ratio:16/9;overflow:hidden;border-radius:18px;background:#061728;box-shadow:var(--shadow)}
.field-video__embed iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
</style>`;
if (!html.includes('id="youtube-camp-video-styles"')) html = html.replace('</head>', css + '\n</head>');

for (const item of videos) {
  const escaped = item.mp4.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const videoRe = new RegExp(`<video\\b[^>]*src=["']${escaped}["'][^>]*>\\s*<\\/video>`, 'i');
  if (!videoRe.test(html)) continue;
  const embed = `<div class="field-video__embed"><iframe src="https://www.youtube-nocookie.com/embed/${item.id}" title="${item.title}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>`;
  html = html.replace(videoRe, embed);
  const sectionStart = html.lastIndexOf('<section class="field-video"', html.indexOf(embed));
  const sectionEnd = html.indexOf('</section>', html.indexOf(embed));
  if (sectionStart >= 0 && sectionEnd > sectionStart) {
    let section = html.slice(sectionStart, sectionEnd + 10);
    section = section.replace(/<h3(?:\s+id="[^"]*")?>[\s\S]*?<\/h3>/i, `<h3>${item.heading}</h3>`);
    section = section.replace(/<div class="field-video__meta">([\s\S]*?)<p>[\s\S]*?<\/p>/i, (m, before) => `<div class="field-video__meta">${before}<p>${item.description}</p>`);
    html = html.slice(0, sectionStart) + section + html.slice(sectionEnd + 10);
  }
}

fs.writeFileSync('index.html', html);
console.log('Replaced local Nha Trang MP4 players with YouTube embeds.');
