/* =============================================
   AWS eBOOK — INTERACTIVE SCRIPTS
   ============================================= */

// ── Custom Cursor ──────────────────────────────
(function() {
  const dot = document.createElement('div');
  try {
    const audio = new Audio('Sound/harry_potter.mp3');
    audio.volume = 0.5;
    audio.currentTime = 0;
    audio.play().catch(() => {});
    
    // Add timeout to stop after 9 seconds
    setTimeout(() => {
      audio.pause();
    }, 9000);
  } catch(e) {}
  document.body.appendChild(dot);

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let cx = mx, cy = my;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    document.body.style.setProperty('--cx', mx + 'px');
    document.body.style.setProperty('--cy', my + 'px');
  });

  function animCursor() {
    cx += (mx - cx) * 0.18;
    cy += (my - cy) * 0.18;
    dot.style.left = cx + 'px';
    dot.style.top  = cy + 'px';
    requestAnimationFrame(animCursor);
  }
  animCursor();

  // Scale cursor on interactive elements
  document.querySelectorAll('button, a, .tag, .aws-logo').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.transform = 'translate(-50%,-50%) scale(2)';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.transform = 'translate(-50%,-50%) scale(1)';
    });
  });

  // Hide cursor on touch devices
  if ('ontouchstart' in window) {
    dot.style.display = 'none';
    document.body.style.cursor = 'auto';
  }
})();


// ── Status Bar Sequence ────────────────────────
const statusMessages = [
  'INITIALIZING SYSTEM...',
  'LOADING AWS MODULES...',
  'CONNECTING TO CLOUD...',
  'SYSTEM READY ✓'
];

let msgIdx = 0;
const statusEl = document.getElementById('statusText');

function cycleStatus() {
  if (!statusEl) return;
  msgIdx++;
  if (msgIdx < statusMessages.length) {
    statusEl.style.opacity = '0';
    setTimeout(() => {
      statusEl.textContent = statusMessages[msgIdx];
      statusEl.style.transition = 'opacity 0.4s ease';
      statusEl.style.opacity = '1';
      if (msgIdx < statusMessages.length - 1) {
        setTimeout(cycleStatus, 900);
      }
    }, 300);
  }
}

setTimeout(cycleStatus, 800);


// ── Typewriter ────────────────────────────────
const words  = ['AWS', 'CLOUD', 'AWS'];
const target = document.getElementById('typedTitle');
let wordIdx  = 0;
let charIdx  = 0;
let deleting = false;

function addCursor() {
  const existing = target.querySelector('.cursor-blink');
  if (!existing) {
    const cur = document.createElement('span');
    cur.className = 'cursor-blink';
    target.appendChild(cur);
  }
}

function typeWriter() {
  if (!target) return;
  const word = words[wordIdx];
  addCursor();

  // Get just the text content (no cursor span)
  const cursor = target.querySelector('.cursor-blink');
  const currentText = Array.from(target.childNodes)
    .filter(n => n !== cursor)
    .map(n => n.textContent)
    .join('');

  if (!deleting && charIdx <= word.length) {
    target.childNodes[0]
      ? (target.childNodes[0].textContent = word.slice(0, charIdx))
      : target.insertBefore(document.createTextNode(word.slice(0, charIdx)), cursor);
    charIdx++;
    setTimeout(typeWriter, charIdx === word.length + 1 ? 2000 : 130);
  } else if (deleting && charIdx >= 0) {
    const textNode = Array.from(target.childNodes).find(n => n.nodeType === 3);
    if (textNode) textNode.textContent = word.slice(0, charIdx);
    charIdx--;
    if (charIdx < 0) {
      deleting = false;
      wordIdx  = (wordIdx + 1) % words.length;
      charIdx  = 0;
      // Once we've looped back to AWS, stop cycling
      if (words[wordIdx] === 'AWS' && wordIdx === words.length - 1) {
        const textNode2 = Array.from(target.childNodes).find(n => n.nodeType === 3);
        if (textNode2) textNode2.textContent = 'AWS';
        return;
      }
    }
    if (!deleting && charIdx === word.length) deleting = true;
    setTimeout(typeWriter, 80);
  }

  if (!deleting && charIdx > word.length) {
    deleting = true;
    setTimeout(typeWriter, 1800);
  }
}

// Clean typewriter implementation
(function initTypewriter() {
  if (!target) return;
  const textNode = document.createTextNode('');
  target.appendChild(textNode);
  addCursor();

  let ti   = 0;      // type index
  let wi   = 0;      // word index
  let del  = false;
  const ws = ['AWS', 'CLOUD', 'AWS'];
  const FINAL = 2;   // stop at this word index

  function tick() {
    const word = ws[wi];
    const cur  = textNode.textContent;

    if (!del) {
      textNode.textContent = word.slice(0, ti + 1);
      ti++;
      if (ti === word.length) {
        if (wi === FINAL) return; // done — leave AWS on screen
        del = true;
        return setTimeout(tick, 1600);
      }
      return setTimeout(tick, 140);
    } else {
      textNode.textContent = word.slice(0, ti - 1);
      ti--;
      if (ti === 0) {
        del  = false;
        wi   = (wi + 1) % ws.length;
        ti   = 0;
        return setTimeout(tick, 300);
      }
      return setTimeout(tick, 80);
    }
  }
  setTimeout(tick, 1400);
})();


