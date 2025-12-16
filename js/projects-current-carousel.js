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
        });
    }
}