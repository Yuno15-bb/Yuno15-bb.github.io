/* ============================================================
   Gradient Background — fond animé WebGL (shader « warp »).
   Porté depuis le composant Framer "Animated Liquid Background".

   Le shader lui-même (warp.glsl) vient de la bibliothèque open source
   @paper-design/shaders (MIT). Framer ne faisait que l'emballer ;
   ce fichier le monte dans un <canvas> sans aucune dépendance.

     GradientBackground.create(document.querySelector("#fond"), {
       preset: "Lava",     // Prism | Lava | Plasma | Pulse | Vortex | Mist
       speed: 30,          // 0–100
     });

   Ou tes propres réglages : { color1, color2, color3, rotation, proportion,
   scale, distortion, swirl, swirlIterations, softness, offset, shape, shapeSize }
   ============================================================ */

(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.GradientBackground = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var SHAPES = { Checks: 0, Stripes: 1, Edge: 2 };

  // Les six réglages du composant Framer, valeurs relevées dans sa source.
  var PRESETS = {
    Prism:  { color1:"#050505", color2:"#66B3FF", color3:"#FFFFFF", rotation:-50, proportion:1,   scale:0.01, speed:30, distortion:0,  swirl:50,  swirlIterations:16, softness:47,  offset:-299, shape:"Checks",  shapeSize:45 },
    Lava:   { color1:"#FF9F21", color2:"#FF0303", color3:"#000000", rotation:114, proportion:100, scale:0.52, speed:30, distortion:7,  swirl:18,  swirlIterations:20, softness:100, offset:717,  shape:"Edge",    shapeSize:12 },
    Plasma: { color1:"#B566FF", color2:"#000000", color3:"#000000", rotation:0,   proportion:63,  scale:0.75, speed:30, distortion:5,  swirl:61,  swirlIterations:5,  softness:100, offset:-168, shape:"Checks",  shapeSize:28 },
    Pulse:  { color1:"#66FF85", color2:"#000000", color3:"#000000", rotation:-167,proportion:92,  scale:0,    speed:20, distortion:54, swirl:75,  swirlIterations:3,  softness:28,  offset:-813, shape:"Checks",  shapeSize:79 },
    Vortex: { color1:"#000000", color2:"#FFFFFF", color3:"#000000", rotation:50,  proportion:41,  scale:0.4,  speed:20, distortion:0,  swirl:100, swirlIterations:3,  softness:5,   offset:-744, shape:"Stripes", shapeSize:80 },
    Mist:   { color1:"#050505", color2:"#FF66B8", color3:"#050505", rotation:0,   proportion:33,  scale:0.48, speed:39, distortion:4,  swirl:65,  swirlIterations:5,  softness:100, offset:-235, shape:"Edge",    shapeSize:48 },
  };

  var VERTEX = "#version 300 es\nin vec2 a;void main(){gl_Position=vec4(a,0.,1.);}";

  // La vitesse ne monte pas droit : l'original la passe par cette courbe,
  // puis multiplie par 5. À 100 on va donc très vite, à 30 c'est calme.
  function speedEase(t) {
    return cubicBezier(0.65, 0, 0.88, 0.77)(Math.max(0, Math.min(1, t)));
  }

  function cubicBezier(p1x, p1y, p2x, p2y) {
    var cx = 3 * p1x, bx = 3 * (p2x - p1x) - cx, ax = 1 - cx - bx;
    var cy = 3 * p1y, by = 3 * (p2y - p1y) - cy, ay = 1 - cy - by;
    function x(t) { return ((ax * t + bx) * t + cx) * t; }
    function y(t) { return ((ay * t + by) * t + cy) * t; }
    function dx(t) { return (3 * ax * t + 2 * bx) * t + cx; }
    return function (t) {
      var g = t, i, d, s;
      for (i = 0; i < 8; i += 1) {
        d = x(g) - t;
        if (Math.abs(d) < 1e-4) break;
        s = dx(g);
        if (Math.abs(s) < 1e-6) break;
        g -= d / s;
      }
      return y(Math.max(0, Math.min(1, g)));
    };
  }

  function toRgba(color) {
    var c = String(color || "#000").trim();
    if (c[0] === "#") {
      if (c.length === 4) c = "#" + c[1] + c[1] + c[2] + c[2] + c[3] + c[3];
      return [parseInt(c.slice(1, 3), 16) / 255,
              parseInt(c.slice(3, 5), 16) / 255,
              parseInt(c.slice(5, 7), 16) / 255, 1];
    }
    var m = c.match(/rgba?\(([^)]+)\)/);
    if (m) {
      var p = m[1].split(",").map(Number);
      return [p[0] / 255, p[1] / 255, p[2] / 255, p.length > 3 ? p[3] : 1];
    }
    return [0, 0, 0, 1];
  }

  function compile(gl, type, src) {
    var sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      var log = gl.getShaderInfoLog(sh);
      gl.deleteShader(sh);
      throw new Error("shader : " + log);
    }
    return sh;
  }

  function create(mount, options) {
    var opts = options || {};

    var root_ = document.createElement("div");
    root_.className = "gbg";
    root_.setAttribute("data-gradient-background", "");
    var canvas = document.createElement("canvas");
    canvas.className = "gbg__canvas";
    canvas.setAttribute("aria-hidden", "true");   // c'est un décor, pas un contenu
    root_.appendChild(canvas);
    mount.appendChild(root_);

    return attach(root_, opts);
  }

  function attach(root_, options) {
    if (root_.__gbg) return root_.__gbg;

    var opts = options || {};
    var canvas = root_.querySelector(".gbg__canvas") || root_.querySelector("canvas");
    if (!canvas) return null;

    var gl = canvas.getContext("webgl2", { antialias: true, alpha: true });
    if (!gl) {
      // Pas de WebGL2 : on laisse un dégradé fixe plutôt qu'un carré vide.
      var p0 = settings(opts);
      root_.style.background =
        "linear-gradient(140deg, " + p0.color1 + ", " + p0.color2 + " 55%, " + p0.color3 + ")";
      root_.setAttribute("data-fallback", "true");
      return { root: root_, fallback: true, destroy: function () {} };
    }

    var glsl = opts.shaderSource || root_.getAttribute("data-shader") || window.WARP_GLSL;
    if (!glsl) throw new Error("Le code du shader manque : passe-le dans shaderSource.");

    var program = gl.createProgram();
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, glsl));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error("programme : " + gl.getProgramInfoLog(program));
    }
    gl.useProgram(program);

    // Deux triangles qui couvrent l'écran : le shader peint chaque pixel.
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(program, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    var U = {};
    ["u_time","u_pixelRatio","u_resolution","u_scale","u_rotation","u_color1","u_color2",
     "u_color3","u_proportion","u_softness","u_shape","u_shapeScale","u_distortion",
     "u_swirl","u_swirlIterations"].forEach(function (n) {
      U[n] = gl.getUniformLocation(program, n);
    });

    var cfg = settings(opts);
    var running = false, raf = null, visible = true;
    var startedAt = performance.now();
    var frames = 0;

    function settings(o) {
      var base = PRESETS[o.preset] || PRESETS.Prism;
      var out = {};
      Object.keys(base).forEach(function (k) { out[k] = base[k]; });
      Object.keys(o).forEach(function (k) { if (k in base) out[k] = o[k]; });
      return out;
    }

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, opts.maxPixelRatio || 2);
      var w = Math.max(1, Math.round(root_.clientWidth * dpr));
      var h = Math.max(1, Math.round(root_.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w; canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      return dpr;
    }

    function draw(now) {
      raf = null;
      var dpr = resize();
      // La vitesse de l'original : courbe puis × 5. Le décalage (offset × 10)
      // sert de graine : deux fonds côte à côte ne sont pas synchronisés.
      var speed = speedEase((cfg.speed == null ? 30 : cfg.speed) / 100) * 5;
      var t = ((now - startedAt) / 1000) * speed + cfg.offset * 10;

      gl.uniform1f(U.u_time, t);
      gl.uniform1f(U.u_pixelRatio, dpr);
      gl.uniform2f(U.u_resolution, canvas.width, canvas.height);
      gl.uniform1f(U.u_scale, cfg.scale);
      gl.uniform1f(U.u_rotation, cfg.rotation * Math.PI / 180);
      gl.uniform4fv(U.u_color1, toRgba(cfg.color1));
      gl.uniform4fv(U.u_color2, toRgba(cfg.color2));
      gl.uniform4fv(U.u_color3, toRgba(cfg.color3));
      gl.uniform1f(U.u_proportion, cfg.proportion / 100);
      gl.uniform1f(U.u_softness, cfg.softness / 100);
      gl.uniform1f(U.u_shape, SHAPES[cfg.shape] == null ? 0 : SHAPES[cfg.shape]);
      gl.uniform1f(U.u_shapeScale, cfg.shapeSize / 100);
      gl.uniform1f(U.u_distortion, cfg.distortion / 50);
      gl.uniform1f(U.u_swirl, cfg.swirl / 100);
      gl.uniform1f(U.u_swirlIterations, cfg.swirl === 0 ? 0 : cfg.swirlIterations);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      frames += 1;
      if (running) raf = requestAnimationFrame(draw);
    }

    function start() {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(draw);
    }
    function stop() {
      running = false;
      if (raf) { cancelAnimationFrame(raf); raf = null; }
    }

    // On ne fait pas tourner un GPU pour un fond qu'on ne voit pas.
    var io = null;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) start(); else stop();
      }, { threshold: 0.01 });
      io.observe(root_);
    }
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop();
      else if (visible) start();
    });

    var ro = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(function () { draw(performance.now()); });
      ro.observe(root_);
    }

    draw(performance.now());       // une image tout de suite, même à l'arrêt
    if (opts.autoPlay !== false) start();

    var api = {
      root: root_, canvas: canvas, gl: gl,
      start: start, stop: stop,
      get running() { return running; },
      get frames() { return frames; },
      get settings() { return cfg; },
      set: function (next) {
        Object.keys(next || {}).forEach(function (k) { opts[k] = next[k]; });
        cfg = settings(opts);
        draw(performance.now());
      },
      destroy: function () {
        stop();
        if (io) io.disconnect();
        if (ro) ro.disconnect();
        delete root_.__gbg;
      },
    };
    root_.__gbg = api;
    return api;
  }

  return { create: create, attach: attach, PRESETS: PRESETS, SHAPES: SHAPES };
});
