import type { Theme } from "vitepress";
import { configProvider } from "./compositions/configProvider";
import Layout from "./components/layout/index.vue";
import "./assets/style/theme.css";

const pureTheme: Theme = {
  Layout: configProvider(Layout),
};

export default pureTheme;
