/**
 * Главный файл JavaScript
 * Инициализация всех компонентов
 */

// Импорты 
import ThemeSwitcher from './theme-switcher.js';
import MobileMenu from './mobile-menu.js';

// Инициализация при полной загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio loaded!');
    
    // Инициализируем компоненты
    const themeSwitcher = new ThemeSwitcher();
    const mobileMenu = new MobileMenu();
    
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