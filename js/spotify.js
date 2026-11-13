(function () {
  const { esc, isUrl, ICONS: I } = PF;
  const cleanUrl = u => String(u || '').trim().replace(/^\[|\]$/g, '');
  const spotifyId = u => /open\.spotify\.com\/(?:intl-[a-z]+\/)?(playlist|album|track|artist)\/([A-Za-z0-9]+)/.exec(cleanUrl(u));
  const embed = u => { const m = spotifyId(u); return m ? `https://open.spotify.com/embed/${m[1]}/${m[2]}?utm_source=generator` : null; };
  const artworkCache = new Map();
  async function getArtwork(p) {
    if (p.cover && PF.isUrl(p.cover)) return p.cover;
    const url = cleanUrl(p.url);
    if (!spotifyId(url)) return null;
    if (!artworkCache.has(url)) artworkCache.set(url, fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`)
      .then(r => r.ok ? r.json() : null).then(data => data && data.thumbnail_url || null).catch(() => null));
    return artworkCache.get(url);
  }
  PF.WM.register('spotify', { title: 'Spotify', icon: I.spotify, w: 78, h: 80, render(body) {
    const S = PF.DATA.spotify; let view = 'home', sel = null;
    const card = (p, i) => `<button type="button" class="sp-card" data-i="${i}"><div class="sp-art-wrap"><div class="sp-art" aria-hidden="true">♪</div><img class="sp-cover" data-cover-index="${i}" alt="${esc(p.title)} artwork" hidden></div><b>${esc(p.title)}</b><span>Playlist</span></button>`;
    const list = a => `<ul class="sp-list">${a.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;
    const songList = a => `<div class="sp-song-players">${a.map(x => {
      const player = x.url ? embed(x.url) : null;
      return `<article class="sp-song-player"><div class="sp-song-meta"><b>${esc(x.title)}</b><span>${esc(x.artist || '')}</span></div>${player ? `<iframe src="${esc(player)}" title="Play ${esc(x.title)} by ${esc(x.artist || '')}" width="100%" height="152" style="border:0;border-radius:12px" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>` : x.url ? `<a class="lnk" href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">Play on Spotify ↗</a>` : '<p class="sp-note">Add a Spotify track URL in js/script.js.</p>'}</article>`;
    }).join('')}</div>`;
    function main() {
      if (sel !== null) { const p = S.playlists[sel], e = embed(p.url);
        return `<button type="button" class="back" data-back>← Back</button><h2>${esc(p.title)}</h2>${e ? `<iframe src="${esc(e)}" title="${esc(p.title)} on Spotify" allow="encrypted-media; clipboard-write; fullscreen" loading="lazy"></iframe><a class="lnk" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">Open in Spotify</a>` : '<div class="sp-note">Add a Spotify URL for this playlist in js/script.js ([SPOTIFY PLAYLIST URL]).</div>'}<p class="sp-note">Playback uses Spotify's official embed. Nothing autoplays; press play yourself. Full songs need you to be logged in to Spotify in this browser, otherwise Spotify plays 30-second previews.</p>`; }
      if (view === 'library') return `<h2>Your Library</h2><h3>Favorite songs</h3>${songList(S.songs)}<h3>Favorite artists</h3>${list(S.artists)}<h3>Playlists</h3><div class="sp-grid">${S.playlists.map(card).join('')}</div>`;
      return `<h2>Good to see you</h2><div class="sp-grid">${S.playlists.map(card).join('')}</div>`;
    }
    function draw() {
      body.innerHTML = `<div class="sp"><aside class="sp-side"><div class="sp-logo">${I.spotify}<span>Spotify</span></div><button type="button" data-v="home" class="${view === 'home' && sel === null ? 'cur' : ''}">Home</button><button type="button" data-v="library" class="${view === 'library' && sel === null ? 'cur' : ''}">Your Library</button></aside><section class="sp-main">${main()}</section></div>`;
      // Resolve official Spotify artwork for every visible playlist card.
      body.querySelectorAll('.sp-cover[data-cover-index]').forEach(async img => {
        const index = Number(img.dataset.coverIndex);
        const artwork = await getArtwork(S.playlists[index]);
        if (artwork && img.isConnected) { img.src = artwork; img.hidden = false; img.previousElementSibling.hidden = true; }
      });
    }
    body.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.v) { view = b.dataset.v; sel = null; draw(); }
      else if (b.dataset.i !== undefined) { sel = +b.dataset.i; draw(); }
      else if (b.dataset.back !== undefined) { sel = null; draw(); }
    });
    draw();
  } });
})();
