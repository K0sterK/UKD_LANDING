// script.js
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });
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
});
