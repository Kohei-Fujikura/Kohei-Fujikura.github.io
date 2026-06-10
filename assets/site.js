/* Shared script — starfield hero background + scroll-reveal animations */
(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Starfield ---- */
  var canvas = document.getElementById("starfield");
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext("2d");
    var stars = [];
    var dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      var rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      var count = Math.floor((rect.width * rect.height) / 6500);
      stars = [];
      for (var i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: (Math.random() * 1.1 + 0.3) * dpr,
          phase: Math.random() * Math.PI * 2,
          speed: 0.4 + Math.random() * 0.8,
          drift: (Math.random() - 0.5) * 0.04 * dpr
        });
      }
    }

    function draw(t) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        var alpha = reducedMotion
          ? 0.5
          : 0.3 + 0.45 * (0.5 + 0.5 * Math.sin(s.phase + t * 0.001 * s.speed));
        ctx.globalAlpha = alpha;
        ctx.fillStyle = "#cdddff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        if (!reducedMotion) {
          s.x += s.drift;
          if (s.x < 0) s.x = canvas.width;
          if (s.x > canvas.width) s.x = 0;
        }
      }
      ctx.globalAlpha = 1;
      if (!reducedMotion) {
        requestAnimationFrame(draw);
      }
    }

    resize();
    window.addEventListener("resize", resize);
    if (reducedMotion) {
      draw(0);
    } else {
      requestAnimationFrame(draw);
    }
  }

  /* ---- Scroll reveal ---- */
  if ("IntersectionObserver" in window) {
    var targets = document.querySelectorAll(".card, .stat-card");
    targets.forEach(function (el) {
      el.classList.add("reveal");
    });
    document.body.classList.add("reveal-init");
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    targets.forEach(function (el) {
      observer.observe(el);
    });
  }
})();
