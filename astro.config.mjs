import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import robots from 'astro-robots';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { cynaraConfig } from './scripts/load-cynara-config.mjs';
import cynaraBuildAssets from './scripts/astro-build-assets.mjs';

export default defineConfig({
  site: cynaraConfig.site.url,
  image: {
    domains: [
      'i.mahiro.work',
      'sta.mahiro.work',
      's.mahiro.work',
      'headimg.mahiro.work',
      'layrain.cynara.my',
      'www.hvhbbs.de',
      'avatars.githubusercontent.com',
      'pic1.afdiancdn.com',
    ],
  },
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
  integrations: [
    tailwind(),
    mdx(),
    robots({
      sitemap: true,
      policy: [
        {
          userAgent: '*',
          allow: '/',
        },
      ],
    }),
    cynaraBuildAssets(),
  ],
});
