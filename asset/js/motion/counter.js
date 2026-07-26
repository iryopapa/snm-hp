// 数値カウントアップ: <span data-counter data-to="100" data-suffix="%">0</span>
(() => {
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ease = (t) => 1 - Math.pow(1 - t, 4);

  function countUp(el) {
    const to = parseFloat(el.dataset.to || "0");
    const suffix = el.dataset.suffix ?? "";
    if (REDUCED) {
      el.textContent = to.toLocaleString() + suffix;
      return;
    }
    const dur = 1400;
    const t0 = performance.now();
    (function frame(t) {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(to * ease(p)).toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(frame);
      else el.dispatchEvent(new CustomEvent("countup:done", { bubbles: true }));
    })(t0);
  }

  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          countUp(e.target);
          io.unobserve(e.target);
        }
      }),
    { rootMargin: "0px 0px -10% 0px" }
  );
  document.querySelectorAll("[data-counter]").forEach((el) => io.observe(el));
})();
