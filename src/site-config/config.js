import mdSupPlugin from "markdown-it-sup";
import mdSubPlugin from "markdown-it-sub";

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
};
