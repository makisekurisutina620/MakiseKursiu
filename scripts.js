// 页面加载完成后执行
window.addEventListener('DOMContentLoaded', () => {
    // 导航栏滚动效果
    const header = document.querySelector('header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    // 作品集过滤功能
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    // 模态框功能
    const modal = document.querySelector('.portfolio-modal');
    const modalClose = document.querySelector('.modal-close');
    const modalImage = document.querySelector('.modal-image img');
    const modalTitle = document.querySelector('.modal-info h2');
    const modalCategory = document.querySelector('.modal-category');
    const modalDescription = document.querySelector('.modal-description');
    
    // 滚动动画
    const fadeElements = document.querySelectorAll('.fade-in');
    
    // 防抖函数
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // 滚动时改变导航栏样式
    const handleScroll = debounce(() => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        checkScroll();
    }, 100);
    
    window.addEventListener('scroll', handleScroll);
    
    // 初始化执行一次
    handleScroll();
    
    // 移动菜单切换
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }
    
    // 关闭移动菜单
    function closeMobileMenu() {
        if (menuToggle && navLinks) {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    }
    
    // 点击导航链接时关闭菜单
    if (navLinks) {
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }
    
    // 图片延迟加载功能
    function lazyLoadImages() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // 回退方案
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }
    
    // 初始化图片延迟加载
    lazyLoadImages();
    
    // 滚动动画检查
    function checkScroll() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            const isVisible = (elementTop < window.innerHeight - 100) && (elementBottom > 0);
            
            if (isVisible) {
                element.classList.add('active');
            }
        });
    }
    
    // 作品集过滤功能
    if (filterBtns.length > 0 && portfolioItems.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // 更新按钮状态
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.getAttribute('data-filter');
                renderItems(filter);
            });
        });
    }
    
    // 渲染作品项
    function renderItems(filter) {
        let visibleItems = 0;
        
        portfolioItems.forEach((item, index) => {
            const itemCategory = item.getAttribute('data-category');
            
            if (filter === 'all' || filter === itemCategory) {
                item.style.display = 'block';
                item.classList.add('fade-in');
                
                // 移除之前的active类以重置动画
                item.classList.remove('active');
                
                // 添加微小延迟以实现交错动画效果
                setTimeout(() => {
                    item.classList.add('active');
                }, 50 * visibleItems);
                
                visibleItems++;
            } else {
                item.style.display = 'none';
                item.classList.remove('active');
            }
        });
        
        // 检查是否有可见项目
        const noResults = document.querySelector('.no-results');
        if (noResults) {
            if (visibleItems === 0) {
                noResults.style.display = 'block';
                setTimeout(() => {
                    noResults.classList.add('active');
                }, 100);
            } else {
                noResults.style.display = 'none';
                noResults.classList.remove('active');
            }
        }
    }
    
    // 模态框功能
    if (modal && portfolioItems.length > 0) {
        portfolioItems.forEach(item => {
            item.addEventListener('click', () => {
                const image = item.querySelector('img');
                const title = item.querySelector('.portfolio-item-title');
                const category = item.querySelector('.portfolio-item-category');
                const description = item.getAttribute('data-description');
                
                if (image && title && category) {
                    modalImage.src = image.src;
                    modalTitle.textContent = title.textContent;
                    modalCategory.textContent = category.textContent;
                    modalDescription.textContent = description || '暂无详细描述';
                    
                    modal.classList.add('active');
                    document.body.classList.add('modal-open');
                }
            });
        });
        
        // 关闭模态框
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                modal.classList.remove('active');
                document.body.classList.remove('modal-open');
            });
        }
        
        // 点击模态框外部关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.classList.remove('modal-open');
            }
        });
        
        // 按ESC键关闭模态框
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                modal.classList.remove('active');
                document.body.classList.remove('modal-open');
            }
        });
    }
    
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 表单提交处理
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('感谢您的留言！我会尽快回复您。');
            contactForm.reset();
        });
    }
});