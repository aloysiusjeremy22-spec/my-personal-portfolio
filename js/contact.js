/* Contact form. EmailJS template variables: {{from_name}} {{from_email}} {{reply_to}} {{subject}} {{message}} */
PF.Contact = {
  mount(c) {
    c.innerHTML = `<form class="cform" novalidate><h2>Send me a message</h2><p class="muted">Your message goes straight to my inbox.</p>
      <label>Your name<input name="from_name" autocomplete="name" required></label>
      <label>Your email<input name="from_email" type="email" autocomplete="email" required></label>
      <label>Subject<input name="subject" required></label>
      <label>Message<textarea name="message" required></textarea></label>
      <button class="btn" type="submit">Send Message</button><p class="status" role="status" aria-live="polite"></p></form>`;
    const f = c.querySelector('form'), st = f.querySelector('.status'), btn = f.querySelector('button'); let busy = false;
    const say = (m, k) => { st.textContent = m; st.className = 'status ' + (k || ''); };
    f.addEventListener('submit', async e => {
      e.preventDefault(); if (busy) return;
      const d = Object.fromEntries(new FormData(f).entries()); Object.keys(d).forEach(k => d[k] = d[k].trim());
      if (!d.from_name || !d.from_email || !d.subject || !d.message) return say('Please fill in every field.', 'bad');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.from_email)) return say('Please enter a valid email address.', 'bad');
      const K = PF.EMAILJS;
      if ([K.PUBLIC_KEY, K.SERVICE_ID, K.TEMPLATE_ID].some(v => !v || v.startsWith('YOUR_'))) return say('Contact form is not configured yet (see README, EmailJS setup). Nothing was sent.', 'bad');
      if (typeof emailjs === 'undefined') return say('EmailJS could not load. Check your connection and try again. Nothing was sent.', 'bad');
      busy = true; btn.disabled = true; btn.textContent = 'Sending…'; say('Sending your message…');
      try {
        await emailjs.send(K.SERVICE_ID, K.TEMPLATE_ID, { ...d, reply_to: d.from_email }, { publicKey: K.PUBLIC_KEY });
        f.reset(); say('Message sent successfully. Thank you!', 'ok');
      } catch (err) { say('Sorry, the message could not be sent' + (err && err.text ? ' (' + err.text + ')' : '') + '. Please try again.', 'bad'); }
      finally { busy = false; btn.disabled = false; btn.textContent = 'Send Message'; }
    });
  }
};
