import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

type ArticleTocWindow = Window &
  typeof globalThis & {
    articleTocScrollOffset?: number;
    articleTocMobileAbortController?: AbortController;
    articleTocMobileScrollTween?: gsap.core.Tween | null;
    articleTocFloatingNodes?: HTMLElement[];
  };

const articleWindow = window as ArticleTocWindow;

const mountMobileTocToBody = (nodes: HTMLElement[]) => {
  articleWindow.articleTocFloatingNodes
    ?.filter((node) => !nodes.includes(node))
    .forEach((node) => node.remove());

  articleWindow.articleTocFloatingNodes = nodes;

  nodes.forEach((node) => {
    if (node.parentElement !== document.body) {
      document.body.appendChild(node);
    }
  });
};

const removeFloatingMobileToc = () => {
  articleWindow.articleTocFloatingNodes?.forEach((node) => node.remove());
  articleWindow.articleTocFloatingNodes = [];
};

const resetMobileToc = (
  mobileTocButton: HTMLElement,
  mobileTocOverlay: HTMLElement,
  mobileTocDrawer: HTMLElement
) => {
  mobileTocButton.setAttribute('aria-expanded', 'false');
  mobileTocButton.setAttribute('aria-controls', 'mobileTocDrawer');
  gsap.killTweensOf([mobileTocOverlay, mobileTocDrawer]);
  mobileTocOverlay.classList.remove('is-open');
  mobileTocDrawer.classList.remove('is-open');
  mobileTocOverlay.style.pointerEvents = 'none';
  gsap.set(mobileTocOverlay, { autoAlpha: 0, clearProps: 'transform' });
  gsap.set(mobileTocDrawer, { autoAlpha: 0, x: 0, clearProps: 'transform' });
};

export function initArticleTocMobile() {
  articleWindow.articleTocMobileAbortController?.abort();
  articleWindow.articleTocMobileScrollTween?.kill();
  articleWindow.articleTocMobileScrollTween = null;

  const articleScrollContainer = document.querySelector<HTMLElement>('.app-scroll');
  const mobileTocButton = document.getElementById('mobileTocBtn');
  const mobileTocOverlay = document.getElementById('mobileTocOverlay');
  const mobileTocDrawer = document.getElementById('mobileTocDrawer');
  const mobileTocLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('.article-toc-drawer [data-toc-link]'));

  if (!(articleScrollContainer && mobileTocButton && mobileTocOverlay && mobileTocDrawer && mobileTocLinks.length > 0)) {
    removeFloatingMobileToc();
    return;
  }

  const abortController = new AbortController();
  articleWindow.articleTocMobileAbortController = abortController;
  const { signal } = abortController;
  const scrollOffset = articleWindow.articleTocScrollOffset ?? 104;
  let mobileTocOpen = false;

  mountMobileTocToBody([mobileTocButton, mobileTocOverlay, mobileTocDrawer]);
  resetMobileToc(mobileTocButton, mobileTocOverlay, mobileTocDrawer);

  const getTargetScrollTop = (target: HTMLElement) => {
    const containerRect = articleScrollContainer.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const nextTop =
      articleScrollContainer.scrollTop +
      (targetRect.top - containerRect.top) -
      scrollOffset;

    return Math.max(0, nextTop);
  };

  const setActiveMobileLink = (slug: string) => {
    mobileTocLinks.forEach((link) => {
      const isActive = link.dataset.tocLink === slug;
      link.classList.toggle('is-active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  const openMobileToc = () => {
    if (mobileTocOpen) {
      return;
    }

    mobileTocOpen = true;
    mobileTocButton.setAttribute('aria-expanded', 'true');
    mobileTocOverlay.classList.add('is-open');
    mobileTocDrawer.classList.add('is-open');
    mobileTocOverlay.style.pointerEvents = 'auto';
    gsap.killTweensOf([mobileTocOverlay, mobileTocDrawer]);

    gsap.fromTo(
      mobileTocOverlay,
      { autoAlpha: 0 },
      {
        autoAlpha: 1,
        duration: 0.24,
        ease: 'power2.out',
        overwrite: true,
      }
    );

    gsap.fromTo(
      mobileTocDrawer,
      { autoAlpha: 1, x: '100%' },
      {
        autoAlpha: 1,
        x: '0%',
        duration: 0.42,
        ease: 'power3.out',
        overwrite: true,
      }
    );
  };

  const closeMobileToc = (immediate = false) => {
    mobileTocOpen = false;
    mobileTocButton.setAttribute('aria-expanded', 'false');
    gsap.killTweensOf([mobileTocOverlay, mobileTocDrawer]);

    if (immediate) {
      resetMobileToc(mobileTocButton, mobileTocOverlay, mobileTocDrawer);
      return;
    }

    gsap.to(mobileTocOverlay, {
      autoAlpha: 0,
      duration: 0.2,
      ease: 'power2.in',
      overwrite: true,
      onComplete: () => {
        mobileTocOverlay.style.pointerEvents = 'none';
        mobileTocOverlay.classList.remove('is-open');
      },
    });

    gsap.to(mobileTocDrawer, {
      autoAlpha: 0,
      x: '100%',
      duration: 0.32,
      ease: 'power3.inOut',
      overwrite: true,
      onComplete: () => {
        mobileTocDrawer.classList.remove('is-open');
      },
    });
  };

  const scrollToTarget = (target: HTMLElement, slug: string) => {
    articleWindow.articleTocMobileScrollTween?.kill();
    setActiveMobileLink(slug);

    articleWindow.articleTocMobileScrollTween = gsap.to(articleScrollContainer, {
      scrollTo: {
        y: getTargetScrollTop(target),
        autoKill: true,
      },
      duration: 0.86,
      ease: 'power3.out',
      overwrite: true,
      onStart: () => {
        if (window.location.hash !== `#${slug}`) {
          window.history.pushState(null, '', `#${slug}`);
        }
      },
    });
  };

  mobileTocButton.addEventListener('click', openMobileToc, { signal });
  mobileTocOverlay.addEventListener('click', () => closeMobileToc(), { signal });
  document.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Escape') {
        closeMobileToc();
      }
    },
    { signal }
  );

  mobileTocLinks.forEach((link) => {
    link.addEventListener(
      'click',
      (event) => {
        const slug = link.dataset.tocLink;
        if (!slug) {
          return;
        }

        const target = document.getElementById(slug);
        if (!target) {
          return;
        }

        event.preventDefault();
        closeMobileToc();
        scrollToTarget(target, slug);
      },
      { signal }
    );
  });

  document.addEventListener(
    'astro:before-swap',
    () => {
      closeMobileToc(true);
      articleWindow.articleTocMobileScrollTween?.kill();
      removeFloatingMobileToc();
      abortController.abort();
    },
    { once: true, signal }
  );
}
