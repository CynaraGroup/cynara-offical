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
