document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const navbarToggler = document.querySelector('.navbar__toggler');
    const navbarMenu = document.querySelector('.navbar__menu');
    
    navbarToggler.addEventListener('click', function() {
        this.classList.toggle('active');
        navbarMenu.classList.toggle('active');
        this.setAttribute('aria-expanded', this.classList.contains('active'));
    });
    
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    const themeText = themeToggle.querySelector('span');
    
    // Check for saved theme preference
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
        themeText.textContent = 'Дневной режим';
    }
    
    themeToggle.addEventListener('click', function() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            themeText.textContent = 'Ночной режим';
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            themeText.textContent = 'Дневной режим';
            localStorage.setItem('theme', 'dark');
        }
    });
    
    // Scroll down button
    const scrollDownBtn = document.getElementById('scrollDown');
    if (scrollDownBtn) {
        scrollDownBtn.addEventListener('click', function() {
            window.scrollBy({
                top: window.innerHeight - 100,
                behavior: 'smooth'
            });
        });
    }
    
    // Back to top button
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navbarMenu.classList.contains('active')) {
                    navbarToggler.classList.remove('active');
                    navbarMenu.classList.remove('active');
                    navbarToggler.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });
    
    // Optimize images for mobile
    function optimizeImagesForMobile() {
        if (window.innerWidth <= 768) {
            const images = document.querySelectorAll('.image-wrapper img, .news-card__image img, .gallery-img');
            
            images.forEach(img => {
                // Приоритетная загрузка на мобильных
                img.loading = 'eager';
                
                // Можно добавить логику для загрузки мобильных версий изображений
                // if (img.dataset.mobileSrc) {
                //     img.src = img.dataset.mobileSrc;
                // }
            });
        }
    }
    
    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    // Загружаем правильную версию изображения в зависимости от размера экрана
                    const srcset = img.getAttribute('srcset');
                    if (srcset) {
                        const sources = srcset.split(', ');
                        const screenWidth = window.innerWidth;
                        let bestSrc = img.getAttribute('src');
                        
                        for (let source of sources) {
                            const [url, width] = source.split(' ');
                            const imgWidth = parseInt(width);
                            
                            if (imgWidth >= screenWidth) {
                                bestSrc = url;
                                break;
                            }
                        }
                        
                        img.src = bestSrc;
                    } else {
                        img.src = img.getAttribute('src');
                    }
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '200px'
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Add animation on scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.attraction');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial state for animation
    const attractions = document.querySelectorAll('.attraction');
    attractions.forEach((attraction, index) => {
        attraction.style.opacity = '0';
        attraction.style.transform = 'translateY(50px)';
        attraction.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
    });
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on load
    
    // Модальное окно с часами работы
    const hoursModal = document.getElementById('hoursModal');
    const modalClose = document.querySelectorAll('.modal__close');
    const hoursButtons = document.querySelectorAll('.btn-hours');
    
    hoursButtons.forEach(button => {
        button.addEventListener('click', openHoursModal);
    });
    
    function openHoursModal(e) {
        e.preventDefault();
        hoursModal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Подсветим текущий день
        highlightCurrentDay();
    }
    
    function closeHoursModal() {
        hoursModal.classList.remove('show');
        document.body.style.overflow = '';
    }
    
    // Функция для подсветки текущего дня
    function highlightCurrentDay() {
        const days = document.querySelectorAll('.schedule__item');
        days.forEach(day => day.classList.remove('schedule__item--current'));
        
        const today = new Date().getDay(); // 0 - воскресенье, 1 - понедельник и т.д.
        const dayIndex = today === 0 ? 6 : today - 1; // Наш список начинается с понедельника
        
        if (dayIndex >= 0 && dayIndex < days.length) {
            days[dayIndex].classList.add('schedule__item--current');
        }
    }
    
    // Обработчик для кнопки "Как добраться"
    document.querySelectorAll('.btn-map').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Получаем элемент карты
            const mapSection = document.getElementById('map');
            if (mapSection) {
                // Вычисляем позицию с учетом высоты навигационной панели
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = mapSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                // Плавная прокрутка
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Закрываем мобильное меню, если оно открыто
                if (navbarMenu.classList.contains('active')) {
                    navbarToggler.classList.remove('active');
                    navbarMenu.classList.remove('active');
                    navbarToggler.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });
    
    // Обработчик для кнопки "Фотогалерея"
    document.querySelectorAll('.btn-gallery').forEach(button => {
        button.addEventListener('click', openGalleryModal);
    });
    
    function openGalleryModal(e) {
        e.preventDefault();
        const galleryModal = document.getElementById('galleryModal');
        galleryModal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Прокручиваем в начало галереи при открытии
        const gallery = galleryModal.querySelector('.vertical-gallery');
        if(gallery) {
            gallery.scrollTop = 0;
        }
    }
    
    function closeGalleryModal() {
        const galleryModal = document.getElementById('galleryModal');
        galleryModal.classList.remove('show');
        document.body.style.overflow = '';
    }
    
    // Закрытие модальных окон
    modalClose.forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            if (this.closest('#hoursModal')) {
                closeHoursModal();
            } else if (this.closest('#galleryModal')) {
                closeGalleryModal();
            }
        });
    });
    
    // Закрытие по клику вне окна
    document.getElementById('hoursModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeHoursModal();
        }
    });
    
    document.getElementById('galleryModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeGalleryModal();
        }
    });
    
    // Закрытие по ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const galleryModal = document.getElementById('galleryModal');
            if (galleryModal.classList.contains('show')) {
                closeGalleryModal();
            }
            
            const hoursModal = document.getElementById('hoursModal');
            if (hoursModal.classList.contains('show')) {
                closeHoursModal();
            }
        }
    });
    
    // Оптимизация изображений при загрузке и изменении размера
    window.addEventListener('load', optimizeImagesForMobile);
    window.addEventListener('resize', optimizeImagesForMobile);
});
// Обработчик для кнопки "Маршрут прогулки"
document.querySelectorAll('.btn-route').forEach(button => {
  button.addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('routeModal').classList.add('show');
    document.body.style.overflow = 'hidden';
  });
});

