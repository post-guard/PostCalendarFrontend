import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import {AntDesignVueResolver} from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        Components({
            resolvers: [AntDesignVueResolver()],
            dts: true
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        port: 7790,
        base: "./",
        open: false,
        proxy: {
            '^/postcalendarapi': {
                target: "https://server.rrricardo.top/postcalendarapi",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/postcalendarapi/, "")
            }

        },
        hmr: true,
    },
    base: "/postcalendar/"
});
