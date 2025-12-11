// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  output: 'static',

  build: {
    assets: 'assets'
  },

  compressHTML: true,
  integrations: [sitemap()],
  site: 'https://synuptic.com'
});