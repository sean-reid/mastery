import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://seanre.id',
  base: '/mastery',
  build: {
    assets: '_assets',
  },
  vite: {
    build: {
      cssMinify: true,
    },
  },
});
