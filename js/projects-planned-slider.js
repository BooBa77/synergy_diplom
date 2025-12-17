// Инициализация слайдера запланированных проектов
import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';

export default class ProjectsPlannedSlider {
    constructor() {
        this.container = document.querySelector('#group-planned .projects-slider');
        
        if (!this.container) {
            console.warn('Слайдер запланированных проектов не найден');
            return;
        }
        
        this.init();
    }
    
    init() {
        this.swiper = new Swiper(this.container, {
            slidesPerView: 1,
            spaceBetween: 30,
            // СЕЛЕКТОРЫ ДЛЯ ЗАПЛАНИРОВАННЫХ:
            navigation: {
                nextEl: '#group-planned .swiper-button-next',
                prevEl: '#group-planned .swiper-button-prev',
            },
            pagination: {
                el: '#group-planned .swiper-pagination',
                clickable: true,
            }
        });
    }
}