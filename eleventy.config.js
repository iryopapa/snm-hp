import { EleventyHtmlBasePlugin } from "@11ty/eleventy";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

  eleventyConfig.addPassthroughCopy({ "src/asset": "asset" });
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });
  // vendor JS/CSS は node_modules から供給（バージョン管理を pnpm に一元化）
  eleventyConfig.addPassthroughCopy({
    "node_modules/gsap/dist/gsap.min.js": "asset/js/vendor/gsap.min.js",
    "node_modules/gsap/dist/ScrollTrigger.min.js": "asset/js/vendor/ScrollTrigger.min.js",
    "node_modules/swiper/swiper-bundle.min.js": "asset/js/vendor/swiper-bundle.min.js",
    "node_modules/swiper/swiper-bundle.min.css": "asset/css/vendor/swiper-bundle.min.css",
  });

  eleventyConfig.setServerOptions({ showAllHosts: true });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data",
      output: "_site",
    },
    pathPrefix: process.env.PATH_PREFIX || "/",
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
