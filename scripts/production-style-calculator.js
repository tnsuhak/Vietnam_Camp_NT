const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');

function replaceBalancedDivByAttribute(source, attrText, replacement){
  const start = source.indexOf(attrText);
  if(start < 0) throw new Error('Target not found: '+attrText);
  const divStart = source.lastIndexOf('<div', start);
  const re = /<div\b[^>]*>|<\/div>/gi;
  re.lastIndex = divStart;
  let depth=0,m;
  while((m=re.exec(source))){
    depth += m[0].startsWith('</') ? -1 : 1;
    if(depth===0) return source.slice(0,divStart)+replacement+source.slice(re.lastIndex);
  }
  throw new Error('Unbalanced div: '+attrText);
}

const key='nt';
const schedules={2:['2027.01.03 ~ 01.16','2027.01.10 ~ 01.23','2027.01.17 ~ 01.30'],3:['2027.01.03 ~ 01.23','2027.01.10 ~ 01.30'],4:['2027.01.03 ~ 01.30']};
const families=[
  {id:'p1c1',label:'보호자 1 + 자녀 1',rooms:[{room:'Deluxe Twin',sub:'기본 제공 객실',price:{2:2900,3:4150,4:5400}}]},
  {id:'p1c2',label:'보호자 1 + 자녀 2',rooms:[{room:'Deluxe (엑스트라 베드 없음)',sub:'개별 상담 필요',consult:true,ref:{2:4755,3:6800,4:8845}},{room:'Deluxe + Extra bed',sub:'개별 상담 필요',consult:true,ref:{2:5015,3:7200,4:9385}},{room:'Suite / Family Room',sub:'개별 상담 필요',consult:true,ref:{2:6029,3:8760,4:11491}}]},
  {id:'p2c1',label:'보호자 2 + 자녀 1',rooms:[{room:'Deluxe + Extra bed',sub:'개별 상담 필요',consult:true,ref:{2:3615,3:5250,4:6885}}]},
  {id:'p1c3',label:'보호자 1 + 자녀 3',rooms:[{room:'Deluxe 2 rooms',sub:'개별 상담 필요',consult:true,ref:{2:7655,3:10950,4:14245}}]},
  {id:'p2c2',label:'보호자 2 + 자녀 2',rooms:[{room:'Deluxe 2 rooms / 2 Bedroom Suite',sub:'개별 상담 필요',consult:true,ref:{2:5800,3:8300,4:10800}}]}
];
function dateHtml(w){return schedules[w].map(d=>`<div class="date"><b>${d}</b><span>${w} WEEKS</span></div>`).join('');}
function familyButtons(active='p1c1'){return families.map(f=>`<button type="button" class="chip" data-fam="${f.id}" aria-pressed="${f.id===active}" onclick="return tnsCalcFamily('${key}','${f.id}',this)">${f.label}</button>`).join('');}
function roomHtml(famId='p1c1',w=4){const f=families.find(x=>x.id===famId)||families[0];return f.rooms.map(r=>`<div class="room"><span class="room__name">${r.room}<small>${r.sub}</small></span><span class="room__won">${r.consult?'상담 필요':'$'+r.price[w].toLocaleString()}<sub>${r.consult?'참고가 $'+r.ref[w].toLocaleString()+' · 확정 전':'USD'} / ${w}주</sub></span></div>`).join('')+`<p class="note" style="margin:6px 0 0">${f.label} · ${w}주 기준${f.rooms.length>1?' · 객실 타입에 따라 참가비가 달라집니다':''}</p>`;}