// Закрытие модального окна
function closeRouteModal() {
  document.getElementById('routeModal').classList.remove('show');
  document.body.style.overflow = '';
}

// Назначение обработчиков закрытия
document.querySelector('#routeModal .modal__close').addEventListener('click', closeRouteModal);
document.getElementById('routeModal').addEventListener('click', function(e) {
  if (e.target === this) closeRouteModal();
});
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeRouteModal();
});
// Добавьте этот код в ваш script.js файл

document.addEventListener('DOMContentLoaded', function() {
  // ... ваш существующий код ...
  
  // Анимация при скролле
  const animateOnScroll = function() {
    const elements = document.querySelectorAll('[data-animate]');
    const windowHeight = window.innerHeight;
    const windowTop = window.scrollY;
    const windowBottom = windowTop + windowHeight;
    
    elements.forEach(element => {
      const elementHeight = element.offsetHeight;
      const elementTop = element.getBoundingClientRect().top + windowTop;
      const elementBottom = elementTop + elementHeight;
      
      // Проверяем, находится ли элемент в области видимости
      if (elementBottom >= windowTop && elementTop <= windowBottom) {
        element.classList.add('animate');
      } else {
        // Можно раскомментировать, если нужно, чтобы анимация повторялась
        // element.classList.remove('animate');
      }
    });
  };
  
  // Инициализация анимаций
  function initAnimations() {
    const sections = [
      '#library', 
      '#theater', 
      '#embankment', 
      '#news', 
      '#map'
    ];
    
    sections.forEach((section, index) => {
      const element = document.querySelector(section);
      if (element) {
        element.setAttribute('data-animate', '');
        element.setAttribute('data-animate-delay', (index * 100) + 100);
      }
    });
    
    // Анимация для карточек новостей
    const newsCards = document.querySelectorAll('.news-card');
    newsCards.forEach((card, index) => {
      card.setAttribute('data-animate', '');
      card.setAttribute('data-animate-delay', (index * 100) + 100);
    });
    
    // Анимация для CTA блока
    const newsCta = document.querySelector('.news-cta');
    if (newsCta) {
      newsCta.setAttribute('data-animate', '');
      newsCta.setAttribute('data-animate-delay', '600');
    }
  }
  
  // Инициализируем анимации
  initAnimations();
  
  // Запускаем при загрузке и при скролле
  animateOnScroll();
  window.addEventListener('scroll', animateOnScroll);
  
  // ... остальной ваш код ...
});
  // Инициализация Supabase
