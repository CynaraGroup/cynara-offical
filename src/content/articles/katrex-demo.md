---
title: "KaTeX 数学公式测试"
description: "验证文章页中的行内公式与块级公式是否能通过 KaTeX 正常渲染。"
pubDate: 2026-05-02
author: "Cynara Team"
tags: ["KaTeX", "Math", "Test"]
pin: true
---

# Markdown / KaTeX 数学公式渲染全景测试文档

本文档包含涵盖各个数学分支的常见 LaTeX 公式，用于全面测试 `remark-math`、`rehype-katex` 和 `KaTeX` 的渲染支持与排版效果。

## 1. 希腊字母 (Greek Letters)

这里展示常用希腊字母的行内渲染效果：
小写字母：$\alpha, \beta, \gamma, \delta, \epsilon, \zeta, \eta, \theta, \iota, \kappa, \lambda, \mu, \nu, \xi, \omicron, \pi, \rho, \sigma, \tau, \upsilon, \phi, \chi, \psi, \omega$
大写字母：$\Gamma, \Delta, \Theta, \Lambda, \Xi, \Pi, \Sigma, \Upsilon, \Phi, \Psi, \Omega$

## 2. 基础代数与运算符 (Algebra & Operators)

**四则运算与关系符：**
加减乘除与正负号：$+ \quad - \quad \pm \quad \mp \quad \times \quad \div \quad \cdot$
关系运算符：$= \quad \neq \quad \approx \quad \equiv \quad < \quad > \quad \le \quad \ge$
分数：$$\frac{a}{b} \quad \text{或} \quad {a \over b}$$

**指数、对数与根号：**
$$a^2 + b^2 = c^2$$
$$\log_a b = c \iff a^c = b$$
$$\sqrt{x^2+y^2}$$
$$\sqrt[n]{x}$$

## 3. 微积分 (Calculus)

**极限 (Limits)：**
$$\lim_{x \to \infty} \left(1 + \frac{1}{x}\right)^x = e$$
$$\lim_{h \to 0} \frac{f(x+h) - f(x)}{h} = f'(x)$$

**导数与偏导数 (Derivatives)：**
$$\frac{dy}{dx} = 2x$$
$$\frac{\partial^2 u}{\partial x^2} + \frac{\partial^2 u}{\partial y^2} = 0$$

**积分 (Integrals)：**
不定积分：$$\int x^2 dx = \frac{x^3}{3} + C$$
定积分 (高斯积分)：$$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$$
二重积分：$$\iint_D \left( \frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y} \right) dx dy = \oint_{\partial D} P dx + Q dy$$

## 4. 离散数学、求和与连乘 (Discrete Math)

**求和公式 (Summations)：**
麦克劳林级数：$$\sum_{n=0}^{\infty} \frac{x^n}{n!} = e^x$$
$$\sum_{i=1}^{n} i^3 = \left( \frac{n(n+1)}{2} \right)^2$$

**连乘公式 (Products)：**
$$\prod_{i=1}^{n} \left( 1 - \frac{1}{p_i^2} \right) = \frac{6}{\pi^2}$$

**集合与逻辑 (Sets & Logic)：**
交集、并集与补集：$A \cap B, \quad C \cup D, \quad \overline{E}$
从属关系：$x \in A, \quad y \notin B, \quad A \subset B, \quad C \supseteq D$
逻辑符号：$\forall x, \quad \exists y, \quad p \implies q, \quad A \iff B$

## 5. 线性代数 (Linear Algebra)

**向量 (Vectors)：**
$$\vec{v} = \langle v_1, v_2, v_3 \rangle$$
$$\overrightarrow{AB} + \overrightarrow{BC} = \overrightarrow{AC}$$

**矩阵 (Matrices)：**
圆括号矩阵：
$$
\begin{pmatrix}
a_{11} & a_{12} & \cdots & a_{1n} \\
a_{21} & a_{22} & \cdots & a_{2n} \\
\vdots & \vdots & \ddots & \vdots \\
a_{m1} & a_{m2} & \cdots & a_{mn}
\end{pmatrix}
$$

方括号矩阵与行列式：
$$
\mathbf{X} = \begin{bmatrix}
1 & x_1 \\
1 & x_2 \\
1 & x_3
\end{bmatrix}
\quad
\det(A) = \begin{vmatrix}
a & b \\
c & d
\end{vmatrix} = ad - bc
$$

## 6. 函数与分段函数 (Functions)

**分段函数 (Piecewise Functions)：**
符号函数：
$$
\text{sgn}(x) = \begin{cases} 
-1 & \text{if } x < 0 \\
0 & \text{if } x = 0 \\
1 & \text{if } x > 0 
\end{cases}
$$

**二项式系数 (Binomial Coefficients)：**
$$\binom{n}{k} = \frac{n!}{k!(n-k)!}$$

## 7. 复杂综合公式示例 (Complex Examples)

**薛定谔方程 (Schrödinger Equation)：**
$$i\hbar \frac{\partial}{\partial t} \Psi(\mathbf{r},t) = \left[ -\frac{\hbar^2}{2m}\nabla^2 + V(\mathbf{r},t) \right] \Psi(\mathbf{r},t)$$

**傅里叶变换 (Fourier Transform)：**
$$f(x) = \int_{-\infty}^{\infty} \hat{f}(\xi)\,e^{2 \pi i \xi x} \, d\xi$$

**纳维-斯托克斯方程 (Navier-Stokes Equation)：**
$$\rho \left( \frac{\partial \mathbf{v}}{\partial t} + \mathbf{v} \cdot \nabla \mathbf{v} \right) = -\nabla p + \mu \nabla^2 \mathbf{v} + \mathbf{f}$$

## 8. 排版与装饰 (Formatting & Accents)

顶部修饰：$\hat{x}, \bar{y}, \tilde{z}, \dot{x}, \ddot{x}$
特定字体：$\mathbb{R}, \mathbb{N}, \mathbb{Z}, \mathbb{C}$ (黑板粗体)
手写体：$\mathcal{A}, \mathcal{B}, \mathcal{C}$
颜色与边框框：
$$\color{red}{x} + \color{blue}{y} = \color{green}{z}$$
$$\boxed{E = mc^2}$$