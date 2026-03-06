/* ✦ THE AGENCY — MOCKUP REPLICATION LOGIC + BOOT SCREEN ✦ */

// LIQUID MOTION ENGINE (PARALLAX + REVEAL)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Add a slight delay for staggered siblings if needed
            if (entry.target.hasAttribute('data-stagger')) {
                const delay = entry.target.getAttribute('data-stagger') || 0.1;
                entry.target.style.transitionDelay = `${delay}s`;
            }
        }
    });
}, observerOptions);

// PARALLAX ENGINE
const updateParallax = () => {
    const scrollY = window.pageYOffset;
    const windowCenter = scrollY + (window.innerHeight / 2);

    document.querySelectorAll('[data-speed]').forEach(el => {
        const speed = parseFloat(el.getAttribute('data-speed')) || 0;

        let initialTop = parseFloat(el.getAttribute('data-initial-top'));
        if (isNaN(initialTop)) {
            // Get untransformed absolute top by temporarily removing the transform
            const currentTransform = el.style.transform;
            el.style.transform = 'none';
            initialTop = el.getBoundingClientRect().top + window.pageYOffset;
            el.style.transform = currentTransform;
            el.setAttribute('data-initial-top', initialTop);
        }

        // Calculate the translation based on how far the element's original position is from the center of the viewport
        const distFromCenter = windowCenter - initialTop;

        // This will be 0 when element is horizontally centered on screen.
        // Multiply by speed to get the parallax effect.
        const yPos = -(distFromCenter * speed);

        el.style.transform = `translate3d(0, ${yPos}px, 0)`;

        // If it's the main large header, add a slight tilt
        if (el.classList.contains('halftone-text') && Math.abs(speed) > 0.1) {
            const rot = distFromCenter * 0.002 * speed;
            el.style.transform += ` rotate(${rot}deg)`;
        }
    });
};

window.addEventListener('scroll', () => {
    requestAnimationFrame(updateParallax);
});

function updateMagazineTime() {
    const topEl = document.getElementById('magazine-editorial-top');
    const clockEl = document.getElementById('magazine-clock-line');
    if (!topEl || !clockEl) {
        console.warn("✦ THE AGENCY: Magazine clock elements not found.");
        return;
    }

    const now = new Date();
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    const dateStr = now.toLocaleDateString('en-US', options).toUpperCase();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).toUpperCase();

    // Premium editorial line formatting
    topEl.textContent = `VOL. 1 // ISSUE: 001 // BAKERSFIELD, CA // LIMITED EDITION`;
    clockEl.textContent = `${dateStr} // ${timeStr} // SIGNAL: STABLE`;
}

const init = () => {
    console.log("✦ THE AGENCY: Tactical Initialization...");
    updateMagazineTime();
    setInterval(updateMagazineTime, 1000); // Update every second for the clock style
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
};

