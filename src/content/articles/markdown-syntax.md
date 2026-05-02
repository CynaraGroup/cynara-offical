---
title: "Markdown 完整语法测试与指南"
description: "欢迎来到 Cynara 的全新博客板块。我们将会在这里持续分享我们的研究、产品动态与开发笔记"
pubDate: 2026-05-02
author: "Cynara Team"
tags: ["Markdown", "Guide", "Test"]
pin: true
---

## 欢迎访问 Cynara 博客

这是我们的第一篇文章，也是尝试整合 Markdown 与 MDX 支持的一次演示。

## 1. 标题 (Headings)

# H1 标题
## H2 标题
### H3 标题
#### H4 标题
##### H5 标题
###### H6 标题

---

## 2. 文本格式 (Text Formatting)

**粗体文本 (Bold)**：使用 `**文本**` 或 `__文本__`
*斜体文本 (Italic)*：使用 `*文本*` 或 `_文本_`
***粗斜体文本 (Bold & Italic)***：使用 `***文本***`
~~删除线文本 (Strikethrough)~~：使用 `~~文本~~`
这是 `内联代码 (Inline Code)` 的示例。

---

## 3. 列表 (Lists)

### 无序列表 (Unordered List)
* 项目一
* 项目二
  * 嵌套项目 2.1
  * 嵌套项目 2.2
* 项目三

### 有序列表 (Ordered List)
1. 第一项
2. 第二项
   1. 嵌套子项 2.1
   2. 嵌套子项 2.2
3. 第三项

### 任务列表 (Task List)
- [x] 已完成的任务
- [ ] 待完成的任务
- [ ] 另一个待完成的任务

---

## 4. 引用 (Blockquotes)

> 这是一个基础的引用块。
> 可以包含多行。

> 嵌套引用：
>> 这是引用的引用块。
>
> 还可以包含**其他语法**。

---

## 5. 代码块 (Code Blocks)

原生支持基于语法高亮的代码块展示（由 Astro 内部的 Shiki 引擎支持）：

```javascript
// JavaScript 示例
function greet(name) {
  console.log(`Hello, ${name}! Welcome to Cynara.`);
}
greet("World");
```

```css
/* CSS 示例 */
.cynara-text {
  background: linear-gradient(to right, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  color: transparent;
}
```

```python
# Python 示例
def fibonacci(n):
    if n <= 1: return n
    return fibonacci(n-1) + fibonacci(n-2)
```

---

## 6. 链接与图片 (Links & Images)

### 链接
[Cynara 官方网站](https://cynara.com)
[带提示(Title)的链接](https://github.com "访问 GitHub")

### 图片
![Cynara Logo](https://i.mahiro.work/i/2026/05/02/11c1trl.svg)

---

## 7. 表格 (Tables)

| 语法 | 说明 | 渲染效果 |
| :--- | :---: | ---: |
| `**加粗**` | 字体加粗 | **加粗** |
| `*斜体*` | 字体倾斜 | *斜体* |
| `~~删除~~`| 文本删除线 | ~~删除~~ |
| `[链接]()`| 超链接 | [示例](#) |

*注：表头下方的冒号代表对齐方式：左侧对齐、居中对齐、右侧对齐。*

---

## 8. 分隔线 (Horizontal Rules)

你可以用三个以上的星号、减号、底线来建立一个分隔线：

***
---
___

## 9. 脚注 (Footnotes)

> **注意：** Astro 的某些解析器可能需要额外配置 remark 插件才能支持脚注，但这里写出常规的扩展语法供参考。

这是一个带有脚注的文本[^1]。

[^1]: 这里是脚注的解释内容。

---

通过这篇文档，你可以快速检查当前博客文章的样式是否符合你的审美需求！如果你需要更改高亮颜色、间距等，可以在 `tailwind.config.mjs` 中通过 `typography` 插件的配置进行修改。
