// ✦ THE AGENCY — SCRIPT ENGINE
// ═══════════════════════════════════════

// ══ PAGE WIPE LOAD ══
const wipe = document.getElementById('wipe');
if (wipe) {
    wipe.style.transition = 'transform .55s cubic-bezier(.77,0,.18,1)';
    wipe.style.transform = 'scaleX(1)';
    setTimeout(() => {
        wipe.style.transformOrigin = 'right';
        wipe.style.transform = 'scaleX(0)';
    }, 60);
}

// ══ LIVE DATE + TIME (from user's device/locale) ══
function updateDateTime() {
    const now = new Date();
    const opts = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short'
    };
    const formatted = now.toLocaleString('en-US', opts).toUpperCase();
    const els = document.querySelectorAll('#live-datetime, .live-datetime-2');
    els.forEach(el => { el.textContent = formatted; });
}
updateDateTime();
setInterval(updateDateTime, 30000); // refresh every 30 seconds

// ══ MASTHEAD HIDE/SHOW ON SCROLL ══
let lastY = 0;
const nav = document.querySelector('.nav');
if (nav) {
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        nav.style.transform = y > lastY && y > 100 ? 'translateY(-100%)' : 'translateY(0)';
        lastY = y;
    }, { passive: true });
}

// ══ SCROLL REVEAL (IntersectionObserver) ══
const rvEls = document.querySelectorAll('.rv');
if (rvEls.length) {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('on'); }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
    rvEls.forEach(el => obs.observe(el));
}

// ══ STATS BAND REVEAL + COUNT-UP ══
function animateCount(el, target, suffix) {
    const dur = 1400;
    const start = performance.now();
    const update = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(ease * target) + suffix;
        if (p < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
}
const statsBand = document.querySelector('.stats-band');
if (statsBand) {
    const statsObs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            statsBand.classList.add('on-view');
            // Count-up for each stat number
            [
                { selector: '.stat:nth-child(1) .stat-n', target: 19, suffix: '+' },
                { selector: '.stat:nth-child(2) .stat-n', target: 3,  suffix: '' },
                { selector: '.stat:nth-child(4) .stat-n', target: 100, suffix: '%' },
            ].forEach(({ selector, target, suffix }) => {
                const el = document.querySelector(selector);
                if (el) animateCount(el, target, suffix);
            });
            // Handle "2×" manually
            const twoX = document.querySelector('.stat:nth-child(3) .stat-n');
            if (twoX) setTimeout(() => { twoX.textContent = '2×'; }, 600);
            statsObs.disconnect();
        }
    }, { threshold: 0.3 });
    statsObs.observe(statsBand);
}

// ══ BLOG CATEGORY FILTER ══
const filterBtns = document.querySelectorAll('.blog-filter');
const blogCards = document.querySelectorAll('#blog-grid .blog-card');
const blogFeatured = document.querySelector('.blog-featured');
if (filterBtns.length) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const cat = btn.dataset.cat;
            // Featured post
            if (blogFeatured) {
                const featCat = blogFeatured.dataset.cat || '';
                blogFeatured.style.display = (cat === 'all' || featCat.includes(cat)) ? '' : 'none';
            }
            // Grid cards
            blogCards.forEach(card => {
                const cardCat = card.dataset.cat || '';
                const show = cat === 'all' || cardCat.includes(cat);
                card.classList.toggle('hidden', !show);
            });
        });
    });
}

// ══ QUIZ LOGIC ══
function selectOpt(el) {
    const q = el.dataset.q;
    document.querySelectorAll(`.quiz-opt[data-q="${q}"]`).forEach(o => o.classList.remove('selected'));
    el.classList.add('selected');
}

function submitQuiz() {
    const answers = {};
    document.querySelectorAll('.quiz-opt.selected').forEach(o => {
        answers[o.dataset.q] = o.dataset.v;
    });
    if (Object.keys(answers).length < 3) {
        alert('Answer all 3 questions first — your results are worth it!');
        return;
    }
    const aCount = Object.values(answers).filter(v => v === 'a').length;
    const cCount = Object.values(answers).filter(v => v === 'c').length;
    let hed, body;
    if (aCount >= 2) {
        hed = 'The Polished Pro';
        body = "Your brand is solid — you know what you're doing. You're probably here for refinement, the next level, or something that takes you from \"good\" to \"people screenshot your website.\" That's our favorite kind of project.";
    } else if (cCount >= 2) {
        hed = 'The Diamond in the Rough';
        body = "Real talk: your brand has potential that isn't showing up for you yet. The good news? The gap between where you are and where you want to be isn't as big as it feels. One quarter with us could change everything.";
    } else {
        hed = 'The Work-in-Progress';
        body = "You've got some things working and some things that need attention — which is honestly the most common (and most rewarding) type of client we work with. You know something's off, you just need someone to help you see it clearly and fix it right.";
    }
    document.getElementById('resultHed').textContent = hed;
    document.getElementById('resultBody').textContent = body;
    document.getElementById('quizResult').classList.add('show');
    document.getElementById('quizForm').style.opacity = '.35';
}

// Make quiz functions globally accessible
window.selectOpt = selectOpt;
window.submitQuiz = submitQuiz;

// ══ INSTAGRAM FEED (curated — swap for live API when ready) ══
(function buildIGFeed() {
    const feed = document.getElementById('ig-feed');
    if (!feed) return;

    const photos = [
        { src: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=320&h=320&fit=crop', alt: 'Brand design session' },
        { src: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=320&h=320&fit=crop', alt: 'Photography setup' },
        { src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=320&h=320&fit=crop', alt: 'Website analytics' },
        { src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=320&h=320&fit=crop', alt: 'Team collaboration' },
        { src: 'https://images.unsplash.com/photo-1634942537034-2531766767d1?w=320&h=320&fit=crop', alt: 'Color palette creation' },
        { src: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=320&h=320&fit=crop', alt: 'Web design in progress' },
        { src: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=320&h=320&fit=crop', alt: 'Video editing' },
        { src: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=320&h=320&fit=crop', alt: 'Coding session' },
    ];

    photos.forEach(p => {
        const a = document.createElement('a');
        a.href = 'https://www.instagram.com/meettheagency/';
        a.target = '_blank';
        a.rel = 'noopener';
        a.style.cssText = 'display:block;aspect-ratio:1;overflow:hidden;position:relative;';

        const img = document.createElement('img');
        img.src = p.src;
        img.alt = p.alt;
        img.loading = 'lazy';
        img.style.cssText = 'width:100%;height:100%;object-fit:cover;transition:transform .4s ease,filter .4s ease;filter:grayscale(.1) contrast(1.05);';
        a.appendChild(img);

        const ov = document.createElement('div');
        ov.style.cssText = 'position:absolute;inset:0;background:rgba(252,24,91,.75);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .3s;';
        ov.innerHTML = '<span style="font-family:\'Barlow Condensed\',sans-serif;font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#fff;">View on IG →</span>';
        a.appendChild(ov);

        a.addEventListener('mouseenter', () => { img.style.transform = 'scale(1.06)'; ov.style.opacity = '1'; });
        a.addEventListener('mouseleave', () => { img.style.transform = 'scale(1)'; ov.style.opacity = '0'; });

        feed.appendChild(a);
    });
})();

console.log('✦ THE AGENCY: System Online.');
