import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        VitePWA({
            includeAssets: [
                'favicon.png',
                'favicon.ico',
                'robots.txt',
                'apple-touch-icon.png',
                'fonts/source-sans-pro-v21-latin-regular.woff2',
                'fonts/source-sans-pro-v21-latin-regular.woff'
            ],
            manifest: {
                name: 'Socketfox',
                short_name: 'Socketfox',
                description: 'Allows you to connect and send data to different websocket URLs and manage those connections efficiently',
                theme_color: '#ffffff',
                icons: [
                    {
                        src: 'pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable'
                    }
                ]
            }
        })
    ]
})
