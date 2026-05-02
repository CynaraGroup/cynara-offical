import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse } from 'yaml';

export type LocalizedText = {
  zh: string;
  en: string;
};

export type CynaraConfig = {
  site: {
    name: string;
    url: string;
    description: LocalizedText;
    keywords: string[];
    defaultImage: string;
    logo: string;
  };
  assets: {
    backgroundVideo: string;
    introVideo: string;
    videoCacheName: string;
  };
  home: {
    featuredProducts: number;
    featuredPartners: number;
    featuredArticles: number;
  };
  articles: {
    pinnedOnlyOnHome: boolean;
    search: {
      enabled: boolean;
      excerptLength: number;
      showImages: boolean;
      showSubResults: boolean;
    };
    toc: {
      enabled: boolean;
      scrollOffset: number;
    };
  };
  routes: {
    home: string;
    products: string;
    partners: string;
    articles: string;
  };
  external: {
    contactEmail: string;
    hiringEmail: string;
    sponsorUrl: string;
    bilibiliUrl: string;
  };
};

const defaultConfig: CynaraConfig = {
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function mergeConfig<T>(base: T, override: unknown): T {
  if (!isRecord(base) || !isRecord(override)) {
    return (override ?? base) as T;
  }

  const merged: Record<string, unknown> = { ...base };

  for (const [key, value] of Object.entries(override)) {
    merged[key] = isRecord(value) && isRecord(merged[key])
      ? mergeConfig(merged[key], value)
      : value;
  }

  return merged as T;
}

function normalizeRoute(route: unknown, fallback: string): string {
  if (typeof route !== 'string' || route.trim() === '') {
    return fallback;
  }

  const nextRoute = route.trim();
  return nextRoute.startsWith('/') ? nextRoute : `/${nextRoute}`;
}

function normalizeConfig(config: CynaraConfig): CynaraConfig {
  return {
    ...config,
    site: {
      ...config.site,
      url: config.site.url.replace(/\/+$/, ''),
      keywords: Array.isArray(config.site.keywords) ? config.site.keywords : defaultConfig.site.keywords,
    },
    home: {
      featuredProducts: Number(config.home.featuredProducts) || defaultConfig.home.featuredProducts,
      featuredPartners: Number(config.home.featuredPartners) || defaultConfig.home.featuredPartners,
      featuredArticles: Number(config.home.featuredArticles) || defaultConfig.home.featuredArticles,
    },
    articles: {
      ...config.articles,
      search: {
        ...config.articles.search,
        excerptLength: Number(config.articles.search.excerptLength) || defaultConfig.articles.search.excerptLength,
      },
      toc: {
        ...config.articles.toc,
        scrollOffset: Number(config.articles.toc.scrollOffset) || defaultConfig.articles.toc.scrollOffset,
      },
    },
    routes: {
      home: normalizeRoute(config.routes.home, defaultConfig.routes.home),
      products: normalizeRoute(config.routes.products, defaultConfig.routes.products),
      partners: normalizeRoute(config.routes.partners, defaultConfig.routes.partners),
      articles: normalizeRoute(config.routes.articles, defaultConfig.routes.articles),
    },
  };
}

function loadCynaraConfig(): CynaraConfig {
  try {
    const configPath = resolve(process.cwd(), 'cynara.config.yaml');
    if (!existsSync(configPath)) {
      return normalizeConfig(defaultConfig);
    }

    const rawConfig = readFileSync(configPath, 'utf8');
    const parsedConfig = parse(rawConfig) ?? {};
    return normalizeConfig(mergeConfig(defaultConfig, parsedConfig));
  } catch (error) {
    console.warn(`[cynara-config] Failed to read cynara.config.yaml: ${error instanceof Error ? error.message : String(error)}`);
    return normalizeConfig(defaultConfig);
  }
}

export const cynaraConfig = loadCynaraConfig();
