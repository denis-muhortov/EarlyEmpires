import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import * as Sentry from "@sentry/vue";

import toaster from "./toaster/index";

import "./assets/main.css";



window.global = window;
const pinia = createPinia();
const app = createApp(App);






Sentry.init({
    app,
    dsn: "https://4d6e447a637d45a2bcdae572aa374e6b@o4504537608290304.ingest.sentry.io/4504537611567104",
    debug: false,
    integrations: [],
    //allowUrls:['earlyempire-nft.com'],
    //tracingOrigins :['*'],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
    logErrors: false,
    //release: '0.0.3'
  });







app.use(pinia);
app.use(toaster);





app.mount("#app");
