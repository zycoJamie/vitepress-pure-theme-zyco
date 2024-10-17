declare module "*.vue" {
  import { DefineComponent } from "vue";
  const c: DefineComponent;
  export default c;
}

declare module "valine";