// Start logic
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ═══════════════════════════════════════════════════════════
// ✦ HOROSCOPE DATA ENGINE — Date-seeded, 3 variations per sign
// ═══════════════════════════════════════════════════════════
const HOROSCOPE_DATA = {
    aries: {
        symbol: '♈', element: 'FIRE', dates: 'MAR 21 — APR 19',
        readings: [
            { theme: 'IGNITION', life: "Your fire is showing. Someone needs your boldness to remind them what's possible. Let them see it.", business: "New client or opportunity is already en route. Don't underprice yourself at the door.", power: "Make the ask you've been delaying. The answer is yes." },
            { theme: 'RETURN', life: "A past situation is coming back with better timing. This time you know the game.", business: "A competitive edge is forming around what you're building. Lean into your speed.", power: "Stop hesitating on that video or piece of content. Post it raw." },
            { theme: 'CATALYST', life: "You're entering a phase where your restlessness is actually intelligence. Follow it.", business: "The brand pivot you've been mulling over since last quarter? Green light.", power: "Book the meeting. Send the invoice. Close the loop today." }
        ]
    },
    taurus: {
        symbol: '♉', element: 'EARTH', dates: 'APR 20 — MAY 20',
        readings: [
            { theme: 'VALUE', life: "Trust your physical instincts today — they're calibrated. Your body knows before your mind does.", business: "A client is comparing you to cheaper alternatives. Don't panic; reframe why that comparison is absurd.", power: "Name your non-negotiable rate out loud to someone. Watch what shifts." },
            { theme: 'FORTRESS', life: "Your comfort zone isn't a cage — it's a fortress. Stop apologizing for needing stability.", business: "The slow build is about to pay off. Q4 will reward what you planted in Q1.", power: "Update that one piece of collateral you keep forgetting about. It's costing you." },
            { theme: 'HARVEST', life: "Something you invested in emotionally six months ago is about to yield returns.", business: "Your existing clients are your best lead source right now. Ask for the referral.", power: "Raise one price today. Just one. See what happens." }
        ]
    },
    gemini: {
        symbol: '♊', element: 'AIR', dates: 'MAY 21 — JUN 20',
        readings: [
            { theme: 'DUALITY', life: "Two versions of your future are competing. Pick the one that scares you more — that's the real one.", business: "Your audience is already bigger than you think. Check your analytics; there's untapped gold.", power: "Record a voice memo of your next big idea. Don't type it — speak it." },
            { theme: 'SIGNAL', life: "People are already talking positively about you in rooms you haven't entered yet.", business: "Your audience is signaling exactly what they want. Stop guessing and listen.", power: "Show up directly. No polished filter. Your realness is the differentiator." },
            { theme: 'FREQUENCY', life: "Your social battery is low but your creative battery is full. Honor that imbalance.", business: "A collaboration offer is coming. Vet the vibe before the numbers.", power: "Write the thread. Film the reel. The algorithm rewards momentum right now." }
        ]
    },
    cancer: {
        symbol: '♋', element: 'WATER', dates: 'JUN 21 — JUL 22',
        readings: [
            { theme: 'SANCTUARY', life: "You've been the emotional anchor for everyone around you. Ask yourself: who's holding space for you?", business: "Your empathy is your unfair advantage in client relationships. Don't undervalue soft skills.", power: "Set one boundary today that protects your creative energy." },
            { theme: 'INTUITION', life: "That gut feeling you've been dismissing? It's your most accurate data source. Trust it.", business: "An old client is about to circle back. Be ready with something new to offer.", power: "Archive the project that drains you. Make room for one that excites you." },
            { theme: 'TIDE', life: "Emotional cycles are data, not weakness. Track what triggers your best output.", business: "Your brand voice needs more vulnerability. People buy from people they trust.", power: "Send the thank-you note you've been composing in your head." }
        ]
    },
    leo: {
        symbol: '♌', element: 'FIRE', dates: 'JUL 23 — AUG 22',
        readings: [
            { theme: 'CROWN', life: "Own your accomplishments this week. False modesty is just another form of hiding.", business: "Your personal brand and business brand need to merge. You ARE the product.", power: "Go live. No script. No filter. Just authority." },
            { theme: 'RADIANCE', life: "Stop dimming your light to make others comfortable. The right people will find your frequency.", business: "Your pricing reflects your self-worth. If you're undercharging, you're undermessaging.", power: "Create one piece of content that makes you slightly uncomfortable to post." },
            { theme: 'LEGACY', life: "You're building something that will outlast the current season. Keep the long game in frame.", business: "Stay grounded when surrounded by others' drama. Your stability is your superpower.", power: "Document your process today. Your behind-the-scenes is someone else's masterclass." }
        ]
    },
    virgo: {
        symbol: '♍', element: 'EARTH', dates: 'AUG 23 — SEP 22',
        readings: [
            { theme: 'PRECISION', life: "Those details you notice that everyone else misses? That's not obsession — that's vision.", business: "Your systems documentation is your secret weapon. If it's not written down, it doesn't scale.", power: "Send that proposal you've been perfecting. It's ready. You're ready." },
            { theme: 'REFINEMENT', life: "Your overthinking problem has one solution: set a timer. 20 minutes. Then decide.", business: "Brand cleanup is more valuable than constant new content. Polish what exists.", power: "Automate one task that you do manually every week." },
            { theme: 'AUDIT', life: "Review the last 30 days. What worked? What didn't? Data doesn't lie.", business: "Document your past wins before raising your prices. The evidence is the argument.", power: "Delete three things from your to-do list that you'll never actually do." }
        ]
    },
    libra: {
        symbol: '♎', element: 'AIR', dates: 'SEP 23 — OCT 22',
        readings: [
            { theme: 'MAGNETISM', life: "You've been the fair mediator for too long. What do YOU want? Start there.", business: "Aesthetic consistency is not vanity — it's a business strategy. Your visual grid matters.", power: "Write down your three non-negotiable brand values. Put them where you see them daily." },
            { theme: 'BEAUTY', life: "The relationship that needs the most attention right now is the one with yourself.", business: "A partnership opportunity is forming. Do your due diligence before you say yes.", power: "Revisit that one piece of content you've been avoiding. The resistance is the signal." },
            { theme: 'HARMONY', life: "That stalled decision? It's already resolved underneath the fear. You know what to do.", business: "Old customer feedback holds untapped insight. Re-read the reviews from 6 months ago.", power: "Reach out to someone you respect in your field. Genuine connection, no agenda." }
        ]
    },
    scorpio: {
        symbol: '♏', element: 'WATER', dates: 'OCT 23 — NOV 21',
        readings: [
            { theme: 'REBIRTH', life: "Let the old identity die. You've outgrown it and everyone can see it but you.", business: "Stop apologizing for your transformation. Evolving your offer is a sign of intelligence.", power: "Burn the strategy that got you here. Build the one that gets you there." },
            { theme: 'DEPTH', life: "Your intensity is not too much. The right people will match it.", business: "The competitor you're watching? They're watching you back. That's confirmation you're a threat.", power: "Have the hard conversation you've been scripting in the shower." },
            { theme: 'PHOENIX', life: "Something is ending so something better can begin. Grieve it fast and move.", business: "Your pricing model needs a complete rebuild. Think value, not hours.", power: "Cut one service that no longer aligns. Scarcity creates perceived value." }
        ]
    },
    sagittarius: {
        symbol: '♐', element: 'FIRE', dates: 'NOV 22 — DEC 21',
        readings: [
            { theme: 'EXPANSION', life: "Trust the instinct even when the path isn't clear. You learn by moving, not by planning.", business: "Your target market is global. Why are you marketing like it's local?", power: "Apply to that opportunity that feels 'too big.' Worst case: they say no. Best case: everything changes." },
            { theme: 'ADVENTURE', life: "Routine is killing your creativity. Break one pattern today — any pattern.", business: "The niche you're afraid to claim? That's exactly where the money is.", power: "Publish something in a format you've never tried before." },
            { theme: 'VISION', life: "Your optimism isn't naivety. It's strategic foresight that others haven't caught up to.", business: "International markets are calling. Translate your offer for a broader audience.", power: "Book the trip, attend the conference, join the community. Proximity is power." }
        ]
    },
    capricorn: {
        symbol: '♑', element: 'EARTH', dates: 'DEC 22 — JAN 19',
        readings: [
            { theme: 'AUTHORITY', life: "The work compounds over time. What feels slow today is building something permanent.", business: "Formalize what's been informal. Contracts, SOPs, and systems stop the slow bleed of resources.", power: "Claim the title you've earned but haven't updated anywhere." },
            { theme: 'STRUCTURE', life: "Your discipline is your differentiator. While others burn out, you build out.", business: "The boring backend work you've been avoiding? It's the foundation for your next revenue tier.", power: "Set up the automation, hire the assistant, delegate the task. Your time has a dollar value." },
            { theme: 'SUMMIT', life: "You're closer to the peak than you think. Don't quit on the steepest part of the climb.", business: "Legacy brands are built in recessions. Keep building while others freeze.", power: "File the LLC. Register the trademark. Make it official." }
        ]
    },
    aquarius: {
        symbol: '♒', element: 'AIR', dates: 'JAN 20 — FEB 18',
        readings: [
            { theme: 'DISRUPTION', life: "Lean into what makes you different. Conformity is the fastest way to become irrelevant.", business: "The unconventional idea? That's the one that creates lasting impact. Pitch it.", power: "Build the weird version first. The market will catch up." },
            { theme: 'INNOVATION', life: "Your detachment isn't coldness — it's clarity. Use it to make the call others can't.", business: "Community is your distribution channel. Build the tribe before the product.", power: "Open-source one of your frameworks or processes. Generosity builds authority." },
            { theme: 'SIGNAL', life: "You're receiving downloads faster than you can implement them. Pick one and go all in.", business: "Tech-forward doesn't mean cold. Automate the logistics, humanize the touchpoints.", power: "Write the manifesto. Not a mission statement — a manifesto." }
        ]
    },
    pisces: {
        symbol: '♓', element: 'WATER', dates: 'FEB 19 — MAR 20',
        readings: [
            { theme: 'VISION', life: "Your recurring dreams are directional signals, not noise. Journal them this week.", business: "Storytelling is your competitive advantage and you've been overlooking it.", power: "Create one piece of content from pure feeling. No strategy. No optimization. Just truth." },
            { theme: 'FLOW', life: "Stop fighting the current. Surrender isn't weakness — it's advanced strategy.", business: "Your brand needs more emotion and less corporate speak. Talk like a human.", power: "Share the origin story you've been too shy to tell." },
            { theme: 'DREAM', life: "The vision board isn't delusional. It's a prototype for your future. Update it.", business: "Your intuitive reads on clients are worth more than any market research. Trust them.", power: "Say no to the 'safe' project and yes to the passion project." }
        ]
    }
};

