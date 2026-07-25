// opencampusセクション専用: 写真Swiper・プログラムフィルタ・OCカレンダー描画・バス運行日切替
(() => {
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- 写真スライダー（Swiper） ----
  if (window.Swiper && document.querySelector(".js-oc-photo-slide")) {
    new Swiper(".js-oc-photo-slide", {
      loop: true,
      slidesPerView: "auto",
      spaceBetween: 0,
      speed: 8000,
      ...(REDUCED
        ? {}
        : { autoplay: { delay: 0, pauseOnMouseEnter: true, disableOnInteraction: false } }),
    });
  }

  // ---- プログラム カテゴリフィルタ（data属性切替） ----
  const filter = document.querySelector("[data-program-filter]");
  if (filter) {
    const buttons = [...filter.querySelectorAll("button[data-cat]")];
    const items = [...document.querySelectorAll("[data-program-item]")];
    const apply = (cat) => {
      buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.cat === cat)));
      items.forEach((el) => {
        el.hidden = cat !== "all" && el.dataset.cat !== cat;
      });
    };
    buttons.forEach((b) => b.addEventListener("click", () => apply(b.dataset.cat)));
  }

  // ---- バス運行日切替 ----
  const busSelect = document.querySelector("[data-bus-select]");
  if (busSelect) {
    const days = [...document.querySelectorAll("[data-bus-day]")];
    busSelect.addEventListener("change", () => {
      days.forEach((d) => { d.hidden = d.dataset.busDay !== busSelect.value; });
    });
  }

  // ---- OCカレンダー（共通ヘルパ） ----
  const DOW_LABELS = ["日", "月", "火", "水", "木", "金", "土"];
  const TYPE_ORDER = ["oc", "bus", "sp_events", "special", "guidance"];
  const typeOf = (cls) => {
    if (cls.includes("bus")) return "bus";
    if (cls.includes("oc")) return "oc";
    if (cls.includes("sp_events")) return "sp_events";
    if (cls.includes("special") || cls.includes("briefing")) return "special";
    return "guidance"; // guidance / session
  };
  const loadEvents = () =>
    fetch(window.SITE_BASE + "asset/data/oc-calendar.json")
      .then((r) => r.json())
      .then((data) => {
        // データ先頭に過年度のゴミ日付（1970-01-01等）が混在するため 2026-07 以降のみ採用
        const events = new Map(); // "YYYY-MM-DD" -> type
        data
          .filter((e) => e.start >= "2026-07-01")
          .forEach((e) => {
            const t = typeOf(e.className || "");
            const prev = events.get(e.start);
            if (!prev || TYPE_ORDER.indexOf(t) < TYPE_ORDER.indexOf(prev)) events.set(e.start, t);
          });
        return events;
      });

  const buildMonthGrid = (y, m, events, hrefFor) => {
    const grid = document.createElement("div");
    grid.className = "p-opencampus__cal-grid";
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
      const href = type ? hrefFor(key) : null;
      if (href) {
        cell = document.createElement("a");
        cell.href = href;
        cell.className = `p-opencampus__cal-day is-${type}`;
      } else {
        cell = document.createElement("span");
        cell.className = "p-opencampus__cal-day" + (type ? ` is-${type}` : "");
      }
      cell.textContent = d;
      grid.append(cell);
    }
    return grid;
  };

  // ---- /opencampus/ : 月送りカレンダー ----
  const calRoot = document.querySelector("[data-oc-calendar]");
  if (calRoot) {
    const DETAIL_URL = window.SITE_BASE + "opencampus/calendar/";
    loadEvents()
      .then((events) => {
        const months = [...new Set([...events.keys()].map((d) => d.slice(0, 7)))].sort();
        if (!months.length) return;
        let idx = 0;
        calRoot.replaceChildren();
        const nav = document.createElement("div");
        nav.className = "p-opencampus__cal-nav";
        const prevBtn = Object.assign(document.createElement("button"), { type: "button", textContent: "<" });
        const nextBtn = Object.assign(document.createElement("button"), { type: "button", textContent: ">" });
        prevBtn.setAttribute("aria-label", "前の月");
        nextBtn.setAttribute("aria-label", "次の月");
        const label = document.createElement("p");
        label.className = "label";
        nav.append(prevBtn, label, nextBtn);
        const gridWrap = document.createElement("div");
        const more = document.createElement("p");
        more.className = "p-opencampus__calendar-more";
        const moreLink = document.createElement("a");
        moreLink.href = DETAIL_URL;
        moreLink.textContent = "開催日程の詳細を見る";
        more.append(moreLink);
        calRoot.append(nav, gridWrap, more);
        const render = () => {
          const [y, m] = months[idx].split("-").map(Number);
          label.textContent = `${y}年${m}月`;
          prevBtn.disabled = idx === 0;
          nextBtn.disabled = idx === months.length - 1;
          gridWrap.replaceChildren(buildMonthGrid(y, m, events, (key) => `${DETAIL_URL}#${key}`));
        };
        prevBtn.addEventListener("click", () => { if (idx > 0) { idx--; render(); } });
        nextBtn.addEventListener("click", () => { if (idx < months.length - 1) { idx++; render(); } });
        render();
      })
      .catch(() => { /* fetch失敗時はフォールバックリンクをそのまま残す */ });
  }

  // ---- /opencampus/calendar/ : 全月一覧カレンダー ----
  const calAllRoot = document.querySelector("[data-oc-calendar-all]");
  if (calAllRoot) {
    loadEvents()
      .then((events) => {
        const months = [...new Set([...events.keys()].map((d) => d.slice(0, 7)))].sort();
        if (!months.length) return;
        calAllRoot.replaceChildren();
        months.forEach((ym) => {
          const [y, m] = ym.split("-").map(Number);
          const sec = document.createElement("section");
          sec.className = "p-opencampus__cal-month";
          const h = document.createElement("h3");
          h.className = "p-opencampus__cal-month-ttl";
          h.textContent = `${y}年${m}月`;
          // 同ページ内のイベントアンカー（id="YYYY-MM-DD"）が存在する日だけリンク化
          sec.append(h, buildMonthGrid(y, m, events, (key) => (document.getElementById(key) ? `#${key}` : null)));
          calAllRoot.append(sec);
        });
        // 他ページから #YYYY-MM-DD 付きで遷移してきた場合のスクロール補正
        const hash = decodeURIComponent(location.hash.slice(1));
        if (/^\d{4}-\d{2}-\d{2}$/.test(hash)) {
          const target = document.getElementById(hash);
          if (target) requestAnimationFrame(() => target.scrollIntoView());
        }
      })
      .catch(() => { /* fetch失敗時はフォールバック文言をそのまま残す */ });
  }
})();
