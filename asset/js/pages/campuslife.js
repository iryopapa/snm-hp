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

  // ---- 施設紹介: キャンパス・ツアー・スクロールテリング（Phase 3） ----
  // スパイク検証済み: 本レイアウト（中央390pxカラム・container-type:inline-size）でも
  // ScrollTriggerの標準pin（pinType:fixed）が座標ズレなく成立する。
  // ページ内の各 [data-tour-stop] から代表写真とエリア名を収集し、JSが組み立てた
  // 写真フレームをpin。scrubで写真がクロスフェード切替＋右端に現在地ドット＋エリア名バッジ。
  // reduced-motion / GSAP不在時はビューア自体を生成しない（既存コンテンツのみ表示）。
  (() => {
    const stops = [...document.querySelectorAll("[data-tour-stop]")];
    if (stops.length < 2 || REDUCED) return;
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    // 各stopの代表写真（本文で使用済みの画像を再利用）とエリア名（本文の見出しを再利用）
    const data = stops
      .map((sec) => {
        const img = sec.querySelector(".head-img img, .imgs img, .swiper-slide img, .img img, img");
        if (!img) return null;
        const labelEl =
          sec.querySelector(".ttl .strong") ||
          sec.querySelector(".ttl .title") ||
          sec.querySelector(".body .ttl") ||
          sec.querySelector(".ttl");
        return {
          src: img.currentSrc || img.src,
          label: labelEl ? labelEl.textContent.replace(/\s+/g, " ").trim() : "",
        };
      })
      .filter(Boolean);
    if (data.length < 2) return;

    // ビューア組み立て（sectionでなくdivにして nth-of-type の縞背景を崩さない）
    const viewer = document.createElement("div");
    viewer.className = "p-campuslife__tour";
    viewer.setAttribute("aria-hidden", "true"); // 本文写真・見出しの装飾的な再掲のため
    const frame = document.createElement("div");
    frame.className = "p-campuslife__tour-frame";
    const photos = document.createElement("div");
    photos.className = "p-campuslife__tour-photos";
    data.forEach((d) => {
      const im = new Image();
      im.src = d.src;
      im.alt = "";
      im.decoding = "async";
      photos.appendChild(im);
    });
    const badge = document.createElement("p");
    badge.className = "p-campuslife__tour-badge";
    badge.innerHTML = '<span class="en">CAMPUS TOUR</span><b class="num"></b><span class="name"></span>';
    const dots = document.createElement("ol");
    dots.className = "p-campuslife__tour-dots";
    data.forEach(() => dots.appendChild(document.createElement("li")));
    frame.append(photos, badge, dots);
    viewer.appendChild(frame);
    stops[0].parentNode.insertBefore(viewer, stops[0]);

    const imgs = [...photos.children];
    const dotEls = [...dots.children];
    const badgeNum = badge.querySelector(".num");
    const badgeName = badge.querySelector(".name");
    let cur = -1;

    const render = (progress) => {
      const idx = progress * (data.length - 1);
      imgs.forEach((im, i) => {
        const near = Math.max(0, 1 - Math.abs(idx - i)); // 隣接写真とだけクロスフェード
        im.style.opacity = near;
        im.style.transform = `scale(${1.08 - 0.08 * near})`;
      });
      const n = Math.round(idx);
      if (n !== cur) {
        cur = n;
        badgeNum.textContent = String(n + 1).padStart(2, "0");
        badgeName.textContent = data[n].label;
        gsap.fromTo(badge, { x: 14, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.35, ease: "power2.out", overwrite: "auto" });
        dotEls.forEach((d, i) => d.classList.toggle("is-on", i === n));
      }
    };

    const headerH = document.querySelector(".c-header")?.offsetHeight || 0;
    ScrollTrigger.create({
      trigger: viewer,
      start: () => "top " + (headerH + 8),
      end: () => "+=" + Math.round(window.innerHeight * 0.42 * data.length),
      pin: true,
      scrub: 0.3,
      anticipatePin: 1,
      onUpdate: (self) => render(self.progress),
      onRefresh: (self) => render(self.progress),
    });
  })();

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