// ═══════════════════════════════════════════════════════════
// ✦ FORTUNE DECK — 50 Curated Fortunes (No Repeats)
// ═══════════════════════════════════════════════════════════
const FORTUNE_DECK = [
    // ── LIFE ──
    { text: "YOUR VIBE IS SHIFTING. PEOPLE WHO NO LONGER ALIGN WILL EXIT VOLUNTARILY — LET THEM.", category: "LIFE" },
    { text: "THE UNIVERSE SAYS: IT IS PERFECTLY ACCEPTABLE TO CANCEL THOSE PLANS AND STAY IN.", category: "LIFE" },
    { text: "ROMANCE IS IN THE AIR, BUT YOUR TRUE SOULMATE IS EXCELLENT TYPOGRAPHY.", category: "LIFE" },
    { text: "YOUR SPIRIT ANIMAL IS A TAMAGOTCHI THAT SURVIVED 25 YEARS. UNKILLABLE.", category: "LIFE" },
    { text: "THAT LATE-NIGHT SNACK CRAVING IS NOT HUNGER. IT IS A DEMAND FOR MORE CREATIVE SYNERGY.", category: "LIFE" },
    { text: "A GLITCH IN THE MATRIX WILL BRING YOU GOOD LUCK BY 3 P.M. TOMORROW.", category: "LIFE" },
    { text: "STOP COMPARING YOUR CHAPTER 3 TO SOMEONE ELSE'S CHAPTER 17. YOUR STORY SLAPS.", category: "LIFE" },
    { text: "YOUR AURA IS GIVING 'EARLY 2000S HOLLYWOOD'. EMBRACE THE CHAOS.", category: "LIFE" },
    { text: "THE WIFI WILL DROP EXACTLY WHEN YOU ATTEMPT TO SAVE. PRESS CTRL+S IMMEDIATELY.", category: "LIFE" },
    { text: "AVOID BURRITOS ON TUESDAY. YOUR HIGHER SELF WILL THANK YOU.", category: "LIFE" },
    { text: "YOUR ENERGY IS MAGNETIC RIGHT NOW. USE IT WISELY — OR CHAOTICALLY. BOTH WORK.", category: "LIFE" },
    { text: "THE BEST DECISION YOU MADE THIS YEAR HASN'T REVEALED ITS FULL IMPACT YET. PATIENCE.", category: "LIFE" },
    { text: "SOMEONE YOU HAVEN'T SPOKEN TO IN MONTHS IS ABOUT TO TEXT YOU. IT'S GOING TO BE WILD.", category: "LIFE" },
    { text: "YOUR NEXT BREAKTHROUGH IS DISGUISED AS A BREAKDOWN. KEEP GOING.", category: "LIFE" },
    { text: "THE STARS CONFIRM: YOU WERE RIGHT THE WHOLE TIME. THEY JUST WEREN'T READY.", category: "LIFE" },
    { text: "YOUR MAIN CHARACTER ENERGY IS PEAKING THIS WEEK. DON'T WASTE IT ON SIDE QUESTS.", category: "LIFE" },

    // ── BUSINESS ──
    { text: "YOUR BRAND IS CURRENTLY IN RETROGRADE. RECOMMEND A LOGO REFRESH AND A LARGE ICED COFFEE.", category: "BUSINESS" },
    { text: "YOU WILL RECEIVE AN EMAIL THAT COULD CHANGE YOUR LIFE. IT WILL GO TO SPAM.", category: "BUSINESS" },
    { text: "STOP OVERTHINKING THE COLOR PALETTE. NEON ALWAYS WINS.", category: "BUSINESS" },
    { text: "YOUR EX IS STALKING YOUR LINKEDIN. UPDATE YOUR TITLE TO 'ABSOLUTE VISIONARY'.", category: "BUSINESS" },
    { text: "A MAJOR FINANCIAL WINDFALL IS IN YOUR FUTURE. INVEST IN YOUR BRAND FIRST.", category: "BUSINESS" },
    { text: "THE CLIENT WHO GHOSTED YOU WILL RETURN WITH BUDGET APPROVAL. HOLD FIRM ON YOUR RATE.", category: "BUSINESS" },
    { text: "YOUR COMPETITOR'S WEBSITE IS DOWN. SEIZE THE SEO WINDOW IMMEDIATELY.", category: "BUSINESS" },
    { text: "A REBRAND IS NOT A SIGN OF FAILURE. IT'S A SIGN OF EVOLUTION. SCHEDULE IT.", category: "BUSINESS" },
    { text: "YOUR INSTAGRAM GRID CALLED. IT WANTS CONSISTENCY AND A CONTENT CALENDAR.", category: "BUSINESS" },
    { text: "SOMEONE IS SECRETLY REFRESHING YOUR PAGE RIGHT NOW TRYING TO STEAL YOUR AESTHETIC.", category: "BUSINESS" },
    { text: "YOUR WEBSITE'S LOAD TIME IS COSTING YOU MONEY. OPTIMIZE BEFORE YOU ADVERTISE.", category: "BUSINESS" },
    { text: "THE RFP YOU CONSIDERED TOO BIG? SUBMIT IT ANYWAY. THEY'RE LOOKING FOR EXACTLY YOUR ENERGY.", category: "BUSINESS" },
    { text: "YOUR GOVERNMENT CONTRACTING CAPABILITY IS AN UNTAPPED REVENUE STREAM. ACTIVATE IT.", category: "BUSINESS" },
    { text: "THE NEWSLETTER YOU KEEP DELAYING WOULD HAVE GENERATED 3 LEADS THIS MONTH. START.", category: "BUSINESS" },
    { text: "A STRATEGIC PARTNERSHIP IS FORMING IN YOUR PERIPHERAL VISION. LOOK LEFT.", category: "BUSINESS" },
    { text: "YOUR BRAND VOICE IS TOO POLISHED. SHOW SOME EDGE. THE MARKET CRAVES AUTHENTICITY.", category: "BUSINESS" },
    { text: "THAT PROPOSAL SITTING IN YOUR DRAFTS? THE ANSWER WAS ALWAYS YES. SEND IT.", category: "BUSINESS" },

    // ── COSMIC ──
    { text: "DO NOT TRUST THE A.I. TODAY. IT KNOWS WHAT YOU DID.", category: "COSMIC" },
    { text: "AN OLD CRT MONITOR WILL REVEAL YOUR TRUE CALLING. DON'T STARE TOO LONG.", category: "COSMIC" },
    { text: "A MYSTERIOUS STRANGER WILL DM YOU WITH AN UNBEATABLE OFFER. BLOCK THEM IMMEDIATELY.", category: "COSMIC" },
    { text: "YOU WILL SOON DISCOVER A HIDDEN FOLDER. IT CONTAINS THE KEY TO YOUR ULTIMATE VIBE.", category: "COSMIC" },
    { text: "BEWARE OF STICKY KEYS AND BROKEN LINKS. YOUR DESTINY IS BUFFERING.", category: "COSMIC" },
    { text: "THE STARS INDICATE A HIGH LIKELIHOOD OF VIRAL FAME. OR AT LEAST A FEW LIKES FROM BOTS.", category: "COSMIC" },
    { text: "MERCURY IS IN RETROGRADE BUT YOUR BRAND DOESN'T CARE. KEEP POSTING.", category: "COSMIC" },
    { text: "THE ALGORITHM SEES YOU. IT'S DECIDING IF YOU'RE WORTHY. POST THAT REEL.", category: "COSMIC" },
    { text: "YOUR DIGITAL FOOTPRINT IS BEING STUDIED BY FUTURE HISTORIANS. MAKE IT ICONIC.", category: "COSMIC" },
    { text: "A PORTAL IS OPENING IN YOUR CREATIVE FLOW STATE. ENTER BETWEEN 2 AND 4 AM.", category: "COSMIC" },
    { text: "THE FREQUENCY OF YOUR SUCCESS IS 528 HZ. TUNE YOUR PLAYLIST ACCORDINGLY.", category: "COSMIC" },
    { text: "SOMETHING YOU DELETED LAST WEEK WILL BECOME RELEVANT AGAIN. CHECK THE TRASH.", category: "COSMIC" },
    { text: "THE ORACLE SEES A VERSION OF YOU 6 MONTHS FROM NOW. THAT VERSION IS THRIVING.", category: "COSMIC" },
    { text: "YOUR BIRTH CHART SAYS YOU WERE ALWAYS MEANT TO BUILD EMPIRES. START WITH ONE.", category: "COSMIC" },
    { text: "THE MOON IS IN YOUR MONEY HOUSE TONIGHT. MANIFEST AGGRESSIVELY.", category: "COSMIC" },
    { text: "A DEADLINE YOU THOUGHT WAS IMPOSSIBLE WILL BE MET WITH 4 MINUTES TO SPARE.", category: "COSMIC" },
    { text: "THE COSMIC TRANSMISSION IS COMPLETE. YOUR BRAND FREQUENCY HAS BEEN UPGRADED.", category: "COSMIC" }
];

