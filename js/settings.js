(function () {
  const { ICONS: I } = PF, KEY = 'aloysius-portfolio-settings';
  const WALLS = { cat: ['Cute Cat', '#183D32 url(assets/images/wallpaper/wallpaper-cat.svg) center/cover no-repeat'], forest: ['Forest Night', 'radial-gradient(circle at 72% 18%,#2f6350,#183D32 55%,#0f2a22)'],
    sage: ['Sage Mist', 'linear-gradient(135deg,#A9BDA9,#557C65 55%,#244D3C)'], moss: ['Deep Moss', 'linear-gradient(160deg,#244D3C,#183D32 60%,#0f2a22)'] };
  const st = { wallpaper: 'cat', theme: 'light', sound: true, volume: .3, scale: 1 };
  try { Object.assign(st, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) {}
  if (!WALLS[st.wallpaper]) st.wallpaper = 'cat'; if (!['light', 'dark'].includes(st.theme)) st.theme = 'light';
  st.volume = Math.min(1, Math.max(0, +st.volume || 0)); st.scale = Math.min(1.25, Math.max(.9, +st.scale || 1)); st.sound = !!st.sound;
  function apply() { const d = document.getElementById('desktop'); d.dataset.theme = st.theme; document.querySelector('.wallpaper').style.background = WALLS[st.wallpaper][1]; document.getElementById('windows').style.setProperty('--ui', st.scale); }
  PF.settings = st;
  PF.Settings = { set(k, v) { st[k] = v; try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} apply(); } };
  let ctx = null;
  PF.Sound = { play(kind) { if (!st.sound || st.volume <= 0) return; try { ctx = ctx || new (window.AudioContext || window.webkitAudioContext)(); const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.value = kind === 'close' ? 440 : 660; g.gain.value = st.volume * .15; o.connect(g); g.connect(ctx.destination); o.start(); g.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + .12); o.stop(ctx.currentTime + .13); } catch (e) {} } };
  apply();
  PF.WM.register('settings', { title: 'Settings', icon: I.settings, w: 70, h: 76, render(body) {
    let cat = 'Personalization', pend = st.wallpaper;
    const panes = {
      Personalization: () => `<h2>Personalization</h2><p class="muted">Pick a wallpaper, preview it, then apply.</p><div class="walls">${Object.entries(WALLS).map(([k, [n, c]]) => `<button type="button" class="wall ${k === pend ? 'cur' : ''}" data-wall="${k}" style="background:${c}" aria-label="${n}" title="${n}"></button>`).join('')}</div><div class="wall-prev" style="background:${WALLS[pend][1]}" role="img" aria-label="Wallpaper preview"></div><p>${WALLS[pend][0]}${pend === st.wallpaper ? ' (current)' : ''}</p><button type="button" class="btn" data-apply>Apply wallpaper</button>`,
      Appearance: () => `<h2>Appearance</h2><div class="row"><label><input type="radio" name="theme" value="light" ${st.theme === 'light' ? 'checked' : ''}> Light</label><label><input type="radio" name="theme" value="dark" ${st.theme === 'dark' ? 'checked' : ''}> Dark</label></div><p class="muted">Applies to application windows. Your green identity stays.</p>`,
      Sound: () => `<h2>Sound</h2><div class="row"><label><input type="checkbox" id="stSound" ${st.sound ? 'checked' : ''}> Interface sound effects</label></div><div class="row"><label>Volume <input type="range" id="stVol" min="0" max="100" value="${Math.round(st.volume * 100)}"></label></div>`,
      Display: () => `<h2>Display</h2><div class="row"><label>Interface scale <select id="stScale">${[.9, 1, 1.1, 1.25].map(v => `<option value="${v}" ${v === st.scale ? 'selected' : ''}>${Math.round(v * 100)}%</option>`).join('')}</select></label></div>`,
      'About This Computer': () => `<h2>About This Computer</h2><div class="doc"><dl><dt>Computer name</dt><dd>Aloysius's Laptop</dd><dt>Portfolio version</dt><dd>2.0</dd><dt>Description</dt><dd>An interactive laptop-style portfolio built with HTML, CSS and vanilla JavaScript.</dd></dl></div><div class="doc"><h3>Keeping My Digital Space Updated</h3><p>My digital space grows as I discover new things, explore my interests, and gain new experiences. Here's how I plan to keep it updated:</p><ul><li><b>New Projects:</b> Add new school projects and personal creations, including descriptions, tools used, and screenshots.</li><li><b>New Achievements:</b> Upload certificates, awards, and other milestones as I reach them.</li><li><b>Skills &amp; Interests:</b> Update my skills and interests as I learn new things and explore different technologies.</li><li><b>System Check:</b> Regularly check links, applications, and the contact form to make sure everything works properly.</li><li><b>Continuous Improvements:</b> Improve the design, features, and overall experience to keep my digital space fresh and enjoyable.</li></ul></div>`
    };
    function draw() { body.innerHTML = `<div class="st"><nav aria-label="Settings categories">${Object.keys(panes).map(c => `<button type="button" class="${c === cat ? 'cur' : ''}" data-cat="${c}">${c}</button>`).join('')}</nav><section class="st-pane">${panes[cat]()}</section></div>`; }
    body.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.cat) { cat = b.dataset.cat; pend = st.wallpaper; draw(); }
      else if (b.dataset.wall) { pend = b.dataset.wall; draw(); }
      else if (b.dataset.apply !== undefined) { PF.Settings.set('wallpaper', pend); draw(); } });
    body.addEventListener('change', e => { const t = e.target;
      if (t.name === 'theme') PF.Settings.set('theme', t.value);
      else if (t.id === 'stSound') PF.Settings.set('sound', t.checked);
      else if (t.id === 'stScale') PF.Settings.set('scale', +t.value); });
    body.addEventListener('input', e => { if (e.target.id === 'stVol') PF.Settings.set('volume', e.target.value / 100); });
    draw();
  } });
})();
