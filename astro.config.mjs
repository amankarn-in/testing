import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'amankarn.in';
const isUserSite = repository.endsWith('.github.io');
const site = process.env.PUBLIC_SITE_URL ?? 'https://amankarn.github.io';

const rawBase = process.env.PUBLIC_BASE_PATH ?? (isUserSite ? '/' : `/${repository}/`);
const base = rawBase === '/' ? '/' : `/${rawBase.replace(/^\/|\/$/g, '')}/`;

export default defineConfig({
  site: 'https://amankarn-in.github.io',
  base: '/testing/',
  output: 'static',
  trailingSlash: 'always',
  integrations: [mdx(), sitemap()]
});
