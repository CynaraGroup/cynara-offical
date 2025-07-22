---
title: Not Found
date: 2025-07-22 22:24:13
aside: false
---
{% raw %}
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#4A90E2',
                        secondary: '#F5A623',
                        neutral: '#F9FCFF',
                        dark: '#333333',
                    },
                    fontFamily: {
                        sans: ['Inter', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
                    },
                }
            }
        }
    </script>
    <style type="text/tailwindcss">
        @layer utilities {
            .content-auto {
                content-visibility: auto;
            }
            .text-shadow {
                text-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .animate-float {
                animation: float 3s ease-in-out infinite;
            }
            .animate-pulse-slow {
                animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }
            @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
            .bg-gradient-cynara {
                background: linear-gradient(135deg, #EAF5FF 0%, #FAFAFF 100%);
            }
        }
    </style>

    <!-- 主内容区 -->
    <div class="text-center max-w-md mx-auto relative z-10">
        <!-- 品牌标志 -->
        <div class="mb-8 flex justify-center">
            <div class="relative w-64">
                <img src="https://cdn.jsdelivr.net/gh/CynaraGroup/PicBed/Cynara/Cynara.svg" alt="CYNARA" class="w-full h-auto">
                <!-- 光效动画 -->
                <div class="absolute top-0 left-0 w-full h-full overflow-hidden">
                    <div class="shine absolute top-0 left-0 w-20 h-full bg-white/20 transform rotate-12 -translate-x-full" style="animation: shine 4s infinite linear;"></div>
                </div>
            </div>
        </div>

        <!-- 错误信息 -->
        <div class="mb-10">
            <div class="relative inline-block">
                <h1 class="text-[clamp(3rem,10vw,5rem)] font-bold text-dark mb-4 animate-pulse-slow">
                    4<span class="text-primary">0</span>4
                </h1>
                <!-- 装饰性线条 -->
                <div class="absolute -bottom-2 left-0 w-full h-1 bg-primary/30 rounded-full"></div>
            </div>
            
            <p class="text-[clamp(1.2rem,3vw,1.5rem)] font-medium text-dark/80 mb-3">页面未找到</p>
            <p class="text-gray-600 mb-6">您访问的页面不存在或已被移除。请检查URL或返回首页。</p>
            
        </div>

        <!-- 建议链接 -->
        <div class="text-gray-500 text-sm mb-8">
            <p class="mb-2">您可能感兴趣的内容：</p>
            <div class="grid grid-cols-2 gap-2">
                <a href="https://www.cynara.my/" class="hover:text-primary transition-colors">官方网站</a>
                <a href="https://www.cynara.my/archives" class="hover:text-primary transition-colors">最新动态</a>
                <a href="https://www.cynara.my/about" class="hover:text-primary transition-colors">关于我们</a>
                <a href="mailto:sorasaku@cynara.my" class="hover:text-primary transition-colors">联系客服</a>
            </div>
        </div>
    </div>
    <script>
        // 光效动画
        function shineEffect() {
            const shine = document.querySelector('.shine');
            shine.style.animation = 'none';
            shine.offsetHeight; // 触发重绘
            shine.style.animation = 'shine 4s infinite linear';
        }
        
        // 页面加载完成后执行
        window.addEventListener('load', () => {
            shineEffect();
            
            // 随机浮动装饰元素
            const floatElements = document.querySelectorAll('.animate-float');
            floatElements.forEach(el => {
                const randomDelay = Math.random() * 3;
                el.style.animationDelay = `${randomDelay}s`;
            });
            
            // 显示提示
            setTimeout(() => {
                const notification = document.createElement('div');
                notification.className = 'fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-dark/80 text-white px-6 py-3 rounded-full shadow-xl text-sm flex items-center';
                notification.innerHTML = '<i class="fa fa-lightbulb-o mr-2"></i> 尝试使用搜索功能或返回首页查找所需内容';
                document.body.appendChild(notification);
                
                // 5秒后隐藏提示
                setTimeout(() => {
                    notification.style.opacity = '0';
                    notification.style.transition = 'opacity 0.5s ease-out';
                    setTimeout(() => notification.remove(), 500);
                }, 5000);
            }, 2000);
        });
        
        // 光效动画
        @keyframes shine {
            0% { transform: translateX(-100%) rotate(12deg); }
            100% { transform: translateX(200%) rotate(12deg); }
        }
    </script>
{% endraw %}