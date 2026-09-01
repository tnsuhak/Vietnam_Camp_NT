const fs = require('fs');

const items = [
  { id:'NdV8cVFUU3I', title:'AVE Academy International School 소개 영상', heading:'AVE Academy International School 둘러보기', sub:'학교 공식 소개 영상 · YouTube' },
  { id:'JBCOpM-uHuw', title:'Vinpearl Empire Nha Trang 소개 영상', heading:'Melia Vinpearl Empire Nha Trang 객실과 시설', sub:'호텔 소개 영상 · YouTube' }
];

function embed(item){
  return `<div style="margin-bottom:22px"><div class="field-video__embed"><iframe src="https://www.youtube-nocookie.com/embed/${item.id}" title="${item.title}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div><div style="padding:10px 4px 0"><b style="display:block;font-family:var(--font-serif);font-size:17px;line-height:1.45">${item.heading}</b><span style="display:block;margin-top:3px;font-size:12.5px;color:var(--muted)">${item.sub}</span></div></div>`;
}

function replaceCard(html,item){
  const marker=`data-yt="${item.id}"`;
  const pos=html.indexOf(marker);
  if(pos<0) return html;
  const start=html.lastIndexOf('<div class="vid"',pos);
  if(start<0) throw new Error(`legacy video start not found: ${item.id}`);
  const openEnd=html.indexOf('>',pos);
  const end=html.indexOf('</div>',openEnd);
  if(openEnd<0 || end<0) throw new Error(`legacy video end not found: ${item.id}`);
  return html.slice(0,start)+embed(item)+html.slice(end+6);
}

let html=fs.readFileSync('index.html','utf8');
for(const item of items) html=replaceCard(html,item);
fs.writeFileSync('index.html',html);
console.log('Converted legacy Nha Trang video cards to direct YouTube iframes.');
