/* ── Canvas neural-mesh animation ────────────── */
(function() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, nodes;
  const N = 70, MAX_DIST = 160, SPEED = 0.35;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function initNodes() {
    nodes = Array.from({ length: N }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - .5) * SPEED,
      vy: (Math.random() - .5) * SPEED,
      r: Math.random() * 1.5 + .5,
      hue: Math.random() < .6 ? 195 : 270, // cyan or purple
    }));
  }

  function draw() {
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

      // move
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0) n.x = W; if (n.x > W) n.x = 0;
      if (n.y < 0) n.y = H; if (n.y > H) n.y = 0;
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); initNodes(); });
  resize(); initNodes(); draw();
})();

/* ── Typing effect ───────────────────────────── */
(function() {
  const lines = [
    'Full-Stack Engineer',
    'TypeScript · React · Python',
    'WebSockets · Docker · CI/CD',
    'AI Integrations · DSP · GraphQL',
    'Builder of things that run in prod.',
  ];
  const el = document.getElementById('typed');
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

/* ── 3-D tilt on cards ───────────────────────── */
(function() {
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
