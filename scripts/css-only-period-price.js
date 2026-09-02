const fs = require('fs');

let html = fs.readFileSync('index.html','utf8');

function replaceBalancedDivByAttribute(source, attrText, replacement){
  const start = source.indexOf(attrText);
  if(start < 0) throw new Error('Target not found: '+attrText);
  const divStart = source.lastIndexOf('<div', start);
  if(divStart < 0) throw new Error('Opening div not found for '+attrText);
  const re = /<div\b[^>]*>|<\/div>/gi;
  re.lastIndex = divStart;
  let depth = 0, m;
  while((m = re.exec(source))){
    if(m[0].startsWith('</')) depth--;
    else depth++;
    if(depth === 0){
      return source.slice(0,divStart)+replacement+source.slice(re.lastIndex);
    }
  }
  throw new Error('Unbalanced div for '+attrText);
}

function replaceSchedule(source,key,dates){
  const groupRe = new RegExp('<div class="chips" data-sched="'+key+'"[\\s\\S]*?<\\/div>\\s*<div class="dates" id="dates-'+key+'"><\\/div>');
  if(!groupRe.test(source)) throw new Error('Schedule block not found: '+key);
  const id = 'tns-'+key+'-sched';
  const panels = [2,3,4].map(w=>`<div class="tns-css-sched__panel tns-css-sched__panel--${w}">${dates[w].map(d=>`<div class="date"><b>${d}</b><span>${w} WEEKS</span></div>`).join('')}</div>`).join('');
  const block = `<div class="tns-css-sched" aria-label="기간 선택">
    <input type="radio" name="${id}" id="${id}-2"><input type="radio" name="${id}" id="${id}-3"><input type="radio" name="${id}" id="${id}-4" checked>
    <div class="chips tns-css-sched__chips"><label class="chip" for="${id}-2">2주</label><label class="chip" for="${id}-3">3주</label><label class="chip" for="${id}-4">4주</label></div>
    <div class="dates tns-css-sched__panels">${panels}</div>
  </div>`;
  return source.replace(groupRe,block);
}

const ntFamilies = [
  ['보호자 1 + 자녀 1',[['Deluxe Twin','기본 제공 객실',{2:2900,3:4150,4:5400},false]]],
  ['보호자 1 + 자녀 2',[
    ['Deluxe (엑스트라 베드 없음)','개별 상담 필요',{2:4755,3:6800,4:8845},true],
    ['Deluxe + Extra bed','개별 상담 필요',{2:5015,3:7200,4:9385},true],
    ['Suite / Family Room','개별 상담 필요',{2:6029,3:8760,4:11491},true]
  ]],
  ['보호자 2 + 자녀 1',[['Deluxe + Extra bed','개별 상담 필요',{2:3615,3:5250,4:6885},true]]],
  ['보호자 1 + 자녀 3',[['Deluxe 2 rooms','개별 상담 필요',{2:7655,3:10950,4:14245},true]]],
  ['보호자 2 + 자녀 2',[['Deluxe 2 rooms / 2 Bedroom Suite','개별 상담 필요',{2:5800,3:8300,4:10800},true]]]
];

function pricePanel(families,weeks){
  return `<div class="tns-css-price__panel tns-css-price__panel--${weeks}">${families.map(([label,rooms])=>`<div class="tns-css-family"><h4>${label}</h4>${rooms.map(([room,sub,prices,consult])=>`<div class="room"><span class="room__name">${room}<small>${sub}</small></span><span class="room__won">${consult?'상담 필요':'$'+Number(prices[weeks]).toLocaleString()}<sub>${consult?'참고가 $'+Number(prices[weeks]).toLocaleString()+' · 확정 전': 'USD'} / ${weeks}주</sub></span></div>`).join('')}</div>`).join('')}</div>`;
}

