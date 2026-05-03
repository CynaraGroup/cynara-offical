import mediumZoom from 'medium-zoom';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

function initArticleEnhancements() {
  // 移动端 TOC 抽屉独立初始化，不依赖 article-content
  initMobileTocDrawer();
  initProgressBar();

  const articleContent = document.querySelector<HTMLElement>('.article-content');
  if (!articleContent) {
    return;
  }

  initCodeCopyButtons(articleContent);
  initImageZoom(articleContent);
}

/* ── Code Copy Buttons ── */

function initCodeCopyButtons(container: HTMLElement) {
  const preBlocks = container.querySelectorAll<HTMLPreElement>('pre');

  preBlocks.forEach((pre) => {
    if (pre.querySelector('.code-copy-btn')) {
      return;
    }

    const btn = document.createElement('button');
    btn.className = 'code-copy-btn';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Copy code');
    btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg><span>复制</span>`;

    btn.addEventListener('click', async () => {
      const code = pre.querySelector('code');
      const text = code ? code.textContent ?? '' : pre.textContent ?? '';

      try {
        await navigator.clipboard.writeText(text);
        btn.classList.add('copied');
        const span = btn.querySelector('span');
        if (span) {
          span.textContent = '已复制';
        }

        setTimeout(() => {
          btn.classList.remove('copied');
          if (span) {
            span.textContent = '复制';
          }
        }, 2000);
      } catch {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        btn.classList.add('copied');
        const span = btn.querySelector('span');
        if (span) {
          span.textContent = '已复制';
        }

        setTimeout(() => {
          btn.classList.remove('copied');
          if (span) {
            span.textContent = '复制';
          }
        }, 2000);
      }
    });

    pre.appendChild(btn);
  });
}

/* ── Medium Zoom (Image Lightbox) ── */

function initImageZoom(container: HTMLElement) {
  const images = container.querySelectorAll<HTMLImageElement>('img');
  if (images.length === 0) {
    return;
  }

  mediumZoom(images, {
    margin: 40,
    background: 'rgba(0, 0, 0, 0.92)',
    scrollOffset: 60,
  });
}

/* ── Reading Progress Bar ── */

function initProgressBar() {
  const progressBar = document.getElementById('articleProgressBar');
  const scrollContainer = document.querySelector<HTMLElement>('.app-scroll');
  const articlePage = document.getElementById('articlePage');

  if (!progressBar || !scrollContainer || !articlePage) {
    return;
  }

  const updateProgress = () => {
    const articleRect = articlePage.getBoundingClientRect();
    const containerRect = scrollContainer.getBoundingClientRect();

    const articleTop = scrollContainer.scrollTop + (articleRect.top - containerRect.top);
    const articleScrollable = Math.max(1, articlePage.offsetHeight - scrollContainer.clientHeight);
    const progress = Math.min(1, Math.max(0, (scrollContainer.scrollTop - articleTop) / articleScrollable));

    progressBar.style.width = `${progress * 100}%`;
  };

  scrollContainer.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/* ── Mobile TOC Drawer (GSAP) ── */

function initMobileTocDrawer() {
  const btn = document.getElementById('mobileTocBtn');
  const overlay = document.getElementById('mobileTocOverlay');
  const drawer = document.getElementById('mobileTocDrawer');
  const scrollContainer = document.querySelector<HTMLElement>('.app-scroll');

  if (!btn || !overlay || !drawer) {
    return;
  }

  const articleWindow = window as Window & typeof globalThis & {
    articleTocScrollOffset?: number;
  };
  const scrollOffset = articleWindow.articleTocScrollOffset ?? 104;

  // 初始隐藏状态
  gsap.set(overlay, { autoAlpha: 0 });
  gsap.set(drawer, { xPercent: 100 });

  let isOpen = false;

  function openDrawer() {
    if (isOpen) {
      return;
    }

    isOpen = true;
    if (overlay) overlay.style.pointerEvents = 'auto';

    gsap.to(overlay, {
      autoAlpha: 1,
      duration: 0.3,
      ease: 'power2.out',
    });

    gsap.to(drawer, {
      xPercent: 0,
      duration: 0.45,
      ease: 'power3.out',
    });
  }

  function closeDrawer() {
    if (!isOpen) {
      return;
    }

    isOpen = false;

    gsap.to(overlay, {
      autoAlpha: 0,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        if (overlay) overlay.style.pointerEvents = 'none';
      },
    });

    gsap.to(drawer, {
      xPercent: 100,
      duration: 0.35,
      ease: 'power3.inOut',
    });
  }

  function scrollToHeading(slug: string) {
    if (!scrollContainer) {
      return;
    }

    const target = document.getElementById(slug);
    if (!target) {
      return;
    }

    const containerRect = scrollContainer.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const scrollY = scrollContainer.scrollTop + (targetRect.top - containerRect.top) - scrollOffset;

    gsap.to(scrollContainer, {
      scrollTo: {
        y: Math.max(0, scrollY),
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
  }

  btn.addEventListener('click', openDrawer);
  overlay.addEventListener('click', closeDrawer);

  const links = drawer.querySelectorAll<HTMLAnchorElement>('.mobile-toc-link');
  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const slug = link.getAttribute('href')?.replace('#', '');
      closeDrawer();

      if (slug) {
        // 等抽屉关闭动画完成后再滚动
        gsap.delayedCall(0.3, () => {
          scrollToHeading(slug);
        });
      }
    });
  });
}

document.addEventListener('astro:page-load', initArticleEnhancements);
