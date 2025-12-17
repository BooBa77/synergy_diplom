import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';

export default class ProjectsCurrentCarousel {
    constructor() {
        this.container = document.querySelector('#group-current .screenshots-slider');
        
        if (!this.container) {
            console.warn('Карусель текущих проектов не найдена');
            return;
        }
        
        // кнопки навигации РЯДОМ с контейнером
        this.nextButton = this.container.parentElement.querySelector('.swiper-button-next');
        this.prevButton = this.container.parentElement.querySelector('.swiper-button-prev');
        this.pagination = this.container.parentElement.querySelector('.swiper-pagination');
        
        this.init();
    }
    
    init() {
        this.swiper = new Swiper(this.container, {
            slidesPerView: 1,
            spaceBetween: 20,
            
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    spaceBetween: 15
                },
                640: {
                    slidesPerView: 2,
                    spaceBetween: 20
                },
                992: {
                    slidesPerView: 3,
                    spaceBetween: 25
                },
                1200: {
                    slidesPerView: 4,
                    spaceBetween: 30
                }
            },
            
            // СЕЛЕКТОРЫ:
            navigation: {
                nextEl: this.nextButton,
                prevEl: this.prevButton,
            },
            
            pagination: {
                el: this.pagination,
                clickable: true,
                dynamicBullets: true,
            },
            
            loop: false,
            grabCursor: true,
            speed: 500,
            effect: 'slide',
            autoHeight: false,
            centeredSlides: false,
            slidesOffsetBefore: 0,
            slidesOffsetAfter: 0
        });
    }
}