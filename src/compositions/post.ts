import { Ref, computed } from "vue";
import type { IMetaPost } from "../support/posts.data.mjs";
import { useRouter } from "vitepress";

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
  const date = (dateStr: string) => {
    return new Date(dateStr).toDateString();
  };
  return {
    formatPostDate: date,
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
