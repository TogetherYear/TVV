import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import path from 'path'

export default defineConfig({
    clearScreen: false,
    plugins: [
        vue({
            script: {}
        })
    ],
    resolve: {
        alias: {
            '@': path.resolve('src')
        }
    },
    build: {
        target: ['esnext'],
        minify: 'esbuild',
        sourcemap: false
    },
    optimizeDeps: {
        include: ['axios']
    },
    base: './',
    envDir: './env',
    envPrefix: ['VITE_', 'TAURI_'],
    server: {
        port: 6768,
        strictPort: true,
    }
})
