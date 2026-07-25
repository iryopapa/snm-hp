// courseセクション専用: Swiper初期化＋<dialog>モーダル開閉
(() => {
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- Swiper（data-course-swiper を一括初期化） ----
  if (window.Swiper) {
    document.querySelectorAll("[data-course-swiper]").forEach((el) => {
      const slides = el.querySelectorAll(".swiper-slide").length;
      const perView = parseFloat(el.dataset.slides || "1");
      const pagination = el.querySelector(".swiper-pagination");
      new Swiper(el, {
        slidesPerView: perView,
        spaceBetween: 12,
        loop: slides > Math.ceil(perView),
        speed: 600,
        ...(pagination ? { pagination: { el: pagination, clickable: true } } : {}),
        ...(REDUCED || slides < 2
          ? {}
          : { autoplay: { delay: 3500, pauseOnMouseEnter: true, disableOnInteraction: false } }),
      });
    });
  }

  // ---- <dialog> モーダル ----
  document.querySelectorAll("dialog.p-course__modal").forEach((dialog) => {
    // 閉じるボタンをJSで注入（マークアップの重複を避ける）
    const close = document.createElement("button");
    close.type = "button";
    close.className = "p-course__modal-close";
    close.setAttribute("aria-label", "閉じる");
    close.textContent = "×";
    close.addEventListener("click", () => dialog.close());
    dialog.prepend(close);

    // 背景クリックで閉じる
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) dialog.close();
    });
  });

  document.querySelectorAll("[data-modal-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const dialog = document.getElementById(btn.dataset.modalOpen);
      if (dialog && typeof dialog.showModal === "function") dialog.showModal();
    });
  });
})();
