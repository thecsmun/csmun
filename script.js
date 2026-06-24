
console.log('%c🇺🇳 CSMUN 2026 | Deliberate. Decide. Deliver.', 'font-size:24px;font-weight:bold;color:#facc15;');
console.log('%cBuilt with ❤️ by Sailesh, Jaswanth, Vedansh and Rishith', 'font-size:14px;color:#99a1af;');
console.log('%c🐛 Found something broken? Congrats — you\'re now QA. Fix it or tweet at us.', 'font-size:12px;color:#6b7280;font-style:italic;');




// ---- 3D TILT CARDS + MOUSE TRACKING GLOW (RAF-throttled) ----
document.querySelectorAll('.committee-card, .stat-card').forEach(card => {
    let ticking = false;
    card.addEventListener('mousemove', (e) => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(() => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -10;
                const rotateY = ((x - centerX) / centerX) * 10;
                card.style.setProperty('--rotate-x', `${rotateX}deg`);
                card.style.setProperty('--rotate-y', `${rotateY}deg`);
                card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
                card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
                ticking = false;
            });
        }
    });
    card.addEventListener('mouseleave', () => {
        card.style.setProperty('--rotate-x', '0deg');
        card.style.setProperty('--rotate-y', '0deg');
    });
});

// ---- Debounce helper ----
function debounce(fn, ms) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), ms);
    };
}

// ---- Throttle with requestAnimationFrame ----
function rafThrottle(fn) {
    let ticking = false;
    return function(...args) {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(() => {
                fn(...args);
                ticking = false;
            });
        }
    };
}

// ---- Navbar Scroll Effect - FIXED VERSION ----
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');
const progressBar = document.getElementById('progressBar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const handleScroll = rafThrottle(() => {
    const scrollY = window.scrollY;
    const docHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    
    // Show navbar immediately on all pages
    navbar.classList.add('visible');
    
    // Navbar background
    navbar.classList.toggle('scrolled', scrollY > 50);
    
    // Progress bar
    if (progressBar) {
        progressBar.style.width = ((scrollY / docHeight) * 100) + '%';
    }
    
    // Back to top button
    if (backToTop) {
        backToTop.classList.toggle('show', scrollY > 300);
    }
    
    // Active nav link - IMPROVED LOGIC
    let current = '';
    for (const section of sections) {
        const sectionTop = section.offsetTop - 100; // 100px offset for navbar
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollY >= sectionTop && scrollY < sectionBottom) {
            current = section.getAttribute('id');
            break;
        }
    }
    
    for (const link of navLinks) {
        const href = link.getAttribute('href');
        if (href && href.includes('#')) {
            const targetId = href.split('#')[1];
            link.classList.toggle('active', targetId === current);
        }
    }
});

window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll(); // Initialize

// ---- Smooth Scroll ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 136; // navbar + ticker height
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// ---- Countdown Timer with flip animation on change ----
const countdownDate = new Date("Jul 2, 2026 09:00:00").getTime();

function triggerCountdownFlip(el) {
    el.classList.remove('flip');
    // Force reflow to restart animation
    void el.offsetWidth;
    el.classList.add('flip');
}

function updateCountdown() {
    const now = Date.now();
    const distance = countdownDate - now;

    if (distance <= 0) {
        const gc = document.querySelector('.glass-card');
        if (gc) gc.innerHTML = "<h2 style='color: var(--gold);'>🎉 The CS MUN 4.0 2026 IS LIVE! 🎉</h2>";
        return;
    }

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");
    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    const newDays = String(Math.floor(distance / 86400000)).padStart(2, '0');
    const newHours = String(Math.floor((distance % 86400000) / 3600000)).padStart(2, '0');
    const newMinutes = String(Math.floor((distance % 3600000) / 60000)).padStart(2, '0');
    const newSeconds = String(Math.floor((distance % 60000) / 1000)).padStart(2, '0');

    // Update and flip if changed
    if (daysEl.textContent !== newDays) {
        daysEl.textContent = newDays;
        triggerCountdownFlip(daysEl);
    }
    if (hoursEl.textContent !== newHours) {
        hoursEl.textContent = newHours;
        triggerCountdownFlip(hoursEl);
    }
    if (minutesEl.textContent !== newMinutes) {
        minutesEl.textContent = newMinutes;
        triggerCountdownFlip(minutesEl);
    }
    if (secondsEl.textContent !== newSeconds) {
        secondsEl.textContent = newSeconds;
        triggerCountdownFlip(secondsEl);
    }
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ---- Scroll Reveal Animations (Intersection Observer) ----
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
const revealObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    }
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

