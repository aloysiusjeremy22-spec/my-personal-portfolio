(function () {
  const apps = {}, wins = {}; let z = 10, active = null;
  const WM = PF.WM = {
    register(id, def) { apps[id] = def; },
    open(id) {
      if (wins[id]) return this.restore(id);            // one instance per app
      const def = apps[id], n = Object.keys(wins).length;
      const w = document.createElement('section');
      w.className = 'win opening'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-label', def.title);
      w.style.cssText = `width:${def.w || 72}%;height:${def.h || 76}%;left:${7 + n * 4}%;top:${5 + n * 4}%`;
      w.innerHTML = `<header class="win-bar"><span class="ico">${def.icon}</span><span class="win-title">${def.title}</span><span class="win-ctl"><button type="button" data-a="min" aria-label="Minimize">–</button><button type="button" data-a="max" aria-label="Maximize">▢</button><button type="button" data-a="close" class="x" aria-label="Close">✕</button></span></header><div class="win-body"></div>`;
      document.getElementById('windows').appendChild(w);
      const tb = document.createElement('button'); tb.type = 'button'; tb.className = 'tb-app open';
      tb.innerHTML = `<span class="ico">${def.icon}</span><span>${def.title}</span>`;
      tb.setAttribute('aria-label', def.title);
      tb.onclick = () => { const s = wins[id]; (s.min || active !== id) ? WM.restore(id) : WM.minimize(id); };
      document.getElementById('tbApps').appendChild(tb);
      const s = wins[id] = { el: w, tb, min: false, max: false };
      def.render(w.querySelector('.win-body'), w);
      w.addEventListener('pointerdown', () => WM.focus(id));
      w.querySelector('.win-ctl').addEventListener('click', e => {
        const b = e.target.closest('button'); if (!b) return;
        ({ min: () => WM.minimize(id), max: () => WM.toggleMax(id), close: () => WM.close(id) })[b.dataset.a]();
      });
      const bar = w.querySelector('.win-bar');
      bar.addEventListener('dblclick', e => { if (!e.target.closest('button') && !PF.isMobile()) WM.toggleMax(id); });
      bar.addEventListener('pointerdown', e => {
        if (e.target.closest('button') || PF.isMobile() || s.max) return;
        const r = w.getBoundingClientRect(), p = w.parentNode.getBoundingClientRect(), ox = e.clientX - r.left, oy = e.clientY - r.top;
        w.style.left = (r.left - p.left) + 'px'; w.style.top = (r.top - p.top) + 'px';
        bar.setPointerCapture(e.pointerId); bar.style.cursor = 'grabbing';
        const mv = ev => { w.style.left = Math.max(0, Math.min(p.width - 90, ev.clientX - p.left - ox)) + 'px'; w.style.top = Math.max(0, Math.min(p.height - 40, ev.clientY - p.top - oy)) + 'px'; };
        const up = () => { bar.removeEventListener('pointermove', mv); bar.removeEventListener('pointerup', up); bar.style.cursor = ''; };
        bar.addEventListener('pointermove', mv); bar.addEventListener('pointerup', up);
      });
      WM.focus(id); PF.Sound && PF.Sound.play('open');
    },
    focus(id) { const s = wins[id]; if (!s) return; active = id; s.el.style.zIndex = ++z; this.sync(); },
    minimize(id) { const s = wins[id]; if (!s) return; s.min = true; s.el.classList.add('min'); if (active === id) active = null; this.sync(); },
    restore(id) { const s = wins[id]; if (!s) return; s.min = false; s.el.classList.remove('min'); this.focus(id); },
    toggleMax(id) { const s = wins[id]; s.max = !s.max; s.el.classList.toggle('max', s.max); },
    close(id) {
      const s = wins[id]; if (!s) return; delete wins[id]; if (active === id) active = null;
      s.tb.remove(); PF.Sound && PF.Sound.play('close'); s.el.classList.add('closing'); setTimeout(() => s.el.remove(), 200); this.sync();
    },
    closeAll() { Object.keys(wins).forEach(id => { wins[id].tb.remove(); wins[id].el.remove(); delete wins[id]; }); active = null; z = 10; },
    sync() { Object.entries(wins).forEach(([id, s]) => s.tb.classList.toggle('active', id === active && !s.min)); }
  };
})();
