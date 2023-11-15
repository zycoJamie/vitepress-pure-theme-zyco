import { useData, useRoute } from "vitepress";
import type { PureThemeConfig } from "../config";

export const useMatchPath = () => {
  const route = useRoute();
  return (targetPath: string) => {
    return route.path === targetPath;
  };
};

// 是否属于文章详情路径
export const useMatchPostPath = () => {
  const route = useRoute();
  const { theme } = useData<PureThemeConfig>();
  return {
    matchPostPath: () =>
      route.path.startsWith(theme.value.postDir ?? "/posts/"),
  };
};
