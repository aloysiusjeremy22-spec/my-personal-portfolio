window.PF = window.PF || {};
PF.DATA = {
  profile: { name:'Aloysius', designation:'Computer Science Student', picture:'assets/images/profile/profile.jpg' /* [PROFILE PICTURE] e.g. 'assets/images/profile/profile.jpg' */ },
  about: { fullName:'Aloysius A. Garcia', intro:'Hello! I\'m Aloysius, a Computer Science student who enjoys exploring technology, playing online games, and discovering new things.', education:'Currently in 3rd Year pursuing a Bachelor of Science in Computer Science, where I continue to gain knowledge and experience in computing, technology, and digital applications.', course:'Bachelor of Science in Computer Science - 3rd Year', interests:'Online gaming, video games, technology, digital entertainment, computers, and exploring new applications.', objectives:'My goal is to complete my studies, broaden my knowledge of technology, and discover opportunities where I can apply my skills and interests. I aim to continue learning, gain experience, and grow both personally and professionally.',
    personalSkills:['Adaptability, Patience, Teamwork, Problem-Solving, Time Management, Willingness to Learn'], hobbies:['Playing Online Games, Exploring Different Games, Watching Gaming Content'], funFacts:['I enjoy spending time in digital spaces and online communities.'] },
  skills: [
    {group:'Programming Languages', items:['Python']}, {group:'Web Development', items:['HTML, CSS, JavaScript']}, {group:'Database Management', items:['MySQL (Basic)']},
    {group:'Software & Tools', items:['VS Code, GitHub, PyCharm, Cisco Packet Tracer, Oracle VirtualBox ']}, {group:'Technical Competencies', items:['Basic Computer Operations, Digital Literacy']}, {group:'Other Skills', items:['Documentation, Communication']}
  ],
  resume: { file:'assets/resume/resume.pdf' },
  projects: [
    {
      title:'Traffic Light System Using Breadboard',
      description:'A group project for COSC60 that involved building a simple traffic light circuit on a breadboard using three LED lights.',
      purpose:'To demonstrate the basic operation and sequence of a traffic light system through a working electronic circuit.',
      tech:['Breadboard','3 LED lights','Electronic components'],
      role:'Group member who helped build and assemble the traffic light circuit.',
      image:'assets/projects/proj01.jpg', github:'', demo:''
    },
    {
      title:'Web-Based User Login and Authentication System',
      description:'A simple website developed for ITEC50 using HTML and CSS, featuring a user login interface.',
      purpose:'To create a basic web-based login page and practice the fundamentals of website structure and styling.',
      tech:['HTML','CSS'],
      role:'Developed the website as a subject project.',
      image:'assets/projects/proj02.jpg', github:'', demo:''
    }
  ],
  certificates: [
    { name:'Elementary Diploma', issuer:'', date:'', file:'assets/certificates/cert01.jpg', type:'image' },
    { name:'Certificate of Recognition – Grade 12, 1st Semester (S.Y. 2023–2024)', issuer:'', date:'', details:'General Weighted Average (GWA): 90.29%', file:'assets/certificates/cert02.jpg', type:'image' },
    { name:'Certificate of Recognition – Grade 12, 2nd Semester (S.Y. 2023–2024)', issuer:'', date:'', details:'General Weighted Average (GWA): 90.57%', file:'assets/certificates/cert03.jpg', type:'image' },
    { name:'Certificate of Participation – Basic Japanese Language Seminar', issuer:'', date:'', details:'For actively participating in the Foreign Language Seminar on Basic Japanese Language.', file:'assets/certificates/cert04.jpg', type:'image' },
    { name:'Certificate of Competence – Senior High School', issuer:'', date:'', details:'For completing the requirements of Senior High School.', file:'assets/certificates/cert05.jpg', type:'image' },
    { name:'Senior High School Diploma', issuer:'', date:'', file:'assets/certificates/cert06.jpg', type:'image' }
  ],
  gallery: [
    { src:'assets/images/gallery/photo1.jpg' /* 'assets/images/gallery/photo1.jpg' */, title:'01 — A Place Close to Home', caption:'A little piece of home in Isla Verde, Batangas, my dad\'s province. A place filled with beautiful views, familiar roots, and memories worth keeping.' },
    { src:'assets/images/gallery/photo2.jpg', title:'02 — Her First Visit', caption:'A special little trip to Isla Verde with my favorite person. It was her first time visiting, which made this day even more memorable for both of us.' },
    { src:'assets/images/gallery/photo3.jpg', title:'03 — Made With Love', caption:'A homemade lunch prepared by me and my girlfriend for my family. Nothing beats sharing food, helping each other in the kitchen, and enjoying a meal together.' },
    { src:'assets/images/gallery/photo4.jpg', title:'04 — Just Me', caption:'A little snapshot of myself, just enjoying the moment. Sometimes, it\'s nice to keep a photo simply because I like how that day felt.' }
  ],
  spotify: { playlists:[ { title:'Aurora', url:'https://open.spotify.com/album/7mGQSG3GPyox65DMOAX0j7?si=idSovZv_Qtel-L24Kfzskw', cover:'' } ], artists:['TONEEJAY'],
    songs:[
      { title:'711', artist:'TONEEJAY', url:'https://open.spotify.com/track/4dnlLz7zpWmuBgGeIHJYL0?si=4be1a65d65274283' }
    ]
  },
  social: {
    facebook:  { url:'https://www.facebook.com/Palahman',  name:'Aloysius Garcia', username:'Palahman',  bio:'😺', picture: "assets/socials/facebook.jpg" },
    instagram: { url:'https://www.instagram.com/aloysius_grc?rpxt=MTBzMWprY2w4bnZzeQ==', name:'Aloysius Garcia', username:'aloysius_grc', bio:'😺', picture: "assets/socials/instagram.jpg" },
    github:    { url:'https://github.com/aloysiusjeremy22-spec"',    name:'', username:'aloysiusjeremy22-spec',    bio:'' },
  }
};
PF.esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
PF.isUrl = s => /^https?:\/\//i.test(s || '');
PF.isMobile = () => matchMedia('(max-width:700px)').matches;
PF.toast = msg => { const d = document.getElementById('desktop') || document.body; const t = document.createElement('div'); t.className='toast'; t.textContent = msg; d.appendChild(t); setTimeout(() => t.remove(), 3200); };
PF.avatar = (src, name) => src ? `<img class="avatar" src="${PF.esc(src)}" alt="${PF.esc(name)} profile picture">` : `<span class="avatar" role="img" aria-label="Profile picture placeholder">${/^[A-Za-z]/.test(name || '') ? PF.esc(name[0].toUpperCase()) : '?'}</span>`;
PF.ICONS = {
  spotify:'<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="22" fill="#1DB954"/><path d="M12 19c8-3 18-2 25 2M14 26c7-2 14-1 20 2M16 33c5-1 10-1 15 1" fill="none" stroke="#121212" stroke-width="3.5" stroke-linecap="round"/></svg>',
  gallery:'<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="5" y="8" width="38" height="32" rx="5" fill="#DCE7DC" stroke="#557C65" stroke-width="2"/><circle cx="17" cy="19" r="4" fill="#557C65"/><path d="M7 38l12-12 8 8 6-6 10 10z" fill="#A9BDA9"/></svg>',
  settings:'<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="16" fill="#A9BDA9"/><circle cx="24" cy="24" r="6" fill="#183D32"/><g stroke="#A9BDA9" stroke-width="5" stroke-linecap="round"><path d="M24 4v6M24 38v6M4 24h6M38 24h6M10 10l4 4M34 34l4 4M10 38l4-4M34 14l4-4"/></g></svg>',
  about:'<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="22" fill="#DCE7DC"/><circle cx="24" cy="19" r="8" fill="#557C65"/><path d="M8 40c3-9 9-12 16-12s13 3 16 12" fill="#557C65"/></svg>',
  folder:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M4 12a4 4 0 014-4h10l5 5h17a4 4 0 014 4v21a4 4 0 01-4 4H8a4 4 0 01-4-4z" fill="#A9BDA9"/><path d="M4 18h40v18a4 4 0 01-4 4H8a4 4 0 01-4-4z" fill="#DCE7DC"/></svg>',
  file:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M10 4h20l10 10v28a2 2 0 01-2 2H10a2 2 0 01-2-2V6a2 2 0 012-2z" fill="#DCE7DC" stroke="#557C65" stroke-width="2"/><path d="M30 4v10h10" fill="#A9BDA9"/><path d="M14 24h20M14 30h20M14 36h12" stroke="#557C65" stroke-width="2"/></svg>',
  chrome:'<i class="chr" aria-hidden="true"></i>',
  facebook:'<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="22" fill="#1877F2"/><path d="M26.5 38V26h4l.7-4.7h-4.7v-3c0-1.4.5-2.3 2.4-2.3h2.4V12c-.4 0-1.9-.2-3.5-.2-3.5 0-5.8 2.1-5.8 6v3.5h-4V26h4v12z" fill="#fff"/></svg>',
  instagram:'<svg viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="ig" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#FEDA75"/><stop offset=".4" stop-color="#FA7E1E"/><stop offset=".7" stop-color="#D62976"/><stop offset="1" stop-color="#4F5BD5"/></linearGradient></defs><rect x="3" y="3" width="42" height="42" rx="12" fill="url(#ig)"/><rect x="12" y="12" width="24" height="24" rx="7" fill="none" stroke="#fff" stroke-width="3"/><circle cx="24" cy="24" r="6" fill="none" stroke="#fff" stroke-width="3"/><circle cx="31" cy="17" r="1.8" fill="#fff"/></svg>',
  github:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#181717" d="M12 .3a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.500 11.500 0 016 0c2.3-1.500 3.300-1.200 3.300-1.200.6 1.700.2 2.900.1 3.200.8.8 1.200 1.900 1.200 3.200 0 4.600-2.800 5.600-5.500 5.900.4.400.8 1.100.8 2.200v3.300c0 .3.2.7.8.6A12 12 0 0012 .3"/></svg>',
  gmail:'<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="4" y="9" width="40" height="30" rx="4" fill="#fff" stroke="#dadce0" stroke-width="2"/><path d="M6 11l18 14 18-14" fill="none" stroke="#EA4335" stroke-width="4"/><path d="M6 37V12" stroke="#4285F4" stroke-width="4"/><path d="M42 37V12" stroke="#34A853" stroke-width="4"/></svg>'
};
