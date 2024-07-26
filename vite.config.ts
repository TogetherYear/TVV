import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

import path from 'path';

export default defineConfig({
    clearScreen: false,
    plugins: [
        vue({
            script: {
                defineModel: true
            }
        })
    ],
    resolve: {
        alias: {
            '@': path.resolve('Src')
        }
    },
    build: {
        target: ['esnext'],
        minify: 'esbuild',
        sourcemap: false,
        emptyOutDir: true,
        assetsDir: 'Source',
        rollupOptions: {
            output: {
                manualChunks: (id: string) => {
                    if (id.includes('node_modules')) {
                        return 'Vendor';
                    }
                }
            }
        }
    },
    base: './',
    envDir: './Env',
    root: path.join(__dirname, ''),
    publicDir: 'Public',
    server: {
        port: 6768,
        strictPort: true
    }
});
