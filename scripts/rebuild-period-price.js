const fs = require('fs');

const FILE = 'index.html';
let html = fs.readFileSync(FILE, 'utf8');

function replaceBalancedDivByAttribute(source, attrText, replacement) {
  const attrAt = source.indexOf(attrText);
  if (attrAt < 0) throw new Error('Target not found: ' + attrText);
  const divStart = source.lastIndexOf('<div', attrAt);
  if (divStart < 0) throw new Error('Opening div not found for ' + attrText);
  const re = /<div\b[^>]*>|<\/div>/gi;
  re.lastIndex = divStart;
  let depth = 0;
  let m;
  while ((m = re.exec(source))) {
    depth += m[0].startsWith('</') ? -1 : 1;
    if (depth === 0) return source.slice(0, divStart) + replacement + source.slice(re.lastIndex);
  }
  throw new Error('Unbalanced div for ' + attrText);
}

const key = 'nt';
const schedules = {
  2: ['2027.01.03 ~ 01.16', '2027.01.10 ~ 01.23', '2027.01.17 ~ 01.30'],
  3: ['2027.01.03 ~ 01.23', '2027.01.10 ~ 01.30'],
  4: ['2027.01.03 ~ 01.30']
};
const families = [
  {id:'p1c1',label:'보호자 1 + 자녀 1',rooms:[{room:'Deluxe Twin',sub:'기본 제공 객실',price:{2:2900,3:4150,4:5400}}]},
  {id:'p1c2',label:'보호자 1 + 자녀 2',rooms:[
    {room:'Deluxe (엑스트라 베드 없음)',sub:'개별 상담 필요',consult:true,ref:{2:4755,3:6800,4:8845}},
    {room:'Deluxe + Extra bed',sub:'개별 상담 필요',consult:true,ref:{2:5015,3:7200,4:9385}},
    {room:'Suite / Family Room',sub:'개별 상담 필요',consult:true,ref:{2:6029,3:8760,4:11491}}
  ]},
  {id:'p2c1',label:'보호자 2 + 자녀 1',rooms:[{room:'Deluxe + Extra bed',sub:'개별 상담 필요',consult:true,ref:{2:3615,3:5250,4:6885}}]},
  {id:'p1c3',label:'보호자 1 + 자녀 3',rooms:[{room:'Deluxe 2 rooms',sub:'개별 상담 필요',consult:true,ref:{2:7655,3:10950,4:14245}}]},
  {id:'p2c2',label:'보호자 2 + 자녀 2',rooms:[{room:'Deluxe 2 rooms / 2 Bedroom Suite',sub:'개별 상담 필요',consult:true,ref:{2:5800,3:8300,4:10800}}]}
];
const money=n=>Number(n).toLocaleString('en-US');
const radio=(id,name,checked=false)=>`<input class="tns-rb-radio" type="radio" id="${id}" name="${name}"${checked?' checked':''}>`;

const schedPrefix=`tns-${key}-schedule`;
const scheduleBlock=`<div class="tns-rb-schedule" aria-label="프로그램 기간 선택">
${radio(`${schedPrefix}-2`,schedPrefix,true)}${radio(`${schedPrefix}-3`,schedPrefix)}${radio(`${schedPrefix}-4`,schedPrefix)}
<div class="tns-rb-tabs tns-rb-tabs--weeks">${[2,3,4].map(w=>`<label class="tns-rb-chip" for="${schedPrefix}-${w}">${w}주</label>`).join('')}</div>
<div class="dates tns-rb-schedule-panels">${[2,3,4].map(w=>`<div class="tns-rb-schedule-panel tns-rb-schedule-panel--${w}">${schedules[w].map(d=>`<div class="date"><b>${d}</b><span>${w} WEEKS</span></div>`).join('')}</div>`).join('')}</div>
</div>`;

const wPrefix=`tns-${key}-cost-w`,fPrefix=`tns-${key}-cost-f`;
const inputs=[radio(`${wPrefix}2`,`tns-${key}-cost-weeks`,true),radio(`${wPrefix}3`,`tns-${key}-cost-weeks`),radio(`${wPrefix}4`,`tns-${key}-cost-weeks`),...families.map((f,i)=>radio(`${fPrefix}-${f.id}`,`tns-${key}-cost-family`,i===0))].join('');
const weekLabels=[2,3,4].map(w=>`<label class="tns-rb-chip" for="${wPrefix}${w}">${w}주</label>`).join('');
const familyLabels=families.map(f=>`<label class="tns-rb-chip tns-rb-family-chip" for="${fPrefix}-${f.id}">${f.label}</label>`).join('');
const roomHtml=(r,w)=>r.consult?`<div class="room"><span class="room__name">${r.room}<small>${r.sub}</small></span><span class="room__won">상담 필요<sub>참고가 $${money(r.ref[w])} · 확정 전 / ${w}주</sub></span></div>`:`<div class="room"><span class="room__name">${r.room}<small>${r.sub}</small></span><span class="room__won">$${money(r.price[w])}<sub>USD / ${w}주</sub></span></div>`;
const results=[2,3,4].flatMap(w=>families.map(f=>`<div class="tns-rb-result tns-rb-result--w${w}-${f.id}">${f.rooms.map(r=>roomHtml(r,w)).join('')}<p class="note" style="margin:6px 0 0">${f.label} · ${w}주 기준${f.rooms.length>1?' · 객실 타입에 따라 참가비가 달라집니다':''}</p></div>`)).join('');
const priceBlock=`<div class="price tns-rb-price" aria-label="기간 및 가족 구성별 참가비 계산">
${inputs}
<div class="price__step"><b>Step 1 · 기간</b><div class="tns-rb-tabs tns-rb-tabs--weeks">${weekLabels}</div></div>
<div class="price__step"><b>Step 2 · 가족 구성</b><div class="tns-rb-tabs tns-rb-tabs--family">${familyLabels}</div></div>
<div class="price__step" style="margin-bottom:0"><b>Step 3 · 객실 &amp; 참가비</b><div class="price__out tns-rb-results">${results}</div></div>
</div>`;

