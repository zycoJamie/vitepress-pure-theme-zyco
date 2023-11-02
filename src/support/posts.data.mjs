import { createContentLoader } from "vitepress";

const postDir =
  globalThis.VITEPRESS_CONFIG.site.themeConfig.postDir || "/posts";

export default createContentLoader(`${postDir}/*.md`);
