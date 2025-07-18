---
date: '2025-07-06T14:46:53+08:00'
excerpt: ''
title: 主要成员
aside: false
updated: '2025-07-18T22:00:39.151+08:00'
---
{% raw %}
    <style>
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
            background-color: #ffffff;
            border-radius: 8px;
            padding: 24px;
            text-align: center;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .member-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgb(255, 255, 255);
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
            color: black;
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
    <!-- 成员卡片容器 -->
    <div class="members-grid">
        <!-- 卡片1 -->
        <div class="member-card">
            <div class="member-avatar">
                <img src="http://q2.qlogo.cn/headimg_dl?dst_uin=1015000721&spec=100" alt="MhYa520">
            </div>
            <div class="member-name">MhYa520</div>
            <p>创始人、论坛负责人、开发组组长</p>
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
            <p>联合创始人、开发组副组长</p>
            <a class="member-link" href="www.zhngjah.space" target="_blank">
                主页
            </a>
        </div>
{% endraw %}
