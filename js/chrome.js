(function () {
  const { esc, isUrl, ICONS: I } = PF;
  const PAGES = { home: ['New Tab', 'portfolio://lets-connect'], contact: ['Contact me', 'portfolio://contact'], gmail: ['Gmail', 'portfolio://profile/gmail'],
    facebook: ['Facebook', 'portfolio://profile/facebook'], instagram: ['Instagram', 'portfolio://profile/instagram'], github: ['GitHub', 'portfolio://profile/github'] };
  const NET = { facebook: 'Facebook', instagram: 'Instagram', github: 'GitHub' };
  const at = u => (u && !u.startsWith('[')) ? '@' + u : u;
  PF.WM.register('chrome', { title: 'Google Chrome', icon: I.chrome, w: 74, h: 80, render(body) {
    const mk = () => ({ page: 'home', back: [], fwd: [] }); let tabs = [mk()], cur = 0;
    const homeHTML = () => `<h1>LET'S CONNECT!</h1><p class="muted">Pick a profile to preview.</p><div class="tiles">${['facebook', 'instagram', 'github'].map(k => `<button type="button" class="tile" data-go="${k}">${I[k]}<span>${NET[k]}</span></button>`).join('')}<button type="button" class="tile" data-go="gmail">${I.gmail}<span>Gmail</span></button></div>`;
    const gmailHTML = () => `<div class="profile"><div class="pf-logo">${I.gmail}</div><h2>Get in touch</h2><p>Have a question, an opportunity or just want to say hi? Send me a message and it will land in my inbox.</p><button type="button" class="lnk" data-go="contact">SEND ME A MESSAGE</button></div>`;
    function profileHTML(k) {
      const s = PF.DATA.social[k], label = 'VISIT ' + NET[k].toUpperCase() + ' PROFILE';
      return `<div class="profile"><div class="pf-logo">${I[k]}</div><div class="pf-av">${PF.avatar(s.picture, s.name)}</div><h2 class="pf-name">${esc(s.name)}</h2><p class="muted">${esc(at(s.username))}</p><p class="pf-bio">${esc(s.bio)}</p><div class="gh-extra"></div>${isUrl(s.url) ? `<a class="lnk" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${label}</a>` : `<button type="button" class="lnk" data-missing>${label}</button>`}</div>`;
    }
    async function ghLoad() {
      const box = body.querySelector('.gh-extra'), u = PF.DATA.social.github.username; if (!box) return;
      if (!u || u.startsWith('[')) { box.innerHTML = '<p class="muted">Add your GitHub username in js/script.js to load live profile data.</p>'; return; }
      box.textContent = 'Loading GitHub data…';
      try {
        const base = 'https://api.github.com/users/' + encodeURIComponent(u);
        const [a, b] = await Promise.all([fetch(base), fetch(base + '/repos?sort=updated&per_page=4')]);
        if (!a.ok || !b.ok) throw new Error('GitHub API ' + a.status);
        const p = await a.json(), repos = await b.json(); if (!body.contains(box)) return;
        const pf = body.querySelector('.profile');
        if (p.name) pf.querySelector('.pf-name').textContent = p.name;
        if (p.bio) pf.querySelector('.pf-bio').textContent = p.bio;
        if (!PF.DATA.social.github.picture && p.avatar_url) pf.querySelector('.pf-av').innerHTML = `<img class="avatar" src="${esc(p.avatar_url)}" alt="${esc(p.login)} GitHub avatar">`;
        box.innerHTML = `<p class="muted">${p.public_repos} public repos · ${p.followers} followers</p><ul class="repos">${repos.map(r => `<li><a href="${esc(r.html_url)}" target="_blank" rel="noopener noreferrer">${esc(r.name)}</a>${r.description ? '<br>' + esc(r.description) : ''}<br><small class="muted">${esc(r.language || '')} ★ ${r.stargazers_count}</small></li>`).join('')}</ul>`;
      } catch (e) { if (body.contains(box)) box.innerHTML = '<p class="muted">Could not load live GitHub data right now. Showing saved details instead.</p>'; }
    }
    function draw() {
      const t = tabs[cur];
      const page = t.page === 'home' ? homeHTML() : t.page === 'gmail' ? gmailHTML() : NET[t.page] ? profileHTML(t.page) : '';
      body.innerHTML = `<div class="chrome"><div class="tabs" role="tablist">${tabs.map((x, i) => `<button type="button" role="tab" aria-selected="${i === cur}" class="tab ${i === cur ? 'cur' : ''}" data-tab="${i}"><span>${PAGES[x.page][0]}</span><b data-x="${i}" role="button" aria-label="Close tab">✕</b></button>`).join('')}<button type="button" class="newtab" data-new aria-label="New tab">+</button></div>
      <div class="cbar"><button type="button" data-n="back" aria-label="Back" ${t.back.length ? '' : 'disabled'}>←</button><button type="button" data-n="fwd" aria-label="Forward" ${t.fwd.length ? '' : 'disabled'}>→</button><button type="button" data-n="ref" aria-label="Refresh">⟳</button><div class="addr">${PAGES[t.page][1]}</div></div>
      <div class="cpage">${page}</div></div>`;
      if (t.page === 'contact') PF.Contact.mount(body.querySelector('.cpage'));
      if (t.page === 'github') ghLoad();
    }
    body.addEventListener('click', e => {
      const t = tabs[cur];
      if (e.target.closest('[data-missing]')) return PF.toast('Add this link in js/script.js (social).');
      const x = e.target.closest('[data-x]');
      if (x) { e.stopPropagation(); tabs.splice(+x.dataset.x, 1); if (!tabs.length) return PF.WM.close('chrome'); cur = Math.min(cur, tabs.length - 1); return draw(); }
      const b = e.target.closest('button'); if (!b) return; const d = b.dataset;
      if (d.tab !== undefined) { cur = +d.tab; draw(); }
      else if (d.new !== undefined) { tabs.push(mk()); cur = tabs.length - 1; draw(); }
      else if (d.go) { t.back.push(t.page); t.fwd = []; t.page = d.go; draw(); }
      else if (d.n === 'back' && t.back.length) { t.fwd.push(t.page); t.page = t.back.pop(); draw(); }
      else if (d.n === 'fwd' && t.fwd.length) { t.back.push(t.page); t.page = t.fwd.pop(); draw(); }
      else if (d.n === 'ref') draw();
    });
    draw();
  } });
})();
