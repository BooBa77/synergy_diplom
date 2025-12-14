// В вашем файле js/main.js или в конце body

document.addEventListener('DOMContentLoaded', () => {
    const projectSwitcher = document.querySelector('.project-switcher');
    
    // Проверяем, есть ли переключатель проектов на странице
    if (projectSwitcher) {
        const radioInputs = projectSwitcher.querySelectorAll('input[name="project_filter"]');
        const projectGroups = document.querySelectorAll('.project-group');

        const showTab = (value) => {
            // Скрываем все группы
            projectGroups.forEach(group => {
                group.style.display = 'none';
            });

            // Показываем нужную группу (например, group-ready)
            const targetGroup = document.getElementById(`group-${value}`);
            if (targetGroup) {
                targetGroup.style.display = 'block';
            }
        };

        // 1. Слушаем изменения в радио-кнопках
        radioInputs.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.checked) {
                    showTab(this.value);
                }
            });
        });

        // 2. Инициализация: Показываем группу, которая выбрана по умолчанию (checked)
        const checkedRadio = projectSwitcher.querySelector('input[name="project_filter"]:checked');
        if (checkedRadio) {
            showTab(checkedRadio.value);
        }
    }

    // ... (ваш существующий код для навигации, если вы его оставили)
});