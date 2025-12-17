// Конфигурация EmailJS - ТВОИ ДАННЫЕ
const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'hWT9iMHE94pqZqdXq',
    SERVICE_ID: 'service_c5ybiea',
    TEMPLATE_ID: 'template_c9fovyc'
};

// Элементы формы
const contactForm = document.getElementById('contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const submitBtn = document.getElementById('submit-btn');
const formLoader = document.getElementById('form-loader');
const btnText = submitBtn.querySelector('.btn-text');
const formMessage = document.getElementById('form-message');

// Валидация
const validators = {
    name: {
        validate: (value) => value.trim().length >= 2,
        message: 'Имя должно содержать минимум 2 символа'
    },
    email: {
        validate: (value) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(value);
        },
        message: 'Введите корректный email адрес'
    },
    message: {
        validate: (value) => value.trim().length >= 10,
        message: 'Сообщение должно содержать минимум 10 символов'
    }
};

// Показать ошибку
function showError(inputId, message) {
    const input = document.getElementById(inputId);
    const errorElement = document.getElementById(`${inputId}-error`);
    
    input.classList.add('error');
    errorElement.textContent = message;
}

// Скрыть ошибку
function hideError(inputId) {
    const input = document.getElementById(inputId);
    const errorElement = document.getElementById(`${inputId}-error`);
    
    input.classList.remove('error');
    errorElement.textContent = '';
}

// Валидация одного поля
function validateField(fieldName, value) {
    const validator = validators[fieldName];
    
    if (!value.trim()) {
        showError(fieldName, 'Это поле обязательно для заполнения');
        return false;
    }
    
    if (!validator.validate(value)) {
        showError(fieldName, validator.message);
        return false;
    }
    
    hideError(fieldName);
    return true;
}

// Валидация всей формы
function validateForm(formData) {
    let isValid = true;
    
    Object.keys(validators).forEach(field => {
        const value = formData.get(field) || '';
        if (!validateField(field, value)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Показать сообщение
function showMessage(type, text) {
    formMessage.textContent = text;
    formMessage.className = `form-message ${type}`;
    formMessage.classList.remove('hidden');
    
    // Автоматически скрыть через 5 секунд
    setTimeout(() => {
        formMessage.classList.add('hidden');
    }, 5000);
}

// Показать загрузку
function showLoading() {
    btnText.classList.add('hidden');
    formLoader.classList.remove('hidden');
    submitBtn.disabled = true;
}

// Скрыть загрузку
function hideLoading() {
    btnText.classList.remove('hidden');
    formLoader.classList.add('hidden');
    submitBtn.disabled = false;
}

// Сбросить форму
function resetForm() {
    contactForm.reset();
    Object.keys(validators).forEach(field => hideError(field));
}

// Инициализация EmailJS
function initEmailJS() {
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS не загружен');
        return false;
    }
    
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    console.log('EmailJS инициализирован');
    return true;
}

// Отправка формы
async function handleSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    
    // Валидация
    if (!validateForm(formData)) {
        return;
    }
    
    // Подготовка данных для EmailJS
    const templateParams = {
        from_name: formData.get('name'),
        from_email: formData.get('email'),
        message: formData.get('message'),
        to_email: 's.tregubov1977@gmail.com', // Твой email для получения
        reply_to: formData.get('email'),
        date: new Date().toLocaleDateString('ru-RU'),
        time: new Date().toLocaleTimeString('ru-RU', { 
            hour: '2-digit', 
            minute: '2-digit' 
        })
    };
    
    console.log('Отправка данных:', templateParams);
    
    try {
        // Показать состояние загрузки
        showLoading();
        
        // Отправка через EmailJS
        const response = await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.TEMPLATE_ID,
            templateParams
        );
        
        console.log('Успешно отправлено:', response);
        
        // Успешная отправка
        showMessage('success', 'Сообщение успешно отправлено! Я отвечу вам в ближайшее время.');
        resetForm();
        
    } catch (error) {
        // Ошибка отправки
        console.error('Ошибка отправки:', error);
        
        // Более понятные сообщения об ошибках
        let errorText = 'Произошла ошибка при отправке. ';
        
        if (error.text && error.text.includes('limit')) {
            errorText += 'Превышен лимит отправки писем.';
        } else if (error.status === 0) {
            errorText += 'Проверьте подключение к интернету.';
        } else {
            errorText += 'Пожалуйста, попробуйте позже или свяжитесь другим способом.';
        }
        
        showMessage('error', errorText);
        
    } finally {
        // Скрыть загрузку
        hideLoading();
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Проверка загрузки EmailJS
    if (!initEmailJS()) {
        showMessage('error', 'Ошибка загрузки сервиса отправки писем');
        console.warn('EmailJS не инициализирован. Проверьте подключение скрипта.');
    }
    
    // Валидация в реальном времени
    nameInput.addEventListener('input', () => {
        validateField('name', nameInput.value);
    });
    
    emailInput.addEventListener('input', () => {
        validateField('email', emailInput.value);
    });
    
    messageInput.addEventListener('input', () => {
        validateField('message', messageInput.value);
    });
    
    // Обработка отправки формы
    contactForm.addEventListener('submit', handleSubmit);
    
    console.log('Форма обратной связи инициализирована');
});