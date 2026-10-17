export interface KbHeading {
  level: number;
  id: string;
  text: string;
}

export interface KbArticle {
  slug: string;
  title: string;
  category: string;
  readingTime: string;
  sectionsCount: string;
  prev: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
  headings: KbHeading[];
  content: string;
}

export interface KbCategory {
  title: string;
  description: string;
  articles: Array<{ slug: string; title: string; readTime: string }>;
}

type ArticleSource = Pick<KbArticle, 'slug' | 'title' | 'category' | 'content'>;
const sources = import.meta.glob<ArticleSource>('./articles/*.ts', { eager: true, import: 'default' });
const groups = [
  {
    title: 'Начало работы',
    description: 'Установка, базовые принципы и настройка клиента MandaGram',
    slugs: ['intro', 'installation', 'hotkeys']
  },
  {
    title: 'Разработка плагинов',
    description: 'От первого плагина к практическим сценариям, справочнику C ABI и внутреннему устройству',
    slugs: ['quickstart', 'plugin-recipes', 'examples', 'api', 'api-reference', 'storage', 'hotreload', 'architecture']
  },
  {
    title: 'Функции клиента',
    description: 'Оформление, приватность, VLC-плеер и сетевые настройки',
    slugs: ['themes', 'privacy', 'media', 'proxy']
  },
  {
    title: 'Поддержка',
    description: 'Диагностика ошибок, безопасный режим и каналы связи',
    slugs: ['troubleshooting', 'community']
  }
];

const plainText = (html: string) => html
  .replace(/<[^>]*>/g, ' ')
  .replace(/&(?:lt|gt|amp|quot|apos|nbsp|#39|#92);/g, entity => ({
    '&lt;': '<', '&gt;': '>', '&amp;': '&', '&quot;': '"', '&apos;': "'",
    '&nbsp;': ' ', '&#39;': "'", '&#92;': '\\'
  })[entity] ?? entity)
  .replace(/\s+/g, ' ').trim();

// Articles contain trusted HTML. Read section IDs and headings in document order;
// keep existing section anchors rather than deriving unstable IDs from titles.
function articleHeadings(content: string): Array<KbHeading & { offset: number }> {
  const sections: string[] = [];
  const headings: Array<KbHeading & { offset: number }> = [];
  const ids = new Set<string>();
  const tokens = /<section\b([^>]*)>|<\/section\s*>|<h([23])\b([^>]*)>([\s\S]*?)<\/h\2>/g;
  for (const match of content.matchAll(tokens)) {
    if (match[1] !== undefined) { sections.push(/\bid=["']([^"']+)["']/.exec(match[1])?.[1] ?? ''); continue; }
    if (match[0].startsWith('</section')) { sections.pop(); continue; }
    const id = /\bid=["']([^"']+)["']/.exec(match[3])?.[1] ?? sections.at(-1);
    if (!id || ids.has(id)) throw new Error(`Missing or duplicate heading anchor: ${match[4]}`);
    ids.add(id);
    headings.push({ level: Number(match[2]), id, text: plainText(match[4]), offset: match.index! });
  }
  return headings;
}

const ordered = groups.flatMap(group => group.slugs.map(slug => {
  const source = sources[`./articles/${slug}.ts`];
  if (!source || source.slug !== slug || source.category !== group.title) {
    throw new Error(`Missing or inconsistent KB article: ${slug}`);
  }
  return source;
}));
if (ordered.length !== Object.keys(sources).length) throw new Error('Unlisted KB article');

const sectionsBySlug = new Map(ordered.map(article => [article.slug, articleHeadings(article.content)]));
export const kbArticles: Record<string, KbArticle> = Object.fromEntries(ordered.map((article, index) => {
  const headings = sectionsBySlug.get(article.slug)!;
  const minutes = Math.max(1, Math.ceil(plainText(article.content).split(' ').length / 150));
  return [article.slug, {
    ...article,
    readingTime: `${minutes} мин чтения`,
    sectionsCount: `${headings.filter(heading => heading.level === 2).length} разделов`,
    headings: headings.map(({ offset, ...heading }) => heading),
    prev: index > 0 ? { slug: ordered[index - 1].slug, title: ordered[index - 1].title } : null,
    next: index + 1 < ordered.length ? { slug: ordered[index + 1].slug, title: ordered[index + 1].title } : null
  }];
}));

export const kbCategories: KbCategory[] = groups.map(group => ({
  title: group.title,
  description: group.description,
  articles: group.slugs.map(slug => ({
    slug, title: kbArticles[slug].title,
    readTime: kbArticles[slug].readingTime.replace(' чтения', '')
  }))
}));

export const kbPopularQuickLinks: Array<[string, string]> = [
  ['quickstart', 'Быстрый старт плагинов'],
  ['plugin-recipes', 'Практические сценарии'],
  ['api-reference', 'Справочник C API'],
  ['privacy', 'Приватность и блокировка'],
  ['installation', 'Установка на ПК']
];

export const kbSearchData = {
  a: ordered.flatMap(article => {
    const headings = sectionsBySlug.get(article.slug)!;
    return [
      [article.slug, article.title, article.category, plainText(article.content)],
      ...headings.map((heading, index) => [
        `${article.slug}#${heading.id}`, heading.text, article.title,
        plainText(article.content.slice(heading.offset, headings[index + 1]?.offset))
      ])
    ];
  })
};
