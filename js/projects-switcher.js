/**
 * Класс для управления переключением вкладок (радио-кнопок) 
 * в секции "Проекты".
 */
export default class ProjectsSwitcher {
    constructor() {
        this.switcherContainer = document.querySelector('.project-switcher');
        
        if (!this.switcherContainer) {
            console.warn('Container for project switcher (.project-switcher) not found.');
            return;
        }

        this.radioInputs = this.switcherContainer.querySelectorAll('input[name="project_filter"]');
        this.projectGroups = document.querySelectorAll('.project-group');

        this._setupListeners();
        this._initializeView();
    }

    /**
     * Устанавливает слушатели событий на радио-кнопки.
     * @private
     */
    _setupListeners() {
        this.radioInputs.forEach(radio => {
            radio.addEventListener('change', () => {
                if (radio.checked) {
                    this.showTab(radio.value);
                }
            });
        });
    }

    /**
     * Показывает нужную вкладку и скрывает остальные.
     * @param {string} value - Значение из атрибута value радио-кнопки ('ready', 'current', 'planned').
     * @private
     */
    showTab(value) {
        // 1. Скрываем все группы
        this.projectGroups.forEach(group => {
            group.style.display = 'none';
        });

        // 2. Показываем нужную группу
        const targetGroup = document.getElementById(`group-${value}`);
        if (targetGroup) {
            targetGroup.style.display = 'block';
            
            // 3. Обновляем Swiper если он есть
            if (value === 'ready' && window.projectsReadySlider?.swiper) {
                setTimeout(() => {
                    window.projectsReadySlider.swiper.update();
                    window.projectsReadySlider.swiper.slideTo(0);
                }, 100);
            }
        }
    }

    /**
     * Устанавливает первоначальное состояние при загрузке.
     * @private
     */
    _initializeView() {
        // Сначала скрываем все
        this.projectGroups.forEach(group => {
            group.style.display = 'none';
        });
        
        // Показываем активную по умолчанию
        const checkedRadio = this.switcherContainer.querySelector('input[name="project_filter"]:checked');
        if (checkedRadio) {
            this.showTab(checkedRadio.value);
        }
    }
}