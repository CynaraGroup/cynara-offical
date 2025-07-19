---
title: 作品集
date: 2025-07-19 16:53:46
aside: false
---
{% raw %}
    <style>
        :root {
            --primary: #6C63FF;
            --secondary: #4A44B5;
            --accent: #FF6584;
            --light: #F8F9FA;
            --dark: #2A2D43;
            --gray: #6C757D;
            --light-gray: #E9ECEF;
            --transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            --shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
            --shadow-hover: 0 15px 40px rgba(0, 0, 0, 0.12);
            --border-radius: 16px;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Noto Sans SC', sans-serif;
            background-color: #fafafa;
            color: var(--dark);
            line-height: 1.7;
            overflow-x: hidden;
        }

        .portfolio-page {
            max-width: 1400px;
            margin: 0 auto;
            padding: 2rem;
        }

        /* 页眉样式 */
        .portfolio-header {
            text-align: center;
            padding: 5rem 0 3rem;
            position: relative;
        }

        .portfolio-header h1 {
            font-family: 'Playfair Display', serif;
            font-size: 3.5rem;
            font-weight: 700;
            color: var(--dark);
            margin-bottom: 1rem;
            position: relative;
            display: inline-block;
        }

        .portfolio-header h1::after {
            content: '';
            position: absolute;
            bottom: -15px;
            left: 50%;
            transform: translateX(-50%);
            width: 80px;
            height: 4px;
            background: var(--accent);
            border-radius: 2px;
        }

        .portfolio-header p {
            font-size: 1.2rem;
            max-width: 700px;
            margin: 2rem auto 0;
            color: var(--gray);
        }

        /* 分类筛选 */
        .portfolio-filter {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 1rem;
            margin: 2.5rem 0 3rem;
        }

        .filter-btn {
            background: white;
            color: var(--dark);
            border: none;
            padding: 0.7rem 1.8rem;
            font-size: 1rem;
            font-weight: 500;
            border-radius: 30px;
            cursor: pointer;
            transition: var(--transition);
            box-shadow: var(--shadow);
        }

        .filter-btn:hover, .filter-btn.active {
            background: var(--primary);
            color: white;
            transform: translateY(-3px);
            box-shadow: var(--shadow-hover);
        }

        /* 作品网格布局 */
        .portfolio-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
            gap: 2.5rem;
            margin-top: 2rem;
        }

        .portfolio-item {
            background: white;
            border-radius: var(--border-radius);
            overflow: hidden;
            box-shadow: var(--shadow);
            transition: var(--transition);
            position: relative;
            transform: translateY(20px);
            opacity: 0;
            animation: fadeInUp 0.6s ease-out forwards;
        }

        .portfolio-item:nth-child(2) { animation-delay: 0.1s; }
        .portfolio-item:nth-child(3) { animation-delay: 0.2s; }
        .portfolio-item:nth-child(4) { animation-delay: 0.3s; }
        .portfolio-item:nth-child(5) { animation-delay: 0.4s; }
        .portfolio-item:nth-child(6) { animation-delay: 0.5s; }

        .portfolio-item:hover {
            transform: translateY(-10px);
            box-shadow: var(--shadow-hover);
        }

        .portfolio-image {
            height: 240px;
            overflow: hidden;
            position: relative;
        }

        .portfolio-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: var(--transition);
        }

        .portfolio-item:hover .portfolio-image img {
            transform: scale(1.1);
        }

        .portfolio-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(to top, rgba(42, 45, 67, 0.8) 0%, transparent 60%);
            opacity: 0;
            transition: var(--transition);
            display: flex;
            align-items: flex-end;
            padding: 1.5rem;
        }

        .portfolio-item:hover .portfolio-overlay {
            opacity: 1;
        }

        .portfolio-tags {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
        }

        .portfolio-tag {
            background: var(--accent);
            color: white;
            font-size: 0.8rem;
            padding: 0.3rem 0.8rem;
            border-radius: 20px;
        }

        .portfolio-content {
            padding: 1.8rem;
        }

        .portfolio-content h3 {
            font-size: 1.5rem;
            margin-bottom: 0.8rem;
            color: var(--dark);
            font-weight: 600;
        }

        .portfolio-content p {
            color: var(--gray);
            margin-bottom: 1.5rem;
            font-size: 0.95rem;
        }

        .portfolio-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid var(--light-gray);
            padding-top: 1.2rem;
            margin-top: 1.2rem;
            font-size: 0.9rem;
            color: var(--gray);
        }

        .portfolio-link {
            display: inline-flex;
            align-items: center;
            color: var(--primary);
            text-decoration: none;
            font-weight: 600;
            transition: var(--transition);
        }

        .portfolio-link i {
            margin-left: 0.5rem;
            transition: var(--transition);
        }

        .portfolio-link:hover {
            color: var(--secondary);
        }

        .portfolio-link:hover i {
            transform: translateX(5px);
        }

        /* 页脚 */
        .portfolio-footer {
            text-align: center;
            padding: 4rem 0 3rem;
            margin-top: 3rem;
            color: var(--gray);
            border-top: 1px solid var(--light-gray);
        }

        .social-links {
            display: flex;
            justify-content: center;
            gap: 1.5rem;
            margin: 1.5rem 0;
        }

        .social-links a {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 48px;
            height: 48px;
            background: white;
            border-radius: 50%;
            color: var(--primary);
            font-size: 1.2rem;
            transition: var(--transition);
            box-shadow: var(--shadow);
        }

        .social-links a:hover {
            background: var(--primary);
            color: white;
            transform: translateY(-5px);
            box-shadow: var(--shadow-hover);
        }

        /* 动画 */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* 响应式设计 */
        @media (max-width: 992px) {
            .portfolio-grid {
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 2rem;
            }

            .portfolio-header h1 {
                font-size: 3rem;
            }
        }

        @media (max-width: 768px) {
            .portfolio-page {
                padding: 1.5rem;
            }

            .portfolio-header {
                padding: 3rem 0 2rem;
            }

            .portfolio-header h1 {
                font-size: 2.5rem;
            }

            .portfolio-header p {
                font-size: 1.1rem;
            }

            .portfolio-grid {
                grid-template-columns: 1fr;
                max-width: 600px;
                margin: 0 auto;
            }

            .filter-btn {
                padding: 0.6rem 1.5rem;
                font-size: 0.95rem;
            }
        }

        @media (max-width: 480px) {
            .portfolio-header h1 {
                font-size: 2.2rem;
            }

            .portfolio-header p {
                font-size: 1rem;
            }

            .portfolio-filter {
                gap: 0.7rem;
            }

            .filter-btn {
                padding: 0.5rem 1.2rem;
                font-size: 0.9rem;
            }
        }
    </style>
    <div class="portfolio-page">
        <!-- 作品网格 -->
        <div class="portfolio-grid">
            <!-- MOEBBS -->
            <div class="portfolio-item" data-category="app">
                <div class="portfolio-image">
                    <img src="https://cdn.jsdelivr.net/gh/sorasakuyu/Pic/Cynara/MoeLogo - 小 - 512X.svg" alt="MOEBBS">
                </div>
                <div class="portfolio-content">
                    <h3>MOEBBS</h3>
                    <p>更适合中国宝宝体质</p>
                    <div class="portfolio-meta">
                        <a href="https://hvhbbs.cc" class="portfolio-link">前往<i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
            </div>
            <!-- 梦幻基岩包 -->
            <div class="portfolio-item" data-category="app">
                <div class="portfolio-image">
                    <img src="https://cdn.jsdelivr.net/gh/sorasakuyu/Pic/Cynara/%E6%95%B4%E5%90%88%E5%8C%85.png" alt="梦幻整合包">
                </div>
                <div class="portfolio-content">
                    <h3>MOEBBS</h3>
                    <p>中国第一下载量</p>
                    <div class="portfolio-meta">
                        <a href="https://www.minebbs.com/resources/bassic.4034/" class="portfolio-link">基岩版<i class="fas fa-arrow-right"></i></a>
                        <a href="https://www.minebbs.com/resources/paper-new.4663/" class="portfolio-link">JAVA版<i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
            </div>
        </div>
    </div>
{% endraw %}