// ── Animated Counter ──────────────────────────
function animateCounter(el, target, duration = 1400) {
  let start = null;
  const from = 0;

  function step(ts) {
    if (!start) start = ts;
    const p = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3); // ease-out cubic
    el.textContent = Math.floor(from + (target - from) * ease);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

function startCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    animateCounter(el, parseInt(el.dataset.target), 1600);
  });
}

setTimeout(startCounters, 1800);


// ── Particles.js Config ───────────────────────
window.addEventListener('load', () => {
  if (typeof particlesJS === 'undefined') return;

  particlesJS('particles-js', {
    particles: {
      number: {
        value: window.innerWidth < 600 ? 100 : 180,
        density: { enable: true, value_area: 800 }
      },
      color: { value: '#FF8C00' },
      shape: {
        type: 'circle',
        stroke: { width: 0 }
      },
      opacity: {
        value: 0.7,
        random: true,
        anim: { enable: true, speed: 1, opacity_min: 0.2, sync: false }
      },
      size: {
        value: 3,
        random: true,
        anim: { enable: false }
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: '#FF8C00',
        opacity: 0.35,
        width: 1
      },
      move: {
        enable: true,
        speed: 2,
        direction: 'none',
        random: false,
        straight: false,
        out_mode: 'out',
        bounce: false,
        attract: { enable: false }
      }
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: {
          enable: true,
          mode: ['grab', 'bubble']
        },
        onclick: {
          enable: true,
          mode: 'repulse'
        },
        resize: true
      },
      modes: {
        grab: {
          distance: 160,
          line_linked: { opacity: 0.5 }
        },
        bubble: {
          distance: 200,
          size: 5,
          duration: 2,
          opacity: 0.8,
          speed: 3
        },
        repulse: {
          distance: 200,
          duration: 0.4
        }
      }
    },
    retina_detect: true
  });
});


// ── Logo Click Effect ──────────────────────────
const logo = document.getElementById('awsLogo');
if (logo) {
  logo.addEventListener('click', () => {
    logo.style.animation = 'none';
    logo.style.filter = 'drop-shadow(0 0 60px rgba(255,140,0,0.9)) brightness(1.4)';
    setTimeout(() => {
      logo.style.filter = 'drop-shadow(0 0 20px rgba(255,140,0,0.5))';
      logo.style.animation = 'floatLogo 4s ease-in-out infinite, rotateSlow 12s linear infinite';
    }, 400);
  });
}


// ── Tag Hover Ripple ──────────────────────────
document.querySelectorAll('.tag').forEach(tag => {
  tag.addEventListener('click', function() {
    this.style.background = 'rgba(255,140,0,0.25)';
    this.style.color      = '#fff';
    setTimeout(() => {
      this.style.background = '';
      this.style.color      = '';
    }, 500);
  });
});


// ── Enter Button → Loading Transition ─────────
const enterBtn      = document.getElementById('enterBtn');
const loadingOverlay = document.getElementById('loadingOverlay');
const loadingFill   = document.getElementById('loadingFill');
const loadingPct    = document.getElementById('loadingPct');

if (enterBtn) {
  enterBtn.addEventListener('click', function () {
    // Play sound (optional)
    try {
      const audio = new Audio('Sound/harry_potter.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch(e) {}

    // Show loading overlay
    loadingOverlay.classList.add('active');

    let pct = 0;
    let startTime = Date.now();
    const totalTime = 9000; // 8 seconds
    
    const interval = setInterval(() => {
    
      let elapsed = Date.now() - startTime;
      let progress = Math.min((elapsed / totalTime) * 100, 100);
    
      loadingFill.style.width = progress + '%';
      loadingPct.textContent = Math.floor(progress) + '%';
    
      if (progress >= 100) {
        clearInterval(interval);
    
        setTimeout(() => {
          document.body.classList.add('fade-out');
    
          setTimeout(() => {
            window.location.href = 'content.html';
          }, 500);
    
        }, 300);
      }
    
    }, 70); 
  });
}


// ── Keyboard shortcut: Enter key ──────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && enterBtn) enterBtn.click();
});


// ── Resize: re-density particles ──────────────
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // Reload particles on significant resize
    if (typeof pJSDom !== 'undefined' && pJSDom.length > 0) {
      pJSDom[0].pJS.fn.vendors.destroypJS();
      pJSDom.splice(0, 1);
    }
  }, 500);
});