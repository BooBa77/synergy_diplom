import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';

export default class ProjectsCurrentCarousel {
    constructor() {
        this.container = document.querySelector('#group-current .screenshots-slider');
        
        if (!this.container) {
            console.warn('Карусель текущих проектов не найдена');
            return;
        }
        
        this.init();
    }
    
    init() {
        this.swiper = new Swiper(this.container, {

        // Количество слайдов в зависимости от ширины экрана
        slidesPerView: 1,
        spaceBetween: 20,
        
        // Адаптивные настройки
        breakpoints: {
            // На телефонах
            320: {
                slidesPerView: 1,
                spaceBetween: 15
            },
            // На планшетах
            640: {
                slidesPerView: 2,
                spaceBetween: 20
            },
            // На ноутбуках
            992: {
                slidesPerView: 2,
                spaceBetween: 25
            },
            // На больших экранах
            1200: {
                slidesPerView: 3,
                spaceBetween: 30
            }
        },
        
        // Навигация
        navigation: {
            nextEl: '.screenshots-slider .swiper-button-next',
            prevEl: '.screenshots-slider .swiper-button-prev',
        },
        
        // Пагинация
        pagination: {
            el: '.screenshots-slider .swiper-pagination',
            clickable: true,
            dynamicBullets: true,
        },
        
        // Дополнительные настройки
        loop: false,
        grabCursor: true,
        speed: 500,
        
        // Эффекты
        effect: 'slide',
        
        // Автовысота
        autoHeight: false,
        
        // Центрирование активного слайда
        centeredSlides: false,
        
        // Отступы от краев
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0


/*
            slidesPerView: 1,
            spaceBetween: 20,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                768: { slidesPerView: 1.5, centeredSlides: true },
                1024: { slidesPerView: 2 }
            }
*/


        });
    }
}