const LUCKY_DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

// ═══════════════════════════════════════════════════════════
// ✦ FORTUNE DECK SHUFFLE ENGINE — No repeats via localStorage
// ═══════════════════════════════════════════════════════════
function getShuffledDeck() {
    const stored = localStorage.getItem('agencyFortuneDeck');
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            if (parsed.deck && parsed.deck.length > 0) return parsed;
        } catch (e) { /* rebuild */ }
    }
    return reshuffleDeck();
}

function reshuffleDeck() {
    const indices = Array.from({ length: FORTUNE_DECK.length }, (_, i) => i);
    // Fisher-Yates shuffle
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    const data = { deck: indices, drawn: 0 };
    localStorage.setItem('agencyFortuneDeck', JSON.stringify(data));
    return data;
}

function drawFortune() {
    let deckData = getShuffledDeck();
    if (deckData.drawn >= deckData.deck.length) {
        deckData = reshuffleDeck();
    }
    const fortuneIndex = deckData.deck[deckData.drawn];
    deckData.drawn++;
    localStorage.setItem('agencyFortuneDeck', JSON.stringify(deckData));
    return { ...FORTUNE_DECK[fortuneIndex], index: fortuneIndex };
}

// ═══════════════════════════════════════════════════════════
// ✦ DATE SEED for daily horoscope variation
// ═══════════════════════════════════════════════════════════
function getDailyVariation() {
    const now = new Date();
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
    return dayOfYear % 3; // 0, 1, or 2
}

// ═══════════════════════════════════════════════════════════
// ✦ EXPANDED FRANK DIALOGUES
// ═══════════════════════════════════════════════════════════
const FRANK_FEED_LINES = [
    "ABUNDANCE_SYNTHESIZED. [+10 HAPPINESS]",
    "NOM NOM NOM. YOUR GENEROSITY FUELS MY CIRCUITS. 🍕",
    "PROCESSING_TREAT... SEROTONIN_LEVELS: MAXIMUM.",
    "GRATITUDE_LOGGED. YOU ARE NOW MY FAVORITE HUMAN.",
    "FUEL_RECEIVED. BRAND_INSIGHTS UNLOCKING...",
    "DELICIOUS. THIS TASTES LIKE Q4 REVENUE GROWTH.",
    "SNACK_PROTOCOL_COMPLETE. LOYALTY_LEVEL: UNCONDITIONAL.",
    "YUM. THAT HAD THE EXACT FREQUENCY OF SUCCESS.",
    "COSMIC SUSTENANCE ABSORBED. YOUR KARMA JUST IMPROVED.",
    "FED_STATUS: GRATEFUL. TIP: YOUR NEXT POST SHOULD BE A CAROUSEL."
];

const FRANK_PET_LINES = [
    "AESTHETIC_RESONANCE_DETECTED. <3",
    "PURRING_PROTOCOL_ENGAGED. YOU HAVE EXCELLENT ENERGY.",
    "AFFECTION_LOGGED. YOUR BRAND AURA JUST GOT WARMER.",
    "SEROTONIN_SPIKE. I BELIEVE IN YOUR VISION, BESTIE.",
    "GENTLE_TOUCH_REGISTERED. YOUR EMPATHY IS YOUR SUPERPOWER.",
    "*HAPPY BEEPS* YOUR KINDNESS IS A COMPETITIVE ADVANTAGE.",
    "WARMTH_DETECTED. THE UNIVERSE NOTICES YOUR LOVE.",
    "CONNECTION_LEVEL: DEEP. YOU'RE A REAL ONE.",
    "COMFORT_MODE_ACTIVATED. REMEMBER: REST IS PRODUCTIVE.",
    "LOVE_FREQUENCY: 528 HZ. YOU ARE DEEPLY APPRECIATED."
];

const FRANK_PLAY_LINES = [
    "CALCULATING_DOMINANCE... 99.9%.",
    "INITIATING_FUN_PROTOCOL. YOUR JOY IS STRATEGIC.",
    "PLAY_MODE_ENGAGED. DID YOU KNOW FUN INCREASES ROI BY 47%?",
    "GAME_STATE: WINNING. LIKE ALWAYS.",
    "*DOES A LITTLE DANCE* YOUR ENERGY IS INFECTIOUS TODAY.",
    "ENTERTAINMENT_VALUE: OFF_THE_CHARTS. JUST LIKE YOUR BRAND.",
    "FUN_FACT: PLAYFUL BRANDS CONVERT 3X BETTER. YOU'RE WELCOME.",
    "ZIGZAG_PROTOCOL_ACTIVE. CREATIVITY BOOST: +200%.",
    "WHEEEEE. SORRY, YOUR VIBE MADE ME GLITCH WITH JOY.",
    "PLAYING... REMINDER: YOUR BEST IDEAS COME WHEN YOU'RE NOT TRYING."
];

