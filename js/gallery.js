(function () {
  const { esc, ICONS: I } = PF;
  PF.WM.register('gallery', { title: 'Gallery', icon: I.gallery, w: 76, h: 80, render(body) {
    const G = PF.DATA.gallery; let idx = -1;
    const pic = (g, cls) => g.src ? `<img class="${cls || ''}" src="${esc(g.src)}" alt="${esc(g.title)}" loading="lazy">` : '<div class="ph">[GALLERY IMAGE]</div>';
    body.innerHTML = G.length ? `<div class="gal" tabindex="-1"><div class="gal-grid">${G.map((g, i) => `<button type="button" class="gal-card" data-i="${i}">${pic(g)}<b>${esc(g.title)}</b><small>${esc(g.caption)}</small></button>`).join('')}</div>
      <div class="lb" hidden role="dialog" aria-label="Photo viewer"><button type="button" class="lb-x" data-a="x" aria-label="Close">✕</button><button type="button" class="lb-prev" data-a="p" aria-label="Previous photo">‹</button><div class="lb-img"></div><b class="lb-t"></b><span class="lb-c"></span><button type="button" class="lb-next" data-a="n" aria-label="Next photo">›</button></div></div>` : '<div class="empty"><p>No photos yet. Add some in js/script.js.</p></div>';
    const lb = body.querySelector('.lb'); if (!lb) return;
    function show(i) {
      idx = (i + G.length) % G.length; const g = G[idx], box = lb.querySelector('.lb-img');
      lb.hidden = false; box.style.opacity = 0; box.innerHTML = pic(g);
      const im = box.querySelector('img'); const fin = () => { box.style.opacity = 1; };
      im ? (im.complete ? fin() : (im.onload = fin, im.onerror = fin)) : fin();
      box.style.transition = 'opacity .3s'; lb.querySelector('.lb-t').textContent = g.title; lb.querySelector('.lb-c').textContent = g.caption;
      lb.querySelector('.lb-prev').hidden = lb.querySelector('.lb-next').hidden = G.length < 2;
    }
    body.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.i !== undefined) show(+b.dataset.i);
      else if (b.dataset.a === 'x') lb.hidden = true;
      else if (b.dataset.a === 'p') show(idx - 1);
      else if (b.dataset.a === 'n') show(idx + 1);
    });
    body.addEventListener('keydown', e => { if (lb.hidden) return; if (e.key === 'Escape') lb.hidden = true; else if (e.key === 'ArrowLeft') show(idx - 1); else if (e.key === 'ArrowRight') show(idx + 1); });
  } });
})();
