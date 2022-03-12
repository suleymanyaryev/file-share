import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dotenv from "dotenv";

export default () => {
    dotenv.config({ path: `./.env` });

    return defineConfig({
        plugins: [vue()],
        base: "",
        server: {
            port: +process.env.PORT || 3000,
            host: process.env.HOST || "0.0.0.0",

            proxy: {
                "/api": {
                    target: process.env.PROXY_URL || "http://127.0.0.1:8080",
                    changeOrigin: true,
                },
            },
        },

        preview: {
            port: +process.env.PORT || 3000,
            host: process.env.HOST || "0.0.0.0",
        },

        resolve: {
            alias: {
                "@": fileURLToPath(new URL("./src", import.meta.url)),
            },
        },

        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `@import "./src/assets/scss/base/variables";`,
                },
            },
        },
    });
};
