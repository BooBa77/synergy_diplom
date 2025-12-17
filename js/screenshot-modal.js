/**
 * Модальное окно для просмотра скриншотов
 */

class ScreenshotModal {
    constructor() {
        this.modal = document.getElementById('screenshot-modal');
        this.modalImage = document.getElementById('modal-image');
        this.modalCaption = document.getElementById('modal-caption');
        this.modalCurrent = document.getElementById('modal-current');
        this.modalTotal = document.getElementById('modal-total');
        this.closeBtn = this.modal.querySelector('.modal__close');
        this.prevBtn = this.modal.querySelector('.modal__prev');
        this.nextBtn = this.modal.querySelector('.modal__next');
        
        this.images = [];
        this.currentIndex = 0;
        
        this.init();
    }
    
    init() {
        // Собираем все изображения из слайдера "Текущие проекты"
        this.collectImages();
        
        // Добавляем обработчики кликов на изображения
        this.addImageClickHandlers();
        
        // Добавляем обработчики для модального окна
        this.addModalHandlers();
        
        // Добавляем обработчики клавиатуры
        this.addKeyboardHandlers();
    }
    
    collectImages() {
        // Находим контейнер с текущим проектом
        const currentProject = document.querySelector('#group-current');
        if (!currentProject) return;
        
        // Находим все изображения в слайдере скриншотов
        const screenshotItems = currentProject.querySelectorAll('.screenshot-item img');
        
        this.images = Array.from(screenshotItems).map(img => ({
            src: img.src,
            alt: img.alt,
            caption: img.closest('.screenshot-item').querySelector('.screenshot-caption')?.textContent || ''
        }));
        
        // Обновляем счетчик
        this.modalTotal.textContent = this.images.length;
    }
    
    addImageClickHandlers() {
        const screenshotItems = document.querySelectorAll('.screenshot-item img');
        
        screenshotItems.forEach((img, index) => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                this.open(index);
            });
        });
    }
    
    addModalHandlers() {
        // Закрытие по клику на overlay
        this.modal.querySelector('.modal__overlay').addEventListener('click', () => {
            this.close();
        });
        
        // Закрытие по кнопке
        this.closeBtn.addEventListener('click', () => {
            this.close();
        });
        
        // Навигация
        this.prevBtn.addEventListener('click', () => {
            this.prev();
        });
        
        this.nextBtn.addEventListener('click', () => {
            this.next();
        });
        
        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });
    }
    
    addKeyboardHandlers() {
        document.addEventListener('keydown', (e) => {
            if (!this.modal.classList.contains('active')) return;
            
            if (e.key === 'ArrowLeft') {
                this.prev();
            } else if (e.key === 'ArrowRight') {
                this.next();
            }
        });
    }
    
    open(index = 0) {
        if (this.images.length === 0) return;
        
        this.currentIndex = index;
        this.updateModal();
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Блокируем скролл страницы
    }
    
    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = ''; // Восстанавливаем скролл
    }
    
    prev() {
        if (this.images.length === 0) return;
        
        this.currentIndex = this.currentIndex > 0 
            ? this.currentIndex - 1 
            : this.images.length - 1;
        
        this.updateModal();
    }
    
    next() {
        if (this.images.length === 0) return;
        
        this.currentIndex = this.currentIndex < this.images.length - 1 
            ? this.currentIndex + 1 
            : 0;
        
        this.updateModal();
    }
    
    updateModal() {
        if (this.images.length === 0) return;
        
        const currentImage = this.images[this.currentIndex];
        
        // Показываем загрузку
        this.modalImage.style.opacity = '0.5';
        
        // Загружаем изображение
        const img = new Image();
        img.src = currentImage.src;
        img.onload = () => {
            this.modalImage.src = currentImage.src;
            this.modalImage.alt = currentImage.alt;
            this.modalImage.style.opacity = '1';
        };
        
        // Обновляем подпись и счетчик
        this.modalCaption.textContent = currentImage.caption;
        this.modalCurrent.textContent = this.currentIndex + 1;
        
        // Показываем/скрываем кнопки навигации если нужно
        this.prevBtn.style.display = this.images.length > 1 ? 'flex' : 'none';
        this.nextBtn.style.display = this.images.length > 1 ? 'flex' : 'none';
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new ScreenshotModal();
});