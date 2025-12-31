// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  output: 'static',

  build: {
    assets: 'assets',
    // Force ALL stylesheets to be inlined to eliminate render-blocking CSS
    // This removes /assets/index.*.css, /assets/asi-trabajamos.*.css from critical path
    inlineStylesheets: 'always'
  },

  compressHTML: true,
  integrations: [sitemap()],
  site: 'https://synuptic.com'
});