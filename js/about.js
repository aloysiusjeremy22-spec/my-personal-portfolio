(function () {
  const { esc, ICONS: I } = PF;
  PF.WM.register('about', { title: 'About Me', icon: I.about, w: 68, h: 80, render(body) {
    const D = PF.DATA, a = D.about, p = D.profile, f = D.resume.file;
    const chips = arr => arr.map(x => `<span class="chip">${esc(x)}</span>`).join('');
    body.innerHTML = `<div class="ab"><header class="ab-head">${PF.avatar(p.picture, p.name)}<div><h1>${esc(p.name)}</h1><p><b>${esc(p.designation)}</b></p><p>${esc(a.intro)}</p><div>${f ? `<a class="lnk" href="${esc(f)}" target="_blank" rel="noopener">View Resume</a><a class="lnk" href="${esc(f)}" download>Download Resume</a>` : '<button type="button" class="lnk" data-missing>View Resume</button><button type="button" class="lnk" data-missing>Download Resume</button>'}<button type="button" class="lnk" data-proj>View Projects</button></div></div></header>
      <section class="ab-sec"><h3>Educational Background</h3><p>${esc(a.education)}</p><p>${esc(a.course)}</p></section>
      <section class="ab-sec"><h3>Technical Skills</h3>${D.skills.map(g => `<p><b>${esc(g.group)}</b><br>${chips(g.items)}</p>`).join('')}</section>
      <section class="ab-sec"><h3>Personal Skills</h3>${chips(a.personalSkills)}</section>
      <section class="ab-sec"><h3>Hobbies and Interests</h3>${chips(a.hobbies)}</section>
      <section class="ab-sec"><h3>Fun Facts</h3><ul>${a.funFacts.map(x => `<li>${esc(x)}</li>`).join('')}</ul></section></div>`;
    body.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.missing !== undefined) PF.toast('Add your resume PDF path in js/script.js (resume.file).');
      else if (b.dataset.proj !== undefined) { PF.nextLoc = ['My Projects']; PF.WM.open('explorer'); if (PF.nextLoc && PF.explorerGo) PF.explorerGo(['My Projects']); PF.nextLoc = null; } });
  } });
})();