for (const el of revealElements) revealObserver.observe(el);

// Cards staggered reveal
document.querySelectorAll('.committee-card, .itinerary-card, .secretariat-card, .eb-card, .policy-card').forEach((card, i) => {
    card.classList.add('reveal');
    if (i < 5) card.classList.add('reveal-delay-' + (i + 1));
    revealObserver.observe(card);
});

// ---- Animated Stats Counter (Enhanced with easeOutExpo) ----
function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 2000;
    const start = performance.now();
    
    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target;
    }
    requestAnimationFrame(update);
}

const statObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
        if (entry.isIntersecting) {
            const nums = entry.target.querySelectorAll('.stat-number');
            for (const n of nums) animateCounter(n);
            statObserver.unobserve(entry.target);
        }
    }
}, { threshold: 0.3 });

const statsSection = document.querySelector('.stats-section');
if (statsSection) statObserver.observe(statsSection);

// ---- Hamburger Menu Toggle ----
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger && navMenu) {
    function toggleMenu(forceClose = false) {
        const isOpen = navMenu.classList.contains('open');
        if (forceClose && !isOpen) return;
        
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('open');
        document.body.classList.toggle('menu-open');
    }

    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Close menu when a nav link is clicked
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu(true);
        });
    });

    // Close menu on outside click / tap backdrop
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('open') &&
            !navMenu.contains(e.target) &&
            !hamburger.contains(e.target)) {
            toggleMenu(true);
        }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('open')) {
            toggleMenu(true);
        }
    });
}

// ---- Back to Top Click + chime ----
if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ---- FAQ Accordion + subtle chime ----
document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item.active').forEach(a => a.classList.remove('active'));
        if (!isActive) item.classList.add('active');
    });
});

// ---- Button Ripple Effect ----
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.style.cssText = `position:absolute;border-radius:50%;background:rgba(255,255,255,0.3);transform:scale(0);animation:rippleAnim 0.6s ease-out;pointer-events:none;width:100px;height:100px;left:${e.clientX - rect.left - 50}px;top:${e.clientY - rect.top - 50}px;`;
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// ---- MAGNETIC BUTTON EFFECT (RAF-throttled) ----
document.querySelectorAll('.btn-primary, .btn-secondary, .btn-download').forEach(btn => {
    let ticking = false;
    btn.addEventListener('mousemove', (e) => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(() => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.05)`;
                ticking = false;
            });
        }
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.removeProperty('transform');
    });
});

// Inject ripple keyframe if not exists
if (!document.getElementById('rippleStyle')) {
    const style = document.createElement('style');
    style.id = 'rippleStyle';
    style.textContent = '@keyframes rippleAnim {to{transform:scale(3);opacity:0}}';
    document.head.appendChild(style);
}

// ---- Preloader ----
const preloader = document.getElementById('preloader');
if (preloader) {
    function hidePreloader() {
        if (preloader.classList.contains('hidden')) return;
        preloader.classList.add('hidden');
        setTimeout(() => { preloader.style.display = 'none'; }, 700);
        setTimeout(initTypewriter, 800);
    }
    setTimeout(hidePreloader, 2200);
    window.addEventListener('load', hidePreloader);
}



// ---- Registration Form Handler ----
const registrationForm = document.getElementById('registrationForm');
const formStatus = document.getElementById('form-status');

if (registrationForm) {
    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const name = formData.get('fullName');
        
        // Simulate form submission
        formStatus.style.color = 'var(--gold)';
        formStatus.textContent = 'Submitting...';
        
        setTimeout(() => {
            formStatus.style.color = '#22c55e'; // A nice green
            formStatus.innerHTML = `Thank you, ${name}! Your registration has been received. We will be in touch shortly.`;
            this.reset();
        }, 1500);
    });
}

// ---- Easter egg: click "Guide to MUN" title 3 times ----
let eggClicks = 0;
const eggTitle = document.getElementById('easterEgg');
if (eggTitle) {
    eggTitle.style.cursor = 'pointer';
    eggTitle.addEventListener('click', () => {
        eggClicks++;
        if (eggClicks === 3) {
            eggClicks = 0;
            const msgs = [
                '🕊️ "Diplomacy is the art of letting someone else have your way." — Lester B. Pearson',
                '🌍 "The UN wasn\'t built to bring us to heaven, but to save us from hell." — Dag Hammarskjöld',
                '🎤 "In MUN, you don\'t just speak — you represent. That changes how you say things."'
            ];
            const msg = msgs[Math.floor(Math.random() * msgs.length)];
            const el = document.createElement('div');
            el.style.cssText = `position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.95);color:var(--gold, #facc15);padding:1rem 2rem;border-radius:1rem;border:1px solid rgba(250,204,21,0.3);z-index:99999;font-size:1rem;max-width:600px;text-align:center;font-family:'Inter',sans-serif;box-shadow:0 0 40px rgba(250,204,21,0.2);animation:fadeInUp 0.5s ease;`;
            el.textContent = msg;
            document.body.appendChild(el);
            setTimeout(() => { el.style.transition = 'opacity 0.5s'; el.style.opacity = '0'; setTimeout(() => el.remove(), 500); }, 4000);
        }
    });
}