function priceBlock(key,families){
  const id='tns-'+key+'-price';
  return `<div class="price tns-css-price" aria-label="기간별 참가비">
    <input type="radio" name="${id}" id="${id}-2"><input type="radio" name="${id}" id="${id}-3"><input type="radio" name="${id}" id="${id}-4" checked>
    <div class="price__step"><b>Step 1 · 기간</b><div class="chips tns-css-price__chips"><label class="chip" for="${id}-2">2주</label><label class="chip" for="${id}-3">3주</label><label class="chip" for="${id}-4">4주</label></div></div>
    <div class="price__step" style="margin-bottom:0"><b>Step 2 · 가족 구성별 객실 & 참가비</b><div class="price__out tns-css-price__panels">${pricePanel(families,2)}${pricePanel(families,3)}${pricePanel(families,4)}</div></div>
  </div>`;
}

html = replaceSchedule(html,'nt',{
  2:['2027.01.03 ~ 01.16','2027.01.10 ~ 01.23','2027.01.17 ~ 01.30'],
  3:['2027.01.03 ~ 01.23','2027.01.10 ~ 01.30'],
  4:['2027.01.03 ~ 01.30']
});
html = replaceBalancedDivByAttribute(html,'data-price="nt"',priceBlock('nt',ntFamilies));

const css = `<style id="tns-css-only-period-price">
.tns-css-sched>input,.tns-css-price>input{position:absolute!important;opacity:0!important;width:1px!important;height:1px!important;pointer-events:none!important}
.tns-css-sched__chips label,.tns-css-price__chips label{cursor:pointer;user-select:none;-webkit-user-select:none;touch-action:manipulation;display:inline-flex;align-items:center;justify-content:center}
.tns-css-sched__panel,.tns-css-price__panel{display:none}
#tns-nt-sched-2:checked~.tns-css-sched__chips label[for="tns-nt-sched-2"],#tns-nt-sched-3:checked~.tns-css-sched__chips label[for="tns-nt-sched-3"],#tns-nt-sched-4:checked~.tns-css-sched__chips label[for="tns-nt-sched-4"],#tns-nt-price-2:checked~.price__step .tns-css-price__chips label[for="tns-nt-price-2"],#tns-nt-price-3:checked~.price__step .tns-css-price__chips label[for="tns-nt-price-3"],#tns-nt-price-4:checked~.price__step .tns-css-price__chips label[for="tns-nt-price-4"]{background:var(--accent);color:#fff;border-color:var(--accent)}
#tns-nt-sched-2:checked~.tns-css-sched__panels .tns-css-sched__panel--2,#tns-nt-sched-3:checked~.tns-css-sched__panels .tns-css-sched__panel--3,#tns-nt-sched-4:checked~.tns-css-sched__panels .tns-css-sched__panel--4,#tns-nt-price-2:checked~.price__step .tns-css-price__panels .tns-css-price__panel--2,#tns-nt-price-3:checked~.price__step .tns-css-price__panels .tns-css-price__panel--3,#tns-nt-price-4:checked~.price__step .tns-css-price__panels .tns-css-price__panel--4{display:block}
.tns-css-family{padding:14px 0;border-bottom:1px solid var(--line)}.tns-css-family:last-child{border-bottom:0}.tns-css-family h4{font-family:var(--font-body);font-size:14px;margin:0 0 8px;color:var(--ink-2)}
@media(max-width:640px){.tns-css-price__chips,.tns-css-sched__chips{display:grid;grid-template-columns:repeat(3,1fr)}.tns-css-price__chips label,.tns-css-sched__chips label{min-height:46px}.tns-css-family .room{grid-template-columns:1fr;gap:6px}.tns-css-family .room__won{text-align:left}}
</style>`;
if(!html.includes('</head>')) throw new Error('Missing head');
html=html.replace('</head>',css+'\n</head>');

fs.writeFileSync('index.html',html);
console.log('Replaced Nha Trang schedule and price selectors with CSS-only controls.');
