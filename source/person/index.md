---
date: '2025-07-06T14:46:53+08:00'
excerpt: ''
title: 主要成员
updated: '2025-07-18T22:00:39.151+08:00'
---
{% raw %}
    <style>
        /* 全局样式重置与基础设置 */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            background-color: #1c1c1c; /* 深色背景 */
            color: #fff;              /* 文字白色 */
            font-family: "微软雅黑", sans-serif;
            padding: 40px;
        }

        /* 标题区域样式 */
        .member-title {
            text-align: center;
            margin-bottom: 40px;
        }
        .member-title h2 {
            font-size: 28px;
            margin-bottom: 12px;
        }
        .member-title p {
            font-size: 16px;
            opacity: 0.8;
        }

        /* 成员卡片容器：网格布局 */
        .members-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 30px;
            max-width: 1200px;
            margin: 0 auto;
        }

        /* 单个成员卡片样式 */
        .member-card {
            background-color: #2a2a2a;
            border-radius: 8px;
            padding: 24px;
            text-align: center;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .member-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.4);
        }

        /* 头像样式 - 修改为正方形 */
        .member-avatar {
            width: 120px;  /* 增加宽度 */
            height: 120px; /* 保持与宽度一致 */
            border-radius: 4px; /* 修改为方形圆角 */
            overflow: hidden;
            margin: 0 auto 16px;
            position: relative; /* 为悬停效果添加定位 */
            border: 2px solid #4caf50; /* 添加边框 */
            transition: all 0.3s ease; /* 过渡效果 */
        }
        .member-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease; /* 图片缩放过渡 */
        }
        
        /* 头像悬停效果 */
        .member-card:hover .member-avatar {
            border-color: #66bb6a; /* 悬停时边框变色 */
            box-shadow: 0 0 15px rgba(76, 175, 80, 0.5); /* 添加发光效果 */
        }
        .member-card:hover .member-avatar img {
            transform: scale(1.1); /* 图片放大 */
        }

        /* 成员名称样式 */
        .member-name {
            font-size: 20px;
            margin-bottom: 8px;
            position: relative;
            display: inline-block;
        }
        .member-name::after {
            content: "";
            position: absolute;
            left: 50%;
            bottom: -6px;
            width: 30px;
            height: 2px;
            background-color: #4caf50; /* 修改为绿色下划线 */
            transform: translateX(-50%);
        }

        /* 链接样式 */
        .member-link {
            display: block;
            color: #4caf50; /* 绿色链接 */
            text-decoration: none;
            font-size: 14px;
            margin-top: 8px;
            transition: color 0.3s ease;
        }
        .member-link:hover {
            color: #66bb6a;
        }
    </style>
    <!-- 标题区域 -->
    <div class="member-title">
        <h2>主要工作室成员</h2>
        <p>不分先后顺序</p>
        <p>主要成员</p>
    </div>

    <!-- 成员卡片容器 -->
    <div class="members-grid">
        <!-- 卡片1 -->
        <div class="member-card">
            <div class="member-avatar">
                <img src="http://q2.qlogo.cn/headimg_dl?dst_uin=1015000721&spec=100" alt="MhYa520">
            </div>
            <div class="member-name">MhYa520</div>
            <!-- <a class="member-link" href="https://space.bilibili.com/1668014367" target="_blank">
                https://space.bilibili.com/1668014367
            </a> -->
        </div>

        <!-- 卡片2 -->
        <div class="member-card">
            <div class="member-avatar">
                <img src="https://avatars.githubusercontent.com/u/93808231?v=4" alt="Sorasaku">
            </div>
            <div class="member-name">Sorasaku Yu</div>
            <a class="member-link" href="www.zhngjah.space" target="_blank">
                主页
            </a>
        </div>
{% endraw %}
