import mdSupPlugin from "markdown-it-sup";
import mdSubPlugin from "markdown-it-sub";
import blogArchivePlugin from "../plugins/blogArchivePlugin.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packagePath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../package.json"
);
const PackageJson = JSON.parse(fs.readFileSync(packagePath));

export const baseConfig = {
  cleanUrls: true,
  markdown: {
    theme: "github-light",
    lineNumbers: true,
    html: true,
    config(md) {
      md.use(mdSupPlugin).use(mdSubPlugin);
    },
  },
  vite: {
    plugins: [blogArchivePlugin({ postDir: "/posts" })],
    optimizeDeps: {
      /**
       * 开发模式下，Symbol变量被提取进入单独模块，导致存在两个同名的Symbol变量
       * 详情：https://github.com/vuejs/vitepress/issues/3292
       */
      exclude: [PackageJson.name],
    },
  },
};
