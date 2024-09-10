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

// 判断容器内文本是否产生省略号
export const useHasEllipsis = (el: HTMLElement, scale: number = 1) => {
  const range = document.createRange();
  range.setStart(el, 0);
  range.setEnd(el, el.childNodes.length);
  const width = Math.floor(range.getBoundingClientRect().width);
  const height = Math.floor(range.getBoundingClientRect().height);

  // el.clientWidth 不受transform: scale影响，需要手动scale矫正数值
  const clientWidth = Math.ceil(el.clientWidth * scale);
  const clientHeight = Math.ceil(el.clientHeight * scale);

  const { paddingLeft, paddingRight, paddingTop, paddingBottom } =
    getComputedStyle(el);

  return (
    clientWidth <
      width + parseInt(paddingLeft, 10) + parseInt(paddingRight, 10) ||
    clientHeight <
      height + parseInt(paddingTop, 10) + parseInt(paddingBottom, 10)
  );
};
