import { useData } from "vitepress";
import { defineComponent, h, provide } from "vue";
import type { Component, InjectionKey } from "vue";
import type { PureThemeConfig } from "../config";

export const themeConfig: InjectionKey<PureThemeConfig> = Symbol("themeConfig");

export const configProvider = (component: Component) => {
  return defineComponent(() => {
    const { theme } = useData();
    provide(themeConfig, theme.value);

    return () => h(component, null, {});
  });
};

// 主页底部默认配置
export const homeFooterDefault = {
  text: (count: number) => `查看全部(${count}篇)文章`,
  route: "articles",
  default: true,
};