const supabaseUrl = 'https://msoortsenydhikmeowep.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zb29ydHNlbnlkaGlrbWVvd2VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMTQ3ODMsImV4cCI6MjA3MzU5MDc4M30.YiewlzuvmolyPHbmsfHuPHRcpRkAiNCnkTmb_GCxzxk';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseAnonKey);

async function loadNews() {
    try {
        let { data: news, error } = await supabaseClient
            .from('news')
            .select('*')
            .eq('is_active', true) // Добавляем фильтр по активным новостям
            .order('created_at', { ascending: false });

        const container = document.getElementById('news-container');
        
        if (error) {
            console.error('Ошибка загрузки:', error);
            container.innerHTML = '<p class="error-news">Не удалось загрузить новости. Проверьте подключение.</p>';
            return;
        }

        if (!news || news.length === 0) {
            container.innerHTML = '<p class="no-news">Новостей пока нет. Зайдите позже!</p>';
            return;
        }

        container.innerHTML = '';
        news.forEach(item => {
            const newsItem = `
                <article class="news-card" data-animate>
                    <div class="news-card__image">
                        <img src="${item.image_url || 'https://via.placeholder.com/400x300?text=Новость'}" 
                             alt="${item.title || 'Новость'}" 
                             loading="lazy"
                             onerror="this.src='https://via.placeholder.com/400x300?text=Изображение'">
                        ${item.date ? `<div class="news-card__date">
                            <span class="day">${formatDate(item.date)}</span>
                        </div>` : ''}
                    </div>
                    <div class="news-card__content">
                        <h3 class="news-card__title">${item.title || 'Новое мероприятие'}</h3>
                        <p class="news-card__excerpt">${item.description || 'Описание мероприятия'}</p>
                        <div class="news-card__meta">
                            ${item.place ? `<span><i class="fas fa-map-marker-alt"></i> ${item.place}</span>` : ''}
                            ${item.time ? `<span><i class="fas fa-clock"></i> ${item.time}</span>` : ''}
                        </div>
                        <div class="news-card__actions">
                            ${item.button_link ? `<a href="${item.button_link}" class="btn btn--primary" target="_blank">${item.button_text || 'Купить билет'}</a>` : ''}
                            ${item.button_text_li ? `<a href="${item.button_text_li}" class="btn btn--outline" target="_blank">${item.button_text || 'Подробнее'}</a>` : ''}
                        </div>
                    </div>
                </article>
            `;
            container.innerHTML += newsItem;
        });

        // Запускаем анимацию для новых карточек
        setTimeout(animateOnScroll, 100);
    } catch (err) {
        console.error('Ошибка:', err);
        document.getElementById('news-container').innerHTML = '<p class="error-news">Ошибка загрузки новостей</p>';
    }
}

// Вспомогательная функция для форматирования даты
function formatDate(dateString) {
    if (!dateString) return '';
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            // Если это не валидная дата, возвращаем как есть
            return dateString;
        }
        
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        return `${day}.${month}`;
    } catch (e) {
        return dateString;
    }
}

// Функция для анимации карточек
function animateNewsCards() {
    const newsCards = document.querySelectorAll('.news-card[data-animate]');
    const windowHeight = window.innerHeight;
    
    newsCards.forEach((card, index) => {
        const cardTop = card.getBoundingClientRect().top;
        
        if (cardTop < windowHeight - 100) {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 150);
        }
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // ... ваш существующий код ...
    
    // Загружаем новости
    loadNews();
    
    // Добавляем обработчик скролла для анимации новостей
    window.addEventListener('scroll', animateNewsCards);
    
    // Инициализация анимаций для новостей
    const newsCards = document.querySelectorAll('.news-card');
    newsCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Запускаем начальную анимацию
    setTimeout(animateNewsCards, 500);
});
