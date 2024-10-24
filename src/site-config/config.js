import mdSupPlugin from "markdown-it-sup";
import mdSubPlugin from "markdown-it-sub";
import blogArchivePlugin from "../plugins/blogArchivePlugin.js";
import mdItMermaidPlugin from "../plugins/mdItMermaidPlugin.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const packagePath = path.resolve(dirname, "../../package.json");
const PackageJson = JSON.parse(fs.readFileSync(packagePath));

export const baseConfig = {
  head: [
    [
      "script",
      {
        src: "https://cdn.jsdelivr.net/npm/mermaid@11.3.0/dist/mermaid.min.js",
      },
    ],
  ],
  cleanUrls: true,
  markdown: {
    theme: "github-light",
    lineNumbers: true,
    html: true,
    config(md) {
      md.use(mdSupPlugin).use(mdSubPlugin).use(mdItMermaidPlugin);
    },
  },
  vite: {
    resolve: {
      alias: {
        "@style-theme": path.resolve(dirname, "..", "..", "./src/assets/style"),
      },
    },
    plugins: [blogArchivePlugin()],
    optimizeDeps: {
      include: [`${PackageJson.name} > valine`],
      /**
       * 开发模式下，Symbol变量被提取进入单独模块，导致存在两个同名的Symbol变量
       * 详情：https://github.com/vuejs/vitepress/issues/3292
       */
      exclude: [PackageJson.name],
    },
  },
};