const schedRe=new RegExp('<div class="chips" data-sched="'+key+'"[\\s\\S]*?<\\/div>\\s*<div class="dates" id="dates-'+key+'"><\\/div>');
if(!schedRe.test(html)) throw new Error('Schedule block missing');
html=html.replace(schedRe,`<div class="chips" data-sched="${key}" role="group" aria-label="기간 선택"><button type="button" class="chip" data-weeks="2" aria-pressed="false" onclick="return tnsCalcWeeks('${key}',2,this)">2주</button><button type="button" class="chip" data-weeks="3" aria-pressed="false" onclick="return tnsCalcWeeks('${key}',3,this)">3주</button><button type="button" class="chip" data-weeks="4" aria-pressed="true" onclick="return tnsCalcWeeks('${key}',4,this)">4주</button></div><div class="dates" id="dates-${key}">${dateHtml(4)}</div>`);
const priceBlock=`<div class="price" data-price="${key}" data-current-weeks="4" data-current-family="p1c1"><div class="price__step"><b>Step 1 · 기간</b><div class="chips" data-role="weeks"><button type="button" class="chip" data-v="2" aria-pressed="false" onclick="return tnsCalcPriceWeeks('${key}',2,this)">2주</button><button type="button" class="chip" data-v="3" aria-pressed="false" onclick="return tnsCalcPriceWeeks('${key}',3,this)">3주</button><button type="button" class="chip" data-v="4" aria-pressed="true" onclick="return tnsCalcPriceWeeks('${key}',4,this)">4주</button></div></div><div class="price__step"><b>Step 2 · 가족 구성</b><div class="chips" data-role="family">${familyButtons()}</div></div><div class="price__step" style="margin-bottom:0"><b>Step 3 · 객실 &amp; 참가비</b><div class="price__out" data-role="out">${roomHtml()}</div></div></div>`;
html=replaceBalancedDivByAttribute(html,'data-price="nt"',priceBlock);
html=html.replace(/\s*<script src="\/ui-fix-runtime\.js"><\/script>\s*/g,'\n').replace(/\s*<script id="tns-mobile-price-runtime">[\s\S]*?<\/script>\s*/g,'\n');
const runtime=`<script id="tns-production-style-calculator">(function(){var DATA={nt:{schedules:${JSON.stringify(schedules)},families:${JSON.stringify(families)}}};function q(s,r){return (r||document).querySelector(s)}function qa(s,r){return (r||document).querySelectorAll(s)}function pressed(g,e){qa('.chip',g).forEach(function(b){b.setAttribute('aria-pressed',b===e?'true':'false')})}function fam(d,id){for(var i=0;i<d.families.length;i++)if(d.families[i].id===id)return d.families[i];return d.families[0]}function render(key){var root=q('[data-price="'+key+'"]'),data=DATA[key];if(!root)return;var w=Number(root.dataset.currentWeeks||4),f=fam(data,root.dataset.currentFamily),out=q('[data-role="out"]',root),s='';for(var i=0;i<f.rooms.length;i++){var r=f.rooms[i];s+='<div class="room"><span class="room__name">'+r.room+'<small>'+r.sub+'</small></span>';if(r.consult)s+='<span class="room__won">상담 필요<sub>참고가 $'+Number(r.ref[w]).toLocaleString('en-US')+' · 확정 전 / '+w+'주</sub></span>';else s+='<span class="room__won">$'+Number(r.price[w]).toLocaleString('en-US')+'<sub>USD / '+w+'주</sub></span>';s+='</div>'}out.innerHTML=s+'<p class="note" style="margin:6px 0 0">'+f.label+' · '+w+'주 기준'+(f.rooms.length>1?' · 객실 타입에 따라 참가비가 달라집니다':'')+'</p>'}window.tnsCalcWeeks=function(key,w,el){var data=DATA[key],g=q('[data-sched="'+key+'"]');if(g)pressed(g,el);var box=q('#dates-'+key);if(box)box.innerHTML=data.schedules[w].map(function(d){return '<div class="date"><b>'+d+'</b><span>'+w+' WEEKS</span></div>'}).join('');var root=q('[data-price="'+key+'"]');if(root){root.dataset.currentWeeks=String(w);var wg=q('[data-role="weeks"]',root),b=wg&&q('.chip[data-v="'+w+'"]',wg);if(b)pressed(wg,b);render(key)}return false};window.tnsCalcPriceWeeks=function(key,w,el){var root=q('[data-price="'+key+'"]');if(!root)return false;root.dataset.currentWeeks=String(w);pressed(el.parentElement,el);render(key);var sg=q('[data-sched="'+key+'"]'),sb=sg&&q('.chip[data-weeks="'+w+'"]',sg);if(sb)pressed(sg,sb);var box=q('#dates-'+key),data=DATA[key];if(box)box.innerHTML=data.schedules[w].map(function(d){return '<div class="date"><b>'+d+'</b><span>'+w+' WEEKS</span></div>'}).join('');return false};window.tnsCalcFamily=function(key,id,el){var root=q('[data-price="'+key+'"]');if(!root)return false;root.dataset.currentFamily=id;pressed(el.parentElement,el);render(key);return false};})();</script>`;
if(!html.includes('</body>')) throw new Error('Missing body');
html=html.replace('</body>',runtime+'\n</body>');
fs.writeFileSync('index.html',html);
console.log('Applied production-style Nha Trang calculator with direct mobile-safe controls.');
