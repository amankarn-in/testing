import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context: { site: URL | undefined }) {
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime()
  );

  const rawBase = import.meta.env.BASE_URL;
  const base = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;

  return rss({
    title: 'Senior Odoo Integration Engineer Blog',
    description: 'Production-focused architecture notes for Odoo and ERP integration engineering.',
    site: context.site ?? new URL('https://amankarn.github.io'),
    items: posts.map((post) => {
      const slug = post.id.replace(/\.(md|mdx)$/i, '');
      return {
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.pubDate,
        link: `${base}blog/${slug}/`
      };
    }),
    customData: '<language>en-us</language>'
  });
}
