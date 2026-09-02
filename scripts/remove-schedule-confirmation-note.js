const fs = require('fs');

const FILE = 'index.html';
let html = fs.readFileSync(FILE, 'utf8');

const target = '공식 확정 자료에 명시된 전체 기간은 4주(2027.01.03~01.30) 하나이며, 2주·3주는 그 안에서 시작일을 선택하는 방식입니다. 위 2주·3주 세부 구간의 시작일 조합은 최종 모집요강 확인 필요 항목입니다.';

if (html.includes(target)) {
  html = html.replace(target, '');
  // Remove an empty paragraph left behind when this note occupied its own line.
  html = html.replace(/<p([^>]*)>\s*<\/p>/g, (m, attrs) => /class=["'][^"']*note[^"']*["']/.test(attrs) ? '' : m);
}

if (html.includes(target)) throw new Error('Nha Trang schedule confirmation note still remains');

fs.writeFileSync(FILE, html);
console.log('Removed Nha Trang schedule confirmation note.');
