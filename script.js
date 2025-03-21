$(document).ready(function () {
    console.log("jQuery працює!");

    // Перемикач вкладок
    $('.tab-link').click(function () {
        var tabId = $(this).data('tab');

        if (!tabId) {
            console.warn("Помилка: tabId не знайдено!");
            return;
        }

        $('.tab-link').removeClass('active');
        $(this).addClass('active');

        $('.tab-content').removeClass('active').css('transform', 'translateX(100%)');
        $('#' + tabId).addClass('active').css('transform', 'translateX(0)');
    });

    // Головний акордеон
    $('.accordion dt').click(function () {
        var $dd = $(this).next('dd');

        if (!$dd.length) {
            console.warn("Помилка: відповідного <dd> не знайдено!");
            return;
        }

        if (!$dd.hasClass('active')) {
            $(this).siblings('dd.active').slideUp().removeClass('active');
            $dd.stop(true, true).slideDown().addClass('active');
        } else {
            $dd.stop(true, true).slideUp().removeClass('active');
        }
    });

    // Вкладений акордеон
    $('.nested-accordion dt').click(function(event) {
    event.stopPropagation(); // Зупиняє подію, щоб вона не йшла до батьків

    var nestedDd = $(this).next('dd');

    if (!nestedDd.hasClass('active')) {
        // Закриваємо тільки сусідні вкладені <dd> в межах поточного <dl>
        $(this).closest('.nested-accordion').find('dd.active').slideUp().removeClass('active');

        // Відкриваємо поточний
        nestedDd.stop(true, true).slideDown().addClass('active');
    nestedDd.stop(true, true).slideUp().removeClass('active');
        
    }
});
//галерея

const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const peekSlides = document.querySelectorAll('.peek-slide');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');

let index = 0;
const fullSlideWidth = 750;
const peekSlideWidth = 150;
const moveDistance = fullSlideWidth; // Зміщення лише на повний кадр

function updateSlider() {
    slider.style.transform = `translateX(${-index * moveDistance}px)`;
}

// Функція для перемикання слайдів
nextButton.addEventListener('click', () => {
    if (index < slides.length - 1) {
        index++;
        updateSlider();
    }
});

prevButton.addEventListener('click', () => {
    if (index > 0) {
        index--;
        updateSlider();
    }
});

updateSlider();
$(document).ready(function () {
  function revealSections() {
    $("section").each(function () {
      let sectionTop = $(this).offset().top;
      let windowBottom = $(window).scrollTop() + $(window).height();
      if (windowBottom > sectionTop + 100) {
        $(this).addClass("visible");
      }
    });
  }
  const images = document.querySelectorAll(".about-image img");
let index = 0;

function changeImage() {
    images[index].classList.remove("active");
    index = (index + 1) % images.length;
    images[index].classList.add("active");
}

setInterval(changeImage, 4000);


  // Викликаємо функцію при завантаженні сторінки та скролі
  revealSections();
  $(window).on("scroll", revealSections);
});
document.addEventListener("DOMContentLoaded", function () {
    let header = document.querySelector("header");

    window.addEventListener("scroll", function () {
        if (window.scrollY > 50) {
            header.classList.add("shrink");
        } else {
            header.classList.remove("shrink");
        }
    });
});
const header = document.querySelector('header');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    if (window.scrollY > lastScrollY) {
        header.classList.add('hidden');
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
            
        });
        document.addEventListener('DOMContentLoaded', function() {
            // Знаходимо вертикальну навігацію
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
                // Показувати навігацію тільки коли прокручено нижче першого екрану
                if (window.scrollY > window.innerHeight) {
                    verticalNav.classList.add('visible');
                } else {
                    verticalNav.classList.remove('visible');
                }
                
                // Визначення активної секції
                let currentSection = null;
                
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.clientHeight;
                    
                    if (window.scrollY >= sectionTop - 200 && 
                        window.scrollY < sectionTop + sectionHeight - 200) {
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
        // Додайте цей код в кінець вашого script.js файлу

// Функція для перевірки, чи є пристрій мобільним
function isMobileDevice() {
    return (window.innerWidth <= 768) || 
           ('ontouchstart' in window) || 
           (navigator.maxTouchPoints > 0) || 
           (navigator.msMaxTouchPoints > 0);
}

// Адаптивність для галереї
document.addEventListener('DOMContentLoaded', function() {
    function adjustSliderSize() {
        const sliders = document.querySelectorAll('.slider');
        const sliderContainers = document.querySelectorAll('.slider-container');
        const slides = document.querySelectorAll('.slide');
        
        if (window.innerWidth <= 768) {
            // Для мобільних пристроїв
            slides.forEach(slide => {
                slide.style.width = '100%';
            });
            
            // Оновлюємо moveDistance для мобільних, якщо змінні існують
            if (typeof index !== 'undefined' && typeof moveDistance !== 'undefined' && typeof updateSlider === 'function') {
                moveDistance = sliderContainers[0].offsetWidth;
                updateSlider();
            }
        }
    }
    
    // Викликаємо функцію при завантаженні та зміні розміру вікна
    if (document.querySelectorAll('.slider-container').length > 0) {
        adjustSliderSize();
        window.addEventListener('resize', adjustSliderSize);
    }
    
    // Додаємо підтримку свайпів для галереї на мобільних пристроях
    const sliderContainers = document.querySelectorAll('.slider-container');
    
    sliderContainers.forEach(container => {
        let startX, moveX;
        let isDown = false;
        
        container.addEventListener('touchstart', function(e) {
            isDown = true;
            startX = e.touches[0].clientX;
        }, { passive: true });
        
        container.addEventListener('touchmove', function(e) {
            if (!isDown) return;
            moveX = e.touches[0].clientX;
        }, { passive: true });
        
        container.addEventListener('touchend', function() {
            if (!isDown) return;
            isDown = false;
            
            if (typeof moveX === 'undefined') return;
            
            const diffX = startX - moveX;
            
            // Якщо свайп достатньо довгий
            if (Math.abs(diffX) > 50) {
                // Перевіряємо, чи існують необхідні змінні та функції
                if (typeof index !== 'undefined' && typeof updateSlider === 'function') {
                    // Свайп вліво - наступний слайд
                    if (diffX > 0) {
                        const slides = document.querySelectorAll('.slide');
                        if (index < slides.length - 1) {
                            index++;
                            updateSlider();
                        }
                    }
                    // Свайп вправо - попередній слайд
                    else if (diffX < 0) {
                        if (index > 0) {
                            index--;
                            updateSlider();
                        }
                    }
                }
            }
        });
    });
    
    // Адаптивність для вкладок
    const tabButtons = document.querySelectorAll('.tab-buttons button');
    
    // Прокрутка до активної вкладки на мобільних
    function scrollToActiveTab() {
        if (window.innerWidth <= 768) {
            const activeTab = document.querySelector('.tab-link.active');
            if (activeTab) {
                const tabContainer = document.querySelector('.tab-buttons');
                if (tabContainer) {
                    tabContainer.scrollLeft = activeTab.offsetLeft - tabContainer.offsetWidth / 2 + activeTab.offsetWidth / 2;
                }
            }
        }
    }
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            setTimeout(scrollToActiveTab, 100);
        });
    });
    
    // Викликаємо при завантаженні
    setTimeout(scrollToActiveTab, 500);
});

