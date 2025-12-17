// Универсальный слайдер проектов
import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';

export default class ProjectsSlider {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        
        if (!this.container) {
            console.warn(`Слайдер не найден: ${containerSelector}`);
            return;
        }
        
        // Находим элементы ВНУТРИ контейнера
        this.prevBtn = this.container.querySelector('.swiper-button-prev');
        this.nextBtn = this.container.querySelector('.swiper-button-next');
        this.pagination = this.container.querySelector('.swiper-pagination');
        
        this.init();
    }
    
    init() {
        this.swiper = new Swiper(this.container, {
            slidesPerView: 1,
            spaceBetween: 30,
            navigation: {
                nextEl: this.nextBtn,
                prevEl: this.prevBtn,
            },
            pagination: {
                el: this.pagination,
                clickable: true,
            },
        });
    }
}