import { resolve, normalize, basename } from "node:path";
import { readdir, copyFile, readFile, rm, constants } from "node:fs/promises";
import matter from "gray-matter";
import { normalizePath } from "vite";
import MarkdownIt from "markdown-it";

export default function blogArchivePlugin() {
  const virtualModule = "virtual:blog/archive/usePosts";
  const resolvedVirtualModule = "\0" + virtualModule;
  let viteConfig = null;
  let posts = {
    all: [], // 完整博客列表并按时间倒序
    date: {}, // 按年分类并排序
    class: {}, // 按照类别分类&&年月日排序
    dateTags: [], // 博客的所有year标签
    classTags: [], // 博客的所有class标签
  };
  const DEFAULT_CLASS = "class";
  const DEFAULT_YEAR = "2000";
  const mdInst = new MarkdownIt({ html: true });
  const REF_END = "&ref:end&"; // 自定义“>“引用段落结束符号
  return {
    name: "vite-plugin-vitepress-blog-archive",
    enforce: "post",
    async buildStart() {
      // project root of the VitePress site
      const rootDoc = global.VITEPRESS_CONFIG.root;
      // 用户主题配置中设置的博客目录
      const userConfigPostDir =
        globalThis.VITEPRESS_CONFIG.site.themeConfig.postDir || "/posts";
      const postDir = resolve(rootDoc, `./${normalize(userConfigPostDir)}`);

      // POSIX规范的博客路径
      const postDirWithoutCwd = `${normalizePath(
        `/${normalizePath(userConfigPostDir)}`
      )}`;

      let fileList = await readdir(postDir, { withFileTypes: true });
      fileList = fileList.filter(
        (file) => file.isFile() && /\.md$/gi.test(file.name)
      );
      let contentList = await Promise.allSettled(
        fileList.map((file) => {
          return readFile(normalize(`${postDir}/${file.name}`), {
            encoding: "utf8",
          });
        })
      );
      contentList = contentList.map((item, idx) => {
        item.fileName = fileList[idx].name;
        return item;
      });
      const postListWithClasses = contentList
        .filter((item) => item.status === "fulfilled")
        .map((item) => {
          const frontMatter = matter(item.value);
          // 自动给含有文本内容的博客生成摘要
          let brief = "";
          mdInst.parseInline(frontMatter.content).map((inline) => {
            (inline.children ?? []).map((token) => {
              if (
                (token.type === "text" && !token.markup) ||
                (token.type === "code_inline" && token.markup === "``")
              ) {
                let content = token.content;
                if (
                  /^(>\s*)+/gi.test(token.content) &&
                  inline.content.includes("\\" + token.content)
                ) {
                  brief += "\\";
                } else if (/^(>\s*)+/gi.test(token.content)) {
                  content += REF_END;
                }
                brief += content;
              }
            });
          });

          if (brief) {
            // 处理所有‘#’
            let newBrief = brief.replaceAll("#", "");
            // 判断 brief 截取字符后是否截断了 REF_END
            newBrief = newBrief.slice(0, 100);
            let briefTemp = brief.slice(92, 108);
            if (briefTemp.includes(REF_END)) {
              // 拼上REF_END被截断的部分
              newBrief += REF_END.slice(
                99 - 92 - briefTemp.indexOf(REF_END) + 1
              );
            }
            // 处理多余的'>'
            const restRefIdx = newBrief.lastIndexOf(">");
            if (
              restRefIdx > newBrief.lastIndexOf(REF_END) &&
              (!~newBrief.lastIndexOf("\\>") ||
                newBrief.lastIndexOf("\\>") + 1 !== restRefIdx)
            ) {
              newBrief =
                newBrief.slice(0, restRefIdx) +
                "\0" +
                newBrief.slice(restRefIdx + 1);
            }

            const refRE = new RegExp(`(?<!\\\\)(>\s*(.*?)${REF_END})`, "ig");
            brief = newBrief.replace(refRE, (_, __, wrapped) => {
              wrapped = wrapped.trim();
              return wrapped ? ` <code>${wrapped}</code> ` : wrapped;
            });
          }

          return {
            ...(frontMatter.data || {}),
            fileName: item.fileName,
            brief: brief ? `${brief}...` : "",
          };
        });

      const normalFileNameReg = /^(\d{4})-(.+)-(.+)$/gi;
      const yearReg = /^\d{4}/gi;
      let pendingTreatData = postListWithClasses.map((fileMatter) => {
        yearReg.lastIndex = 0;
        const resYear = yearReg.exec(fileMatter.date);
        const fullYear = resYear ? resYear[0] : DEFAULT_YEAR;
        normalFileNameReg.lastIndex = 0;
        const regRes = normalFileNameReg.exec(fileMatter.fileName);
        const resFileName = regRes ? regRes[3] : fileMatter.fileName;

        // 归档后的新文件名
        const archiveFileName = `${fullYear}-${
          fileMatter.class || DEFAULT_CLASS
        }-${basename(resFileName, ".md")}`;
        // runtime访问文件的url
        const fileUrL = `${postDirWithoutCwd}/${archiveFileName}`;

        copyFile(
          normalize(`${postDir}/${fileMatter.fileName}`),
          normalize(`${postDir}/${archiveFileName}.md`),
          constants.COPYFILE_EXCL
        )
          .then(() => rm(normalize(`${postDir}/${fileMatter.fileName}`)))
          .catch(() => {});
        return {
          ...fileMatter,
          year: fullYear,
          fileName: archiveFileName,
          url: fileUrL,
        };
      });
      /******* 注入数据预处理 *******/
      const mapByYear = {}; // 按年分类
      const mapByClass = {}; // 按类别分类
      pendingTreatData.map((item) => {
        if (!mapByYear[item.year]) {
          mapByYear[item.year] = [];
        }
        if (!mapByClass[item.class || DEFAULT_CLASS]) {
          mapByClass[item.class || DEFAULT_CLASS] = [];
        }
        mapByYear[item.year].push({ ...item });
        mapByClass[item.class || DEFAULT_CLASS].push({ ...item });
      });
      Object.keys(mapByYear).map((year) => {
        // 按年分类，时间倒序
        mapByYear[year].sort((b, p) => {
          const preDate = new Date(p.date);
          const preTime = !!preDate.getTime() ? preDate.getTime() : Date.now();
          const backDate = new Date(b.date);
          const backTime = !!backDate.getTime()
            ? backDate.getTime()
            : Date.now();
          return preTime - backTime;
        });
      });
      posts.date = mapByYear;
      posts.dateTags = Object.keys(mapByYear).reverse();

      Object.keys(mapByClass).map((classes) => {
        // 按类别，时间倒序
        mapByClass[classes].sort((b, p) => {
          const preDate = new Date(p.date);
          const preTime = !!preDate.getTime() ? preDate.getTime() : Date.now();
          const backDate = new Date(b.date);
          const backTime = !!backDate.getTime()
            ? backDate.getTime()
            : Date.now();
          return preTime - backTime;
        });
      });
      posts.class = mapByClass;
      posts.classTags = Object.keys(mapByClass);

      posts.all = Array.prototype.concat.apply(
        [],
        posts.dateTags.map((year) => posts.date[year])
      );
    },
    configResolved(resolvedConfig) {
      viteConfig = resolvedConfig;
    },
    resolveId(id) {
      if (id === virtualModule) {
        return resolvedVirtualModule;
      }
      return null;
    },
    load(id) {
      if (id === resolvedVirtualModule) {
        return `export default () => {
          return { posts: ${JSON.stringify(posts)} };
        };`;
      }
      return null;
    },
    async transform(code, id) {
      let targetFileReg = /\.vue$/gi;
      if (viteConfig.command === "serve") {
        targetFileReg = /\.vue$/gi;
      } else {
        targetFileReg = /\.vue\?vue&type=script/gi;
      }
      if (targetFileReg.test(id)) {
        return {
          code: `import usePosts from '${virtualModule}';\n` + code,
        };
      }
      return null;
    },
  };
}
