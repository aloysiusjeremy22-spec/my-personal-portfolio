/* Sticky-note guide beside the laptop. */
(function () {
  const { esc } = PF;
  PF.GUIDE = [
    { app: 'explorer', title: 'File Explorer', items: [
      ['About Me › Personal Information, Skills, Resume', ['About Me']],
      ['My Projects', ['My Projects']],
      ['My Certificates', ['My Certificates']],
      ['My Personal Files (gallery photos)', ['My Personal Files']] ] },
    { app: 'about', title: 'About Me', items: [
      ['Introduction & Resume'], ['Educational Background'], ['Technical Skills'], ['Personal Skills'], ['Hobbies and Interests'], ['Fun Facts'] ] },
    { app: 'gallery', title: 'Gallery', items: [['Photo grid'], ['Photo viewer (‹ › arrows, Esc to close)']] },
    { app: 'chrome', title: 'Google Chrome', items: [['Facebook'], ['Instagram'], ['GitHub'], ['Gmail & contact form']] },
    { app: 'spotify', title: 'Spotify', items: [['Home (playlists)'], ['Your Library (songs, artists)']] },
    { app: 'settings', title: 'Settings', items: [['Personalization (wallpaper)'], ['Appearance (light / dark)'], ['Sound'], ['Display'], ['About This Computer']] }
  ];

  const note = document.getElementById('guide'); if (!note) return;
  note.classList.add('folded');
  note.innerHTML = `<span class="tape" aria-hidden="true"></span><button type="button" class="g-toggle" aria-expanded="false" aria-controls="guideBody"><span>📌 Quick Guide</span><small class="g-hint">tap to open</small><b class="g-x" aria-hidden="true">✕</b></button><div class="g-wrap"><div class="g-body" id="guideBody"><p class="g-sub">What's inside each app. Tap a line to open it.</p><p class="g-warn" role="status" hidden>Open the laptop first 💻</p>` +
    PF.GUIDE.map((g, i) => `<details${i === 0 ? ' open' : ''}><summary>${esc(g.title)}</summary><ul>${g.items.map(([t, loc]) => `<li><button type="button" data-app="${g.app}"${loc ? ` data-loc="${esc(JSON.stringify(loc))}"` : ''}>${esc(t)}</button></li>`).join('')}</ul></details>`).join('') + '</div></div>';

  const tog = note.querySelector('.g-toggle');
  const setFold = f => { note.classList.toggle('folded', f); tog.setAttribute('aria-expanded', String(!f)); note.querySelector('.g-wrap').inert = f; };
  setFold(true);
  tog.addEventListener('click', () => setFold(!note.classList.contains('folded')));
  note.addEventListener('keydown', e => { if (e.key === 'Escape' && !note.classList.contains('folded')) { setFold(true); tog.focus(); } });

  let timer = null;
  note.addEventListener('click', e => {
    const b = e.target.closest('button[data-app]'); if (!b) return;
    if (document.getElementById('laptop').dataset.state !== 'open') {
      const w = note.querySelector('.g-warn'); w.hidden = false; clearTimeout(timer); timer = setTimeout(() => w.hidden = true, 2600); return;
    }
    const loc = b.dataset.loc ? JSON.parse(b.dataset.loc) : null;
    if (b.dataset.app === 'explorer' && loc) { PF.nextLoc = loc; PF.WM.open('explorer'); if (PF.nextLoc && PF.explorerGo) PF.explorerGo(loc); PF.nextLoc = null; }
    else PF.WM.open(b.dataset.app);
  });
})();
