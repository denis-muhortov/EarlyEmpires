import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { sentryVitePlugin } from "@sentry/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // sentryVitePlugin({
    //   org: "llc-15",
    //   project: "earlyempire",

    //   // Specify the directory containing build artifacts
    //   include: "./dist",

    //   // Auth tokens can be obtained from https://sentry.io/settings/account/api/auth-tokens/
    //   // and needs the `project:releases` and `org:read` scopes
    //   authToken: '5d50a1356a5a4d74aa4908597494b1ede5f4eeedfdd2440fa2029052d3714bbf',

    //   // Optionally uncomment the line below to override automatic release name detection
    //   // release: process.env.RELEASE,
    // }),

  ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  define: {
		//global: "globalThis",
	},
  build: {
    sourcemap: true,
    //outDir: '../game.empires.com',
    //emptyOutDir: true,
    //publicDir : './public',
    //minify: false
  },
});


// https://vitejs.dev/config/
