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
      /**
       * 使用ClientOnly包裹的原因
       * 在生产环境下，vitepress调用vue的ssr方法renderToString，这会将标签内的文本转义，导致两个问题
       * 1. script内的js出现语法错误，不能执行
       * 2. hydration mismatch
       */
      return `<pre class='mermaid-container' style="visibility:hidden;">${tokens[idx].content}</pre>
      <ClientOnly>
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
        </component>
      </ClientOnly>`;
    }
    return defaultHandler(tokens, idx, options, env, self);
  };
};

export default markdownItForMermaid;
