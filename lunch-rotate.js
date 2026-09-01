(function () {
  function titleText(el) {
    return (el.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function findLunchTitle() {
    var nodes = document.querySelectorAll('h2,h3,h4,h5');
    for (var i = 0; i < nodes.length; i++) {
      var text = titleText(nodes[i]);
      if (text.indexOf('점심') !== -1 && text.indexOf('간식') !== -1) return nodes[i];
    }
    return null;
  }

  function findScope(title) {
    var node = title.parentElement;
    for (var i = 0; i < 7 && node; i++, node = node.parentElement) {
      var images = node.querySelectorAll('img');
      if (images.length >= 1 && images.length <= 4) return node;
    }
    return title.closest('section') || document;
  }

  function pickImage(scope, title) {
    var images = Array.prototype.slice.call(scope.querySelectorAll('img')).filter(function (img) {
      return !img.closest('header,footer');
    });
    if (!images.length) return null;
    if (images.length === 1) return images[0];

    var titleRect = title.getBoundingClientRect();
    var titleY = titleRect.top + titleRect.height / 2;
    images.sort(function (a, b) {
      function score(img) {
        var r = img.getBoundingClientRect();
        var area = Math.max(1, r.width * r.height);
        var y = r.top + r.height / 2;
        return area / (1 + Math.abs(y - titleY));
      }
      return score(b) - score(a);
    });
    return images[0];
  }

  function applyLandscape() {
    var title = findLunchTitle();
    if (!title) return;
    var scope = findScope(title);
    var img = pickImage(scope, title);
    if (!img || img.classList.contains('tns-lunch-landscape-img')) return;

    var frame = img.parentElement;
    if (!frame) return;
    frame.classList.add('tns-lunch-landscape-frame');
    img.classList.add('tns-lunch-landscape-img');

    function fit() {
      var frameWidth = frame.clientWidth;
      var frameHeight = frame.clientHeight;
      var naturalWidth = img.naturalWidth;
      var naturalHeight = img.naturalHeight;
      if (!frameWidth || !frameHeight || !naturalWidth || !naturalHeight) return;

      var scale = Math.min(frameWidth / naturalHeight, frameHeight / naturalWidth);
      img.style.width = (naturalWidth * scale) + 'px';
      img.style.height = (naturalHeight * scale) + 'px';
      img.style.transform = 'translate(-50%,-50%) rotate(90deg)';
    }

    if (img.complete) fit();
    else img.addEventListener('load', fit, { once: true });
    window.addEventListener('resize', fit, { passive: true });
    if (window.ResizeObserver) new ResizeObserver(fit).observe(frame);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyLandscape, { once: true });
  else applyLandscape();
})();
