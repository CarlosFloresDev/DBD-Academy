import { defineConfig } from 'astro/config';

// Sitio 100 % estatico. Se despliega en Cloudflare Workers (assets desde ./dist).
export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
  compressHTML: true,
});
