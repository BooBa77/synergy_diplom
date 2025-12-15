// js/github.js
class GitHubContributions {
    constructor(options = {}) {
        this.username = options.username || 'BooBa77';
        this.containerId = options.containerId || 'github-calendar';
        this.statsId = options.statsId || 'github-stats';
        this.container = document.getElementById(this.containerId);
        this.statsContainer = document.getElementById(this.statsId);
        
        // Цвета для уровней активности (как на GitHub)
        this.colors = {
            level0: 'var(--github-level-0, #ebedf0)',
            level1: 'var(--github-level-1, #9be9a8)',
            level2: 'var(--github-level-2, #40c463)',
            level3: 'var(--github-level-3, #30a14e)',
            level4: 'var(--github-level-4, #216e39)'
        };
        
        // Месяцы на русском
        this.months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
        this.weekdays = ['Пн', '', 'Ср', '', 'Пт', '', 'Вс'];
        
        // Кэширование
        this.cacheKey = `github_contributions_${this.username}`;
        this.cacheDuration = 60 * 60 * 1000; // 1 час
    }
    
    // Получение данных контрибуций
    async fetchContributions() {
        try {
            // Способ 1: Парсинг HTML страницы GitHub (работает без токена)
            const response = await fetch(`https://github.com/${this.username}`);
            const html = await response.text();
            
            // Извлекаем данные контрибуций из HTML
            const contributions = this.parseContributionsFromHTML(html);
            
            if (contributions) {
                this.saveToCache(contributions);
                return contributions;
            }
            
            // Способ 2: GitHub GraphQL API (нужен токен)
            return await this.fetchFromGraphQL();
            
        } catch (error) {
            console.error('Error fetching contributions:', error);
            return this.getFromCache();
        }
    }
    