html=replaceBalancedDivByAttribute(html,'data-sched="nt"',scheduleBlock);
html=replaceBalancedDivByAttribute(html,'id="dates-nt"','');
html=replaceBalancedDivByAttribute(html,'data-price="nt"',priceBlock);
html=html
 .replace(/\s*<script src="\/ui-fix-runtime\.js"><\/script>\s*/g,'\n')
 .replace(/\s*<script id="tns-mobile-price-runtime">[\s\S]*?<\/script>\s*/g,'\n')
 .replace(/\s*<script id="tns-production-style-calculator">[\s\S]*?<\/script>\s*/g,'\n')
 .replace(/\s*<style id="tns-css-only-period-price">[\s\S]*?<\/style>\s*/g,'\n')
 .replace(/\s*<style id="tns-rebuilt-period-price">[\s\S]*?<\/style>\s*/g,'\n');

const active=[];
[2,3,4].forEach(w=>{active.push(`#${schedPrefix}-${w}:checked~.tns-rb-tabs label[for="${schedPrefix}-${w}"]`);active.push(`#${wPrefix}${w}:checked~.price__step .tns-rb-tabs label[for="${wPrefix}${w}"]`);});
families.forEach(f=>active.push(`#${fPrefix}-${f.id}:checked~.price__step .tns-rb-tabs label[for="${fPrefix}-${f.id}"]`));
const schedShow=[2,3,4].map(w=>`#${schedPrefix}-${w}:checked~.tns-rb-schedule-panels .tns-rb-schedule-panel--${w}`);
const resultShow=[];[2,3,4].forEach(w=>families.forEach(f=>resultShow.push(`#${wPrefix}${w}:checked~#${fPrefix}-${f.id}:checked~.price__step .tns-rb-results .tns-rb-result--w${w}-${f.id}`)));
const css=`<style id="tns-rebuilt-period-price">
.tns-rb-radio{position:absolute!important;opacity:0!important;width:1px!important;height:1px!important;pointer-events:none!important}
.tns-rb-tabs{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}.tns-rb-chip{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:10px 16px;border:1px solid var(--line,#d9e0e7);border-radius:999px;background:#fff;color:var(--ink,#172432);font-weight:700;font-size:14px;line-height:1.2;cursor:pointer;user-select:none;-webkit-user-select:none;touch-action:manipulation}.tns-rb-chip:active{transform:scale(.98)}
${active.join(',')}{background:var(--accent,#0c7c77)!important;color:#fff!important;border-color:var(--accent,#0c7c77)!important}
.tns-rb-schedule-panel,.tns-rb-result{display:none}${schedShow.join(',')}{display:block}${resultShow.join(',')}{display:block}.tns-rb-schedule-panels{margin-top:12px}.tns-rb-family-chip{font-size:13.5px}.tns-rb-results .room{margin-top:0}
@media(max-width:640px){.tns-rb-tabs--weeks{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}.tns-rb-tabs--weeks .tns-rb-chip{padding:10px 6px;width:100%;min-height:46px}.tns-rb-tabs--family{display:grid;grid-template-columns:1fr;gap:7px}.tns-rb-tabs--family .tns-rb-chip{width:100%;justify-content:flex-start;text-align:left;border-radius:12px;padding:12px 14px}.tns-rb-results .room{grid-template-columns:1fr;gap:6px}.tns-rb-results .room__won{text-align:left}}
</style>`;
if(!html.includes('</head>')) throw new Error('Missing </head>');
html=html.replace('</head>',css+'\n</head>');
if(html.includes('data-sched="nt"')||html.includes('data-price="nt"')) throw new Error('Legacy Nha Trang period/price hooks still remain');
if(!html.includes('tns-nt-schedule-2')||!html.includes('tns-nt-cost-w2')||!html.includes('tns-nt-cost-f-p1c1')) throw new Error('Rebuilt Nha Trang selector markup is incomplete');
if(!html.includes('2027.01.17 ~ 01.30')||!html.includes('$14,245')) throw new Error('Expected 2027 Nha Trang schedule/price data is missing');
fs.writeFileSync(FILE,html);
console.log('Rebuilt Nha Trang duration and price selector from scratch with CSS-only controls; default is 2 weeks.');
