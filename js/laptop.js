(function () {
  const $ = id => document.getElementById(id);
  const L = $('laptop'), btn = $('openBtn'), screen = $('screen'), boot = $('boot'), desk = $('desktop'), sd = $('shutdown'), shutMsg = $('shutMsg');
  let busy = false, isOpen = false, docked = false;
  const T = ms => matchMedia('(prefers-reduced-motion: reduce)').matches ? Math.min(ms, 120) : ms;
  const wait = ms => new Promise(r => setTimeout(r, T(ms)));
  const dock = () => { document.body.appendChild(desk); desk.classList.add('docked'); document.body.classList.add('docked'); docked = true; };
  const undock = () => { screen.appendChild(desk); desk.classList.remove('docked'); document.body.classList.remove('docked'); docked = false; };
  async function open() {
    if (busy || isOpen) return; busy = true; btn.disabled = true; L.dataset.state = 'opening';
    L.classList.add('lid-open'); await wait(1600);
    screen.classList.add('lit'); boot.classList.add('show'); await wait(1500);
    PF.Desktop.start(); desk.hidden = false; void desk.offsetWidth; desk.classList.add('on'); boot.classList.remove('show');
    await wait(750);
    if (PF.isMobile()) dock();
    PF.Sound && PF.Sound.play('open');
    isOpen = true; busy = false; L.dataset.state = 'open'; $('closeBtn').focus({ preventScroll: true });
  }
  // msg === null: Close Laptop. msg string: Shut Down (shutdown screen first).
  async function down(msg) {
    if (busy || !isOpen) return; busy = true; L.dataset.state = 'closing'; PF.WM.closeAll(); PF.Desktop.stop();
    if (msg) { shutMsg.textContent = msg; sd.classList.add('on'); await wait(2200); }
    desk.classList.add('dim'); await wait(650);
    if (docked) undock();
    desk.classList.remove('on', 'dim'); desk.hidden = true; sd.classList.remove('on'); await wait(300);
    screen.classList.remove('lit'); await wait(500);
    L.classList.remove('lid-open'); await wait(1600);
    isOpen = false; busy = false; btn.textContent = msg ? 'POWER ON' : 'OPEN LAPTOP'; btn.disabled = false; L.dataset.state = 'closed'; btn.focus({ preventScroll: true });
  }
  async function restart() {
    if (busy || !isOpen) return; busy = true; PF.WM.closeAll(); PF.Desktop.stop();
    shutMsg.textContent = 'Restarting…'; sd.classList.add('on'); await wait(2200);
    PF.Desktop.start(); sd.classList.remove('on'); await wait(700); busy = false;
  }
  PF.Power = { close: () => down(null), shutdown: () => down('Shutting down…'), restart };
  btn.addEventListener('click', open); $('closeBtn').addEventListener('click', PF.Power.close);
})();
