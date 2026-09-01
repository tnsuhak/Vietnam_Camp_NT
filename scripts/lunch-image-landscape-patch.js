const fs = require('fs');

const FILE = 'index.html';
let html = fs.readFileSync(FILE, 'utf8');

if (!html.includes('점심 & 간식')) {
  throw new Error('Could not find the Nha Trang lunch section marker: 점심 & 간식');
}

const styles = `<style id="tns-lunch-landscape-styles">
.tns-lunch-landscape-frame{position:relative!important;display:block!important;width:100%!important;height:auto!important;min-height:0!important;aspect-ratio:4/3!important;overflow:hidden!important;background:#000!important}
.tns-lunch-landscape-img{position:absolute!important;left:50%!important;top:50%!important;max-width:none!important;max-height:none!important;object-fit:contain!important;transform-origin:center center!important}
</style>`;

const runtime = `<script id="tns-lunch-landscape-runtime">
(function(){
  function textOf(el){return (el.textContent||'').replace(/\\s+/g,' ').trim();}
  function findLunchTitle(){
    var nodes=document.querySelectorAll('h2,h3,h4,h5');
    for(var i=0;i<nodes.length;i++){
      var t=textOf(nodes[i]);
      if(t.indexOf('점심')!==-1 && t.indexOf('간식')!==-1) return nodes[i];
    }
    return null;
  }
  function findScope(title){
    var node=title.parentElement;
    for(var i=0;i<7 && node;i++,node=node.parentElement){
      var imgs=node.querySelectorAll('img');
      if(imgs.length>=1 && imgs.length<=4) return node;
    }
    return title.closest('section') || document;
  }
  function pickImage(scope,title){
    var imgs=Array.prototype.slice.call(scope.querySelectorAll('img')).filter(function(img){
      return !img.closest('header,footer') && img.naturalWidth!==1 && img.naturalHeight!==1;
    });
    if(!imgs.length) return null;
    if(imgs.length===1) return imgs[0];
    var ty=title.getBoundingClientRect().top + title.getBoundingClientRect().height/2;
    imgs.sort(function(a,b){
      function score(img){
        var r=img.getBoundingClientRect();
        var area=Math.max(1,r.width*r.height);
        var cy=r.top+r.height/2;
        return area/(1+Math.abs(cy-ty));
      }
      return score(b)-score(a);
    });
    return imgs[0];
  }
  function rotateLunch(){
    var title=findLunchTitle();
    if(!title) return;
    var scope=findScope(title);
    var img=pickImage(scope,title);
    if(!img) return;
    if(img.classList.contains('tns-lunch-landscape-img')) return;

    var frame=img.parentElement;
    if(!frame) return;
    frame.classList.add('tns-lunch-landscape-frame');
    img.classList.add('tns-lunch-landscape-img');

    function fit(){
      var cw=frame.clientWidth, ch=frame.clientHeight;
      var nw=img.naturalWidth, nh=img.naturalHeight;
      if(!cw || !ch || !nw || !nh) return;
      var scale=Math.min(cw/nh,ch/nw);
      img.style.width=(nw*scale)+'px';
      img.style.height=(nh*scale)+'px';
      img.style.transform='translate(-50%,-50%) rotate(90deg)';
    }
    if(img.complete) fit(); else img.addEventListener('load',fit,{once:true});
    window.addEventListener('resize',fit,{passive:true});
    if(window.ResizeObserver){new ResizeObserver(fit).observe(frame);}
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',rotateLunch,{once:true});
  else rotateLunch();
})();
</script>`;

html = html.replace(/<style\b[^>]*id=(["'])tns-lunch-landscape-styles\1[^>]*>[\s\S]*?<\/style>\s*/gi, '');
html = html.replace(/<script\b[^>]*id=(["'])tns-lunch-landscape-runtime\1[^>]*>[\s\S]*?<\/script>\s*/gi, '');

if (!html.includes('</head>')) throw new Error('Missing </head> while adding lunch image rotation styles');
if (!html.includes('</body>')) throw new Error('Missing </body> while adding lunch image rotation runtime');
html = html.replace('</head>', styles + '\n</head>');
html = html.replace('</body>', runtime + '\n</body>');

fs.writeFileSync(FILE, html);
console.log('Configured the Nha Trang lunch photo to display rotated 90 degrees in a 4:3 landscape frame.');
