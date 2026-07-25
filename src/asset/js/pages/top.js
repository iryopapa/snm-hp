// トップページ専用: ティッカー回転・Swiper初期化・OCカレンダー描画
(() => {
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- 最新NEWSティッカー（1行ずつフェード切替） ----
  const ticker = document.querySelector("[data-ticker]");
  if (ticker) {
    const items = [...ticker.children];
    if (!REDUCED && items.length > 1) {
      let idx = 0;
      setInterval(() => {
        items[idx].classList.remove("is-active");
        idx = (idx + 1) % items.length;
        items[idx].classList.add("is-active");
      }, 4500);
    }
  }

  // ---- Swiper ----
  if (window.Swiper) {
    if (document.querySelector(".js-program-slide")) {
      new Swiper(".js-program-slide", {
        loop: true,
        slidesPerView: "auto",
        spaceBetween: 12,
        centeredSlides: true,
        speed: 600,
        ...(REDUCED
          ? {}
          : { autoplay: { delay: 3000, pauseOnMouseEnter: true, disableOnInteraction: false } }),
      });
    }
    if (document.querySelector(".js-schedule-slider")) {
      new Swiper(".js-schedule-slider", {
        slidesPerView: 2.5,
        spaceBetween: 8,
        navigation: {
          nextEl: ".p-top__schedule .swiper-button-next",
          prevEl: ".p-top__schedule .swiper-button-prev",
        },
      });
    }
  }

  // ---- オープンキャンパス カレンダー ----
  const calRoot = document.querySelector("[data-oc-calendar]");
  if (!calRoot) return;

  const DETAIL_URL = window.SITE_BASE + "opencampus/calendar/";
  const DOW_LABELS = ["日", "月", "火", "水", "木", "金", "土"];
  const TYPE_ORDER = ["oc", "bus", "sp_events", "special", "guidance"];
  const typeOf = (cls) => {
    if (cls.includes("bus")) return "bus";
    if (cls.includes("oc")) return "oc";
    if (cls.includes("sp_events")) return "sp_events";
    if (cls.includes("special") || cls.includes("briefing")) return "special";
    return "guidance"; // guidance / session
  };

  fetch(window.SITE_BASE + "asset/data/oc-calendar.json")
    .then((r) => r.json())
    .then((data) => {
      // データ先頭に過年度のゴミ日付が混在するため 2026-07 以降のみ採用
      const events = new Map(); // "YYYY-MM-DD" -> type
      data
        .filter((e) => e.start >= "2026-07-01")
        .forEach((e) => {
          const t = typeOf(e.className || "");
          const prev = events.get(e.start);
          if (!prev || TYPE_ORDER.indexOf(t) < TYPE_ORDER.indexOf(prev)) events.set(e.start, t);
        });
      const months = [...new Set([...events.keys()].map((d) => d.slice(0, 7)))].sort();
      if (!months.length) return;
      let idx = 0;

      calRoot.innerHTML = "";
      const nav = document.createElement("div");
      nav.className = "p-top__cal-nav";
      const prevBtn = Object.assign(document.createElement("button"), { type: "button", textContent: "<" });
      const nextBtn = Object.assign(document.createElement("button"), { type: "button", textContent: ">" });
      prevBtn.setAttribute("aria-label", "前の月");
      nextBtn.setAttribute("aria-label", "次の月");
      const label = document.createElement("p");
      label.className = "label";
      nav.append(prevBtn, label, nextBtn);
      const grid = document.createElement("div");
      grid.className = "p-top__cal-grid";
      const more = document.createElement("p");
      more.className = "p-top__calendar-more";
      const moreLink = document.createElement("a");
      moreLink.href = DETAIL_URL;
      moreLink.textContent = "開催日程の詳細を見る";
      more.append(moreLink);
      calRoot.append(nav, grid, more);

      const render = () => {
        const [y, m] = months[idx].split("-").map(Number);
        label.textContent = `${y}年${m}月`;
        prevBtn.disabled = idx === 0;
        nextBtn.disabled = idx === months.length - 1;
        grid.innerHTML = "";
        DOW_LABELS.forEach((d, i) => {
          const el = document.createElement("span");
          el.className = "dow" + (i === 0 ? " sun" : i === 6 ? " sat" : "");
          el.textContent = d;
          grid.append(el);
        });
        const first = new Date(y, m - 1, 1);
        const days = new Date(y, m, 0).getDate();
        for (let i = 0; i < first.getDay(); i++) grid.append(document.createElement("span"));
        for (let d = 1; d <= days; d++) {
          const key = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
          const type = events.get(key);
          let cell;
          if (type) {
            cell = document.createElement("a");
            cell.href = `${DETAIL_URL}#${key}`;
            cell.className = `p-top__cal-day is-${type}`;
          } else {
            cell = document.createElement("span");
            cell.className = "p-top__cal-day";
          }
          cell.textContent = d;
          grid.append(cell);
        }
      };
      prevBtn.addEventListener("click", () => { if (idx > 0) { idx--; render(); } });
      nextBtn.addEventListener("click", () => { if (idx < months.length - 1) { idx++; render(); } });
      render();
    })
    .catch(() => { /* fetch失敗時はフォールバックリンクをそのまま残す */ });
})();
