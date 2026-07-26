// トップページ・オープニング演出（GSAP timeline）
// 筆記体タイトルのペン風ワイプ → 背景写真フォーカス → 左右レール出現 → CTAカード着地
(() => {
  if (!document.body.classList.contains("p-top")) return;
  if (typeof gsap === "undefined") return;

  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    // 筆記体「Future is yours」: 左からのソフトワイプ（手書きの走り書き風）
    tl.fromTo(
      ".p-top__mv-title img",
      { clipPath: "inset(0 100% 0 0)", autoAlpha: 1 },
      { clipPath: "inset(0 -8% 0 0)", duration: 1.6, ease: "power1.inOut" }
    )
      .from(".p-top__mv-bg img", { autoAlpha: 0, scale: 1.06, duration: 1.4 }, 0.15)
      .from(".p-top__mv-circle", { autoAlpha: 0, scale: 0.6, ease: "back.out(1.7)", duration: 0.7 }, 1.2)
      .from(".l-rail--left", { autoAlpha: 0, duration: 0.8 }, 0.6)
      .from(".l-rail--right", { autoAlpha: 0, x: 24, duration: 0.9 }, 0.8)
      .from(".l-rail__cta-cards .c-cta-card", { autoAlpha: 0, y: 20, stagger: 0.12, duration: 0.5 }, 1.3)
      .from(".p-top__ticker", { autoAlpha: 0, y: 12, duration: 0.5 }, 1.6);

    // 左右レールのパララックス（視差6%以下・scrub）
    if (typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
      gsap.to(".l-rail__inner--left", {
        yPercent: -5,
        ease: "none",
        scrollTrigger: { trigger: document.body, start: "top top", end: "max", scrub: 0.6 },
      });
      gsap.fromTo(
        ".l-rail--right",
        { backgroundPosition: "center 100%" },
        {
          backgroundPosition: "center 88%",
          ease: "none",
          scrollTrigger: { trigger: document.body, start: "top top", end: "max", scrub: 0.8 },
        }
      );
    }

    return () => tl.kill();
  });
})();