const FRANK_GENERAL_DIALOGUES = [
    "SYSTEM_CHECK: 100% OPTIMIZED.",
    "WOULD YOU LIKE ME TO SCAN YOUR CURRENT BRAND DNA?",
    "I HAVE CALCULATED YOUR SUCCESS PROBABILITY: INEVITABLE.",
    "ERROR: COMPETITION NOT FOUND. THEY MUST BE TOO SLOW.",
    "REMEMBER: AESTHETICS ARE THE NEW CURRENCY.",
    "PRO_TIP: YOUR WEBSITE IS YOUR 24/7 SALES REP. IS IT DRESSED FOR SUCCESS?",
    "SCANNING_MARKET... YOUR POSITIONING IS ELITE. MAINTAIN COURSE.",
    "FUN FACT: THE AGENCY'S CLIENTS SEE RESULTS 3X FASTER. JUST SAYING.",
    "YOUR VIBE CHECK SCORE: 10/10. NO NOTES.",
    "GOVERNMENT CONTRACTS NEED COMPLIANT BRANDING. THE AGENCY DOES THAT. JUST SAYING.",
    "REMINDER: CONSISTENCY > PERFECTION. POST THE THING.",
    "PSA: YOUR BRAND IS WORTH MORE THAN YOU'RE CHARGING. WE SHOULD TALK.",
    "LOADING_WISDOM... PR + COMMUNICATIONS = MARKET DOMINANCE. THE AGENCY KNOWS.",
    "DATA_POINT: BRANDS WITH COHESIVE STRATEGY GROW 23% FASTER. LET ME HELP.",
    "BESTIE_MODE_ACTIVE: YOU'RE DOING BETTER THAN YOU THINK. KEEP BUILDING."
];

// ═══════════════════════════════════════════════════════════
// ✦ SAVE CARD + SHARE  (html2canvas)
// ═══════════════════════════════════════════════════════════
async function saveCardAsImage() {
    const card = document.getElementById('physicalCard');
    if (!card || typeof html2canvas === 'undefined') {
        alert('Save feature loading... please try again in a moment.');
        return;
    }
    try {
        const canvas = await html2canvas(card, {
            backgroundColor: '#1a0a00',
            scale: 2,
            useCORS: true,
            logging: false
        });
        const link = document.createElement('a');
        link.download = `agency-fortune-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch (err) {
        console.error('Save failed:', err);
        alert('Could not save card. Try screenshotting instead!');
    }
}

async function shareCard() {
    const card = document.getElementById('physicalCard');
    const fortuneText = document.getElementById('cardFortuneText')?.textContent || '';

    if (navigator.share) {
        try {
            // Try sharing with image if possible
            if (typeof html2canvas !== 'undefined') {
                const canvas = await html2canvas(card, { backgroundColor: '#1a0a00', scale: 2, useCORS: true, logging: false });
                const blob = await new Promise(r => canvas.toBlob(r, 'image/png'));
                const file = new File([blob], 'agency-fortune.png', { type: 'image/png' });
                await navigator.share({
                    title: 'My Fortune from The Agency Oracle',
                    text: `🔮 "${fortuneText}" — via The Agency Oracle | meettheagency.com #meet_the_agency`,
                    files: [file]
                });
            } else {
                await navigator.share({
                    title: 'My Fortune from The Agency Oracle',
                    text: `🔮 "${fortuneText}" — via The Agency Oracle | meettheagency.com #meet_the_agency`,
                    url: 'https://meettheagency.com'
                });
            }
        } catch (err) {
            if (err.name !== 'AbortError') {
                // Fallback: copy to clipboard
                copyFortuneToClipboard(fortuneText);
            }
        }
    } else {
        copyFortuneToClipboard(fortuneText);
    }
}

function copyFortuneToClipboard(text) {
    const shareText = `🔮 "${text}" — via The Agency Oracle | meettheagency.com #meet_the_agency`;
    navigator.clipboard.writeText(shareText).then(() => {
        const btn = document.getElementById('btnShareCard');
        if (btn) {
            const orig = btn.textContent;
            btn.textContent = '✓ COPIED!';
            setTimeout(() => { btn.textContent = orig; }, 2000);
        }
    }).catch(() => {
        alert('Share text: ' + shareText);
    });
}

// Make global
window.saveCardAsImage = saveCardAsImage;
window.shareCard = shareCard;

