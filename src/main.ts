// src\main.ts

import { createApp } from "vue";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import App from "./App.vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import Message from "primevue/message";

const app = createApp(App);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});
app.component("PrimeButton", Button);
app.component("PrimeDialog", Dialog);
app.component("PrimeMessage", Message);
app.mount("#app");
