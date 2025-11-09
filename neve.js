/**
 * Snowfall.js
 * - Script autônomo para efeito de neve em páginas HTML.
 * - Respeita prefers-reduced-motion (não inicia automaticamente quando ativo).
 * - Exposição global: window.Snowfall.start(), .stop(), .toggle()
 *
 * Uso:
 * 1) Incluir o arquivo na página.
 * 2) Opcional: Snowfall.start({count: 120, color: 'white'});
 *
 * Performance:
 * - Usa <canvas> e devicePixelRatio para nitidez.
 * - Ajusta partículas conforme tamanho da viewport.
 * - Possui pausa quando página não visível (Page Visibility API).
 */

(function () {
  const DEFAULTS = {
    count: 120,               // quantidade de flocos
    minSize: 1.5,             // tamanho mínimo (px)
    maxSize: 4.0,             // tamanho máximo (px)
    speed: 1.0,               // multiplicador de velocidade
    wind: 0.5,                // força média do vento (pode variar)
    color: 'rgba(255,255,255,0.9)', // cor do floco
    zindex: 9999,             // z-index do canvas
    pointerInteraction: false,// se true, o mouse influencia vento localmente
    autoStart: true           // iniciar automaticamente (respeita prefers-reduced-motion)
  };

  // Respeita preferência de redução de movimento
  const prefersReducedMotion = (() => {
    try {
      return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  })();

  let canvas, ctx;
  let width = 0, height = 0, dpr = 1;
  let flakes = [];
  let running = false;
  let rafId = null;
  let lastTime = 0;
  let config = Object.assign({}, DEFAULTS);
  let visibilityHidden = false;
  let windBase = 0;
  let mouseX = null, mouseY = null;

  // Util
  const rand = (min, max) => Math.random() * (max - min) + min;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function createCanvas() {
    canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.left = '0';
    canvas.style.top = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none'; // não bloqueia interação
    canvas.style.zIndex = String(config.zindex);
    canvas.setAttribute('aria-hidden', 'true');
    canvas.setAttribute('role', 'presentation');

    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d', { alpha: true });
    updateSize();
  }

  function removeCanvas() {
    if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
    canvas = ctx = null;
  }

  function updateSize() {
    if (!canvas) return;
    dpr = window.devicePixelRatio || 1;
    width = document.documentElement.clientWidth;
    height = document.documentElement.clientHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx && ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function makeFlake(index) {
    const size = rand(config.minSize, config.maxSize);
    // life: how long until respawn from top (not used directly but informative)
    const flake = {
      id: index,
      x: rand(0, width),
      y: rand(-height, height),
      vx: rand(-config.wind, config.wind),
      vy: rand(0.2, 1.2) * config.speed * (size / config.maxSize + 0.5),
      size,
      angle: rand(0, Math.PI * 2),
      angularSpeed: rand(-0.03, 0.03),
      opacity: rand(0.6, 1.0),
      driftFactor: rand(0.2, 1.0) // controla variação no movimento lateral
    };
    return flake;
  }

  function initFlakes() {
    flakes = [];
    const count = Math.max(10, Math.round(config.count));
    for (let i = 0; i < count; i++) flakes.push(makeFlake(i));
  }

  function respawnFlake(flake) {
    flake.x = rand(0, width);
    flake.y = rand(-20, -5);
    flake.vx = rand(-config.wind, config.wind);
    flake.vy = rand(0.2, 1.2) * config.speed * (flake.size / config.maxSize + 0.5);
    flake.opacity = rand(0.6, 1.0);
  }

  function step(timestamp) {
    if (visibilityHidden) {
      rafId = requestAnimationFrame(step);
      return;
    }
    if (!lastTime) lastTime = timestamp;
    const dt = Math.min(32, timestamp - lastTime); // ms
    lastTime = timestamp;

    // vento base suave oscilante
    windBase = Math.sin(timestamp / 5000) * config.wind * 0.6;

    // limpeza
    ctx.clearRect(0, 0, width, height);

    // atualizar e desenhar flakes
    for (let i = 0; i < flakes.length; i++) {
      const f = flakes[i];

      // aplicar movimentos
      // variação local do vento (mouse) — opcional
      let localWind = windBase;
      if (config.pointerInteraction && mouseX !== null) {
        const dx = (f.x - mouseX);
        const dy = (f.y - mouseY);
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        localWind += clamp((dx / dist) * (100 / (dist + 20)), -2, 2);
      }

      // movimento
      f.vx += (localWind * 0.001) * dt * f.driftFactor;
      // pequena resistência para evitar acelerações infinitas
      f.vx *= 0.995;
      f.vy = clamp(f.vy + 0.0005 * dt, 0.05, 6);

      // posição
      f.x += f.vx * dt * 0.06;
      f.y += f.vy * dt * 0.06;

      // rotação simples para dar sensação de floco complexo
      f.angle += f.angularSpeed * dt * 0.06;

      // respawn se saiu da tela
      if (f.y - f.size > height + 20 || f.x < -50 || f.x > width + 50) {
        respawnFlake(f);
      }

      // desenhar
      drawFlake(f);
    }

    rafId = requestAnimationFrame(step);
  }

  function drawFlake(f) {
    ctx.save();
    ctx.globalAlpha = f.opacity;
    ctx.translate(f.x, f.y);
    ctx.rotate(f.angle);

    // desenho performático: círculo simples com sombra leve
    // para flocos mais "texturizados" poderiamos usar gradientes ou imagens,
    // mas círculos são muito mais rápidos e ainda esteticamente agradáveis.
    const r = f.size;
    ctx.beginPath();
    ctx.fillStyle = config.color;
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    // uma leve "brilho" para profundidade (não obrigatório)
    if (r > (config.maxSize * 0.6)) {
      ctx.globalAlpha = Math.min(0.25, ctx.globalAlpha * 0.5);
      ctx.beginPath();
      ctx.arc(-r * 0.25, -r * 0.25, r * 0.6, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  function onResize() {
    updateSize();
    // reajustar número de flakes de acordo com área (escala simples)
    const area = width * height;
    const areaFactor = Math.sqrt(area) / 100; // heurística
    const newCount = Math.round(config.count * Math.max(0.5, areaFactor / 4));
    config.count = Math.max(10, newCount);
    initFlakes();
  }

  function onVisibilityChange() {
    visibilityHidden = document.hidden;
  }

  function onMouseMove(e) {
    if (!config.pointerInteraction) return;
    mouseX = e.clientX;
    mouseY = e.clientY;
  }

  function onMouseLeave() {
    mouseX = null;
    mouseY = null;
  }

  function setupListeners() {
    window.addEventListener('resize', onResize, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);
    if (config.pointerInteraction) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseleave', onMouseLeave);
      window.addEventListener('mouseout', onMouseLeave);
      window.addEventListener('touchmove', (e) => {
        const t = e.touches[0];
        if (t) {
          mouseX = t.clientX;
          mouseY = t.clientY;
        }
      }, { passive: true });
    }
  }

  function removeListeners() {
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    if (config.pointerInteraction) {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('mouseout', onMouseLeave);
      window.removeEventListener('touchmove', null);
    }
  }

  // API
  const Snowfall = {
    start: function (opts = {}) {
      // Não forçar start se user prefer-reduced-motion
      if (prefersReducedMotion && opts.force !== true) {
        console.info('Snowfall: não iniciado por preferência de reduced-motion.');
        return;
      }

      if (running) return;

      // mescla opções
      config = Object.assign({}, config, opts);
      // se reduzir motion for ativado e pointerInteraction for true, ainda respeitamos (não iniciamos)
      if (prefersReducedMotion && opts.force !== true) {
        console.info('Snowfall: prefer-reduced-motion detectado, início bloqueado.');
        return;
      }

      createCanvas();
      initFlakes();
      setupListeners();
      running = true;
      lastTime = 0;
      rafId = requestAnimationFrame(step);
    },

    stop: function () {
      if (!running) return;
      running = false;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      removeListeners();
      removeCanvas();
    },

    toggle: function (opts) {
      if (running) this.stop();
      else this.start(opts);
    },

    // Permite atualizar configurações em tempo de execução (reinicia)
    update: function (opts) {
      const wasRunning = running;
      this.stop();
      config = Object.assign({}, config, opts);
      if (wasRunning) this.start();
    },

    isRunning: function () {
      return running;
    }
  };

  // Expor globalmente
  window.Snowfall = Snowfall;

  // Auto start (respeita reduced-motion)
  if (config.autoStart && !prefersReducedMotion) {
    // start com atraso mínimo para permitir carregamento do DOM
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      Snowfall.start();
    } else {
      document.addEventListener('DOMContentLoaded', () => Snowfall.start(), { once: true });
    }
  } else {
    if (prefersReducedMotion) {
      console.info('Snowfall: não iniciado automaticamente (prefers-reduced-motion).');
    }
  }
})();
