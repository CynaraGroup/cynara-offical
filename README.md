# Cynara 官方网站

Cynara 官方网站与内容站点（Astro + Tailwind CSS + DaisyUI），包含首页展示、产品与合作伙伴信息、以及基于 Content Collections 的文章系统（支持 MD/MDX）。

## 技术栈

- [Astro](https://astro.build/) (v4)
- [Tailwind CSS](https://tailwindcss.com/)
- [DaisyUI](https://daisyui.com/)
- [MDX](https://mdxjs.com/) + Astro Content Collections
- [GSAP](https://gsap.com/)（动画）

## 目录结构（简要）

- `src/pages/`：路由页面
- `src/components/`：UI 组件
- `src/layouts/`：布局组件
- `src/content/articles/`：文章内容（`.md` / `.mdx`）
- `public/`：静态资源

## 本地开发

安装依赖：

```powershell
pnpm install
```

启动开发服务器：

```powershell
pnpm dev
```

构建生产包：

```powershell
pnpm build
```

预览构建结果：

```powershell
pnpm preview
```

## 文章系统

文章存放在 `src/content/articles/` 中，支持 `.md` 与 `.mdx`。

- 列表页：`/articles`
- 详情页：`/articles/<slug>`

> 新增文章只需在 `src/content/articles/` 中创建文件并填写 frontmatter。

## 常见问题

### 视频无法加载或出现 503

上游对象存储可能存在限速或 Referer 限制。当前已使用 Cache Storage + fetch 的方式优化加载，但若仍频繁出现 503，建议更换稳定的 CDN 或调整签名策略。
