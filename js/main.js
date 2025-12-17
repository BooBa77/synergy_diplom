/**
 * Главный файл JavaScript
 * Инициализация всех компонентов
 */

// Импорты 
import ThemeSwitcher from './theme-switcher.js';
import MobileMenu from './mobile-menu.js';
import ProjectsSwitcher from './projects-switcher.js';
import ProjectsSlider from './projects-slider.js';
import ProjectsCurrentCarousel from './projects-current-carousel.js';
import './github.js';

// Инициализация при полной загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
 
    // Инициализируем компоненты
    const themeSwitcher = new ThemeSwitcher();
    const mobileMenu = new MobileMenu();
    const projectsSwitcher = new ProjectsSwitcher();
    const projectsCurrentCarousel = new ProjectsCurrentCarousel();

    // Инициализируем слайдеры ПРОЕКТОВ
    const readySlider = new ProjectsSlider('#group-ready .projects-slider');
    const plannedSlider = new ProjectsSlider('#group-planned .projects-slider');    

    // Плавный скролл для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Добавляем активный класс к ссылкам при скролле
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__menu a');
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
});