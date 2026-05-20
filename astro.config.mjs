import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
    site: 'https://hashiwaacademy.id',
    output: 'server',
    adapter: netlify(),
    security: {
        checkOrigin: false,
    },
});
