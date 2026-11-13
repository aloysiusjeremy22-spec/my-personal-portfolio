(function () {
  const { esc, isUrl, ICONS: I } = PF;

  const uniq = (arr, key) => { const seen = {}; return arr.map(x => { const base = x[key] || 'Untitled'; seen[base] = (seen[base] || 0) + 1; return seen[base] > 1 ? base + ' (' + seen[base] + ')' : base; }); };
  const tree = () => { const D = PF.DATA, pn = uniq(D.projects, 'title'), cn = uniq(D.certificates, 'name'), gn = uniq(D.gallery, 'title'); return { name: 'This PC', type: 'folder', children: [
    { name: 'About Me', type: 'folder', children: [
      { name: 'Personal Information', type: 'file', kind: 'info' }, { name: 'My Skills', type: 'file', kind: 'skills' }, { name: 'My Resume', type: 'file', kind: 'resume' } ] },
    { name: 'My Projects', type: 'folder', children: D.projects.map((p, i) => ({ name: pn[i], type: 'file', kind: 'project', data: p })) },
    { name: 'My Certificates', type: 'folder', children: D.certificates.map((c, i) => ({ name: cn[i], type: 'file', kind: 'cert', data: c })) },
    { name: 'My Personal Files', type: 'folder', children: D.gallery.map((g, i) => ({ name: gn[i], type: 'file', kind: 'photo', data: g })) } ] }; };
  const resolve = loc => { let n = tree(); for (const k of loc) { n = (n.children || []).find(c => c.name === k); if (!n) return null; } return n; };
  const flat = (n, loc, out) => { (n.children || []).forEach(c => { const l = [...loc, c.name]; out.push({ n: c, loc: l }); if (c.children) flat(c, l, out); }); return out; };
  const J = l => esc(JSON.stringify(l));
  const dl = rows => '<dl>' + rows.map(([a, b]) => `<dt>${esc(a)}</dt><dd>${esc(b)}</dd>`).join('') + '</dl>';

  PF.WM.register('explorer', { title: 'File Explorer', icon: I.folder, w: 76, h: 78, render(body) {
    let loc = PF.nextLoc || [], hist = [loc], hi = 0, q = '', zoom = 1; PF.nextLoc = null;
    const go = l => { hist = hist.slice(0, hi + 1); hist.push(l); hi++; loc = l; q = ''; zoom = 1; draw(); };
    PF.explorerGo = l => { if (!body.isConnected) return false; go(l); return true; };
    const empty = m => `<div class="empty"><p>${m}</p></div>`;
    const thumb = n => {
      if (n.type === 'folder') return I.folder;
      if (n.kind === 'photo' && n.data.src) return `<img src="${esc(n.data.src)}" alt="${esc(n.name)}">`;
      if (n.kind === 'project') {
        return n.data.image ? `<img src="${esc(n.data.image)}" alt="${esc(n.name)} thumbnail">` : '';
      }
      if (n.kind === 'cert') {
        const image = n.data.file && n.data.type !== 'pdf' ? n.data.file : '';
        return image ? `<img src="${esc(image)}" alt="${esc(n.name)} thumbnail">` : '';
      }
      return I.file;
    };
    const grid = items => '<div class="fx-grid">' + items.map(x => `<button type="button" class="fx-item" data-loc="${J(x.loc)}">${thumb(x.n)}<span>${esc(x.n.name)}</span></button>`).join('') + '</div>';

    function preview(n) {
      const D = PF.DATA, a = D.about;
      if (n.kind === 'info') return `<article class="doc"><h2>Personal Information</h2>${PF.avatar(PF.DATA.profile.picture, PF.DATA.profile.name)}${dl([['Full name', a.fullName], ['Introduction', a.intro], ['Education', a.education], ['Course & year', a.course], ['Interests', a.interests], ['Career objectives', a.objectives]])}</article>`;
      if (n.kind === 'skills') return `<article class="doc"><h2>My Skills</h2><dl>${D.skills.map(g => `<dt>${esc(g.group)}</dt><dd>${g.items.map(s => `<span class="chip">${esc(s)}</span>`).join('')}</dd>`).join('')}</dl></article>`;
      if (n.kind === 'resume') { const f = D.resume.file; return `<article class="doc"><h2>My Resume</h2>${f ? `<iframe class="pdf" src="${esc(f)}" title="Resume preview"></iframe><p><a class="lnk" href="${esc(f)}" target="_blank" rel="noopener">View</a><a class="lnk" href="${esc(f)}" download>Download</a></p>` : '<div class="ph">[RESUME PDF]<br>Put your PDF in assets/resume/ and set resume.file in js/main.js.</div>'}</article>`; }
      if (n.kind === 'project') { const p = n.data;
        const projectImage = p.image ? `<img src="${esc(p.image)}" alt="${esc(p.title)}" class="project-image">` : '';
        const links = (isUrl(p.github) ? `<a class="lnk" href="${esc(p.github)}" target="_blank" rel="noopener noreferrer">GitHub repository</a>` : '') + (isUrl(p.demo) ? `<a class="lnk" href="${esc(p.demo)}" target="_blank" rel="noopener noreferrer">Live demo</a>` : '');
        return `<article class="doc"><h2>${esc(p.title)}</h2><p>${esc(p.description)}</p><dl><dt>Purpose</dt><dd>${esc(p.purpose)}</dd><dt>Technologies</dt><dd>${p.tech.map(t => `<span class="chip">${esc(t)}</span>`).join('')}</dd><dt>My role</dt><dd>${esc(p.role)}</dd></dl>${projectImage}<div>${links || '<p class="muted">No repository or live demo link available.</p>'}</div></article>`; }
      if (n.kind === 'cert') { const c = n.data;
        const view = !c.file ? '' : c.type === 'pdf' ? `<iframe class="pdf" src="${esc(c.file)}" title="${esc(c.name)}"></iframe>` : `<div class="zbar"><button type="button" data-z="-.25" aria-label="Zoom out">−</button><button type="button" data-z="0">Reset</button><button type="button" data-z=".25" aria-label="Zoom in">+</button></div><div class="zoomwrap"><img class="zoomimg" src="${esc(c.file)}" alt="${esc(c.name)}" style="width:${zoom * 100}%"></div>`;
        return `<article class="doc"><h2>${esc(c.name)}</h2>${dl([['Issued by', c.issuer], ['Date', c.date]])}${view}${c.file ? `<a class="lnk" href="${esc(c.file)}" download>Download</a>` : ''}</article>`; }
      if (n.kind === 'photo') { const g = n.data; return `<article class="doc"><h2>${esc(g.title)}</h2>${g.src ? `<img src="${esc(g.src)}" alt="${esc(g.title)}">` : '<div class="ph">[GALLERY IMAGE] add photos to assets/images/gallery/</div>'}<p>${esc(g.caption)}</p></article>`; }
      return empty('Nothing to show.');
    }
    function mainHTML() {
      const node = resolve(loc) || tree();
      if (q) { const r = flat(tree(), [], []).filter(x => x.n.name.toLowerCase().includes(q.toLowerCase())); return r.length ? grid(r) : empty(`No files or folders match “${esc(q)}”.`); }
      if (node.type === 'folder') return node.children.length ? grid(node.children.map(c => ({ n: c, loc: [...loc, c.name] }))) : empty('This folder is empty.');
      return preview(node);
    }
    function draw() {
      const crumbs = ['This PC', ...loc].map((c, i) => `<button type="button" data-crumb="${i}">${esc(c)}</button>`).join('<span aria-hidden="true">›</span>');
      const side = [['Home', []], ['About Me', ['About Me']], ['My Projects', ['My Projects']], ['My Certificates', ['My Certificates']], ['My Personal Files', ['My Personal Files']]].map(([t, l]) => `<button type="button" class="${loc[0] === l[0] && (l.length || !loc.length) ? 'cur' : ''}" data-loc="${J(l)}"><span class="ico">${I.folder}</span>${t}</button>`).join('');
      body.innerHTML = `<div class="fx"><div class="fx-bar"><button type="button" data-a="back" aria-label="Back" ${hi < 1 ? 'disabled' : ''}>←</button><button type="button" data-a="fwd" aria-label="Forward" ${hi >= hist.length - 1 ? 'disabled' : ''}>→</button><button type="button" data-a="up" aria-label="Up one level" ${loc.length ? '' : 'disabled'}>↑</button><nav class="crumbs" aria-label="Breadcrumb">${crumbs}</nav><input class="fx-search" type="search" placeholder="Search" aria-label="Search files and folders"></div><aside class="fx-side">${side}</aside><section class="fx-main">${mainHTML()}</section></div>`;
    }
    body.addEventListener('input', e => { if (e.target.matches('.fx-search')) { q = e.target.value.trim(); body.querySelector('.fx-main').innerHTML = mainHTML(); } });
    body.addEventListener('click', e => {
      const t = e.target.closest('button'); if (!t) return; const d = t.dataset;
      if (d.loc) go(JSON.parse(d.loc));
      else if (d.crumb !== undefined) go(loc.slice(0, +d.crumb));
      else if (d.a === 'back' && hi > 0) { loc = hist[--hi]; q = ''; draw(); }
      else if (d.a === 'fwd' && hi < hist.length - 1) { loc = hist[++hi]; q = ''; draw(); }
      else if (d.a === 'up' && loc.length) go(loc.slice(0, -1));
      else if (d.z !== undefined) { zoom = d.z === '0' ? 1 : Math.max(.5, Math.min(4, zoom + +d.z)); const im = body.querySelector('.zoomimg'); if (im) im.style.width = zoom * 100 + '%'; }
    });
    draw();
  } });
})();
