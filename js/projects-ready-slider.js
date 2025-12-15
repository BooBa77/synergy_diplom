// Инициализация слайдера готовых проектов
import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';

export default class ProjectsReadySlider {
    constructor() {
        this.container = document.querySelector('#group-ready .projects-slider');
        
        if (!this.container) {
            console.warn('Слайдер готовых проектов не найден');
            return;
        }
        
        this.init();
        
        // Добавить глобальную ссылку для доступа из других файлов
        window.projectsReadySlider = this;
    }
    
    init() {
        this.swiper = new Swiper(this.container, {
            slidesPerView: 1,
            spaceBetween: 30,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            }
        });
    }
}