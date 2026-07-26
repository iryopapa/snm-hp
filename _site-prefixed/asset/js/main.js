// 共通UI: グローバルメニュー開閉・訪問者ドロップダウンの外側クリック閉じ
(() => {
  const btn = document.querySelector("[data-menu-toggle]");
  const menu = document.getElementById("global-menu");
  if (btn && menu) {
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      menu.hidden = open;
      document.documentElement.style.overflow = open ? "" : "hidden";
    });
    menu.addEventListener("click", (e) => {
      if (e.target.closest("a")) {
        btn.setAttribute("aria-expanded", "false");
        menu.hidden = true;
        document.documentElement.style.overflow = "";
      }
    });
  }

  document.addEventListener("click", (e) => {
    document.querySelectorAll("details.c-visitor-drop[open]").forEach((d) => {
      if (!d.contains(e.target)) d.removeAttribute("open");
    });
  });

  // 年次タブ（c-tab）: aria準拠の最小実装
  document.querySelectorAll("[data-tabs]").forEach((root) => {
    const btns = [...root.querySelectorAll(".c-tab__btn")];
    const panels = [...root.querySelectorAll(".c-tab__panel")];
    btns.forEach((b, i) => {
      b.setAttribute("role", "tab");
      b.addEventListener("click", () => {
        btns.forEach((x, j) => {
          x.setAttribute("aria-selected", String(i === j));
          if (panels[j]) panels[j].hidden = i !== j;
        });
      });
    });
  });
})();
