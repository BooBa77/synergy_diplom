/**
 * Переключение светлой/темной темы
 */

export default class ThemeSwitcher {
    constructor() {
        this.themeToggle = document.querySelector('.theme-toggle');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        this.init();
    }
    
    init() {
        // Устанавливаем начальную тему
        this.setTheme(this.currentTheme);
        
        // Вешаем обработчик на кнопку
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Слушаем системные предпочтения
        this.listenToSystemPreference();
    }
    
    setTheme(theme) {
        // Устанавливаем атрибут data-theme на body
        document.body.setAttribute('data-theme', theme);
        
        // Сохраняем в localStorage
        localStorage.setItem('theme', theme);
        
        // Обновляем aria-label кнопки
        const label = theme === 'dark' ? 'Включить светлую тему' : 'Включить темную тему';
        this.themeToggle.setAttribute('aria-label', label);
        this.themeToggle.setAttribute('title', label);
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.currentTheme = newTheme;
        this.setTheme(newTheme);
        
        // Добавляем анимацию переключения
        this.themeToggle.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.themeToggle.style.transform = '';
        }, 150);
    }
    
    listenToSystemPreference() {
        // Если пользователь не выбирал тему вручную, следим за системой
        if (!localStorage.getItem('theme')) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            // Устанавливаем тему по системным настройкам
            this.setTheme(mediaQuery.matches ? 'dark' : 'light');
            
            // Слушаем изменения системных настроек
            mediaQuery.addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }
}