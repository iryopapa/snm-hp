// 「100%」カウント完了時に十字きらめきを4〜6個だけ散らす（1回きり・全画面演出はしない）
(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const SVG = "http://www.w3.org/2000/svg";
  function burst(target) {
    const rect = target.getBoundingClientRect();
    const n = 4 + Math.floor(Math.random() * 3);
    for (let i = 0; i < n; i++) {
      const svg = document.createElementNS(SVG, "svg");
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.classList.add("c-sparkle");
      const path = document.createElementNS(SVG, "path");
      path.setAttribute("d", "M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z");
      path.setAttribute("fill", ["#ffe200", "#ef89ac", "#7cbc28"][i % 3]);
      svg.appendChild(path);
      const angle = (Math.PI * 2 * i) / n + Math.random() * 0.6;
      const dist = 30 + Math.random() * 30;
      svg.style.left = rect.left + rect.width / 2 + window.scrollX + "px";
      svg.style.top = rect.top + rect.height / 2 + window.scrollY + "px";
      svg.style.setProperty("--dx", Math.cos(angle) * dist + "px");
      svg.style.setProperty("--dy", Math.sin(angle) * dist + "px");
      document.body.appendChild(svg);
      svg.addEventListener("animationend", () => svg.remove());
    }
  }

  document.addEventListener("countup:done", (e) => {
    const el = e.target;
    if (el.dataset.to === "100" && !el.dataset.sparkled) {
      el.dataset.sparkled = "1";
      burst(el);
    }
  });
})();
