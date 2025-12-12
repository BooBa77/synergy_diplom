/**
 * Мобильное меню
 */

export default class MobileMenu {
    constructor() {
        this.navToggle = document.querySelector('.nav__toggle');
        this.navMenu = document.querySelector('.nav__menu');
        
        this.init();
    }
    
    init() {
        this.navToggle.addEventListener('click', () => this.toggleMenu());
        
        // Закрываем меню при клике на ссылку
        document.querySelectorAll('.nav__menu a').forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
        
        // Закрываем меню при клике вне его
        document.addEventListener('click', (e) => {
            if (!this.navToggle.contains(e.target) && !this.navMenu.contains(e.target)) {
                this.closeMenu();
            }
        });
    }
    
    toggleMenu() {
        this.navMenu.classList.toggle('active');
        this.navToggle.setAttribute(
            'aria-expanded', 
            this.navMenu.classList.contains('active')
        );
        
        // Анимация иконки бургер/крестик
        const icon = this.navToggle.querySelector('i');
        if (this.navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }
    
    closeMenu() {
        this.navMenu.classList.remove('active');
        this.navToggle.setAttribute('aria-expanded', 'false');
        
        const icon = this.navToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
}