// Модифікуємо обробник скролу для вертикальної навігації
document.addEventListener('DOMContentLoaded', function() {
    const verticalNav = document.querySelector('.vertical-nav');
    if (!verticalNav) return;
    
    function handleVerticalNavScroll() {
        const navLinks = document.querySelectorAll('.vertical-nav a');
        const sections = document.querySelectorAll('section[id]');
        
        // Показувати навігацію тільки коли прокручено нижче першого екрану
        // Для мобільних пристроїв зменшуємо поріг появи
        const scrollThreshold = isMobileDevice() ? window.innerHeight * 0.7 : window.innerHeight;
        
        if (window.scrollY > scrollThreshold) {
            verticalNav.classList.add('visible');
        } else {
            verticalNav.classList.remove('visible');
        }
        
        // Визначення активної секції
        let currentSection = null;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            // Для мобільних пристроїв змінюємо зону активації секції
            const offset = isMobileDevice() ? 100 : 200;
            
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
    
    // Додаємо обробник скролу
    window.addEventListener('scroll', handleVerticalNavScroll);
    
    // Додаємо обробник зміни розміру вікна
    window.addEventListener('resize', handleVerticalNavScroll);
    
    // Додаємо обробник для сенсорних пристроїв
    document.addEventListener('touchmove', handleVerticalNavScroll, { passive: true });
    
    // Перевірка початкового стану
    handleVerticalNavScroll();
});
function debugAccordionSliders() {
    console.log("=== DEBUGGING ACCORDION SLIDERS ===");
    
    // Перевіряємо наявність слайдерів
    const sliders = document.querySelectorAll('.accordion-slider');
    console.log(`Found ${sliders.length} sliders on page`);
    
    // Перевіряємо кожен слайдер
    sliders.forEach((slider, i) => {
        const slides = slider.querySelectorAll('.accordion-slide');
        console.log(`Slider ${i+1}: Found ${slides.length} slides`);
        
        // Перевіряємо видимість слайдера
        const sliderVisible = slider.offsetParent !== null;
        console.log(`Slider ${i+1} is ${sliderVisible ? 'visible' : 'hidden'}`);
        
        // Перевіряємо розміри слайдера
        console.log(`Slider ${i+1} dimensions: ${slider.offsetWidth}x${slider.offsetHeight}`);
        
        // Перевіряємо стилі слайдів
        slides.forEach((slide, j) => {
            console.log(`Slide ${j+1} in slider ${i+1}:`);
            console.log(`- Position: ${getComputedStyle(slide).position}`);
            console.log(`- Opacity: ${getComputedStyle(slide).opacity}`);
            console.log(`- Z-index: ${getComputedStyle(slide).zIndex}`);
        });
    });
    
    console.log("=== END DEBUGGING ===");
}

// Повністю нова функція для зміни зображень
function setupImageRotation() {
    console.log("Setting up image rotation for accordion sliders");
    
    // Знаходимо всі слайдери
    const sliders = document.querySelectorAll('.accordion-slider');
    
    sliders.forEach((slider) => {
        // Очищаємо попередній інтервал, якщо він існує
        if (slider.dataset.intervalId) {
            clearInterval(parseInt(slider.dataset.intervalId));
            console.log("Cleared previous interval");
        }
        
        // Знаходимо всі слайди в поточному слайдері
        const slides = slider.querySelectorAll('.accordion-slide');
        
        // Якщо слайдів менше 2, немає сенсу налаштовувати ротацію
        if (slides.length < 2) {
            console.log("Not enough slides for rotation");
            return;
        }
        
        console.log(`Setting up rotation for ${slides.length} slides`);
        
        // Переконуємося, що тільки перший слайд активний
        slides.forEach((slide, index) => {
            if (index === 0) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
        
        // Встановлюємо індекс поточного слайду
        let currentIndex = 0;
        
        // Функція для зміни слайду
        function rotateImages() {
            // Приховуємо поточний слайд
            slides[currentIndex].classList.remove('active');
            
            // Обчислюємо індекс наступного слайду
            currentIndex = (currentIndex + 1) % slides.length;
            
            // Показуємо наступний слайд
            slides[currentIndex].classList.add('active');
            
            console.log(`Rotated to slide ${currentIndex + 1}`);
        }
        
        // Запускаємо інтервал для зміни слайдів
        const intervalId = setInterval(rotateImages, 3000);
        
        // Зберігаємо ID інтервалу в атрибуті data-interval-id
        slider.dataset.intervalId = intervalId;
        
        console.log(`Set up interval with ID ${intervalId}`);
    });
}

// Додайте цей код в ваш document.ready або DOMContentLoaded обробник
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded");
    
    // Запускаємо відлагодження
    setTimeout(debugAccordionSliders, 1000);
    
    // Налаштовуємо ротацію зображень після завантаження сторінки
    setTimeout(setupImageRotation, 1500);
    
    // Налаштовуємо ротацію при кліку на елементи акордеону
    document.querySelectorAll('.accordion dt, .nested-accordion dt').forEach(item => {
        item.addEventListener('click', function() {
            console.log("Accordion item clicked");
            // Даємо час для відображення контенту
            setTimeout(debugAccordionSliders, 500);
            setTimeout(setupImageRotation, 1000);
        });
    });
    
    // Налаштовуємо ротацію при зміні вкладок
    document.querySelectorAll('.tab-link').forEach(tab => {
        tab.addEventListener('click', function() {
            console.log("Tab clicked");
            // Даємо час для відображення контенту
            setTimeout(debugAccordionSliders, 500);
            setTimeout(setupImageRotation, 1000);
        });
    });
});
        });