/* ==========================================================
   PAX SILICA — script.js
   - Scroll-driven parallax hero (mountains fall away → grid scene)
   - Fixed bar: chapter label + progress
   - Reveal-on-scroll, count-ups
   - Scale diagrams: area-true packing of landmarks, football-pitch grid,
     comparison bars
   ========================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var range = function (p, a, b) { return clamp((p - a) / (b - a), 0, 1); };
  var easeInOut = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var easeOut = function (t) { return 1 - Math.pow(1 - t, 3); };
  var fmt = function (n, d) { return Number(n).toLocaleString('en-US', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }); };

  /* ---------------------------------------------------------
     DATA (areas in hectares; 4,000 acres × 0.404686 = 1,618.7 ha)
     --------------------------------------------------------- */
  var HUB_HA = 4000 * 0.404686;
  var HUB_SIDE = Math.sqrt(HUB_HA);            // in hectometres (1 ha = 1 hm²) → ≈ 40.23

  var PLACES = [
    { name: 'Central Park',   short: 'Central Park', ha: 341, where: 'New York',    color: '#a3c882' },
    { name: 'UP Diliman',     short: 'UP Diliman',   ha: 493, where: 'Quezon City', color: '#ffd966' },
    { name: 'Monaco',         short: 'Monaco',       ha: 202, where: 'principality', color: '#ff9e80' },
    { name: 'Hyde Park',      short: 'Hyde Park',    ha: 142, where: 'London',      color: '#80a95f' },
    { name: 'Intramuros',     short: 'Intramuros',   ha: 67,  where: 'Manila',      color: '#f4b6c2' },
    { name: 'Rizal Park',     short: 'Rizal Park',   ha: 58,  where: 'Manila',      color: '#b9e3ff' },
    { name: 'Vatican City',   short: 'Vatican',      ha: 49,  where: 'city-state',  color: '#e2d1ff' }
  ];

  // Hand-placed layout in hectometre units inside the 40.23 × 40.23 hub square.
  // Squares have side √area; Central Park keeps its long, thin 40 × 8.5 shape (= 340 ha).
  var LAYOUT = [
    { x: 0,    y: 0,    w: 40,   h: 8.5 },                        // Central Park
    { x: 0,    y: 9.1,  w: Math.sqrt(493), h: Math.sqrt(493) },   // UP Diliman
    { x: 22.8, y: 9.1,  w: Math.sqrt(202), h: Math.sqrt(202) },   // Monaco
    { x: 25,   y: 23.9, w: Math.sqrt(142), h: Math.sqrt(142) },   // Hyde Park
    { x: 0,    y: 31.9, w: Math.sqrt(67),  h: Math.sqrt(67) },    // Intramuros
    { x: 8.8,  y: 31.9, w: Math.sqrt(58),  h: Math.sqrt(58) },    // Rizal Park
    { x: 17,   y: 31.9, w: Math.sqrt(49),  h: Math.sqrt(49) }     // Vatican City
  ];

  /* ---------------------------------------------------------
     1) HERO PARALLAX
     --------------------------------------------------------- */
  var hero = $('#hero');
  var sky = $('#sky');
  var glow = $('#glow');
  var grid = $('#grid');
  var s2text = $('#scene2Text');
  var cue = $('#cue');

  // each layer: end position (% of stage), end scale, and the scroll window it moves in
  var LAYERS = [
    { el: $('#L-light'), x:   6, y: 104, s: 1.05, a: 0.00, b: 0.44, mx: 0.4 },
    { el: $('#L-mid'),   x: -14, y: 112, s: 1.10, a: 0.00, b: 0.52, mx: 0.9 },
    { el: $('#L-left'),  x: -30, y: 112, s: 1.16, a: 0.04, b: 0.60, mx: 0.6 },
    { el: $('#L-right'), x:  30, y: 112, s: 1.16, a: 0.04, b: 0.60, mx: 1.2 }
  ];

  var heroTop = 0, heroSpan = 1;
  function measureHero() {
    var r = hero.getBoundingClientRect();
    heroTop = r.top + window.pageYOffset;
    heroSpan = Math.max(1, hero.offsetHeight - $('.hero__sticky').offsetHeight);
  }

  var mouseX = 0, mouseY = 0, mouseXs = 0, mouseYs = 0;
  if (!reduceMotion) {
    window.addEventListener('pointermove', function (e) {
      mouseX = (e.clientX / window.innerWidth - .5) * 2;
      mouseY = (e.clientY / window.innerHeight - .5) * 2;
    }, { passive: true });
  }

  function renderHero(p) {
    var i, L, e;
    var mouseK = (1 - range(p, 0, .12));           // only wiggle while the mountains are intact
    for (i = 0; i < LAYERS.length; i++) {
      L = LAYERS[i];
      e = easeInOut(range(p, L.a, L.b));
      var mxPx = mouseXs * L.mx * 14 * mouseK;
      var myPx = mouseYs * L.mx * 6 * mouseK;
      L.el.style.transform =
        'translate3d(calc(' + (L.x * e).toFixed(3) + '% + ' + mxPx.toFixed(2) + 'px),' +
        'calc(' + (L.y * e).toFixed(3) + '% + ' + myPx.toFixed(2) + 'px),0) scale(' + lerp(1.02, L.s, e).toFixed(4) + ')';
    }

    sky.style.opacity = (1 - easeOut(range(p, .10, .50))).toFixed(3);

    var g = easeOut(range(p, .10, .58));
    glow.style.opacity = g.toFixed(3);
    glow.style.setProperty('--gs', lerp(.55, 1, g).toFixed(4));

    var gr = easeOut(range(p, .14, .62));
    var drift = range(p, .6, 1);
    grid.style.opacity = gr.toFixed(3);
    grid.style.transform = 'scale(' + (lerp(1.55, 1, gr) + drift * .08).toFixed(4) + ')';

    var t = easeOut(range(p, .52, .78));
    s2text.style.opacity = t.toFixed(3);
    s2text.style.transform = 'translate3d(0,' + (lerp(70, 0, t) - drift * 24).toFixed(2) + 'px,0)';

    cue.style.opacity = (1 - range(p, 0, .04)).toFixed(3);
  }

  /* ---------------------------------------------------------
     2) SCROLL LOOP (smoothed) + bar + chapter parallax
     --------------------------------------------------------- */
  var barProgress = $('#barProgress');
  var chapterNum = $('#chapterNum');
  var chapterName = $('#chapterName');
  var ridges = $$('[data-ridge]');
  var bigNums = $$('.chapter__num');
  var targetY = window.pageYOffset, currentY = targetY, lastHeroP = -1;
  var maxScroll = 1;

  function measureAll() {
    measureHero();
    maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    if (typeof layoutPitches === 'function') layoutPitches();
  }

  function frame() {
    targetY = window.pageYOffset;
    currentY = reduceMotion ? targetY : lerp(currentY, targetY, .13);
    if (Math.abs(currentY - targetY) < .1) currentY = targetY;

    mouseXs = lerp(mouseXs, mouseX, .06);
    mouseYs = lerp(mouseYs, mouseY, .06);

    var p = clamp((currentY - heroTop) / heroSpan, 0, 1);
    if (p < 1 || lastHeroP < 1 || Math.abs(mouseXs - mouseX) > .001) renderHero(p);
    lastHeroP = p;

    barProgress.style.width = (clamp(targetY / maxScroll, 0, 1) * 100).toFixed(2) + '%';

    // chapter-level parallax: big outlined numerals drift slower than the page; ridges slide sideways
    var vh = window.innerHeight, i, r, mid;
    for (i = 0; i < bigNums.length; i++) {
      r = bigNums[i].getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) continue;
      mid = (r.top + r.height / 2 - vh / 2) / vh;
      bigNums[i].style.transform = 'translate3d(0,' + (-mid * 70).toFixed(1) + 'px,0)';
    }
    for (i = 0; i < ridges.length; i++) {
      r = ridges[i].getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) continue;
      mid = (r.top - vh / 2) / vh;
      ridges[i].style.transform = 'translate3d(' + (mid * -5).toFixed(2) + '%,0,0)';
    }

    requestAnimationFrame(frame);
  }

  /* chapter label in the bar */
  var chapters = $$('[data-chapter]');
  function updateChapter() {
    var mid = window.innerHeight * .5, best = chapters[0];
    chapters.forEach(function (c) { if (c.getBoundingClientRect().top <= mid) best = c; });
    if (chapterNum.textContent !== best.dataset.chapter) {
      chapterNum.textContent = best.dataset.chapter;
      chapterName.innerHTML = best.dataset.name;
    }
  }
  window.addEventListener('scroll', updateChapter, { passive: true });

  /* ---------------------------------------------------------
     3) REVEAL + WATCH (intersection observers)
     --------------------------------------------------------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        io.unobserve(en.target);
        if (en.target.classList.contains('watch')) en.target.dispatchEvent(new CustomEvent('watched'));
      }
    });
  }, { threshold: .18, rootMargin: '0px 0px -6% 0px' });

  function observeAll() {
    $$('.reveal, .watch').forEach(function (el) { io.observe(el); });
  }

  /* count-ups */
  var cio = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      cio.unobserve(en.target);
      var el = en.target, to = parseFloat(el.dataset.to), dec = parseInt(el.dataset.dec || '0', 10);
      if (reduceMotion) { el.textContent = fmt(to, dec); return; }
      var t0 = performance.now(), dur = 1600;
      (function tick(now) {
        var k = easeOut(clamp((now - t0) / dur, 0, 1));
        el.textContent = fmt(to * k, dec);
        if (k < 1) requestAnimationFrame(tick);
      })(t0);
    });
  }, { threshold: .6 });
  $$('.countup').forEach(function (el) { cio.observe(el); });

  /* ---------------------------------------------------------
     4) DIAGRAM: landmarks packed inside the hub square
     --------------------------------------------------------- */
  (function buildPack() {
    var host = $('#pack');
    if (!host) return;
    var fig = $('#packFig');
    var lab = document.createElement('div');
    lab.className = 'pack__label';
    lab.textContent = 'Hub · ' + fmt(HUB_HA) + ' ha';
    host.appendChild(lab);

    PLACES.forEach(function (pl, i) {
      var L = LAYOUT[i], d = document.createElement('div');
      d.className = 'pack__item';
      d.style.cssText =
        'left:' + (L.x / HUB_SIDE * 100).toFixed(3) + '%;' +
        'top:' + (L.y / HUB_SIDE * 100).toFixed(3) + '%;' +
        'width:' + (L.w / HUB_SIDE * 100).toFixed(3) + '%;' +
        'height:' + (L.h / HUB_SIDE * 100).toFixed(3) + '%;' +
        'background:' + pl.color + ';--i:' + i + ';';
      d.title = pl.name + ' — ' + pl.ha + ' ha';
      d.innerHTML = pl.short + '<small>' + pl.ha + ' ha</small>';
      host.appendChild(d);
    });
    // the figure wrapper carries .watch → .in so items animate in together
    fig.addEventListener('watched', function () {});
  })();

  /* how many times does each place fit? */
  function buildBars(host, rows, opts) {
    if (!host) return;
    opts = opts || {};
    var max = opts.max;
    rows.forEach(function (r, i) {
      var w = opts.log ? Math.log10(r.v) / Math.log10(max) : r.v / max;
      var row = document.createElement('div');
      row.className = 'bar-row';
      row.innerHTML =
        '<div class="bar-row__label">' + r.label + (r.sub ? '<small>' + r.sub + '</small>' : '') + '</div>' +
        '<div class="bar-row__track"><div class="bar-row__fill" style="--w:' + (clamp(w, 0, 1) * 100).toFixed(2) + '%;--i:' + i + ';' + (r.color ? '--fill:' + r.color : '') + '"></div></div>' +
        '<div class="bar-row__val">' + r.text + '</div>';
      host.appendChild(row);
    });
  }

  var fits = PLACES.map(function (p) {
    return { label: p.name, sub: p.where, v: HUB_HA / p.ha, text: '×' + fmt(HUB_HA / p.ha, 1), color: p.color };
  }).sort(function (a, b) { return a.v - b.v; });
  buildBars($('#multiples'), fits, { max: Math.max.apply(null, fits.map(function (f) { return f.v; })) * 1.05 });

  /* ---------------------------------------------------------
     5) DIAGRAM: 2,267 football pitches
     --------------------------------------------------------- */
  var PITCH_HA = 105 * 68 / 10000;                  // 0.714 ha
  var PITCHES = Math.round(HUB_HA / PITCH_HA);      // 2,267
  var COLS = 38, ROWS = Math.ceil(PITCHES / COLS);  // 38 × 60 cells; 105 m × 68 m each → ~4.0 km square
  var cv = $('#pitches'), ctx = cv ? cv.getContext('2d') : null;
  var pitchCountEl = $('#pitchCount');
  var pitchShown = 0, pitchAnimating = false;

  function drawPitches(n) {
    if (!ctx) return;
    var W = cv.width, H = cv.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);
    var cw = W / COLS, ch = H / ROWS, gap = Math.max(1, Math.round(W / 420));
    for (var i = 0; i < n; i++) {
      var c = i % COLS, r = Math.floor(i / COLS);
      var shade = (c + r) % 2 === 0 ? '#4ac7cc' : '#7fdce0';
      ctx.fillStyle = shade;
      ctx.fillRect(c * cw + gap, r * ch + gap, cw - gap * 2, ch - gap * 2);
    }
    if (pitchCountEl) pitchCountEl.textContent = fmt(n);
  }
  function layoutPitches() {
    if (!cv) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = cv.clientWidth;
    if (!w) return;
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(w * (4080 / 3990) * dpr);
    drawPitches(pitchShown);
  }
  window.layoutPitches = layoutPitches;

  var pitchFig = $('#pitchFig');
  if (pitchFig) {
    pitchFig.addEventListener('watched', function () {
      if (pitchAnimating) return;
      pitchAnimating = true;
      if (reduceMotion) { pitchShown = PITCHES; drawPitches(pitchShown); return; }
      var t0 = performance.now(), dur = 2600;
      (function tick(now) {
        var k = easeInOut(clamp((now - t0) / dur, 0, 1));
        pitchShown = Math.round(PITCHES * k);
        drawPitches(pitchShown);
        if (k < 1) requestAnimationFrame(tick);
      })(t0);
    });
  }

  /* ---------------------------------------------------------
     6) CHART: estimates of affected people (log scale)
     --------------------------------------------------------- */
  buildBars($('#peopleChart'), [
    { label: 'Aeta homes “pushed”',     sub: 'BCDA, Sept 2026 · households', v: 40,    text: '40 homes',          color: '#a3c882' },
    { label: 'Binyayan “affected persons”', sub: 'BCDA letter, 16 Jul · mostly farmers', v: 92, text: '92 people', color: '#a3c882' },
    { label: 'Aeta affected',           sub: 'BCDA estimate (same 40 homes)', v: 200, text: '~200 people',       color: '#a3c882' },
    { label: 'Sapang Kawayan village',  sub: 'RFA · households in the village', v: 200, text: '~200 households', color: '#4ac7cc' },
    { label: 'Aetas + farmers',         sub: 'Protest groups’ claim · Palace disputes', v: 20000, text: '20,000', color: '#ff9e80' }
  ], { log: true, max: 30000 });

  /* ---------------------------------------------------------
     7) DIAGRAM: power, in context
     --------------------------------------------------------- */
  buildBars($('#energyBars'), [
    { label: 'Hub (reported estimate)', v: 26.3, text: '26.3 TWh', color: '#4ac7cc' },
    { label: 'PH service sector, 2024',  v: 28,   text: '28 TWh',   color: '#a3c882' }
  ], { max: 30 });

  /* ---------------------------------------------------------
     INIT
     --------------------------------------------------------- */
  function init() {
    measureAll();
    layoutPitches();
    updateChapter();
    observeAll();
    renderHero(clamp((window.pageYOffset - heroTop) / heroSpan, 0, 1));
    requestAnimationFrame(frame);
  }

  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(measureAll, 120);
  });
  window.addEventListener('load', measureAll);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measureAll);

  init();
})();
