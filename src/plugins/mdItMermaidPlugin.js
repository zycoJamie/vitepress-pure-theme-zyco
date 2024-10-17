import { unescapeAll } from "markdown-it/lib/common/utils.js";

const markdownItForMermaid = (mdIt) => {
  const targetRule = "fence";
  const defaultHandler = mdIt.renderer.rules[targetRule];
  mdIt.renderer.rules[targetRule] = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const info = token.info ? unescapeAll(token.info).trim() : "";
    let langName = "";
    let langAttrs = "";

    if (info) {
      const arr = info.split(/(\s+)/g);
      langName = arr[0];
      langAttrs = arr.slice(2).join("");
    }
    if (langName === "mermaid") {
      return `<pre class='mermaid-container' style="visibility:hidden;">${tokens[idx].content}</pre>
      <component is="script">
      (() => {
        const timer = setInterval(async () => {
          if (window.mermaid) {
            await window.mermaid.run({ querySelector: ".mermaid-container" });
            const container = document.querySelector(".mermaid-container");
            if (container) {
              container.style.visibility = "visible";
            }
            clearInterval(timer);
          }
        }, 500);
      })();
      </component>`;
    }
    return defaultHandler(tokens, idx, options, env, self);
  };
};

export default markdownItForMermaid;