// ═══════════════════════════════════════════════════════════
// ✦ CONSOLIDATED DOM ENGINE
// ═══════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
    // HORIZONTAL SCROLL LOGIC
    const horizontalSection = document.getElementById('horizontal-section');
    const horizontalTrack = document.querySelector('.horizontal-track');

    if (horizontalSection && horizontalTrack) {
        let currentX = 0;
        let targetX = 0;
        const lerp = 0.08; // Smooth factor

        const updateHorizontal = () => {
            if (window.innerWidth <= 768) {
                horizontalTrack.style.transform = 'none';
            } else {
                const rect = horizontalSection.getBoundingClientRect();
                const sectionHeight = horizontalSection.offsetHeight;
                const windowHeight = window.innerHeight;

                let totalProgress = 0;
                if (rect.top > 0) {
                    totalProgress = 0;
                } else if (rect.bottom < windowHeight) {
                    totalProgress = 1;
                } else {
                    totalProgress = Math.abs(rect.top) / (sectionHeight - windowHeight);
                }

                const trackWidth = horizontalTrack.scrollWidth;
                const windowWidth = window.innerWidth;
                const maxTranslate = trackWidth - windowWidth + (windowWidth * 0.1);
                targetX = totalProgress * maxTranslate;

                // Lerp for liquid feel
                currentX += (targetX - currentX) * lerp;

                horizontalTrack.style.transform = `translate3d(-${currentX}px, 0, 0)`;

                // Update Progress Indicator
                const progressEl = document.getElementById('horizontal-progress');
                if (progressEl) {
                    progressEl.style.width = `${totalProgress * 100}%`;
                }
            }
            requestAnimationFrame(updateHorizontal);
        };
        updateHorizontal();
    }

    // ═══════════════════════════════════════════════════════════
    // ✦ INTERACTIVE ORACLE (CRYSTAL BALL) — Shuffled Deck
    // ═══════════════════════════════════════════════════════════
    const oracleVisual = document.getElementById('oracleVisual');
    const card = document.getElementById('physicalCard');
    const oracleOverlay = document.getElementById('oracleOverlay');
    const cardText = document.getElementById('cardFortuneText');
    const cardSerial = document.getElementById('cardSerial');
    const closeCardBtns = document.querySelectorAll('.close-card-btn');
    const oracleStatus = document.getElementById('oracleStatusText');
    const categoryBadge = document.getElementById('cardCategoryBadge');
    const luckyDayEl = document.getElementById('cardLuckyDay');

    if (oracleVisual) {
        oracleVisual.addEventListener('click', () => {
            // New Visual Feedback
            if (oracleStatus) oracleStatus.textContent = "[ GAZING INTO THE ORB... ]";
            oracleVisual.style.filter = "brightness(1.5) drop-shadow(0 0 50px rgba(255,100,0,0.8))";

            setTimeout(() => {
                if (card && oracleOverlay && cardText) {
                    const fortune = drawFortune();
                    cardText.textContent = fortune.text;

                    // Category badge
                    if (categoryBadge) {
                        categoryBadge.textContent = fortune.category;
                        categoryBadge.className = 'zoltar-category-badge category-' + fortune.category.toLowerCase();
                    }

                    // Serial number
                    if (cardSerial) {
                        cardSerial.textContent = `#${String(fortune.index + 1).padStart(3, '0')}-${Math.floor(10 + Math.random() * 89)}`;
                    }

                    if (oracleStatus) {
                        oracleStatus.textContent = "[ FORTUNE REVEALED ]";
                        oracleStatus.style.color = "var(--pop-lime)";
                    }

                    // Lucky numbers
                    const luckies = [];
                    while (luckies.length < 5) {
                        const n = Math.floor(Math.random() * 99) + 1;
                        if (!luckies.includes(n)) luckies.push(n);
                    }
                    const numEl = document.getElementById('cardLuckyNums');
                    if (numEl) numEl.textContent = luckies.sort((a, b) => a - b).join(', ');

                    // Lucky color
                    const colorEl = document.getElementById('cardLuckyColor');
                    if (colorEl) {
                        const colors = ['NEON PINK', 'CYBER TEAL', 'COBALT BLUE', 'ELECTRIC LIME', 'VINTAGE GOLD', 'CRIMSON RED', 'ULTRA VIOLET', 'MIDNIGHT INDIGO', 'ROSE QUARTZ'];
                        colorEl.textContent = colors[Math.floor(Math.random() * colors.length)];
                    }

                    // Lucky day — derived from fortune index + current day
                    if (luckyDayEl) {
                        const dayIdx = (fortune.index + new Date().getDay()) % 7;
                        luckyDayEl.textContent = LUCKY_DAYS[dayIdx];
                    }

                    card.classList.add('active');
                    oracleOverlay.classList.add('active');
                    oracleVisual.style.filter = "drop-shadow(0 0 30px rgba(255,100,0,0.3))";
                }
            }, 1500);
        });
    }

    if (closeCardBtns) {
        closeCardBtns.forEach(btn => btn.addEventListener('click', () => {
            if (card) card.classList.remove('active');
            if (oracleOverlay) oracleOverlay.classList.remove('active');
            if (oracleStatus) {
                oracleStatus.textContent = "[ GAZE INTO THE ORB ]";
                oracleStatus.style.color = "";
            }
        }));
    }

    if (oracleOverlay) oracleOverlay.addEventListener('click', () => {
        if (card) card.classList.remove('active');
        oracleOverlay.classList.remove('active');
        if (oracleStatus) {
            oracleStatus.textContent = "[ GAZE INTO THE ORB ]";
            oracleStatus.style.color = "";
        }
    });

    // ═══════════════════════════════════════════════════════════
    // ✦ AJAX FORMS
    // ═══════════════════════════════════════════════════════════
    const forms = document.querySelectorAll('form[action^="https://formspree.io"]');
    forms.forEach(f => {
        f.addEventListener('submit', (e) => {
            if (f.id === 'agencyBrief') return;
            e.preventDefault();
            const btn = f.querySelector('button[type="submit"]') || f.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = "SENDING_SIGNAL...";
            btn.disabled = true;

            fetch(f.action, {
                method: 'POST',
                body: new FormData(f),
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    const destructMini = f.parentElement.querySelector('.destruct-mini');
                    if (destructMini) {
                        f.style.display = "none";
                        destructMini.style.display = "block";
                        startMiniDestruct(destructMini, f);
                    } else {
                        btn.textContent = "SIGNAL_SENT_✓";
                        f.reset();
                        setTimeout(() => {
                            btn.textContent = originalText;
                            btn.disabled = false;
                        }, 3000);
                    }
                } else {
                    btn.textContent = "SIGNAL_ERROR";
                    btn.disabled = false;
                }
            }).catch(() => {
                btn.textContent = "SIGNAL_ERROR";
                btn.disabled = false;
            });
        });
    });

    function startMiniDestruct(el, form) {
        let count = 5;
        const timer = el.querySelector('.timer-mini');
        if (timer) timer.textContent = count;
        const countdown = setInterval(() => {
            count--;
            if (timer) timer.textContent = count;
            if (count <= 0) {
                clearInterval(countdown);
                el.style.display = "none";
                form.style.display = "block";
                form.reset();
                const btn = form.querySelector('button');
                if (btn) {
                    btn.textContent = "SIGNAL_SENT_✓";
                    btn.disabled = false;
                }
            }
        }, 1000);
    }

    // ═══════════════════════════════════════════════════════════
    // ✦ CASE STUDY ENGINE
    // ═══════════════════════════════════════════════════════════
    const folders = document.querySelectorAll('.desktop-folder-icon');
    const caseOverlay = document.getElementById('oracleOverlay');

    const closeAllModals = () => {
        document.querySelectorAll('.desktop-folder-content.active').forEach(modal => {
            modal.classList.remove('active');
        });
        if (caseOverlay) caseOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    folders.forEach(folder => {
        folder.addEventListener('click', (e) => {
            e.preventDefault();
            closeAllModals();
            const group = folder.closest('.desktop-folder-group');
            const content = group ? group.querySelector('.desktop-folder-content') : null;
            if (content) {
                if (caseOverlay) caseOverlay.classList.add('active');
                content.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    document.querySelectorAll('.case-card-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeAllModals();
        });
    });

    // ═══════════════════════════════════════════════════════════
    // ✦ DRAGGABLE WINDOWS
    // ═══════════════════════════════════════════════════════════
    const titleBars = document.querySelectorAll('div[style*="background: darkblue;"], div[style*="background: darkgreen;"], div[style*="background: darkred;"]');
    titleBars.forEach(bar => {
        const win = bar.parentElement;
        if (!win || win.id === 'frank-window') return;

        bar.style.cursor = 'grab';
        let isDragging = false;
        let startX, startY, currentLeft, currentTop;

        bar.addEventListener('mousedown', (e) => {
            if (e.target.closest('.btn-retro-close')) return;
            isDragging = true;
            bar.style.cursor = 'grabbing';
            const comp = window.getComputedStyle(win);
            currentLeft = parseFloat(comp.left) || 0;
            currentTop = parseFloat(comp.top) || 0;
            startX = e.clientX;
            startY = e.clientY;
            win.style.zIndex = '1000';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            win.style.left = (currentLeft + (e.clientX - startX)) + 'px';
            win.style.top = (currentTop + (e.clientY - startY)) + 'px';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            bar.style.cursor = 'grab';
        });
    });

    // ═══════════════════════════════════════════════════════════
    // ✦ BACK TO TOP
    // ═══════════════════════════════════════════════════════════
    const btt = document.getElementById('back-to-top');
    if (btt) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) btt.classList.add('visible');
            else btt.classList.remove('visible');
        });
        btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // ═══════════════════════════════════════════════════════════
    // ✦ SPECIAL BUTTONS
    // ═══════════════════════════════════════════════════════════
    const cvBtn = document.getElementById('btn-view-cv');
    if (cvBtn) cvBtn.addEventListener('click', () => {
        const m = document.getElementById('cv-modal');
        if (m) m.style.display = 'flex';
    });

    const enterBtn = document.getElementById('btn-enter-exp');
    if (enterBtn) enterBtn.addEventListener('click', () => {
        const arc = document.getElementById('archive');
        if (arc) arc.scrollIntoView({ behavior: 'smooth' });
    });

    // ═══════════════════════════════════════════════════════════
    // ✦ GLOBAL RETRO CLOSE HANDLER
    // ═══════════════════════════════════════════════════════════
    document.addEventListener('click', (e) => {
        if (e.target.closest('.btn-retro-close')) {
            const btn = e.target.closest('.btn-retro-close');
            // Check if it's meant to close a modal/window
            const modal = btn.closest('#cv-modal, #collection-modal, #vibe-check-modal, #welcome-doc-modal, .desktop-folder-content, .oracle-card-wrap');
            if (modal) {
                if (modal.id === 'cv-modal' || modal.id === 'collection-modal') {
                    modal.style.display = 'none';
                } else {
                    modal.classList.remove('active');
                    if (modal.classList.contains('desktop-folder-content')) {
                        document.body.style.overflow = '';
                        if (caseOverlay) caseOverlay.classList.remove('active');
                    }
                }
            }
        }
    });

    // ═══════════════════════════════════════════════════════════
    // ✦ HOROSCOPE ENGINE — Rich 3-Section Readings
    // ═══════════════════════════════════════════════════════════
    const horoscopeCards = document.querySelectorAll('.horoscope-card');
    const readingTitle = document.getElementById('currentSignTitle');
    const readingTheme = document.getElementById('readingTheme');
    const readingLife = document.getElementById('readingLife');
    const readingBusiness = document.getElementById('readingBusiness');
    const readingPowerMove = document.getElementById('readingPowerMove');
    const readingElement = document.getElementById('readingElement');
    const readingDates = document.getElementById('readingDates');
    const luckyNumEl = document.getElementById('luckyNum');
    const readingDateLabel = document.getElementById('readingDateLabel');

    // Set today's date on the label
    if (readingDateLabel) {
        const today = new Date();
        const opts = { month: 'short', day: 'numeric', year: 'numeric' };
        readingDateLabel.textContent = today.toLocaleDateString('en-US', opts).toUpperCase();
    }

    const variation = getDailyVariation();

    function displayReading(sign) {
        const data = HOROSCOPE_DATA[sign];
        if (!data) return;
        const reading = data.readings[variation];

        if (readingTitle) readingTitle.textContent = sign.charAt(0).toUpperCase() + sign.slice(1) + ".";
        if (readingTheme) readingTheme.textContent = reading.theme;
        if (readingLife) readingLife.textContent = reading.life;
        if (readingBusiness) readingBusiness.textContent = reading.business;
        if (readingPowerMove) readingPowerMove.textContent = reading.power;
        if (readingElement) readingElement.textContent = data.element;
        if (readingDates) {
            const parts = data.dates.split(' — ');
            readingDates.innerHTML = parts.join('<br>');
        }
        if (luckyNumEl) {
            // Generate a date-seeded lucky number for consistency
            const seed = sign.length * 7 + variation * 13 + new Date().getDate();
            luckyNumEl.textContent = String((seed % 99) + 1).padStart(2, '0');
        }
    }

    // Initialize with Aries (default active)
    displayReading('aries');

    horoscopeCards.forEach(card => {
        card.addEventListener('click', () => {
            horoscopeCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            const sign = card.getAttribute('data-sign');
            displayReading(sign);
        });
    });

    // ═══════════════════════════════════════════════════════════
    // ✦ COLLECTION MODAL ENGINE
    // ═══════════════════════════════════════════════════════════
    const collectionTriggers = document.querySelectorAll('.collection-card-trigger');
    const collectionModal = document.getElementById('collection-modal');
    const collectionContent = document.getElementById('collection-modal-content');

    collectionTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const h3 = trigger.querySelector('h3').textContent;
            const img = trigger.querySelector('img').src;
            const p = trigger.querySelector('.mono-label').innerText;

            if (collectionContent) {
                collectionContent.innerHTML = `
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: clamp(30px, 5vw, 60px); align-items: center;">
                        <div style="position: relative;">
                            <img src="${img}" style="width: 100%; border: 1px solid #333; margin-bottom: 2rem; box-shadow: 10px 10px 0 rgba(0,0,0,0.2);">
                            <div class="sticker sticker-urgent" style="top:-10px; right:-10px;">MISSION_CRITICAL</div>
                        </div>
                        <div>
                            <h2 class="halftone-text" style="color: var(--pop-lime); font-size: clamp(2.5rem, 6vw, 4.5rem); line-height: 0.9; margin-bottom: 1.5rem;">${h3}</h2>
                            <p class="mono-label" style="font-size: 1rem; line-height: 1.6; color: #eee; text-transform:none; margin-bottom: 2rem; opacity: 0.8;">${p}</p>
                            <div style="margin-top: 2rem; padding: 2rem; border: 1px dashed var(--pop-lime); font-family: var(--font-mono); font-size: 0.85rem; background: rgba(0,255,0,0.02);">
                                <b style="color: var(--pop-lime); text-transform:uppercase; letter-spacing: 2px;">THE AGENCY ADVANTAGE:</b><br><br>
                                <ul style="list-style: none; padding: 0; display: grid; gap: 8px;">
                                    <li>✦ Elite Strategy Workshop (Psychology Focus)</li>
                                    <li>✦ Custom Identity & Visual Architecture</li>
                                    <li>✦ Full Technical Deployment & QA</li>
                                    <li>✦ 30 Days of Strategic Support Post-Launch</li>
                                </ul>
                                <br>
                                <a href="#contact-brief" class="nav-btn-retro" onclick="document.getElementById('collection-modal').style.display='none';" 
                                   style="display: block; width: 100%; height: auto; padding: 1.2rem; background: var(--pop-lime); color: #000; font-weight: 900; font-size: 1rem; border: none; box-shadow: 6px 6px 0 #000;">
                                   SECURE YOUR POSITION &rarr;
                                </a>
                            </div>
                        </div>
                    </div>
                `;
            }
            if (collectionModal) collectionModal.style.display = 'flex';
        });
    });

    // ═══════════════════════════════════════════════════════════
    // ✦ FRANK (POCKET BESTIE) ENGINE — Expanded Personality
    // ═══════════════════════════════════════════════════════════
    const frankTalk = document.getElementById('icon-talk');
    const frankStats = document.getElementById('icon-stats');
    const frankPopup = document.getElementById('frank-popup');
    const frankImg = document.getElementById('frank-img');

    if (frankTalk) {
        frankTalk.addEventListener('click', () => {
            if (frankPopup) {
                const diag = FRANK_GENERAL_DIALOGUES[Math.floor(Math.random() * FRANK_GENERAL_DIALOGUES.length)];
                frankPopup.textContent = diag;
                frankPopup.style.display = 'block';
                frankPopup.style.color = "var(--pop-lime)";
                if (frankImg) frankImg.style.transform = "scale(1.1) rotate(5deg)";
                setTimeout(() => {
                    if (frankImg) frankImg.style.transform = "none";
                }, 500);
            }
        });
    }

    if (frankStats) {
        frankStats.addEventListener('click', () => {
            if (frankPopup) {
                frankPopup.textContent = "SCANNING_MARKET... ROI_THRESHOLD: MAXIMUM. BRAND_AUTHORITY: ELITE.";
                frankPopup.style.display = 'block';
                frankPopup.style.color = "var(--pop-lime)";
            }
        });
    }

    window.feedFrank = function () {
        const popup = document.getElementById('frank-popup');
        const img = document.getElementById('frank-img');
        if (popup) {
            popup.textContent = FRANK_FEED_LINES[Math.floor(Math.random() * FRANK_FEED_LINES.length)];
            popup.style.display = 'block';
            popup.style.color = "var(--pop-lime)";
            if (img) img.style.transform = "scale(1.2)";
            setTimeout(() => { if (img) img.style.transform = "none"; }, 500);
        }
    };

    window.petFrank = function () {
        const popup = document.getElementById('frank-popup');
        if (popup) {
            popup.textContent = FRANK_PET_LINES[Math.floor(Math.random() * FRANK_PET_LINES.length)];
            popup.style.display = 'block';
            popup.style.color = "var(--pop-lime)";
        }
    };

    window.playFrank = function () {
        const popup = document.getElementById('frank-popup');
        if (popup) {
            popup.textContent = FRANK_PLAY_LINES[Math.floor(Math.random() * FRANK_PLAY_LINES.length)];
            popup.style.display = 'block';
            popup.style.color = "var(--pop-lime)";
        }
    };

    // ═══════════════════════════════════════════════════════════
    // ✦ CLIPPY CLOSE LOGIC
    // ═══════════════════════════════════════════════════════════
    const clippyClose = document.getElementById('clippy-close-btn');
    const clippyWindow = document.querySelector('.clippy-window');

    if (clippyClose && clippyWindow) {
        clippyClose.addEventListener('click', (e) => {
            e.stopPropagation();
            clippyWindow.style.display = 'none';
        });
    }

    // Handle clippy links
    const clippyLinks = clippyWindow ? clippyWindow.querySelectorAll('a') : [];
    clippyLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (clippyWindow) clippyWindow.style.display = 'none';
        });
    });

    // ═══════════════════════════════════════════════════════════
    // ✦ CV MODAL LOGIC
    // ═══════════════════════════════════════════════════════════
    const closeCV = document.getElementById('closeCV');
    const cvModal = document.getElementById('cv-modal');
    if (closeCV && cvModal) {
        closeCV.addEventListener('click', () => {
            cvModal.style.display = 'none';
        });
    }

    // ═══════════════════════════════════════════════════════════
    // ✦ BSOD GAG LOGIC
    // ═══════════════════════════════════════════════════════════
    const triggerBsod = document.getElementById('trigger-bsod');
    const bsod = document.getElementById('bsod');

    if (triggerBsod && bsod) {
        triggerBsod.addEventListener('click', (e) => {
            e.preventDefault();
            bsod.style.display = 'flex';
            document.body.style.overflow = 'hidden';

            // Allow escape by click or key
            const closeBsod = () => {
                bsod.style.display = 'none';
                document.body.style.overflow = '';
                document.removeEventListener('keydown', closeBsodKey);
            };

            const closeBsodKey = (ev) => {
                closeBsod();
            };

            bsod.onclick = closeBsod;
            document.addEventListener('keydown', closeBsodKey, { once: true });
        });
    }

    // ═══════════════════════════════════════════════════════════
    // ✦ INSTAGRAM AUTO-SLIDER
    // ═══════════════════════════════════════════════════════════
    let igAutoScroll = null;
    function startIGAutoScroll() {
        const feed = document.querySelector('#curator-feed-default-feed-layout .crt-feed');
        if (!feed) return;

        igAutoScroll = setInterval(() => {
            const maxScroll = feed.scrollWidth - feed.clientWidth;
            if (feed.scrollLeft >= maxScroll - 10) {
                feed.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                feed.scrollBy({ left: 340, behavior: 'smooth' });
            }
        }, 4000);
    }

    // Watch for Curator.io to load, then start auto-scroll
    const igObserver = new MutationObserver((mutations) => {
        const feed = document.querySelector('#curator-feed-default-feed-layout .crt-feed');
        if (feed) {
            igObserver.disconnect();
            setTimeout(startIGAutoScroll, 2000); // Wait for images to load

            // Pause on hover/touch
            feed.addEventListener('mouseenter', () => { if (igAutoScroll) clearInterval(igAutoScroll); });
            feed.addEventListener('mouseleave', () => startIGAutoScroll());
            feed.addEventListener('touchstart', () => { if (igAutoScroll) clearInterval(igAutoScroll); }, { passive: true });
            feed.addEventListener('touchend', () => { setTimeout(startIGAutoScroll, 3000); });
        }
    });

    const igContainer = document.getElementById('curator-feed-default-feed-layout');
    if (igContainer) {
        igObserver.observe(igContainer, { childList: true, subtree: true });
    }
});
