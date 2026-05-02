import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

const articleScrollContainer = document.querySelector<HTMLElement>('.app-scroll');
const articlePage = document.getElementById('articlePage');
const articleBody = document.getElementById('article-body');
const tocCard = document.querySelector<HTMLElement>('.article-toc-card');
const tocWrap = document.querySelector<HTMLElement>('.article-toc-wrap');
const tocNav = document.querySelector<HTMLElement>('.article-toc-nav');
const tocCursor = document.querySelector<HTMLElement>('.article-toc-cursor');
const tocLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-toc-link]'));
const articleWindow = window as Window & typeof globalThis & {
  articleTocScrollOffset?: number;
};

const tocTargets = tocLinks
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
  .filter((item): item is { link: HTMLAnchorElement; target: HTMLElement } => item !== null);

if (articleScrollContainer && articlePage && articleBody && tocCard && tocWrap && tocTargets.length > 0) {
  const scrollOffset = articleWindow.articleTocScrollOffset ?? 104;
  let activeId = '';
  let scrollTween: gsap.core.Tween | null = null;
  let rafId = 0;
  let followMax = 0;
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
      link.classList.toggle('is-active', isActive);

      if (isActive) {
        link.setAttribute('aria-current', 'location');
        gsap.to(link, {
          x: link.classList.contains('is-nested') ? 3 : 5,
          color: '#eff6ff',
          duration: 0.28,
          ease: 'power3.out',
          overwrite: true,
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
        link.removeAttribute('aria-current');
        gsap.to(link, {
          x: 0,
          duration: 0.24,
          ease: 'power2.out',
          overwrite: true,
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
    scrollTween?.kill();
    syncActiveLink(slug);

    scrollTween = gsap.to(articleScrollContainer, {
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

  tocLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const slug = link.dataset.tocLink;
      if (!slug) {
        return;
      }

      const target = document.getElementById(slug);
      if (!target) {
        return;
      }

      event.preventDefault();
      scrollToTarget(target, slug);
    });
  });

  articleScrollContainer.addEventListener('scroll', requestActiveUpdate, { passive: true });

  window.addEventListener('hashchange', () => {
    const slug = decodeURIComponent(window.location.hash.replace(/^#/, ''));
    const item = tocTargets.find(({ target }) => target.id === slug);
    if (item) {
      scrollToTarget(item.target, item.target.id, false);
    }
  });

  window.addEventListener(
    'resize',
    () => {
      refreshFollowBounds();
      requestActiveUpdate();
    },
    { passive: true }
  );

  const initialSlug = decodeURIComponent(window.location.hash.replace(/^#/, ''));
  const initialTarget = tocTargets.find(({ target }) => target.id === initialSlug);

  if (initialTarget) {
    window.setTimeout(() => {
      refreshFollowBounds();
      scrollToTarget(initialTarget.target, initialTarget.target.id, false);
    }, 80);
  } else {
    refreshFollowBounds();
    requestActiveUpdate();
  }
}
