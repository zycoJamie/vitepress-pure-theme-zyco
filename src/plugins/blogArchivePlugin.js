import { resolve, normalize, basename } from "node:path";
import { readdir, copyFile, readFile, rm, constants } from "node:fs/promises";
import { cwd } from "node:process";
import matter from "gray-matter";

export default function getFilesOnDisk(config) {
  return {
    name: "vite-plugin-vitepress-blog-archive",
    async buildStart() {
      const postDir = resolve(
        cwd(),
        `./${normalize(config.postDir || "/posts")}`
      );

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
      console.log(postListWithClasses);

      const normalFileNameReg = /^(\d{4})-(\d{1,})-(\d{1,})-(.+)-(.+)$/gi;
      postListWithClasses.map((fileMatter) => {
        const date = new Date(fileMatter.date);
        normalFileNameReg.lastIndex = 0;
        const regRes = normalFileNameReg.exec(fileMatter.fileName);
        const resFileName = regRes ? regRes[5] : fileMatter.fileName;
        copyFile(
          normalize(`${postDir}/${fileMatter.fileName}`),
          normalize(
            `${postDir}/${date.getFullYear()}-${String(
              date.getMonth() + 1
            ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}-${
              fileMatter.class || "class"
            }-${basename(resFileName, ".md")}.md`
          ),
          constants.COPYFILE_EXCL
        )
          .then(() => rm(normalize(`${postDir}/${fileMatter.fileName}`)))
          .catch(() => {});
      });
    },
  };
}