// =============================================
// 3D ENHANCED FEATURES (Friend's Additions)
// =============================================



let typewriterRunning = false;
function initTypewriter() {
 if (typewriterRunning) return;
 typewriterRunning = true;
 const lines = document.querySelectorAll('.typewriter-line');
 const cursor = document.querySelector('.typewriter-cursor');
 if (!lines.length) return;
 let lineIndex = 0;
 let charIndex = 0;
 let isTyping = false;
 function typeLine() {
 if (lineIndex >= lines.length) {
 if (cursor) cursor.classList.add('idle');
 return;
 }
 const line = lines[lineIndex];
 const text = line.getAttribute('data-text');
 if (!isTyping) {
 isTyping = true;
 line.classList.add('visible');
 }
 if (charIndex < text.length) {
 line.textContent = text.substring(0, charIndex + 1);
 charIndex++;
 setTimeout(typeLine, 40 + Math.random() * 30);
 } else {
 isTyping = false;
 charIndex = 0;
 lineIndex++;
 setTimeout(typeLine, 500);
 }
 }
 setTimeout(typeLine, 1600);
}

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
 || window.innerWidth <= 768;



let currentMouseX = 0, currentMouseY = 0;
function update3DParallax() {
 if (isMobile) return;
 if (window.scrollY > window.innerHeight) return;
 const normalizedX = (currentMouseX / window.innerWidth - 0.5) * 2;
 const normalizedY = (currentMouseY / window.innerHeight - 0.5) * 2;
 const skylineLayers = document.querySelectorAll('.skyline-layer');
 skylineLayers.forEach((layer, index) => {
 const depth = index === 0 ? -50 : index === 1 ? -20 : 0;
 const rotateY = normalizedX * (depth / 5);
 const rotateX = -normalizedY * (depth / 5);
 layer.style.transform = `translateZ(${depth}px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
 });
}
if (!isMobile) {
 document.addEventListener('mousemove', (e) => {
 currentMouseX = e.clientX;
 currentMouseY = e.clientY;
 });
}


// ==================== HORIZONTAL SCROLLING ROADMAP ==================== 

const roadmapSection = document.querySelector('.committees-roadmap-section');
const roadmapWrapper = roadmapSection ? document.getElementById('roadmapWrapper') : null;
const roadmapTrack = roadmapSection ? document.getElementById('roadmapTrack') : null;
const roadmapCards = roadmapSection ? document.querySelectorAll('.roadmap-card') : [];
const roadmapProgress = roadmapSection ? document.getElementById('roadmapProgress') : null;
const scrollHint = roadmapSection ? document.getElementById('scrollHint') : null;

if (roadmapSection && roadmapTrack && roadmapCards && roadmapCards.length > 0) {
 const totalCards = roadmapCards.length;
 
 function updateRoadmap() {
 const sectionTop = roadmapSection.offsetTop;
 const sectionHeight = roadmapSection.offsetHeight;
 const scrollY = window.scrollY;
 
 // Calculate scroll progress through the section
 const scrollProgress = (scrollY - sectionTop) / sectionHeight;
 const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
 
 // Update progress bar
 if (roadmapProgress) {
 roadmapProgress.style.width = (clampedProgress * 100) + '%';
 }
 
 // Hide scroll hint after first scroll
 if (scrollHint && clampedProgress > 0.05) {
 scrollHint.classList.add('hidden');
 }
 
 // Calculate which card should be active
 const activeIndex = Math.floor(clampedProgress * totalCards);
 const clampedIndex = Math.min(activeIndex, totalCards - 1);
 
 // Horizontal scroll distance with HAIRPIN BENDS
 // Cards 0-2 move left, card 3 turns back right, cards 4-5 move left again
 let translateX = 0;
 
 if (clampedIndex === 0) {
 translateX = 0;
 } else if (clampedIndex === 1) {
 translateX = -100; // Move left
 } else if (clampedIndex === 2) {
 translateX = -200; // Continue left
 } else if (clampedIndex === 3) {
 translateX = -150; // HAIRPIN BEND - move back right
 } else if (clampedIndex === 4) {
 translateX = -250; // Move left again
 } else if (clampedIndex === 5) {
 translateX = -350; // Final position
 }
 
 roadmapTrack.style.transform = `translateX(${translateX}vw)`;
 
 // Set active card
 roadmapCards.forEach((card, index) => {
 if (index === clampedIndex) {
 card.classList.add('active');
 } else {
 card.classList.remove('active');
 }
 });
 }
 
 // Throttled scroll handler
 const handleRoadmapScroll = rafThrottle(updateRoadmap);
 window.addEventListener('scroll', handleRoadmapScroll, { passive: true });
 
 // Initialize on load
 updateRoadmap();
}

function initCommitteeRoad() {
 const container = document.getElementById('committeesRoad');
 const svg = document.getElementById('roadSvg');
 const path = document.getElementById('roadPath');
 if (!container || !svg || !path) return;

 const cards = container.querySelectorAll('.road-card');
 if (!cards.length) return;

 let pathLength = 0;

 function buildPath() {
 const W = container.offsetWidth;
 const cardHeight = 480;
 const totalHeight = cardHeight * cards.length + 300;

 container.style.minHeight = totalHeight + 'px';
 svg.setAttribute('viewBox', `0 0 ${W} ${totalHeight}`);
 svg.setAttribute('width', W);
 svg.setAttribute('height', totalHeight);
 svg.style.width = '100%';
 svg.style.height = totalHeight + 'px';

 const leftX = W * 0.47;
 const rightX = W * 0.53;

 // Road enters from top-right, just like image 2
 let d = `M ${rightX} 0`;

 cards.forEach((card, i) => {
 const yPos = 80 + (i * cardHeight);
 const currY = yPos + 180;
 const currX = i % 2 === 0 ? leftX : rightX;

 card.style.position = 'absolute';
 card.style.top = yPos + 'px';
 card.style.width = '42%';
 card.style.maxWidth = '520px';

 if (i % 2 === 0) {
 card.style.left = '0%';
 card.style.right = 'auto';
 } else {
 card.style.right = '0%';
 card.style.left = 'auto';
 }

 if (i === 0) {
 // First segment: comes nearly straight down from top-right
 // then ONE wide sweep left to first card — exactly like image 2
 d += ` C ${rightX} ${currY * 0.55}, ${rightX} ${currY * 0.8}, ${currX} ${currY}`;
 } else {
 const prevX = (i - 1) % 2 === 0 ? leftX : rightX;
 const prevY = 80 + ((i - 1) * cardHeight) + 180;

 // Each segment: road goes nearly straight down on its side
 // then ONE tight sweep across — pure highway bend, no S-curve
 d += ` C ${prevX} ${prevY + (currY - prevY) * 0.9}, ${currX} ${prevY + (currY - prevY) * 0.9}, ${currX} ${currY}`;
 }
 });

 const allPaths = ['roadPath', 'roadPathEdge', 'roadPathLeft', 'roadPathRight', 'roadPathDash'];
 allPaths.forEach(id => {
 const el = document.getElementById(id);
 if (el) el.setAttribute('d', d);
 });

 pathLength = path.getTotalLength();
 path.style.strokeDasharray = pathLength;
 path.style.strokeDashoffset = pathLength;
 }

 function updateOnScroll() {
 const rect = container.getBoundingClientRect();
 const vh = window.innerHeight;
 const start = vh - rect.top;
 const total = rect.height + vh;
 let progress = start / total;
 progress = Math.max(0, Math.min(1, progress));

 const offset = pathLength * (1 - progress);
 path.style.strokeDashoffset = offset;
 }

 buildPath();
 updateOnScroll();

 window.addEventListener('resize', debounce(() => { buildPath(); updateOnScroll(); }, 200));
 window.addEventListener('scroll', rafThrottle(updateOnScroll), { passive: true });
}

window.addEventListener('load', () => setTimeout(initCommitteeRoad, 300));
document.addEventListener('DOMContentLoaded', () => setTimeout(initCommitteeRoad, 500));

// ==================== TOAST NOTIFICATION SYSTEM ====================
function showToast(message, type = 'info') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-icon">${type === 'success' ? '✓' : 'ℹ'}</div>
        <div class="toast-message">${message}</div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ==================== PAGE TRANSITION EFFECT ====================
document.querySelectorAll('a:not([target="_blank"])').forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
            e.preventDefault();
            const overlay = document.createElement('div');
            overlay.className = 'page-transition active';
            document.body.appendChild(overlay);
            setTimeout(() => { window.location.href = href; }, 500);
        }
    });
});

// ==================== TOUCH SWIPE GESTURES ====================
let touchStartX = 0;
document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});
document.addEventListener('touchend', e => {
    const touchEndX = e.changedTouches[0].screenX;
    if (touchEndX < touchStartX - 50) {
        document.dispatchEvent(new CustomEvent('swipeleft'));
    }
    if (touchEndX > touchStartX + 50) {
        document.dispatchEvent(new CustomEvent('swiperight'));
    }
});

// ==================== KEYBOARD NAVIGATION ACCESSIBILITY ====================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') document.body.classList.add('keyboard-nav');
});
document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// ==================== ACHIEVEMENT SYSTEM + KONAMI CODE ====================
const achievements = {
    night_owl: { unlocked: false, name: 'Night Owl', desc: 'Visited at 2 AM' },
    explorer: { unlocked: false, name: 'Explorer', desc: 'Visited all pages' },
    konami: { unlocked: false, name: 'Konami Code', desc: 'Found the secret' },
    diplomat: { unlocked: false, name: 'Diplomat', desc: 'Clicked the enter button' },
};
function unlockAchievement(key) {
    if (achievements[key] && !achievements[key].unlocked) {
        achievements[key].unlocked = true;
        showToast(`🏆 Achievement Unlocked: ${achievements[key].name}`, 'success');
    }
}
if (new Date().getHours() === 2) unlockAchievement('night_owl');
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;
document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            unlockAchievement('konami');
            konamiIndex = 0;
            showToast('🎮 KONAMI CODE ACTIVATED!', 'info');
        }
    } else {
        konamiIndex = 0;
    }
});
const enterBtn = document.querySelector('.intro-enter');
if (enterBtn) {
    enterBtn.addEventListener('click', () => unlockAchievement('diplomat'));
}

// ==================== DYNAMIC TESTIMONIALS SLIDER ====================
(function() {
  const STORAGE_KEY = 'csmun_reviews';
  let currentSlide = 0;
  let autoAdvance = null;

  function getReviews() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try { return JSON.parse(stored); } catch (_) {}
    }
    const defaults = [
      { name: 'Arjun Mehta', title: 'Best Delegate, UNSC 2025', text: 'CSMUN 2025 was a transformative experience. The debates were intense, the EBs were phenomenal, and I learned more in three days than I did in months of classroom study.' },
      { name: 'Priya Sharma', title: 'High Commendation, UNHRC 2025', text: 'The level of organization and professionalism at CSMUN is unmatched. From registration to awards, everything was flawless. Highly recommend for first-timers and veterans alike!' },
      { name: 'Kabir Singh', title: 'International Press 2025', text: 'As an International Press delegate, CSMUN gave me hands-on journalism experience. I interviewed diplomats, covered live debates, and published my first article. Unforgettable!' }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    return defaults;
  }

  function saveReviews(reviews) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  }

  function escapeHtml(str) {
    var d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  function renderSlider() {
    var track = document.querySelector('.testimonial-track');
    var dotsContainer = document.querySelector('.testimonial-dots');
    if (!track) return;

    var reviews = getReviews();
    track.innerHTML = '';
    dotsContainer.innerHTML = '';

    if (!reviews.length) {
      track.innerHTML = '<p style="text-align:center;color:var(--gray-500);padding:2rem;">No reviews yet. Be the first to share your experience!</p>';
      return;
    }

    reviews.forEach(function(r, i) {
      var slide = document.createElement('div');
      slide.className = 'testimonial-slide' + (i === 0 ? ' active' : '');
      slide.innerHTML = '<div class="testimonial-content"><div class="quote-mark">"</div><p class="testimonial-text">' + escapeHtml(r.text) + '</p><div class="testimonial-author"><div class="author-avatar"><svg width="60" height="60" viewBox="0 0 60 60"><circle cx="30" cy="30" r="28" fill="rgba(250,204,21,0.15)"/><circle cx="30" cy="22" r="10" fill="var(--gold)" opacity="0.4"/><path d="M10 50 Q30 35 50 50" fill="var(--gold)" opacity="0.4"/></svg></div><div><h4>' + escapeHtml(r.name) + '</h4><p>' + escapeHtml(r.title) + '</p></div></div></div>';
      track.appendChild(slide);

      var dot = document.createElement('span');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('data-slide', i);
      dotsContainer.appendChild(dot);
    });

    attachControls();
  }

  function attachControls() {
    var slides = document.querySelectorAll('.testimonial-slide');
    var dots = document.querySelectorAll('.testimonial-dots .dot');
    var prevBtn = document.querySelector('.testimonial-prev');
    var nextBtn = document.querySelector('.testimonial-next');
    if (!slides.length) return;

    currentSlide = 0;
    if (autoAdvance) clearInterval(autoAdvance);

    function showSlide(index) {
      slides.forEach(function(s) { s.classList.remove('active'); });
      dots.forEach(function(d) { d.classList.remove('active'); });
      slides[index].classList.add('active');
      dots[index].classList.add('active');
    }

    if (nextBtn) {
      nextBtn.onclick = function() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
      };
    }
    if (prevBtn) {
      prevBtn.onclick = function() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
      };
    }
    dots.forEach(function(dot, i) {
      dot.onclick = function() {
        currentSlide = i;
        showSlide(currentSlide);
      };
    });

    autoAdvance = setInterval(function() {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    }, 6000);
  }

  renderSlider();

  var toggleBtn = document.querySelector('.review-toggle-btn');
  var reviewForm = document.querySelector('.review-form');
  var submitBtn = document.querySelector('.submit-review');

  if (toggleBtn && reviewForm) {
    var formVisible = false;
    toggleBtn.addEventListener('click', function() {
      formVisible = !formVisible;
      reviewForm.style.display = formVisible ? 'flex' : 'none';
      toggleBtn.textContent = formVisible ? 'Cancel' : 'Write a Review';
    });
  }

  if (submitBtn) {
    submitBtn.addEventListener('click', function() {
      var name = document.getElementById('review-name');
      var title = document.getElementById('review-title');
      var text = document.getElementById('review-text');
      if (!name.value.trim() || !title.value.trim() || !text.value.trim()) {
        alert('Please fill in all fields.');
        return;
      }
      var reviews = getReviews();
      reviews.unshift({ name: name.value.trim(), title: title.value.trim(), text: text.value.trim() });
      saveReviews(reviews);
      name.value = '';
      title.value = '';
      text.value = '';
      if (reviewForm) reviewForm.style.display = 'none';
      if (toggleBtn) toggleBtn.textContent = 'Write a Review';
      formVisible = false;
      renderSlider();
    });
  }
})();

// ==================== LAZY LOADING IMAGES WITH BLUR-UP ====================
(function() {
    const lazyImages = document.querySelectorAll('.lazy-image');
    if (!lazyImages.length) return;
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src');
                if (src) {
                    img.src = src;
                    img.removeAttribute('data-src');
                }
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    }, { rootMargin: '200px 0px' });
    lazyImages.forEach(img => imageObserver.observe(img));
})();// ==================== FIX INFINITE SCROLL ====================
(function fixOverflow() {
    document.documentElement.style.overflowX = 'hidden';
    document.body.style.overflowX = 'hidden';
    document.body.style.maxWidth = '100vw';
    document.documentElement.style.maxWidth = '100vw';
    
    // Force recalculate layout after all elements render
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.documentElement.style.overflowX = 'hidden';
            document.body.style.overflowX = 'hidden';
        }, 500);
    });
})();