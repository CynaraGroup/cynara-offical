import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

type TocTarget = {
  link: HTMLAnchorElement;
  target: HTMLElement;
};

type ArticleTocWindow = Window &
  typeof globalThis & {
    articleTocScrollOffset?: number;
    articleTocAbortController?: AbortController;
    articleTocScrollTween?: gsap.core.Tween | null;
  };

const articleWindow = window as ArticleTocWindow;

const resetMobileToc = (
  mobileTocButton: HTMLElement | null,
  mobileTocOverlay: HTMLElement | null,
  mobileTocDrawer: HTMLElement | null
) => {
  if (mobileTocButton) {
    mobileTocButton.setAttribute('aria-expanded', 'false');
    mobileTocButton.setAttribute('aria-controls', 'mobileTocDrawer');
  }

  if (!(mobileTocOverlay && mobileTocDrawer)) {
    return;
  }

  gsap.killTweensOf([mobileTocOverlay, mobileTocDrawer]);
  mobileTocOverlay.style.pointerEvents = 'none';
  gsap.set(mobileTocOverlay, { autoAlpha: 0 });
  gsap.set(mobileTocDrawer, { autoAlpha: 0, xPercent: 100 });
};

function initArticleToc() {
  articleWindow.articleTocAbortController?.abort();
  articleWindow.articleTocScrollTween?.kill();
  articleWindow.articleTocScrollTween = null;

  const abortController = new AbortController();
  articleWindow.articleTocAbortController = abortController;
  const { signal } = abortController;

  const articleScrollContainer = document.querySelector<HTMLElement>('.app-scroll');
  const articlePage = document.getElementById('articlePage');
  const articleBody = document.getElementById('article-body');
  const tocCard = document.querySelector<HTMLElement>('.article-toc-card');
  const tocWrap = document.querySelector<HTMLElement>('.article-toc-wrap');
  const tocNav = document.querySelector<HTMLElement>('.article-toc-wrap .article-toc-nav');
  const tocCursor = document.querySelector<HTMLElement>('.article-toc-cursor');
  const desktopTocLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('.article-toc-wrap [data-toc-link]'));
  const mobileTocLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('.article-toc-drawer [data-toc-link]'));
  const tocLinks = [...desktopTocLinks, ...mobileTocLinks];
  const mobileTocButton = document.getElementById('mobileTocBtn');
  const mobileTocOverlay = document.getElementById('mobileTocOverlay');
  const mobileTocDrawer = document.getElementById('mobileTocDrawer');

  resetMobileToc(mobileTocButton, mobileTocOverlay, mobileTocDrawer);

  const tocTargets = desktopTocLinks
    .map((link) => {
      const slug = link.dataset.tocLink;
      if (!slug) {
        return null;
      }

      const target = document.getElementById(slug);
      if (!target) {
        return null;
      }

      return { link, target };
    })
    .filter((item): item is TocTarget => item !== null);

  if (!(articleScrollContainer && articlePage && articleBody && tocCard && tocWrap && tocTargets.length > 0)) {
    return;
  }

  const scrollOffset = articleWindow.articleTocScrollOffset ?? 104;
  let activeId = '';
  let rafId = 0;
  let followMax = 0;
  let mobileTocOpen = false;
  const moveTocCard = gsap.quickTo(tocCard, 'y', {
    duration: 0.72,
    ease: 'expo.out',
  });
  const moveCursorY = tocCursor
    ? gsap.quickTo(tocCursor, 'y', {
        duration: 0.42,
        ease: 'expo.out',
      })
    : null;
  const resizeCursor = tocCursor
    ? gsap.quickTo(tocCursor, 'height', {
        duration: 0.38,
        ease: 'power3.out',
      })
    : null;

  const getTargetScrollTop = (target: HTMLElement) => {
    const containerRect = articleScrollContainer.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const nextTop =
      articleScrollContainer.scrollTop +
      (targetRect.top - containerRect.top) -
      scrollOffset;

    return Math.max(0, nextTop);
  };

  const refreshFollowBounds = () => {
    const bodyHeight = articleBody.offsetHeight;
    const cardHeight = tocCard.offsetHeight;
    followMax = Math.max(0, bodyHeight - cardHeight);
  };

  const updateTocFollow = () => {
    refreshFollowBounds();

    const bodyTop = getTargetScrollTop(articleBody) + scrollOffset;
    const bodyScrollable = Math.max(1, articleBody.offsetHeight - articleScrollContainer.clientHeight * 0.72);
    const progress = gsap.utils.clamp(
      0,
      1,
      (articleScrollContainer.scrollTop - bodyTop) / bodyScrollable
    );

    moveTocCard(followMax * progress);
  };

  const openMobileToc = () => {
    if (!(mobileTocButton && mobileTocOverlay && mobileTocDrawer) || mobileTocOpen) {
      return;
    }

    mobileTocOpen = true;
    mobileTocButton.setAttribute('aria-expanded', 'true');
    mobileTocOverlay.style.pointerEvents = 'auto';
    gsap.killTweensOf([mobileTocOverlay, mobileTocDrawer]);

    gsap.to(mobileTocOverlay, {
      autoAlpha: 1,
      duration: 0.24,
      ease: 'power2.out',
      overwrite: true,
    });

    gsap.fromTo(
      mobileTocDrawer,
      { autoAlpha: 1, xPercent: 100 },
      {
        autoAlpha: 1,
        xPercent: 0,
        duration: 0.42,
        ease: 'power3.out',
        overwrite: true,
      }
    );
  };

  const closeMobileToc = (immediate = false) => {
    if (!(mobileTocButton && mobileTocOverlay && mobileTocDrawer)) {
      return;
    }

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
      },
    });

    gsap.to(mobileTocDrawer, {
      autoAlpha: 0,
      xPercent: 100,
      duration: 0.32,
      ease: 'power3.inOut',
      overwrite: true,
    });
  };

  const keepActiveVisible = (link: HTMLAnchorElement) => {
    const cardRect = tocCard.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    const overflowTop = linkRect.top - cardRect.top - 44;
    const overflowBottom = linkRect.bottom - cardRect.bottom + 28;

    if (overflowTop >= 0 && overflowBottom <= 0) {
      return;
    }

    gsap.to(tocCard, {
      scrollTo: {
        y: tocCard.scrollTop + (overflowTop < 0 ? overflowTop : overflowBottom),
        autoKill: false,
      },
      duration: 0.32,
      ease: 'power2.out',
      overwrite: true,
    });
  };

  const syncActiveLink = (nextId: string) => {
    if (!nextId || nextId === activeId) {
      return;
    }

    activeId = nextId;

    tocTargets.forEach(({ link, target }) => {
      const isActive = target.id === nextId;
      const linkedItems = tocLinks.filter((tocLink) => tocLink.dataset.tocLink === target.id);

      linkedItems.forEach((tocLink) => {
        tocLink.classList.toggle('is-active', isActive);
        if (isActive) {
          tocLink.setAttribute('aria-current', 'location');
        } else {
          tocLink.removeAttribute('aria-current');
        }
      });

      if (isActive) {
        linkedItems.forEach((tocLink) => {
          gsap.to(tocLink, {
            x: tocLink.classList.contains('is-nested') ? 3 : 5,
            color: '#eff6ff',
            duration: 0.28,
            ease: 'power3.out',
            overwrite: true,
          });
        });

        if (tocCursor && tocNav && moveCursorY && resizeCursor) {
          const navRect = tocNav.getBoundingClientRect();
          const linkRect = link.getBoundingClientRect();
          moveCursorY(linkRect.top - navRect.top + tocNav.scrollTop);
          resizeCursor(linkRect.height);
          gsap.to(tocCursor, {
            autoAlpha: 1,
            duration: 0.2,
            ease: 'power2.out',
            overwrite: true,
          });
        }

        keepActiveVisible(link);
      } else {
        linkedItems.forEach((tocLink) => {
          gsap.to(tocLink, {
            x: 0,
            duration: 0.24,
            ease: 'power2.out',
            overwrite: true,
          });
        });
      }
    });
  };

  const readCurrentHeading = () => {
    const scrollLine = articleScrollContainer.scrollTop + scrollOffset + 24;
    let nextId = tocTargets[0].target.id;

    for (const { target } of tocTargets) {
      const targetTop = getTargetScrollTop(target) + scrollOffset;
      if (targetTop <= scrollLine) {
        nextId = target.id;
      }
    }

    return nextId;
  };

  const updateActiveLink = () => {
    syncActiveLink(readCurrentHeading());
    updateTocFollow();
  };

  const requestActiveUpdate = () => {
    if (rafId) {
      return;
    }

    rafId = window.requestAnimationFrame(() => {
      rafId = 0;
      updateActiveLink();
    });
  };

  const scrollToTarget = (target: HTMLElement, slug: string, shouldUpdateHash = true) => {
    articleWindow.articleTocScrollTween?.kill();
    syncActiveLink(slug);

    articleWindow.articleTocScrollTween = gsap.to(articleScrollContainer, {
      scrollTo: {
        y: getTargetScrollTop(target),
        autoKill: true,
      },
      duration: 0.86,
      ease: 'power3.out',
      overwrite: true,
      onStart: () => {
        if (shouldUpdateHash && window.location.hash !== `#${slug}`) {
          window.history.pushState(null, '', `#${slug}`);
        }
      },
      onUpdate: requestActiveUpdate,
      onInterrupt: requestActiveUpdate,
      onComplete: requestActiveUpdate,
    });
  };

  mobileTocButton?.addEventListener('click', openMobileToc, { signal });
  mobileTocOverlay?.addEventListener('click', () => closeMobileToc(), { signal });
  document.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Escape') {
        closeMobileToc();
      }
    },
    { signal }
  );

  tocLinks.forEach((link) => {
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

  articleScrollContainer.addEventListener('scroll', requestActiveUpdate, { passive: true, signal });

  window.addEventListener(
    'hashchange',
    () => {
      const slug = decodeURIComponent(window.location.hash.replace(/^#/, ''));
      const item = tocTargets.find(({ target }) => target.id === slug);
      if (item) {
        scrollToTarget(item.target, item.target.id, false);
      }
    },
    { signal }
  );

  window.addEventListener(
    'resize',
    () => {
      refreshFollowBounds();
      requestActiveUpdate();
    },
    { passive: true, signal }
  );

  document.addEventListener(
    'astro:before-swap',
    () => {
      closeMobileToc(true);
      articleWindow.articleTocScrollTween?.kill();
      abortController.abort();
    },
    { once: true, signal }
  );

  const initialSlug = decodeURIComponent(window.location.hash.replace(/^#/, ''));
  const initialTarget = tocTargets.find(({ target }) => target.id === initialSlug);

  if (initialTarget) {
    window.setTimeout(() => {
      if (signal.aborted) {
        return;
      }

      refreshFollowBounds();
      scrollToTarget(initialTarget.target, initialTarget.target.id, false);
    }, 80);
  } else {
    refreshFollowBounds();
    requestActiveUpdate();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initArticleToc, { once: true });
} else {
  initArticleToc();
}

document.addEventListener('astro:page-load', initArticleToc);
