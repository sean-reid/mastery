import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://sean-reid.github.io',
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
