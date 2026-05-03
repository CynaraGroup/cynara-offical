import { initArticleTocDesktop } from './articleTocDesktop';
import { initArticleTocMobile } from './articleTocMobile';

function initArticleToc() {
  initArticleTocDesktop();
  initArticleTocMobile();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initArticleToc, { once: true });
} else {
  initArticleToc();
}

document.addEventListener('astro:page-load', initArticleToc);
