import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { sentryVitePlugin } from "@sentry/vite-plugin";


const RELEASE_VER = "0.9.3";

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    "process.env.RELEASE_VER": `"${RELEASE_VER}"`, 
    "process.env.SENTRYDSN": `${"https://4d6e447a637d45a2bcdae572aa374e6b@o4504537608290304.ingest.sentry.io/4504537611567104"}`,
	},
  plugins: [
    vue(),
    sentryVitePlugin({
      org: "llc-15",
      project: "earlyempire",

      // Specify the directory containing build artifacts
      include: "./dist",

      // Auth tokens can be obtained from https://sentry.io/settings/account/api/auth-tokens/
      // and needs the `project:releases` and `org:read` scopes
      authToken: '5d50a1356a5a4d74aa4908597494b1ede5f4eeedfdd2440fa2029052d3714bbf',

      // Optionally uncomment the line below to override automatic release name detection
      release: RELEASE_VER,
    }),

  ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  build: {
    sourcemap: 'hidden',
    //outDir: '../game.empires.com',
    //emptyOutDir: true,
    //publicDir : './public',
    //minify: false
  },
});


// https://vitejs.dev/config/
