import mediumZoom from 'medium-zoom';

function initArticleEnhancements() {
  initProgressBar();

  const articleContent = document.querySelector<HTMLElement>('.article-content');
  if (!articleContent) {
    return;
  }

  initCodeCopyButtons(articleContent);
  initImageZoom(articleContent);
}

function initCodeCopyButtons(container: HTMLElement) {
  const preBlocks = container.querySelectorAll<HTMLPreElement>('pre');

  preBlocks.forEach((pre) => {
    if (pre.querySelector('.code-copy-btn')) {
      return;
    }

    const button = document.createElement('button');
    button.className = 'code-copy-btn';
    button.type = 'button';
    button.setAttribute('aria-label', 'Copy code');
    button.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg><span>复制</span>`;

    button.addEventListener('click', async () => {
      const code = pre.querySelector('code');
      const text = code ? code.textContent ?? '' : pre.textContent ?? '';
      const label = button.querySelector('span');

      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      button.classList.add('copied');
      if (label) {
        label.textContent = '已复制';
      }

      window.setTimeout(() => {
        button.classList.remove('copied');
        if (label) {
          label.textContent = '复制';
        }
      }, 2000);
    });

    pre.appendChild(button);
  });
}

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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initArticleEnhancements, { once: true });
} else {
  initArticleEnhancements();
}
document.addEventListener('astro:page-load', initArticleEnhancements);