    // Парсинг данных из HTML страницы GitHub
    parseContributionsFromHTML(html) {
        // Ищем скрипт с данными контрибуций
        const regex = /data-graph-data="({[^"]*})"/;
        const match = html.match(regex);
        
        if (match && match[1]) {
            try {
                const data = JSON.parse(match[1].replace(/&quot;/g, '"'));
                return this.processContributionsData(data);
            } catch (e) {
                console.error('Failed to parse contributions data:', e);
            }
        }
        
        // Альтернативный метод: парсинг таблицы
        const altRegex = /<svg[^>]*class="js-calendar-graph-svg"[^>]*>([\s\S]*?)<\/svg>/;
        const altMatch = html.match(altRegex);
        
        if (altMatch) {
            return this.parseFromSVG(altMatch[0]);
        }
        
        return null;
    }
    
    // GitHub GraphQL API (нужен токен)
    async fetchFromGraphQL() {
        const token = localStorage.getItem('github_token');
        if (!token) return null;
        
        const query = `
            query($username: String!) {
                user(login: $username) {
                    contributionsCollection {
                        contributionCalendar {
                            totalContributions
                            weeks {
                                contributionDays {
                                    contributionCount
                                    date
                                    weekday
                                }
                            }
                        }
                    }
                }
            }
        `;
        
        try {
            const response = await fetch('https://api.github.com/graphql', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query,
                    variables: { username: this.username }
                })
            });
            
            const result = await response.json();
            return result.data?.user?.contributionsCollection?.contributionCalendar;
        } catch (error) {
            console.error('GraphQL error:', error);
            return null;
        }
    }
    
    // Обработка данных контрибуций
    processContributionsData(data) {
        if (!data || !data.contributions) return null;
        
        const contributions = [];
        let total = 0;
        let currentYearTotal = 0;
        const currentYear = new Date().getFullYear();
        
        // Обрабатываем каждый день
        data.contributions.forEach(day => {
            const date = new Date(day.date);
            contributions.push({
                date: day.date,
                count: day.count,
                weekday: date.getDay(),
                month: date.getMonth(),
                year: date.getFullYear(),
                level: this.getActivityLevel(day.count)
            });
            
            total += day.count;
            if (date.getFullYear() === currentYear) {
                currentYearTotal += day.count;
            }
        });
        
        return {
            total,
            currentYearTotal,
            contributions,
            lastUpdated: new Date().toISOString()
        };
    }
    
    // Определение уровня активности
    getActivityLevel(count) {
        if (count === 0) return 0;
        if (count <= 2) return 1;
        if (count <= 5) return 2;
        if (count <= 10) return 3;
        return 4;
    }
    
    // Создание календаря
    createCalendar(data) {
        if (!data || !data.contributions) {
            return '<div class="github-calendar__error">Не удалось загрузить данные</div>';
        }
        
        // Группируем по неделям
        const weeks = [];
        let currentWeek = [];
        let currentWeekday = 0;
        
        data.contributions.forEach(day => {
            const date = new Date(day.date);
            const weekday = date.getDay();
            
            // Начинаем новую неделю
            if (weekday === 0 && currentWeek.length > 0) {
                weeks.push([...currentWeek]);
                currentWeek = [];
            }
            
            // Заполняем пустые дни в начале недели
            while (currentWeekday < weekday) {
                currentWeek.push(null);
                currentWeekday++;
            }
            
            currentWeek.push(day);
            currentWeekday = weekday + 1;
        });
        
        // Добавляем последнюю неделю
        if (currentWeek.length > 0) {
            weeks.push(currentWeek);
        }
        
        // Создаем HTML для календаря
        let calendarHTML = '<div class="calendar-grid">';
        
        // Добавляем подписи месяцев
        calendarHTML += '<div class="month-labels">';
        let lastMonth = -1;
        
        weeks.forEach((week, weekIndex) => {
            if (week.length > 0) {
                const firstDay = week.find(day => day !== null);
                if (firstDay) {
                    const date = new Date(firstDay.date);
                    const month = date.getMonth();
                    
                    if (month !== lastMonth && weekIndex > 2) {
                        calendarHTML += `<div class="month-label" style="grid-column: ${weekIndex + 2}">${this.months[month]}</div>`;
                        lastMonth = month;
                    }
                }
            }
        });
        calendarHTML += '</div>';
        
        // Добавляем подписи дней недели
        calendarHTML += '<div class="weekday-labels">';
        this.weekdays.forEach((day, index) => {
            if (day) {
                calendarHTML += `<div class="weekday-label">${day}</div>`;
            }
        });
        calendarHTML += '</div>';
        
        // Создаем сетку дней
        calendarHTML += '<div class="days-grid">';
        
        // Для каждого дня недели
        for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
            // Для каждой недели
            weeks.forEach((week, weekIndex) => {
                const day = week[dayOfWeek];
                
                if (day) {
                    const tooltip = `${day.count} контрибуций<br>${new Date(day.date).toLocaleDateString('ru-RU', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}`;
                    
                    calendarHTML += `
                        <div class="day-cell" 
                             data-level="${day.level}"
                             data-count="${day.count}"
                             title="${tooltip.replace('<br>', ' ')}">
                            <div class="day-tooltip">${tooltip}</div>
                        </div>
                    `;
                } else {
                    calendarHTML += '<div class="day-cell empty"></div>';
                }
            });
        }
        
        calendarHTML += '</div></div>';
        return calendarHTML;
    }
    
    // Обновление статистики
    updateStats(data) {
        if (!data || !this.statsContainer) return;
        
        this.statsContainer.innerHTML = `
            <div class="stat-item">
                <span class="stat-value">${data.total.toLocaleString('ru-RU')}</span>
                <span class="stat-label">всего контрибуций</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">${data.currentYearTotal.toLocaleString('ru-RU')}</span>
                <span class="stat-label">в ${new Date().getFullYear()} году</span>
            </div>
        `;
    }
    
    // Кэширование
    saveToCache(data) {
        const cache = {
            timestamp: Date.now(),
            data: data
        };
        localStorage.setItem(this.cacheKey, JSON.stringify(cache));
    }
    
    getFromCache() {
        const cached = localStorage.getItem(this.cacheKey);
        if (!cached) return null;
        
        const cache = JSON.parse(cached);
        if (Date.now() - cache.timestamp > this.cacheDuration) {
            localStorage.removeItem(this.cacheKey);
            return null;
        }
        
        return cache.data;
    }
    
    // Отображение календаря
    async displayCalendar() {
        if (!this.container) return;
        
        this.container.innerHTML = `
            <div class="github-calendar__loading">
                <i class="fas fa-spinner fa-spin"></i> Загружаю календарь контрибуций...
            </div>
        `;
        
        try {
            const data = await this.fetchContributions();
            
            if (!data) {
                this.container.innerHTML = `
                    <div class="github-calendar__error">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Не удалось загрузить календарь</p>
                        <small>Попробуйте обновить страницу или зайти позже</small>
                    </div>
                `;
                return;
            }
            
            const calendarHTML = this.createCalendar(data);
            this.container.innerHTML = calendarHTML;
            this.updateStats(data);
            
            // Добавляем обработчики для tooltip
            this.initTooltips();
            
        } catch (error) {
            this.container.innerHTML = `
                <div class="github-calendar__error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Ошибка загрузки</p>
                    <small>${error.message}</small>
                </div>
            `;
        }
    }
    
    // Инициализация tooltip
    initTooltips() {
        const dayCells = this.container.querySelectorAll('.day-cell:not(.empty)');
        
        dayCells.forEach(cell => {
            cell.addEventListener('mouseenter', (e) => {
                const tooltip = cell.querySelector('.day-tooltip');
                if (tooltip) {
                    tooltip.style.display = 'block';
                }
            });
            
            cell.addEventListener('mouseleave', () => {
                const tooltip = cell.querySelector('.day-tooltip');
                if (tooltip) {
                    tooltip.style.display = 'none';
                }
            });
        });
    }
    
    // Инициализация
    init() {
        if (!this.container) {
            console.error(`Container #${this.containerId} not found`);
            return;
        }
        
        this.displayCalendar();
        
        // Кнопка обновления
        const refreshBtn = document.getElementById('refresh-calendar');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.displayCalendar());
        }
        
        // Автообновление раз в час
        setInterval(() => this.displayCalendar(), 60 * 60 * 1000);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const githubCalendar = new GitHubContributions({
        username: 'BooBa77',
        containerId: 'github-calendar',
        statsId: 'github-stats'
    });
    githubCalendar.init();
});

export default GitHubContributions;