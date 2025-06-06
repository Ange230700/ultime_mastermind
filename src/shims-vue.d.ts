// src/shims-vue.d.ts
declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<Record<string, unknown>, unknown, unknown>;
  export default component;
}
