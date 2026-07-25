// campuslifeセクション専用: 行事フォトのクロスフェード切替・施設スライダー初期化
(() => {
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- 年間行事: 複数写真のクロスフェード（[data-xfade]） ----
  const stacks = document.querySelectorAll("[data-xfade]");
  if (stacks.length && !REDUCED) {
    stacks.forEach((stack, n) => {
      const imgs = [...stack.querySelectorAll("img")];
      if (imgs.length < 2) return;
      let idx = 0;
      // ブロックごとに開始タイミングを少しずらして単調さを回避
      setTimeout(() => {
        setInterval(() => {
          imgs[idx].classList.add("is-hidden");
          idx = (idx + 1) % imgs.length;
          imgs[idx].classList.remove("is-hidden");
        }, 3600);
      }, (n % 4) * 900);
    });
  }

  // ---- 施設紹介: 実習室スライダー ----
  if (window.Swiper) {
    document.querySelectorAll(".js-facility-slide").forEach((el) => {
      new Swiper(el, {
        loop: true,
        speed: 600,
        pagination: { el: el.querySelector(".swiper-pagination"), clickable: true },
        ...(REDUCED
          ? {}
          : { autoplay: { delay: 4000, pauseOnMouseEnter: true, disableOnInteraction: false } }),
      });
    });
  }
})();
