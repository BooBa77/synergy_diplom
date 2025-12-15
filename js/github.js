// js/github.js
class GitHubActivity {
    constructor(options = {}) {
        this.username = options.username || 'BooBa77';
        this.limit = options.limit || 10;
        this.containerId = options.containerId || 'github-activity';
        this.container = document.getElementById(this.containerId);
        
        // Типы событий и их перевод
        this.eventTypes = {
            'PushEvent': '📌 Запушил(а) коммиты в',
            'IssuesEvent': '📝 Работал(а) с issue в',
            'CreateEvent': '🆕 Создал(а)',
            'DeleteEvent': '🗑️ Удалил(а)',
            'WatchEvent': '⭐ Поставил(а) звезду',
            'ForkEvent': '⑂ Сфоркнул(а)',
            'PullRequestEvent': '🔀 Создал(а) pull request в',
            'PullRequestReviewEvent': '👁️‍🗨️ Ревью pull request в',
            'IssueCommentEvent': '💬 Прокомментировал(а) issue в',
            'CommitCommentEvent': '💬 Прокомментировал(а) коммит в',
            'ReleaseEvent': '🚀 Выпустил(а) релиз',
            'PublicEvent': '🌐 Опубликовал(а) репозиторий',
            'MemberEvent': '👥 Добавил(а) участника в'
        };
        
        // Кэширование
        this.cacheKey = `github_activity_${this.username}`;
        this.cacheDuration = 5 * 60 * 1000; // 5 минут
    }
    
    // Получение данных из API GitHub
    async fetchActivity() {
        try {
            const response = await fetch(
                `https://api.github.com/users/${this.username}/events?per_page=${this.limit}`
            );
            
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }
            
            const events = await response.json();
            this.saveToCache(events);
            return events;
        } catch (error) {
            console.error('Error fetching GitHub activity:', error);
            return this.getFromCache() || [];
        }
    }
    
    // Кэширование в localStorage
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
    
    // Форматирование даты
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffMins < 60) {
            return `${diffMins} ${this.pluralize(diffMins, ['минуту', 'минуты', 'минут'])} назад`;
        } else if (diffHours < 24) {
            return `${diffHours} ${this.pluralize(diffHours, ['час', 'часа', 'часов'])} назад`;
        } else if (diffDays < 7) {
            return `${diffDays} ${this.pluralize(diffDays, ['день', 'дня', 'дней'])} назад`;
        } else {
            return date.toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        }
    }
    
    // Склонение слов
    pluralize(number, words) {
        const cases = [2, 0, 1, 1, 1, 2];
        return words[
            number % 100 > 4 && number % 100 < 20 
                ? 2 
                : cases[Math.min(number % 10, 5)]
        ];
    }
    
    // Создание HTML для события
    createEventHTML(event) {
        const eventType = this.eventTypes[event.type] || `🔧 ${event.type.replace('Event', '')} в`;
        const repoName = event.repo.name;
        const repoUrl = `https://github.com/${repoName}`;
        const timeAgo = this.formatDate(event.created_at);
        
        let details = '';
        
        // Детали для разных типов событий
        if (event.type === 'PushEvent' && event.payload && event.payload.commits) {
            const commitCount = event.payload.commits.length;
            const commitWord = this.pluralize(commitCount, ['коммит', 'коммита', 'коммитов']);
            details = ` (${commitCount} ${commitWord})`;
        } else if (event.type === 'IssuesEvent' && event.payload && event.payload.issue) {
            details = ` #${event.payload.issue.number}`;
        } else if (event.type === 'PullRequestEvent' && event.payload && event.payload.pull_request) {
            details = ` #${event.payload.pull_request.number}`;
        }
        
        return `
            <div class="github-activity__event">
                <div class="github-activity__event-icon">
                    <i class="fas fa-code-commit"></i>
                </div>
                <div class="github-activity__event-content">
                    <div class="github-activity__event-text">
                        ${eventType} 
                        <a href="${repoUrl}" target="_blank" class="github-activity__repo-link">
                            ${repoName}
                        </a>
                        ${details}
                    </div>
                    <div class="github-activity__event-time">
                        <i class="far fa-clock"></i> ${timeAgo}
                    </div>
                </div>
            </div>
        `;
    }
    
    // Отображение активности
    async displayActivity() {
        // Показываем спиннер загрузки
        this.container.innerHTML = `
            <div class="github-activity__loading">
                <i class="fas fa-spinner fa-spin"></i> Загружаю активность...
            </div>
        `;
        
        try {
            const events = await this.fetchActivity();
            
            if (!events || events.length === 0) {
                this.container.innerHTML = `
                    <div class="github-activity__empty">
                        <i class="fas fa-code"></i>
                        <p>Активность не найдена или достигнут лимит запросов</p>
                    </div>
                `;
                return;
            }
            
            // Создаем HTML для всех событий
            const eventsHTML = events
                .map(event => this.createEventHTML(event))
                .join('');
            
            this.container.innerHTML = eventsHTML;
            
        } catch (error) {
            this.container.innerHTML = `
                <div class="github-activity__error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Не удалось загрузить активность</p>
                    <small>Проверьте подключение или повторите позже</small>
                </div>
            `;
        }
    }
    
    // Инициализация
    init() {
        if (!this.container) {
            console.error(`Container #${this.containerId} not found`);
            return;
        }
        
        this.displayActivity();
        
        // Автообновление каждые 10 минут
        setInterval(() => this.displayActivity(), 10 * 60 * 1000);
        
        // Кнопка обновления (опционально)
        const refreshBtn = document.createElement('button');
        refreshBtn.className = 'github-activity__refresh';
        refreshBtn.innerHTML = '<i class="fas fa-redo"></i>';
        refreshBtn.addEventListener('click', () => this.displayActivity());
        this.container.parentNode.appendChild(refreshBtn);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const githubActivity = new GitHubActivity({
        username: 'BooBa77', // Ваш GitHub username
        limit: 8,
        containerId: 'github-activity'
    });
    githubActivity.init();
});

// Экспорт для использования в других модулях
export default GitHubActivity;