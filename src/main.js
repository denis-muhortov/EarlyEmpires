import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";

import toaster from "./toaster/index";

import "./assets/main.css";



window.global = window;
const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(toaster);
app.mount("#app");
