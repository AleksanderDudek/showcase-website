const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer  = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ── Canvas neural-mesh animation ────────────── */
(function() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, N, nodes;
  const MAX_DIST = 160, SPEED = 0.35;

  // Fewer nodes on small screens: the connection pass is O(N²).
  const nodeCount = () => Math.round(Math.min(70, Math.max(28, (W * H) / 16000)));

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function initNodes() {
    N = nodeCount();
    nodes = Array.from({ length: N }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - .5) * SPEED,
      vy: (Math.random() - .5) * SPEED,
      r: Math.random() * 1.5 + .5,
      hue: Math.random() < .6 ? 195 : 270, // cyan or purple
    }));
  }

  function render() {
    ctx.clearRect(0, 0, W, H);

    // connections
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < MAX_DIST) {
          const a = 1 - d / MAX_DIST;
          ctx.strokeStyle = `hsla(${nodes[i].hue}, 90%, 65%, ${a * .5})`;
          ctx.lineWidth   = a * 1.2;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // nodes
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${n.hue}, 90%, 70%, .8)`;
      ctx.fill();
    });
  }

  function step() {
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0) n.x = W; if (n.x > W) n.x = 0;
      if (n.y < 0) n.y = H; if (n.y > H) n.y = 0;
    });
  }

  function loop() {
    render();
    step();
    requestAnimationFrame(loop);
  }

  // Mobile browsers fire resize when the URL bar shows/hides while scrolling;
  // only reseed the mesh when the width really changes so it doesn't jump.
  let lastW = window.innerWidth;
  window.addEventListener('resize', () => {
    const widthChanged = window.innerWidth !== lastW;
    lastW = window.innerWidth;
    resize();
    if (widthChanged) initNodes();
    if (reduceMotion) render();
  });

  resize(); initNodes();
  if (reduceMotion) render(); else loop();
})();

/* ── Typing effect ───────────────────────────── */
(function() {
  const lines = [
    'Full-Stack Engineer',
    'TypeScript · React · Python',
    'Local-first PWAs · Web Speech',
    'AI Agents · MCP · RAG',
    'WebSockets · Docker · CI/CD',
    'Builder of things that run in prod.',
  ];
  const el = document.getElementById('typed');
  if (reduceMotion) { el.textContent = lines[0]; return; }
  let li = 0, ci = 0, deleting = false;
  const TSPEED = 55, DSPEED = 28, PAUSE = 2200;

  function tick() {
    const line = lines[li];
    if (!deleting) {
      el.textContent = line.slice(0, ++ci);
      if (ci === line.length) { deleting = true; setTimeout(tick, PAUSE); return; }
    } else {
      el.textContent = line.slice(0, --ci);
      if (ci === 0) { deleting = false; li = (li + 1) % lines.length; }
    }
    setTimeout(tick, deleting ? DSPEED : TSPEED);
  }
  tick();
})();

/* ── Counter animation ───────────────────────── */
(function() {
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      counterObs.unobserve(e.target);
      const target = +e.target.dataset.target;
      if (reduceMotion) { e.target.textContent = target; return; }
      let cur = 0;
      const step = Math.ceil(target / 30);
      const id = setInterval(() => {
        cur = Math.min(cur + step, target);
        e.target.textContent = cur + (e.target.dataset.suffix || '');
        if (cur >= target) clearInterval(id);
      }, 40);
    });
  }, { threshold: .5 });
  document.querySelectorAll('[data-target]').forEach(el => counterObs.observe(el));
})();

/* ── Card scroll-in ──────────────────────────── */
(function() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (!e.isIntersecting) return;
      setTimeout(() => e.target.classList.add('vis'), i * 80);
      obs.unobserve(e.target);
    });
  }, { threshold: .08 });

  document.querySelectorAll('.card, .video-card').forEach(c => obs.observe(c));
})();

/* ── Code previews: collapsed on phones, open on wider screens ── */
(function() {
  if (window.matchMedia('(min-width: 768px)').matches) return;
  document.querySelectorAll('details.code-wrap[open]').forEach(d => { d.open = false; });
})();

/* ── YouTube facades: load the player only when asked ── */
(function() {
  document.querySelectorAll('.yt-facade[data-yt]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${link.dataset.yt}?rel=0&autoplay=1`;
      iframe.title = link.getAttribute('aria-label').replace(/^Play video: /, '');
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      link.replaceWith(iframe);
      iframe.focus();
    });
  });
})();

/* ── 3-D tilt on cards (mouse/trackpad only) ─── */
(function() {
  if (!finePointer || reduceMotion) return;
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - .5;
      const y = (e.clientY - r.top)  / r.height - .5;
      card.style.transform = `translateY(-5px) rotateX(${-y*6}deg) rotateY(${x*6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();
