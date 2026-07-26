// スクロールリビール: [data-anim] を IntersectionObserver で is-inview 化
(() => {
  // 親 [data-anim-group] 配下の子へ --i を自動採番（stagger）
  document.querySelectorAll("[data-anim-group]").forEach((g) => {
    [...g.querySelectorAll("[data-anim]")].forEach((el, i) => el.style.setProperty("--i", i));
  });

  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-inview");
          io.unobserve(e.target);
        }
      }),
    { rootMargin: "0px 0px -12% 0px", threshold: 0 }
  );
  document.querySelectorAll("[data-anim], [data-marker]").forEach((el) => io.observe(el));
})();
