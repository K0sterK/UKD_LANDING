$(document).ready(function () {
    console.log("jQuery працює!");

    // Ініціалізація Facebook Pixel відстеження
    initializeTracking();
    
    // Ініціалізація галереї з циклічною навігацією
    initializeGallery();
    
    // Ініціалізація акордеону з анімаціями
    initializeAccordion();
    
    // Ініціалізація табів з анімаціями
    initializeTabs();
    
    // Інші функції
    initializeScrollEffects();
    initializeHeaderBehavior();
    initializeVerticalNav();

   // ФУНКЦІЯ 1: ВІДСТЕЖЕННЯ FACEBOOK PIXEL
   function initializeTracking() {
    // 1. Відстеження кліків на пункти в хедері
    $('header nav a').on('click', function() {
        const section = $(this).text().trim();
        fbq('trackCustom', 'Navigation', { section: section });
        console.log("Header navigation click tracked:", section);
    });

    // 2. Відстеження кліків на номери телефонів
    $('.phone-numbers a').on('click', function() {
        const phoneNumber = $(this).text().trim();
        fbq('trackCustom', 'Contact', { method: 'phone', content: phoneNumber });
        console.log("Phone click tracked:", phoneNumber);
    });

    // 3. Відстеження кліків на вертикальну навігацію
    $('.vertical-nav a').on('click', function() {
        const section = $(this).find('.nav-text').text().trim();
        fbq('trackCustom', 'VerticalNavigation', { section: section });
        console.log("Vertical navigation click tracked:", section);
    });

    // 4. Відстеження кліків на соціальні мережі справа
    $('.social-sidebar a').on('click', function() {
        const platform = $(this).attr('title');
        fbq('trackCustom', 'SocialClick', { platform: platform });
        console.log("Social sidebar click tracked:", platform);
    });

    // 5. Відстеження кліків на кнопку "Детальніше" в акордеоні
    $(document).on('click', '.details-link', function() {
        var section = $(this).closest('dd').prev('dt').text().trim();
        fbq('trackCustom', 'DetailsClick', { section: section });
        console.log("Details click tracked:", section);
    });

    // 6. Відстеження кліків на кнопку "Детальніше" в галереї
    $(document).on('click', '.gallery-details-link', function() {
        var section = $(this).closest('.text-block').find('h3').text().trim();
        fbq('trackCustom', 'GalleryDetailsClick', { section: section });
        console.log("Gallery details click tracked:", section);
    });

    // 7. Відстеження кліків на посилання в футері
    $('footer a').click(function() {
        var linkType = '';
        var linkValue = $(this).text().trim();
        
        if ($(this).closest('.social-icons').length) {
            linkType = 'social';
            linkValue = $(this).find('img').attr('alt');
        } else if ($(this).attr('href').startsWith('tel:')) {
            linkType = 'phone';
        } else if ($(this).attr('href').startsWith('mailto:')) {
            linkType = 'email';
        } else {
            linkType = 'link';
        }
        
        fbq('trackCustom', 'FooterClick', { type: linkType, value: linkValue });
        console.log("Footer click tracked:", linkType, linkValue);
    });
}

    // ФУНКЦІЯ 2: ГАЛЕРЕЯ З ЦИКЛІЧНОЮ НАВІГАЦІЄЮ
    function initializeGallery() {
        // Ініціалізація для всіх галерей на сторінці
        $('.gallery-container').each(function(galleryIndex) {
            const $gallery = $(this);
            const $slider = $gallery.find('.slider');
            const $slides = $gallery.find('.slide');
            const $prevButton = $gallery.find('.controls button:first-child');
            const $nextButton = $gallery.find('.controls button:last-child');
            const slideCount = $slides.length;
            
            // Встановлюємо початковий індекс
            $gallery.data('currentIndex', 0);
            
            // Функція для оновлення слайдера
            function updateSlider(newIndex) {
                const currentIndex = $gallery.data('currentIndex');
                const slideWidth = $slides.first().outerWidth();
                
                // Анімуємо перехід
                $slider.css({
                    'transition': 'transform 0.5s ease',
                    'transform': `translateX(${-newIndex * slideWidth}px)`
                });
                
                // Оновлюємо індекс
                $gallery.data('currentIndex', newIndex);
                
                // Відстежуємо подію тільки при ручній навігації (не при автопрокрутці)
                const galleryTitle = $gallery.find('.text-block h3').text().trim();
                const direction = newIndex > currentIndex ? 'next' : 'prev';
                
                fbq('track', 'GalleryNavigation', { 
                    direction: direction, 
                    gallery: galleryTitle,
                    slideIndex: newIndex
                });
                console.log(`Gallery ${galleryIndex} navigation: ${direction} to slide ${newIndex}`);
            }
            
            // Обробник для кнопки "Наступний"
            $nextButton.on('click', function() {
                const currentIndex = $gallery.data('currentIndex');
                // Циклічна навігація: якщо досягли кінця, повертаємось на початок
                const newIndex = (currentIndex + 1) % slideCount;
                updateSlider(newIndex);
            });
            
            // Обробник для кнопки "Попередній"
            $prevButton.on('click', function() {
                const currentIndex = $gallery.data('currentIndex');
                // Циклічна навігація: якщо на початку, переходимо в кінець
                const newIndex = (currentIndex - 1 + slideCount) % slideCount;
                updateSlider(newIndex);
            });
            
            // Зупиняємо автоматичну зміну при наведенні миші
            $gallery.hover(
                function() { $(this).addClass('paused'); },
                function() { $(this).removeClass('paused'); }
            );
            
            // Підтримка свайпів для мобільних пристроїв
            let touchStartX = 0;
            let touchEndX = 0;
            
            $slider.on('touchstart', function(e) {
                touchStartX = e.originalEvent.touches[0].clientX;
            });
            
            $slider.on('touchend', function(e) {
                touchEndX = e.originalEvent.changedTouches[0].clientX;
                handleSwipe();
            });
            
            function handleSwipe() {
                const minSwipeDistance = 50;
                const swipeDistance = touchEndX - touchStartX;
                
                if (Math.abs(swipeDistance) > minSwipeDistance) {
                    const currentIndex = $gallery.data('currentIndex');
                    let newIndex;
                    
                    if (swipeDistance < 0) {
                        // Свайп вліво - наступний слайд
                        newIndex = (currentIndex + 1) % slideCount;
                    } else {
                        // Свайп вправо - попередній слайд
                        newIndex = (currentIndex - 1 + slideCount) % slideCount;
                    }
                    
                    updateSlider(newIndex);
                }
            }
        });
    }

    // ФУНКЦІЯ 3: АКОРДЕОН З АНІМАЦІЯМИ
    function initializeAccordion() {
        // Попередньо завантажуємо контент акордеону для уникнення лагів
        preloadAccordionContent();
        
        // Головний акордеон
        $('.accordion dt').off('click').on('click', function() {
            const $dt = $(this);
            const $dd = $dt.next('dd');
            const sectionName = $dt.text().trim();
            
            if (!$dd.length) return;
            
            // Анімація для заголовка акордеону
            $dt.addClass('clicked');
            setTimeout(() => $dt.removeClass('clicked'), 300);
            
            // Відстеження події відкриття акордеону
            if (!$dd.hasClass('active')) {
                fbq('track', 'AccordionSectionOpen', { 
                    sectionName: sectionName,
                    sectionType: 'parent',
                    sectionPath: sectionName
                });
                console.log("Parent accordion section opened:", sectionName);
            }
            
            // Оптимізована анімація з плавною появою/зникненням
            if (!$dd.hasClass('active')) {
                // Закриваємо всі активні dd з анімацією
                $('.accordion dd.active').each(function() {
                    const $activeDD = $(this);
                    $activeDD.css({
                        'max-height': $activeDD.outerHeight(),
                        'overflow': 'hidden'
                    });
                    
                    // Анімуємо закриття
                    setTimeout(() => {
                        $activeDD.css({
                            'transition': 'max-height 0.3s ease-out, opacity 0.2s ease-out',
                            'max-height': '0',
                            'opacity': '0'
                        });
                        
                        // Після завершення анімації
                        setTimeout(() => {
                            $activeDD.removeClass('active').hide().css({
                                'max-height': '',
                                'opacity': '',
                                'transition': '',
                                'overflow': ''
                            });
                        }, 300);
                    }, 10);
                });
                
                // Відкриваємо поточний з затримкою та анімацією
                setTimeout(function() {
                    $dd.css({
                        'display': 'block',
                        'max-height': '0',
                        'opacity': '0',
                        'overflow': 'hidden'
                    });
                    
                    // Запускаємо анімацію появи
                    setTimeout(() => {
                        $dd.addClass('active').css({
                            'transition': 'max-height 0.5s ease-in, opacity 0.3s ease-in',
                            'max-height': '2000px', // Достатньо велике значення
                            'opacity': '1'
                        });
                        
                        // Після завершення анімації
                        setTimeout(() => {
                            $dd.css({
                                'max-height': '',
                                'transition': '',
                                'overflow': ''
                            });
                        }, 500);
                    }, 10);
                }, 310);
            } else {
                // Анімуємо закриття
                $dd.css({
                    'max-height': $dd.outerHeight(),
                    'overflow': 'hidden'
                });
                
                setTimeout(() => {
                    $dd.css({
                        'transition': 'max-height 0.3s ease-out, opacity 0.2s ease-out',
                        'max-height': '0',
                        'opacity': '0'
                    });
                    
                    // Після завершення анімації
                    setTimeout(() => {
                        $dd.removeClass('active').hide().css({
                            'max-height': '',
                            'opacity': '',
                            'transition': '',
                            'overflow': ''
                        });
                    }, 300);
                }, 10);
            }
        });
        
        // Вкладений акордеон
        $('.nested-accordion dt').off('click').on('click', function(event) {
            event.stopPropagation();
            
            const $dt = $(this);
            const $dd = $dt.next('dd');
            const childSection = $dt.text().trim();
            const parentSection = $dt.closest('.accordion').find('> dt').text().trim();
            
            if (!$dd.length) return;
            
            // Анімація для заголовка акордеону
            $dt.addClass('clicked');
            setTimeout(() => $dt.removeClass('clicked'), 300);
            
            // Відстеження події відкриття вкладеного акордеону
            if (!$dd.hasClass('active')) {
                fbq('track', 'AccordionSectionOpen', { 
                    sectionName: childSection,
                    sectionType: 'child',
                    parentSection: parentSection,
                    sectionPath: `${parentSection} > ${childSection}`
                });
                console.log("Child accordion section opened:", parentSection, ">", childSection);
            }
            
            // Оптимізована анімація з плавною появою/зникненням
            if (!$dd.hasClass('active')) {
                // Закриваємо всі активні вкладені dd з анімацією
                $dt.closest('.nested-accordion').find('dd.active').each(function() {
                    const $activeDD = $(this);
                    $activeDD.css({
                        'max-height': $activeDD.outerHeight(),
                        'overflow': 'hidden'
                    });
                    
                    // Анімуємо закриття
                    setTimeout(() => {
                        $activeDD.css({
                            'transition': 'max-height 0.3s ease-out, opacity 0.2s ease-out',
                            'max-height': '0',
                            'opacity': '0'
                        });
                        
                        // Після завершення анімації
                        setTimeout(() => {
                            $activeDD.removeClass('active').hide().css({
                                'max-height': '',
                                'opacity': '',
                                'transition': '',
                                'overflow': ''
                            });
                        }, 300);
                    }, 10);
                });
                
                // Відкриваємо поточний з затримкою та анімацією
                setTimeout(function() {
                    $dd.css({
                        'display': 'block',
                        'max-height': '0',
                        'opacity': '0',
                        'overflow': 'hidden'
                    });
                    
                    // Запускаємо анімацію появи
                    setTimeout(() => {
                        $dd.addClass('active').css({
                            'transition': 'max-height 0.5s ease-in, opacity 0.3s ease-in',
                            'max-height': '1000px', // Достатньо велике значення
                            'opacity': '1'
                        });
                        
                        // Після завершення анімації
                        setTimeout(() => {
                            $dd.css({
                                'max-height': '',
                                'transition': '',
                                'overflow': ''
                            });
                        }, 500);
                    }, 10);
                }, 310);
            } else {
                // Анімуємо закриття
                $dd.css({
                    'max-height': $dd.outerHeight(),
                    'overflow': 'hidden'
                });
                
                setTimeout(() => {
                    $dd.css({
                        'transition': 'max-height 0.3s ease-out, opacity 0.2s ease-out',
                        'max-height': '0',
                        'opacity': '0'
                    });
                    
                    // Після завершення анімації
                    setTimeout(() => {
                        $dd.removeClass('active').hide().css({
                            'max-height': '',
                            'opacity': '',
                            'transition': '',
                            'overflow': ''
                        });
                    }, 300);
                }, 10);
            }
        });
        
        // Попереднє завантаження контенту акордеону для уникнення лагів
        function preloadAccordionContent() {
            // Приховуємо всі dd елементи, але завантажуємо їх контент
            $('.accordion dd, .nested-accordion dd').each(function() {
                const $dd = $(this);
                
                // Якщо є зображення, попередньо завантажуємо їх
                $dd.find('img').each(function() {
                    const img = new Image();
                    img.src = $(this).attr('src');
                });
                
                // Якщо є iframe (карти, відео), також завантажуємо
                $dd.find('iframe').each(function() {
                    $(this).attr('data-src', $(this).attr('src'));
                    $(this).attr('src', '');
                });
            });
            
            // Додаємо обробник для завантаження iframe при відкритті акордеону
            $('.accordion dt, .nested-accordion dt').on('click', function() {
                const $dd = $(this).next('dd');
                
                $dd.find('iframe[data-src]').each(function() {
                    if (!$(this).attr('src')) {
                        $(this).attr('src', $(this).attr('data-src'));
                    }
                });
            });
        }
    }

    // ФУНКЦІЯ 4: ТАБИ З АНІМАЦІЯМИ
    function initializeTabs() {
        $('.tab-link').off('click').on('click', function() {
            const $tab = $(this);
            const tabId = $tab.data('tab');
            const tabLabel = $tab.text().trim();
            
            if (!tabId) {
                console.warn("Помилка: tabId не знайдено!");
                return;
            }
            
            // Відстеження зміни вкладки
            fbq('track', 'TabChange', { tab: tabId, label: tabLabel });
            console.log("Tab change tracked:", tabId, tabLabel);
            
            // Анімація для активної вкладки
            $tab.addClass('tab-clicked');
            setTimeout(() => $tab.removeClass('tab-clicked'), 300);
            
            // Оновлюємо активний стан вкладок
            $('.tab-link').removeClass('active');
            $tab.addClass('active');
            
            // Анімація зміни контенту
            const $currentContent = $('.tab-content.active');
            const $newContent = $('#' + tabId);
            
            // Анімуємо вихід поточного контенту
            $currentContent.css({
                'transition': 'transform 0.3s ease-out, opacity 0.3s ease-out',
                'transform': 'translateX(-30px)',
                'opacity': '0'
            });
            
            // Після завершення анімації виходу
            setTimeout(() => {
                $currentContent.removeClass('active').css({
                    'transform': 'translateX(100%)',
                    'transition': '',
                    'display': 'none'
                });
                
                // Підготовка нового контенту
                $newContent.css({
                    'display': 'block',
                    'transform': 'translateX(30px)',
                    'opacity': '0'
                });
                
                // Анімуємо вхід нового контенту
                setTimeout(() => {
                    $newContent.addClass('active').css({
                        'transition': 'transform 0.3s ease-in, opacity 0.3s ease-in',
                        'transform': 'translateX(0)',
                        'opacity': '1'
                    });
                    
                    // Після завершення анімації входу
                    setTimeout(() => {
                        $newContent.css({
                            'transition': ''
                        });
                    }, 300);
                }, 20);
            }, 300);
            
            // Прокрутка до активної вкладки на мобільних
            if (window.innerWidth <= 768) {
                const tabContainer = document.querySelector('.tab-buttons');
                if (tabContainer) {
                    tabContainer.scrollLeft = $tab[0].offsetLeft - tabContainer.offsetWidth / 2 + $tab[0].offsetWidth / 2;
                }
            }
        });
    }

    // ФУНКЦІЯ 5: ЕФЕКТИ СКРОЛУ
    function initializeScrollEffects() {
        // Анімація секцій при скролі
        function revealSections() {
            $("section").each(function() {
                let sectionTop = $(this).offset().top;
                let windowBottom = $(window).scrollTop() + $(window).height();
                if (windowBottom > sectionTop + 100) {
                    $(this).addClass("visible");
                }
            });
        }
        
        // Зміна зображень в секції About
        const aboutImages = document.querySelectorAll(".about-image img");
        let aboutImageIndex = 0;

        function changeAboutImage() {
            if (aboutImages.length > 1) {
                aboutImages[aboutImageIndex].classList.remove("active");
                aboutImageIndex = (aboutImageIndex + 1) % aboutImages.length;
                aboutImages[aboutImageIndex].classList.add("active");
            }
        }

        if (aboutImages.length > 0) {
            setInterval(changeAboutImage, 4000);
        }

        // Викликаємо функцію при завантаженні сторінки та скролі
        revealSections();
        $(window).on("scroll", revealSections);
    }

    // ФУНКЦІЯ 6: ПОВЕДІНКА ХЕДЕРА
    function initializeHeaderBehavior() {
        // Анімація хедера при скролі
        let header = document.querySelector("header");
        if (header) {
            window.addEventListener("scroll", function() {
                if (window.scrollY > 50) {
                    header.classList.add("shrink");
                } else {
                    header.classList.remove("shrink");
                }
            });
        }
        
        // Приховування хедера при скролі вниз
        let lastScrollY = window.scrollY;
        if (header) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > lastScrollY) {
                    header.classList.add('hidden');
                } else {
                    header.classList.remove('hidden');
                }
                lastScrollY = window.scrollY;
            });

            header.addEventListener('mouseenter', () => {
                header.classList.remove('hidden');
            });

            header.addEventListener('mouseleave', () => {
                if (window.scrollY > 0) {
                    header.classList.add('hidden');
                }
            });
        }
    }

    // ФУНКЦІЯ 7: ВЕРТИКАЛЬНА НАВІГАЦІЯ
    function initializeVerticalNav() {
        const verticalNav = document.querySelector('.vertical-nav');
        const navLinks = document.querySelectorAll('.vertical-nav a');
        const sections = document.querySelectorAll('section[id]');
        
        // Функція для плавного скролу при кліку на посилання
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Функція для обробки скролу
        function handleScroll() {
            if (!verticalNav) return;
            
            // Показувати навігацію тільки коли прокручено нижче першого екрану
            if (window.scrollY > window.innerHeight * 0.7) {
                verticalNav.classList.add('visible');
            } else {
                verticalNav.classList.remove('visible');
            }
            
            // Визначення активної секції
            let currentSection = null;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                const isMobile = window.innerWidth <= 768;
                const offset = isMobile ? 100 : 200;
                
                if (window.scrollY >= sectionTop - offset && 
                    window.scrollY < sectionTop + sectionHeight - offset) {
                    currentSection = section.getAttribute('id');
                }
            });
            
            // Оновлення активного стану посилань
            navLinks.forEach(link => {
                link.classList.remove('active');
                
                if (currentSection && link.getAttribute('href') === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
        }
        
        // Додавання обробника події скролу
        window.addEventListener('scroll', handleScroll);
        
        // Перевірка початкового стану
        handleScroll();
    }
});