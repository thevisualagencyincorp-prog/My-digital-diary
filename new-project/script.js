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
                { selector: '.stat:nth-child(2) .stat-n', target: 3, suffix: '' },
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

// ══ INSTAGRAM FEED (auto-sliding carousel) ══
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

    function createSlide(p) {
        const a = document.createElement('a');
        a.href = 'https://www.instagram.com/meet_the_agency/';
        a.target = '_blank';
        a.rel = 'noopener';
        a.style.cssText = 'display:block;width:220px;height:220px;flex-shrink:0;overflow:hidden;position:relative;border-radius:10px;';

        const img = document.createElement('img');
        img.src = p.src;
        img.alt = p.alt;
        img.loading = 'lazy';
        img.style.cssText = 'width:100%;height:100%;object-fit:cover;transition:transform .4s ease,filter .4s ease;filter:grayscale(.1) contrast(1.05);';
        a.appendChild(img);

        const ov = document.createElement('div');
        ov.style.cssText = 'position:absolute;inset:0;background:rgba(252,24,91,.75);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .3s;border-radius:10px;';
        ov.innerHTML = '<span style="font-family:\'Barlow Condensed\',sans-serif;font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#fff;">View on IG →</span>';
        a.appendChild(ov);

        a.addEventListener('mouseenter', () => { img.style.transform = 'scale(1.06)'; ov.style.opacity = '1'; });
        a.addEventListener('mouseleave', () => { img.style.transform = 'scale(1)'; ov.style.opacity = '0'; });

        return a;
    }

    // Build slides (duplicate for infinite scroll)
    [...photos, ...photos].forEach(p => feed.appendChild(createSlide(p)));
})();


// ══ SELF-DESTRUCT FORM SUBMISSION ══
function runSelfDestruct(overlay, form, btn, origText) {
    const countdownEl = overlay.querySelector('.sd-countdown');
    let count = 5;

    // Kick off at 5, tick down every 900ms
    const tick = setInterval(() => {
        count--;

        if (countdownEl) {
            // Remove + re-add class to restart animation
            countdownEl.classList.remove('pop');
            void countdownEl.offsetWidth; // reflow to restart animation
            countdownEl.classList.add('pop');

            if (count > 0) {
                countdownEl.textContent = count;
            } else {
                countdownEl.textContent = '✦';
                clearInterval(tick);

                // Glitch + dissolve after a beat
                setTimeout(() => {
                    overlay.classList.add('self-destruct');

                    // After animation completes, reset everything
                    setTimeout(() => {
                        overlay.classList.remove('show', 'self-destruct');
                        form.reset();
                        btn.textContent = origText;
                        btn.disabled = false;
                    }, 1200);
                }, 600);
            }
        }
    }, 900);
}

function initBriefForm(formEl) {
    if (!formEl) return;
    const successEl = formEl.querySelector('.brief-success');
    if (!successEl) return;

    formEl.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = formEl.querySelector('.bf-submit');
        const origText = btn.textContent;

        btn.textContent = 'Sending...';
        btn.disabled = true;

        try {
            const res = await fetch(formEl.action, {
                method: 'POST',
                body: new FormData(formEl),
                headers: { 'Accept': 'application/json' }
            });

            if (res.ok) {
                // Reset countdown display to 5 before showing
                const countdownEl = successEl.querySelector('.sd-countdown');
                if (countdownEl) countdownEl.textContent = '5';

                successEl.classList.add('show');
                runSelfDestruct(successEl, formEl, btn, origText);
            } else {
                btn.textContent = 'Something went wrong — try again';
                btn.disabled = false;
            }
        } catch {
            btn.textContent = 'Connection error — try again';
            btn.disabled = false;
        }
    });
}
// Init both forms
document.querySelectorAll('.brief-form').forEach(initBriefForm);

// ══ BACK TO TOP BUTTON ══
const backToTopBtn = document.getElementById('backToTop');
if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

console.log('✦ THE AGENCY: System Online.');

// ══ CURSOR-FOLLOWING GLOW ══
const cursorGlow = document.getElementById('cursor-glow');
const heroSection = document.querySelector('.hero');
if (cursorGlow && heroSection) {
    let glowActive = false;
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Only show glow when near the hero section
        const heroRect = heroSection.getBoundingClientRect();
        const inHero = e.clientY < heroRect.bottom + 200;
        if (inHero && !glowActive) {
            glowActive = true;
            cursorGlow.style.opacity = '1';
        } else if (!inHero && glowActive) {
            glowActive = false;
            cursorGlow.style.opacity = '0';
        }
    });

    // Smooth follow with requestAnimationFrame
    function updateGlow() {
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';
        requestAnimationFrame(updateGlow);
    }
    requestAnimationFrame(updateGlow);
}

// ══ PARALLAX ON SCROLL ══
const heroMedia = document.querySelector('.hero-media img');
const founderOvals = document.querySelectorAll('.founder-oval');
const aboutBlob = document.querySelector('.about-blob');

function updateParallax() {
    const scrollY = window.scrollY;

    // Hero image parallax (subtle)
    if (heroMedia) {
        const heroRect = heroMedia.closest('.hero').getBoundingClientRect();
        if (heroRect.bottom > 0 && heroRect.top < window.innerHeight) {
            const progress = -heroRect.top / window.innerHeight;
            heroMedia.style.transform = `translateY(${progress * 40}px) scale(1.05)`;
        }
    }

    // About blob parallax
    if (aboutBlob) {
        const aboutRect = aboutBlob.getBoundingClientRect();
        if (aboutRect.bottom > 0 && aboutRect.top < window.innerHeight) {
            const progress = (aboutRect.top - window.innerHeight) / (window.innerHeight * 2);
            aboutBlob.style.transform = `translateY(${progress * -30}px)`;
        }
    }

    // Founder ovals parallax (slight float)
    founderOvals.forEach((oval, i) => {
        const rect = oval.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
            const progress = (rect.top - window.innerHeight * 0.5) / window.innerHeight;
            const dir = i % 2 === 0 ? 1 : -1;
            oval.style.transform = `translateY(${progress * 20 * dir}px) rotate(${dir * -1.4}deg)`;
        }
    });

    requestAnimationFrame(updateParallax);
}
requestAnimationFrame(updateParallax);

// ══ GALLERY CARD STAGGERED ENTRANCE ══
const galleryCards = document.querySelectorAll('.gallery-card');
if (galleryCards.length) {
    const galleryObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('on');
                galleryObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    galleryCards.forEach(card => galleryObs.observe(card));
}

// ══ SECTION HEADING UNDERLINE REVEAL ══
const sectionHeds = document.querySelectorAll('.section-hed');
if (sectionHeds.length) {
    const hedObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('on');
                hedObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    sectionHeds.forEach(hed => hedObs.observe(hed));
}

// ══ IMAGE REVEAL ON SCROLL ══
const imgReveals = document.querySelectorAll('.img-reveal');
if (imgReveals.length) {
    const imgObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('on');
                imgObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    imgReveals.forEach(el => imgObs.observe(el));
}

// ══ MAGNETIC BUTTON HOVER ══
document.querySelectorAll('.btn-pk, .btn-lime, .btn-outline').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
    });
});

// ══ TILT EFFECT ON SERVICE CARDS ══
document.querySelectorAll('.svc-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-7px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ══ SMOOTH NAV LINK SCROLL ══
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
