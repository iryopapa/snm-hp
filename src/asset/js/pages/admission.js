// admissionセクション専用: 出願フロー・ロードマップ描画（Phase 3）
// 点線レールをSVG化し、ScrollTrigger scrub で進捗線が伸びる。
// 線の到達に合わせて各ステップ番号へ .is-lit を付与（逆スクロールで消灯も可）。
(() => {
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const flows = document.querySelectorAll(".p-admission__flow");
  if (!flows.length) return;

  // reduced-motion / GSAP不在時: CSSの点線レールを残し、全ステップ点灯済みで静的表示
  if (REDUCED || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    flows.forEach((flow) =>
      flow.querySelectorAll("[data-flow-step]").forEach((li) => li.classList.add("is-lit"))
    );
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  const SVGNS = "http://www.w3.org/2000/svg";
  const RAIL_INSET = 12; // CSSレール（top:12px / bottom:12px）と揃える

  flows.forEach((flow) => {
    const items = [...flow.querySelectorAll("[data-flow-step]")];
    if (!items.length) return;

    // SVGレール生成（base=点線の下地 / progress=伸びる実線）
    const svg = document.createElementNS(SVGNS, "svg");
    svg.setAttribute("class", "p-admission__flow-svg");
    svg.setAttribute("aria-hidden", "true");
    const makeLine = (cls) => {
      const l = document.createElementNS(SVGNS, "line");
      l.setAttribute("class", cls);
      l.setAttribute("x1", "1");
      l.setAttribute("x2", "1");
      l.setAttribute("y1", "0");
      svg.appendChild(l);
      return l;
    };
    const base = makeLine("is-base");
    const prog = makeLine("is-progress");
    flow.prepend(svg);
    flow.classList.add("is-svg-rail"); // CSS ::before の点線を無効化

    let railH = 0;
    const measure = () => {
      railH = Math.max(0, flow.offsetHeight - RAIL_INSET * 2);
      base.setAttribute("y2", railH);
      prog.setAttribute("y2", railH);
      prog.style.strokeDasharray = railH;
    };

    const setProgress = (p) => {
      prog.style.strokeDashoffset = railH * (1 - p);
      const tipY = RAIL_INSET + railH * p; // 線の先端（flow上端基準）
      items.forEach((li) => {
        const num = li.querySelector(".p-admission__flow-num");
        const centerY = li.offsetTop + (num ? num.offsetTop + num.offsetHeight / 2 : 22);
        li.classList.toggle("is-lit", tipY >= centerY - 2);
      });
    };

    measure();
    const st = ScrollTrigger.create({
      trigger: flow,
      start: "top 72%",
      end: "bottom 60%",
      scrub: 0.4,
      onUpdate: (self) => setProgress(self.progress),
      onRefresh: (self) => {
        measure();
        setProgress(self.progress);
      },
    });

    // 画像遅延読込などでフロー高さが変わったら再計測（debounce）
    let t;
    new ResizeObserver(() => {
      clearTimeout(t);
      t = setTimeout(() => ScrollTrigger.refresh(), 200);
    }).observe(flow);
  });
})();
