import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { cynaraConfig } from '../config/cynara';

export async function GET(context: { site: URL | undefined }) {
  const articles = await getCollection('articles', ({ data }) => {
    return data.draft !== true;
  });

  const sortedArticles = articles.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

  return rss({
    title: `${cynaraConfig.site.name} - 专栏`,
    description: cynaraConfig.site.description.zh,
    site: context.site?.toString() ?? cynaraConfig.site.url,
    items: sortedArticles.map((article) => ({
      title: article.data.title,
      pubDate: article.data.pubDate,
      description: article.data.description ?? '',
      link: `/articles/${article.slug}/`,
      categories: article.data.tags ?? [],
      author: article.data.author ?? cynaraConfig.site.name,
    })),
    customData: `<language>zh-cn</language>`,
    stylesheet: '/rss-styles.xsl',
  });
}
