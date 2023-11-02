import { useData } from "vitepress";
import { defineComponent, h, provide } from "vue";
import type { Component, InjectionKey } from "vue";
import type { PureThemeConfig } from "../config";

export const themeConfig: InjectionKey<PureThemeConfig> = Symbol("themeConfig");

export const configProvider = (component: Component) => {
  return defineComponent(() => {
    const { theme } = useData();
    console.log(theme.value);
    provide(themeConfig, theme.value);

    return () => h(component, null, {});
  });
};
