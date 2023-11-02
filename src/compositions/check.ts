import { useRoute } from "vitepress";

export const useMatchPath = () => {
  const route = useRoute();
  console.log(route.path);
  return (targetPath: string) => {
    return route.path === targetPath;
  };
};
