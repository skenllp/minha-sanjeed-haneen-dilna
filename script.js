/* ============ EDIT YOUR DETAILS HERE ============ */
const CONFIG = {
  hosts: 'Ashraf Parappurath & Thajunniza MK',
  nikkah:    { bride: 'Minha Nourin',     groom: 'Sanjeedh Roshan' },
  reception: { groom: 'Haneen Ashraf PP', bride: 'Dr. Dilna K' },
  date: '2026-12-26T10:30:00+05:30',   // wedding date & time (IST)
  durationHours: 5,
  venue: { name: 'Chaliyar Convention Centre', line1: 'Edavannappara', line2: '',
           mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Chaliyar+Convention+Centre+Edavannappara' },
  whatsapp: '91XXXXXXXXXX',            // RSVP goes to this WhatsApp number (country code, no +)
  music: 'assets/music.mp3'            // optional; button hides itself if the file is missing
};
/* ================================================= */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const target = new Date(CONFIG.date);
const [Y, M, D] = CONFIG.date.slice(0, 10).split('-').map(Number);
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const wd = new Date(Date.UTC(Y, M - 1, D)).getUTCDay();
const [hh, mm] = CONFIG.date.slice(11, 16).split(':').map(Number);
const time12 = `${((hh + 11) % 12) + 1}:${String(mm).padStart(2, '0')} ${hh >= 12 ? 'PM' : 'AM'}`;
const dateLong = `${DAYS[wd]}, ${D} ${MONTHS[M - 1]} ${Y}`;

/* ---- bind text ---- */
const f1 = n => n.replace(/^Dr\.\s*/, '').split(' ')[0];
const nikkahFirst = `${f1(CONFIG.nikkah.bride)} & ${f1(CONFIG.nikkah.groom)}`;
const recFirst = `${f1(CONFIG.reception.groom)} & ${f1(CONFIG.reception.bride)}`;
const hostParts = (CONFIG.hosts || '').split(/\s*&\s*/);
const hostFather = hostParts[0] || 'Ashraf Parappurath';
const hostMother = hostParts[1] || 'Thajunniza MK';
const V = {
  hosts: CONFIG.hosts, 'hosts-invite': `${CONFIG.hosts} warmly invite you to the`,
  'host-father': hostFather, 'host-mother': hostMother,
  nb: CONFIG.nikkah.bride, ng: CONFIG.nikkah.groom, rg: CONFIG.reception.groom, rb: CONFIG.reception.bride,
  'nb-first': f1(CONFIG.nikkah.bride), 'ng-first': f1(CONFIG.nikkah.groom),
  'rg-first': f1(CONFIG.reception.groom), 'rb-first': f1(CONFIG.reception.bride),
  'nikkah-names': nikkahFirst, 'reception-names': recFirst, 'rec-first': recFirst,
  venue: CONFIG.venue.name, 'venue-upper': CONFIG.venue.name.toUpperCase(), line1: CONFIG.venue.line1, line2: CONFIG.venue.line2,
  'date-long': dateLong, 'date-upper': dateLong.toUpperCase(),
  time: time12, 'time-upper': `${time12} ONWARDS`,
  day: String(D), 'month-upper': MONTHS[M - 1].toUpperCase(), 'month-name': MONTHS[M - 1], year: String(Y), 'weekday-upper': DAYS[wd].toUpperCase()
};
$$('[data-bind]').forEach(el => { const v = V[el.dataset.bind]; if (v != null) el.textContent = v; });
$('#mapBtn').href = CONFIG.venue.mapsUrl;
document.title = `${nikkahFirst} · Nikkah Invitation`;

/* ---- split text into words for reveal ---- */
$$('[data-split]').forEach(el => {
  const words = el.textContent.trim().split(/\s+/);
  el.innerHTML = words.map((w, i) => `<span class="w"><span style="--i:${i}">${w.replace(/&/g,'&amp;')}</span></span>`).join(' ');
  el.style.setProperty('--d', (el.dataset.delay || 0) + 's');
  el.setAttribute('aria-label', words.join(' '));
});

/* ---- reveal: hero on load (after cover dismissed), rest on scroll ---- */
const hero = $('#top');
const startHeroReveal = () => $$('.hero [data-split], .hero .reveal').forEach(el => el.classList.add('is-in'));

const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
}), { threshold: 0.22, rootMargin: '0px 0px -6% 0px' });
$$('.reveal, [data-split]').filter(el => !hero.contains(el)).forEach(el => io.observe(el));

/* ---- scroll: progress bar + hero parallax ---- */
const bar = $('#progress'), heroBg = $('#heroBg');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
let ticking = false;
function onScroll() {
  const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = `translateX(-50%) scaleX(${max > 0 ? y / max : 0})`;
  if (!reduce && y < innerHeight * 1.2) heroBg.style.transform = `translate3d(0,${y * 0.22}px,0)`;
  ticking = false;
}
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();

/* ---- countdown ---- */
const pad = n => String(n).padStart(2, '0');
function tick() {
  let s = Math.max(0, Math.floor((target - Date.now()) / 1000));
  const elD = $('#cd-d'), elH = $('#cd-h'), elM = $('#cd-m'), elS = $('#cd-s');
  if (elD) elD.textContent = pad(Math.floor(s / 86400)); s %= 86400;
  if (elH) elH.textContent = pad(Math.floor(s / 3600)); s %= 3600;
  if (elM) elM.textContent = pad(Math.floor(s / 60));
  if (elS) elS.textContent = pad(s % 60);
}
tick(); setInterval(tick, 1000);

/* ---- RSVP -> WhatsApp ---- */
const rsvpForm = $('#rsvpForm');
if (rsvpForm) {
  rsvpForm.addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(e.target);
    const text = `Wedding RSVP\nName: ${f.get('name')}\nResponse: ${f.get('attend')}\nGuests: ${f.get('guests')}` +
      (f.get('msg') ? `\nMessage: ${f.get('msg')}` : '');
    $('#thanks').hidden = false;
    window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  });
}

/* ---- cover screen + music ---- */
(function () {
  const cover = $('#cover');
  const openBtn = $('#openInvitation');
  const btn = $('#music');
  const audio = new Audio(CONFIG.music);
  audio.loop = true; audio.preload = 'auto';

  // lock scroll while cover is visible
  document.body.classList.add('cover-active');

  const set = on => btn.classList.toggle('playing', on);
  const play = () => audio.play().then(() => set(true)).catch(() => set(false));

  // "Open Invitation" button
  openBtn.addEventListener('click', () => {
    // dismiss cover
    cover.classList.add('out');
    document.body.classList.remove('cover-active');

    // start music
    play();

    // show music toggle button
    btn.hidden = false;

    // trigger hero reveal after cover fades
    setTimeout(() => {
      startHeroReveal();
      cover.addEventListener('transitionend', () => cover.remove(), { once: true });
    }, 100);
  });

  // music toggle button
  btn.addEventListener('click', e => {
    e.stopPropagation();
    audio.paused ? play() : (audio.pause(), set(false));
  });

  // hide music button if file is missing
  audio.addEventListener('error', () => { btn.hidden = true; });
})();
