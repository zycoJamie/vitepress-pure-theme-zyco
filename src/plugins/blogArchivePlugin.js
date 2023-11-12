import { resolve, normalize, basename } from "node:path";
import { readdir, copyFile, readFile, rm, constants } from "node:fs/promises";
import { cwd } from "node:process";
import matter from "gray-matter";
import { normalizePath } from "vite";

export default function blogArchivePlugin(config) {
  const virtualModule = "virtual:blog/archive/usePosts";
  const resolvedVirtualModule = "\0" + virtualModule;
  let viteConfig = null;
  let posts = {
    all: [], // 原始博客列表
    date: [], // 按照年月日排序
    class: {}, // 按照类别分类&&年月日排序
  };
  return {
    name: "vite-plugin-vitepress-blog-archive",
    enforce: "post",
    async buildStart() {
      const postDir = resolve(
        cwd(),
        `./${normalize(config.postDir || "/posts")}`
      );

      // POSIX规范的博客路径
      const postDirWithoutCwd = `${normalizePath(
        `/${normalizePath(config.postDir || "/posts")}`
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
          return {
            ...(frontMatter.data || {}),
            fileName: item.fileName,
          };
        });

      const normalFileNameReg = /^(\d{4})-(.+)-(.+)$/gi;
      const yearReg = /^\d{4}/gi;
      let pendingTreatData = postListWithClasses.map((fileMatter) => {
        yearReg.lastIndex = 0;
        const resYear = yearReg.exec(fileMatter.date);
        const fullYear = resYear ? resYear[0] : "2000";
        normalFileNameReg.lastIndex = 0;
        const regRes = normalFileNameReg.exec(fileMatter.fileName);
        const resFileName = regRes ? regRes[3] : fileMatter.fileName;

        // 归档后的新文件名
        const archiveFileName = `${fullYear}-${
          fileMatter.class || "class"
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
          fileName: archiveFileName,
          url: fileUrL,
        };
      });
      posts.all = pendingTreatData;
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
