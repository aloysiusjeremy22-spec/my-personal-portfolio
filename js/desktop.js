(function () {
  let timer = null; const $ = id => document.getElementById(id), I = PF.ICONS;
  const clock = $('clock'), dateText = $('dateText');
  const tick = () => { const n = new Date(); clock.innerHTML = `<span class="cd">${n.toLocaleDateString([], { month: 'short', day: 'numeric' })} </span>${n.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`; dateText.textContent = n.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }); };
  const apps = [['explorer', 'File Explorer', I.folder], ['chrome', 'Google Chrome', I.chrome], ['spotify', 'Spotify', I.spotify], ['gallery', 'Gallery', I.gallery], ['settings', 'Settings', I.settings], ['about', 'About Me', I.about]];
  $('icons').innerHTML = apps.map(([id, t, ic]) => `<button type="button" class="icon" data-app="${id}" aria-label="Open ${t}"><span class="ico">${ic}</span><span>${t.replace('Google ', '')}</span></button>`).join('');
  $('startMenu').innerHTML = apps.map(([id, t, ic]) => `<button type="button" data-app="${id}"><span class="ico">${ic}</span>${t}</button>`).join('') + '<hr><button type="button" data-pw="shutdown">⏻ Shut Down</button>';
  $('pwrMenu').innerHTML = '<button type="button" data-pw="shutdown">⏻ Shut Down</button><button type="button" data-pw="restart">⟳ Restart</button><button type="button" data-pw="close">▭ Close Laptop</button>';
  $('volMenu').innerHTML = '<label>Volume<input type="range" id="volRange" min="0" max="100" aria-label="Volume"></label><label class="chk"><input type="checkbox" id="volOn"> Sound effects on</label>';
  const menus = { start: $('startMenu'), pwr: $('pwrMenu'), vol: $('volMenu') };
  const hide = () => Object.values(menus).forEach(m => m.hidden = true);
  const toggle = k => { const open = menus[k].hidden; hide(); menus[k].hidden = !open; if (k === 'vol' && open) { $('volRange').value = Math.round(PF.settings.volume * 100); $('volOn').checked = PF.settings.sound; } };
  $('startBtn').onclick = () => toggle('start'); $('pwrBtn').onclick = () => toggle('pwr'); $('volBtn').onclick = () => toggle('vol');
  $('desktop').addEventListener('click', e => {
    const a = e.target.closest('[data-app]'), pw = e.target.closest('[data-pw]');
    if (a) { PF.WM.open(a.dataset.app); hide(); } else if (pw) { hide(); PF.Power[pw.dataset.pw](); }
    else if (!e.target.closest('.menu,.tb-btn,.tb-start')) hide();
  });
  $('volRange').addEventListener('input', e => PF.Settings.set('volume', e.target.value / 100));
  $('volOn').addEventListener('change', e => PF.Settings.set('sound', e.target.checked));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') hide(); });
  PF.Desktop = { start() { tick(); timer = setInterval(tick, 1000); }, stop() { clearInterval(timer); hide(); } };
})();
