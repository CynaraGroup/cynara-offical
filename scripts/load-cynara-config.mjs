import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const configPath = path.join(rootDir, 'cynara.config.yaml');

const defaultConfig = {
  site: {
    name: 'Cynara',
    url: 'https://cynara.my',
    description: {
      zh: 'Cynara 官方网站，展示产品、伙伴、专栏与团队动态。',
      en: 'Cynara official website featuring products, partners, articles, and team updates.',
    },
    keywords: ['Cynara', 'CynaraGroup', 'Tech', 'WebDev'],
    defaultImage: 'https://i.mahiro.work/i/2026/05/02/11c1trl.svg',
    logo: 'https://i.mahiro.work/i/2026/05/02/11c1trl.svg',
  },
  assets: {
    backgroundVideo: 'https://s.mahiro.work/d/cynara-offical/output_min.mp4?sign=zuTiNw1EABHRU3cHhojuSRpHtxwG9XYuz6QwSX6CaAQ=:0',
    introVideo: 'https://s.mahiro.work/d/cynara-offical/begin.mp4?sign=EV_Zz9Q2oblkZSHcm0E6MI1ugKe9hM3DfCyFocXaekE=:0',
    videoCacheName: 'cynara-video-cache',
  },
  home: {
    featuredProducts: 5,
    featuredPartners: 4,
    featuredArticles: 3,
  },
  articles: {
    pinnedOnlyOnHome: true,
    search: {
      enabled: true,
      excerptLength: 6,
      showImages: false,
      showSubResults: false,
    },
    toc: {
      enabled: true,
      scrollOffset: 104,
    },
  },
  routes: {
    home: '/home',
    products: '/products',
    partners: '/partners',
    articles: '/articles',
  },
  external: {
    contactEmail: 'zhngjah3@outlook.com',
    hiringEmail: 'sorasaku@cynara.my',
    sponsorUrl: 'https://ifdian.net/a/cynara',
    bilibiliUrl: 'https://space.bilibili.com/3706979616819218',
  },
};

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function mergeConfig(base, override) {
  if (!isRecord(base) || !isRecord(override)) {
    return override ?? base;
  }

  const merged = { ...base };

  for (const [key, value] of Object.entries(override)) {
    merged[key] = isRecord(value) && isRecord(base[key])
      ? mergeConfig(base[key], value)
      : value;
  }

  return merged;
}

function normalizeRoute(route, fallback) {
  if (typeof route !== 'string' || route.trim() === '') {
    return fallback;
  }

  const nextRoute = route.trim();
  return nextRoute.startsWith('/') ? nextRoute : `/${nextRoute}`;
}

function normalizeConfig(config) {
  const merged = mergeConfig(defaultConfig, config);

  return {
    ...merged,
    site: {
      ...merged.site,
      url: String(merged.site.url).replace(/\/+$/, ''),
      keywords: Array.isArray(merged.site.keywords) ? merged.site.keywords : defaultConfig.site.keywords,
    },
    home: {
      featuredProducts: Number(merged.home.featuredProducts) || defaultConfig.home.featuredProducts,
      featuredPartners: Number(merged.home.featuredPartners) || defaultConfig.home.featuredPartners,
      featuredArticles: Number(merged.home.featuredArticles) || defaultConfig.home.featuredArticles,
    },
    articles: {
      ...merged.articles,
      search: {
        ...merged.articles.search,
        excerptLength: Number(merged.articles.search.excerptLength) || defaultConfig.articles.search.excerptLength,
      },
      toc: {
        ...merged.articles.toc,
        scrollOffset: Number(merged.articles.toc.scrollOffset) || defaultConfig.articles.toc.scrollOffset,
      },
    },
    routes: {
      home: normalizeRoute(merged.routes.home, defaultConfig.routes.home),
      products: normalizeRoute(merged.routes.products, defaultConfig.routes.products),
      partners: normalizeRoute(merged.routes.partners, defaultConfig.routes.partners),
      articles: normalizeRoute(merged.routes.articles, defaultConfig.routes.articles),
    },
  };
}

export function loadCynaraConfig() {
  try {
    if (!fs.existsSync(configPath)) {
      return normalizeConfig(defaultConfig);
    }

    const rawConfig = fs.readFileSync(configPath, 'utf8');
    const parsedConfig = parse(rawConfig) ?? {};
    return normalizeConfig(parsedConfig);
  } catch (error) {
    console.warn(`[cynara-config] Failed to read cynara.config.yaml: ${error instanceof Error ? error.message : String(error)}`);
    return normalizeConfig(defaultConfig);
  }
}

export const cynaraConfig = loadCynaraConfig();
