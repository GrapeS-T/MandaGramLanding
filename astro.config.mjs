import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://mandagram.com',
  // JSON endpoints are files; page links retain their directory-style slash.
  trailingSlash: 'ignore',
  build: {
    assets: '_a',
    format: 'directory',
    inlineStylesheets: 'always'
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover'
  }
});
