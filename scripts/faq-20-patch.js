const fs=require('fs');

const STYLE=`<style id="faq20-styles">
.faq20{padding:64px 0;background:#fff}.faq20 .sec-head{max-width:760px}.faq20__list{display:grid;gap:10px;max-width:920px}.faq20 details{background:#fff;border:1px solid var(--line);border-radius:14px;overflow:hidden;box-shadow:0 4px 16px rgba(11,34,57,.04)}.faq20 summary{cursor:pointer;list-style:none;padding:17px 52px 17px 18px;font-weight:750;position:relative;line-height:1.5}.faq20 summary::-webkit-details-marker{display:none}.faq20 summary:after{content:'+';position:absolute;right:18px;top:50%;transform:translateY(-50%);font-size:22px;color:var(--sea)}.faq20 details[open] summary:after{content:'−'}.faq20__answer{padding:0 18px 18px;color:var(--ink-3);font-size:14.5px;line-height:1.75}.faq20__note{margin-top:16px;font-size:12.5px;color:var(--muted);max-width:900px}@media(max-width:640px){.faq20{padding:52px 0}.faq20 summary{padding:15px 46px 15px 15px}.faq20__answer{padding:0 15px 15px}}
</style>`;

const NT=[
['나트랑 캠프는 어떤 프로그램인가요?','연령에 따라 AVE Academy 세미 스쿨링과 Kid Castle 유치원 스쿨링으로 나뉘는 가족형 겨울캠프입니다. 아이는 학교 프로그램에 참여하고 보호자는 나트랑에서 별도 일정을 보낼 수 있습니다.'],
['AVE Academy와 Kid Castle은 어떻게 나뉘나요?','AVE Academy는 7~15세 대상, Kid Castle은 4~6세(2024년생~2022년생) 대상 프로그램으로 안내되어 있습니다.'],
['프로그램은 몇 주 과정인가요?','2주·3주·4주 중 선택할 수 있습니다. 세부 입·퇴실일은 선택 기간과 운영 일정에 따라 최종 확인합니다.'],
['AVE Academy 하루 수업시간은 어떻게 되나요?','2027 WINTER PROGRAM GUIDE 기준으로 08:30~16:30 운영으로 안내되어 있습니다.'],
['AVE Academy 한 반 인원은 몇 명인가요?','15명 기준으로 총 4개 반 운영이 안내되어 있으며, 모집 인원에 따라 실제 반 구성은 조정될 수 있습니다.'],
['AVE 수업은 캠프 학생끼리만 하나요?','오전에는 영어 집중 수업을 진행하고 오후에는 재학생과 함께하는 합동 수업 형태가 포함되는 세미 스쿨링 방식입니다.'],
['Kid Castle 하루 운영시간은 어떻게 되나요?','2027 가이드 기준 08:30~15:00 운영으로 안내되어 있습니다.'],
['Kid Castle 한 반은 몇 명이고 교사는 어떻게 배치되나요?','각 반 26명 기준이며 원어민 교사와 이중언어 현지 보조교사 2~3명이 함께 운영하는 것으로 안내되어 있습니다.'],
['Kid Castle도 기존 재학생과 같이 생활하나요?','캠프 참가자만 별도 분리하는 방식이 아니라 기존 재학생과 같은 반에서 생활하는 형태로 안내되어 있습니다.'],
['Kid Castle은 어떤 교육과정을 사용하나요?','캐나다 교육 프로그램을 기반으로 수업하는 것으로 안내되어 있습니다.'],
['나트랑 숙소는 어디인가요?','가족 숙소는 Meliá Vinpearl Empire가 기본 안내 숙소입니다.'],
['객실 청소는 얼마나 자주 해주나요?','Meliá 객실은 주 3회 하우스키핑이 진행되는 것으로 안내되어 있습니다.'],
['현지에서 문의할 수 있는 데스크가 있나요?','캠프 전용 Help Desk를 통해 현지 생활, 학교, 숙소 관련 문의를 지원하는 방식이 안내되어 있습니다.'],
['아이 등·하교 차량이 있나요?','자녀 등·하교에 캠프 전용 스쿨버스를 운영하는 것으로 안내되어 있습니다.'],
['보호자 프로그램도 있나요?','학부모 대상 주 1회 시티투어가 안내되어 있으며, 자녀 수업 시간 동안 보호자가 나트랑 일정을 즐길 수 있도록 구성되어 있습니다.'],
['주말 여행이나 골프 예약도 도움받을 수 있나요?','주말 가족여행과 골프 등 선택 일정의 예약 안내를 지원하는 것으로 안내되어 있습니다.'],
['아이가 아프면 어떻게 하나요?','현재 프로그램 안내에는 한국어로 소통 가능한 병원 동행 및 현지 지원 내용이 포함되어 있습니다. 실제 긴급상황 대응 범위와 절차는 출국 전 최종 안내를 확인해야 합니다.'],
['한국에서 출국은 단체 출국인가요?','단체 지정 항공편으로 함께 출국하는 방식이 아니라 가족별 개별 출국입니다. 현지에서는 각 가족의 항공편 도착·출발 시간에 맞춰 공항 픽업과 드롭을 개별로 지원합니다.'],
['등록 후 학부모 안내방이 만들어지나요?','등록이 완료되면 학부모님과 현지 운영팀이 함께하는 가족별 단체 채팅방을 개설합니다. 해당 방에서 출국 전 OT, 출국 안내, 준비사항을 전달하고 궁금한 점도 계속 질문할 수 있습니다.'],
['얼리버드 할인은 어떻게 되나요?','현재 안내된 얼리버드는 9월 1일부터 10월 31일까지이며, 한 가족당 US$100 할인과 형제·자매 1인당 US$50 추가 할인이 안내되어 있습니다.']
];
function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function faqBlock(items){const details=items.map((x,i)=>`<details><summary>${i+1}. ${esc(x[0])}</summary><div class="faq20__answer">${esc(x[1])}</div></details>`).join('');return `<section id="faq" class="faq20" aria-labelledby="faq-title"><div class="wrap"><div class="sec-head"><p class="eyebrow">FAQ · 20 Questions</p><h2 id="faq-title">자주 묻는 질문 20</h2><p class="lead">나트랑 2027 겨울캠프 상담에서 많이 확인하는 내용을 정리했습니다.</p></div><div class="faq20__list">${details}</div><p class="faq20__note">※ 학교·숙소·프로모션의 잔여 자리와 운영 조건은 변동될 수 있어 등록 시점에 최종 확인합니다.</p></div></section>`;}
function faqSchema(items){return `<script type="application/ld+json" id="faq20-schema">${JSON.stringify({'@context':'https://schema.org','@type':'FAQPage',mainEntity:items.map(x=>({'@type':'Question',name:x[0],acceptedAnswer:{'@type':'Answer',text:x[1]}}))})}</script>`;}
function patch(html){if(NT.length!==20)throw new Error('Nha Trang FAQ must contain exactly 20 items');const block=faqBlock(NT);const byId=/<section\b(?=[^>]*\bid=["']faq["'])[^>]*>[\s\S]*?<\/section>/i;const byMarker=/<!--\s*=+\s*FAQ\s*=+\s*-->[\s\S]*?(?=<!--\s*=+\s*[A-Z][A-Z\s&\/-]*\s*=+\s*-->)/i;if(byId.test(html))html=html.replace(byId,block);else if(byMarker.test(html))html=html.replace(byMarker,'<!-- ============ FAQ ============ -->\n'+block+'\n');else throw new Error('Could not locate Nha Trang FAQ section');if(!html.includes('id="faq20-styles"'))html=html.replace('</head>',STYLE+'\n</head>');html=html.replace(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi,m=>m.includes('FAQPage')?'':m);html=html.replace('</head>',faqSchema(NT)+'\n</head>');const section=html.match(/<section\b(?=[^>]*\bid=["']faq["'])[^>]*>[\s\S]*?<\/section>/i);const count=section?(section[0].match(/<details>/g)||[]).length:0;if(count!==20)throw new Error('Nha Trang rendered FAQ count is '+count+', expected 20');return html;}
let html=fs.readFileSync('index.html','utf8');html=patch(html);fs.writeFileSync('index.html',html);console.log('Updated Nha Trang FAQ with individual departure, airport transfer and parent chat/OT guidance.');
