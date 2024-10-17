import { Ref, computed, onMounted } from "vue";
import type { IMetaPost } from "../support/posts.data.mjs";
import { useData, useRouter } from "vitepress";
import { MONTH_MAP_ABBR } from "../support/utils";
import type { PureThemeConfig } from "../config";

// blog排序
export const useSortPosts = <T extends IMetaPost[]>(posts: Ref<T>) => {
  return computed(() =>
    posts.value.sort(
      (b, p) => new Date(p.date).getTime() - new Date(b.date).getTime()
    )
  );
};

// 格式化blog相关
export const useFormatPost = () => {
  const yearRegExp = /^\d{4}/gi;
  const monthRegExp = /[/\-.](\d{1,2})[/\-.]/gi;
  const dateRegExp = /\d{1,2}$/gi;
  // 格式化年月日 避免时区问题
  const date = (hasYear: boolean, dateStr: string) => {
    yearRegExp.lastIndex = 0;
    monthRegExp.lastIndex = 0;
    dateRegExp.lastIndex = 0;
    let res = "";
    let temp: string[] = monthRegExp.exec(dateStr) ?? ["01", "01"];
    res += MONTH_MAP_ABBR[(temp[1] ?? "01").padStart(2, "0")];
    temp = dateRegExp.exec(dateStr) ?? ["01"];
    res += ` ${temp[0].padStart(2, "0")}`;
    if (hasYear) {
      temp = yearRegExp.exec(dateStr) ?? ["2000"];
      res += `, ${temp[0]}`;
    }
    return res;
  };
  return {
    formatPostDate: date.bind(null, true),
    formatPostDateWithoutYear: date.bind(null, false),
  };
};

// 路由文章详情
export const usePostRoute = () => {
  const router = useRouter();
  return {
    goToArticle: (path: string) => {
      router.go(path);
    },
  };
};

// 初始化valine
export const useValine = () => {
  onMounted(() => {
    const { theme } = useData<PureThemeConfig>();
    import("valine").then(({ default: Valine }) => {
      if (theme.value?.valine) {
        if (!theme.value?.valine?.appId || !theme.value?.valine?.appKey) {
          console.error("请配置valine的appId和appKey");
          return null;
        }
        const inst = new Valine({
          appId: theme.value.valine.appId,
          appKey: theme.value.valine.appKey,
          visitor: true,
        });
        return inst;
      }
    });
  });
};
