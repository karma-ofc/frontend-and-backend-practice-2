// Основные ф-ции
document.addEventListener('DOMContentLoaded', function() {
    initProgressBars();
    initForms();
    
    if (document.querySelector('.project-card')) {
        initProjectModals();
        initProjectFilters();
    }
    
    if (document.getElementById('diaryEntries')) {
        initDiary();
    }
    
    // Добавление плавной прокрутки для всех ссылок с якорями
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Проверка prefers-reduced-motion
                const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: reducedMotion ? 'auto' : 'smooth'
                });
            }
        });
    });
    
    // Инициализация статистики дневника
    updateDiaryStats();
    
    // Обработчик для skip-link
    initSkipLink();
    
    // Применение контейнерных запросов
    initContainerQueriesFallback();
});

// Инициализация skip-link
function initSkipLink() {
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus();
                setTimeout(() => targetElement.removeAttribute('tabindex'), 1000);
            }
        });
    }
}

// Fallback для контейнерных запросов
function initContainerQueriesFallback() {
    
    if (!('container' in document.documentElement.style)) {
        console.log('Container Queries не поддерживаются, применяем fallback');
        applyContainerQueriesFallback();
    }
}

function applyContainerQueriesFallback() {
    // Мобильные стили для маленьких контейнеров
    const projectsArea = document.querySelector('.projects-area');
    const diaryContainer = document.querySelector('.diary-container');
    const contactsContainer = document.querySelector('.contacts-container');
    
    const checkSizes = () => {
        if (projectsArea && projectsArea.offsetWidth < 400) {
            projectsArea.classList.add('mobile-layout');
        } else {
            projectsArea.classList.remove('mobile-layout');
        }
        
        if (diaryContainer && diaryContainer.offsetWidth < 500) {
            diaryContainer.classList.add('mobile-layout');
        } else {
            diaryContainer.classList.remove('mobile-layout');
        }
        
        if (contactsContainer && contactsContainer.offsetWidth < 600) {
            contactsContainer.classList.add('mobile-layout');
        } else {
            contactsContainer.classList.remove('mobile-layout');
        }
    };
    
    checkSizes();
    window.addEventListener('resize', checkSizes);
}

// Ф-ция для анимации прогресс-баров
function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    // Проверка prefers-reduced-motion
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Наблюдатель для анимации при прокрутке
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.style.width;
                progressBar.style.width = '0';
                
                setTimeout(() => {
                    if (!reducedMotion) {
                        progressBar.style.transition = 'width 1.5s ease-in-out';
                        progressBar.style.width = width;
                    } else {
                        progressBar.style.width = width;
                    }
                }, 300);
                
                observer.unobserve(progressBar);
            }
        });
    }, { threshold: 0.5 });
    
    progressBars.forEach(bar => observer.observe(bar));
}

// Ф-ция инициализации обработчиков форм
function initForms() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            let isValid = true;
            
            // имя
            if (name === '') {
                showError('name', 'Пожалуйста, введите ваше имя');
                isValid = false;
            } else if (name.length < 2) {
                showError('name', 'Имя должно содержать минимум 2 символа');
                isValid = false;
            } else {
                clearError('name');
            }
            
            // email
            if (email === '') {
                showError('email', 'Пожалуйста, введите ваш email');
                isValid = false;
            } else if (!isValidEmail(email)) {
                showError('email', 'Пожалуйста, введите корректный email');
                isValid = false;
            } else {
                clearError('email');
            }
            
            // сообщение
            if (message === '') {
                showError('message', 'Пожалуйста, введите ваше сообщение');
                isValid = false;
            } else if (message.length < 10) {
                showError('message', 'Сообщение должно содержать минимум 10 символов');
                isValid = false;
            } else {
                clearError('message');
            }
            
            if (isValid) {
                // Вывод в консоль
                console.log('=== ФОРМА КОНТАКТОВ ===');
                console.log('Имя:', name);
                console.log('Email:', email);
                console.log('Сообщение:', message);
                console.log('Время отправки:', new Date().toLocaleString());
                console.log('=====================');
                
                // Уведомление
                showNotification('Сообщение успешно отправлено!','success');
                
                contactForm.reset();
            }
        });
        
        // Реальная валидация при вводе
        document.getElementById('name').addEventListener('blur', function() {
            const name = this.value.trim();
            if (name !== '' && name.length < 2) {
                showError('name', 'Имя должно содержать минимум 2 символа');
            } else if (name !== '') {
                clearError('name');
            }
        });
        
        document.getElementById('email').addEventListener('blur', function() {
            const email = this.value.trim();
            if (email !== '' && !isValidEmail(email)) {
                showError('email', 'Пожалуйста, введите корректный email');
            } else if (email !== '') {
                clearError('email');
            }
        });
        
        document.getElementById('message').addEventListener('blur', function() {
            const message = this.value.trim();
            if (message !== '' && message.length < 10) {
                showError('message', 'Сообщение должно содержать минимум 10 символов');
            } else if (message !== '') {
                clearError('message');
            }
        });
    }
    
    // Обработка формы добавления записи в дневник
    const diaryForm = document.getElementById('diaryForm');
    if (diaryForm) {
        diaryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('entryTitle').value.trim();
            const date = document.getElementById('entryDate').value;
            const status = document.getElementById('entryStatus').value;
            
            if (title === '') {
                showError('entryTitle', 'Пожалуйста, введите название задачи');
                return;
            } else if (title.length < 3) {
                showError('entryTitle', 'Название задачи должно содержать минимум 3 символа');
                return;
            } else {
                clearError('entryTitle');
            }
            
            addDiaryEntry(title, date, status);
            diaryForm.reset();
            showNotification('Запись успешно добавлена в дневник!', 'success');
        });
        
        // Реальная валидация для формы дневника
        document.getElementById('entryTitle').addEventListener('blur', function() {
            const title = this.value.trim();
            if (title !== '' && title.length < 3) {
                showError('entryTitle', 'Название задачи должно содержать минимум 3 символа');
            } else if (title !== '') {
                clearError('entryTitle');
            }
        });
    }
}

// Ф-ция пр-ки валидности email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Ф-ция для отображения ошибки
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    let errorElement = document.getElementById(`${fieldId}Error`);
    
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = `${fieldId}Error`;
        errorElement.className = 'invalid-feedback';
        field.parentNode.appendChild(errorElement);
    }
    
    field.classList.add('is-invalid');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    // Фокусировка на поле с ошибкой для скринридеров
    field.setAttribute('aria-invalid', 'true');
    field.focus();
}

// ф-ция очистки ошибки
function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}Error`);
    
    field.classList.remove('is-invalid');
    field.setAttribute('aria-invalid', 'false');
    
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

// Ф-ция показа уведомлений
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 100px; right: 20px; z-index: 1050; min-width: 300px;';
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Закрыть"></button>
    `;
    
    document.body.appendChild(notification);
    
    // скрытие уведомления через 5 секунд
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// ф-ция для скачивания резюме
function downloadResume() {
    const link = document.createElement('a');
    link.href = 'assets/resume.pdf';
    link.download = 'Резюме_Сергей_Барков.pdf';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Резюме успешно скачано!', 'success');
}

// Ф-ции для работы с проектами
function initProjectModals() {
    // Данные проектов
    const projectsData = {
        'project1': {
            title: 'Личный сайт',
            description: 'Адаптивный веб-сайт с использованием HTML и CSS. Проект включает в себя главную страницу, портфолио и контактную форму.',
            technologies: ['HTML5', 'CSS3', 'JavaScript'],
            liveLink: '#',
            codeLink: '#',
            images: []
        },
        'project2': {
            title: 'Todo-приложение',
            description: 'Интерактивное приложение для управления задачами с возможностью добавления, редактирования и удаления задач.',
            technologies: ['JavaScript', 'LocalStorage', 'Bootstrap'],
            liveLink: '#',
            codeLink: '#',
            images: []
        },
        'project3': {
            title: 'Портфолио на Bootstrap',
            description: 'Современное адаптивное портфолио с использованием Bootstrap 5. Включает анимации и интерактивные элементы.',
            technologies: ['Bootstrap 5', 'JavaScript', 'CSS3'],
            liveLink: '#',
            codeLink: '#',
            images: []
        },
        'project4': {
            title: 'Интернет-магазин',
            description: 'Прототип интернет-магазина с корзиной покупок и системой фильтрации товаров.',
            technologies: ['React', 'Node.js', 'MongoDB'],
            liveLink: '#',
            codeLink: '#',
            images: []
        }
    };

    // Обработчики для модальных окон проектов
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project');
            const project = projectsData[projectId];
            
            if (project) {
                showProjectModal(project);
            }
        });
        
        // Обработчик клавиатуры для доступности
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const projectId = this.getAttribute('data-project');
                const project = projectsData[projectId];
                
                if (project) {
                    showProjectModal(project);
                }
            }
        });
    });
}

function showProjectModal(project) {
    // Создание модального окна
    let modal = document.getElementById('projectModal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'projectModal';
        modal.className = 'modal fade';
        modal.setAttribute('tabindex', '-1');
        modal.setAttribute('aria-labelledby', 'projectModalTitle');
        modal.setAttribute('aria-hidden', 'true');
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 class="modal-title h5" id="projectModalTitle">${project.title}</h2>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
                    </div>
                    <div class="modal-body">
                        <p id="projectModalDescription">${project.description}</p>
                        <h3 class="h6">Технологии:</h3>
                        <div id="projectModalTechnologies"></div>
                        <div class="mt-3">
                            <a href="${project.liveLink}" class="btn btn-primary me-2 button" target="_blank" rel="noopener">Живая версия</a>
                            <a href="${project.codeLink}" class="btn btn-outline-secondary button" target="_blank" rel="noopener">Исходный код</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    } else {
        // Обновление содержимого модального окна
        document.getElementById('projectModalTitle').textContent = project.title;
        document.getElementById('projectModalDescription').textContent = project.description;
        
        const technologiesContainer = document.getElementById('projectModalTechnologies');
        technologiesContainer.innerHTML = project.technologies.map(tech => 
            `<span class="badge bg-secondary me-1 mb-1">${tech}</span>`
        ).join('');
        
        const liveLink = modal.querySelector('.btn-primary');
        const codeLink = modal.querySelector('.btn-outline-secondary');
        liveLink.href = project.liveLink;
        codeLink.href = project.codeLink;
    }
    
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
}

function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.project-filter');
    
    setTimeout(() => {
        filterProjects('all');
    }, 100);
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Обновление активной кнопки
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            filterProjects(filter);
        });
        
        // Обработчики клавиатуры
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                filterProjects(filter);
            }
        });
    });
}

function filterProjects(filter) {
    const projects = document.querySelectorAll('.project-card');
    
    projects.forEach(project => {
        const category = project.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
            project.style.display = 'flex';
            project.setAttribute('aria-hidden', 'false');
        } else {
            project.style.display = 'none';
            project.setAttribute('aria-hidden', 'true');
        }
    });
}

// Ф-ции работы с дневником
function initDiary() {
    // Загрузка записей дневника из localStorage
    loadDiaryEntries();
    updateCourseProgress();
    updateDiaryStats();
}

function loadDiaryEntries() {
    let diaryEntries = JSON.parse(localStorage.getItem('diaryEntries')) || [
        { 
            id: generateId(),
            title: 'Верстка макета сайта', 
            date: '2024-12-15', 
            status: 'completed' 
        },
        { 
            id: generateId(),
            title: 'JavaScript основы', 
            date: '2024-12-10', 
            status: 'completed' 
        },
        { 
            id: generateId(),
            title: 'Работа с формами', 
            date: '2024-12-05', 
            status: 'in-progress' 
        },
        { 
            id: generateId(),
            title: 'Адаптивный дизайн', 
            date: '2024-12-01', 
            status: 'in-progress' 
        }
    ];
    
    // Сохранение обратно в localStorage
    localStorage.setItem('diaryEntries', JSON.stringify(diaryEntries));
    
    const entriesContainer = document.getElementById('diaryEntries');
    if (entriesContainer) {
        renderDiaryEntries(entriesContainer, diaryEntries);
    }
}

function renderDiaryEntries(container, entries) {
    container.innerHTML = '';
    
    if (entries.length === 0) {
        container.innerHTML = '<p class="text-muted text-center">Записей пока нет. Добавьте первую запись!</p>';
        return;
    }
    
    // Сортировка по дате (новые сверху)
    entries.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    entries.forEach((entry, index) => {
        const entryElement = document.createElement('article');
        entryElement.className = `diary-entry ${entry.status}`;
        entryElement.setAttribute('data-entry-id', entry.id);
        
        const statusIcon = entry.status === 'completed' ? '✓' : '⟳';
        const statusText = entry.status === 'completed' ? 'Завершено' : 'В процессе';
        const formattedDate = formatDate(entry.date);
        
        entryElement.innerHTML = `
            <div class="d-flex justify-content-between align-items-start">
                <div class="flex-grow-1">
                    <h3 class="h5 mb-2">${entry.title}</h3>
                    <p class="mb-1"><small class="text-muted">Дата: ${formattedDate}</small></p>
                    <span class="badge ${entry.status === 'completed' ? 'bg-success' : 'bg-warning'}">
                        ${statusIcon} ${statusText}
                    </span>
                </div>
                <button type="button" class="btn btn-outline-danger btn-sm ms-3 delete-entry" 
                        data-entry-id="${entry.id}"
                        aria-label="Удалить запись ${entry.title}">
                    Удалить
                </button>
            </div>
        `;
        
        container.appendChild(entryElement);
    });
    
    addDeleteHandlers();
    updateDiaryStats();
}

function addDeleteHandlers() {
    const deleteButtons = document.querySelectorAll('.delete-entry');
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const entryId = this.getAttribute('data-entry-id');
            const entryTitle = this.closest('.diary-entry').querySelector('h3').textContent;
            deleteDiaryEntry(entryId, entryTitle);
        });
        
        // Обработчик клавиатуры
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const entryId = this.getAttribute('data-entry-id');
                const entryTitle = this.closest('.diary-entry').querySelector('h3').textContent;
                deleteDiaryEntry(entryId, entryTitle);
            }
        });
    });
}

function deleteDiaryEntry(entryId, entryTitle) {
    if (!confirm(`Вы уверены, что хотите удалить запись "${entryTitle}"?`)) {
        return;
    }
    
    const diaryEntries = JSON.parse(localStorage.getItem('diaryEntries')) || [];
    const updatedEntries = diaryEntries.filter(entry => entry.id !== entryId);
    
    localStorage.setItem('diaryEntries', JSON.stringify(updatedEntries));
    
    // Обновление отображения
    const entriesContainer = document.getElementById('diaryEntries');
    renderDiaryEntries(entriesContainer, updatedEntries);
    
    updateCourseProgress();
    updateDiaryStats();
    
    showNotification(`Запись "${entryTitle}" успешно удалена!`, 'success');
}

function addDiaryEntry(title, date, status) {
    const diaryEntries = JSON.parse(localStorage.getItem('diaryEntries')) || [];
    
    // Если дата не указана, используется текущая дата
    const entryDate = date || new Date().toISOString().split('T')[0];
    
    const newEntry = {
        id: generateId(),
        title: title,
        date: entryDate,
        status: status
    };
    
    diaryEntries.unshift(newEntry);
    localStorage.setItem('diaryEntries', JSON.stringify(diaryEntries));
    
    const entriesContainer = document.getElementById('diaryEntries');
    renderDiaryEntries(entriesContainer, diaryEntries);
    
    updateCourseProgress();
    updateDiaryStats();
}

function updateCourseProgress() {
    const coursesContainer = document.getElementById('coursesProgress');
    if (!coursesContainer) return;
    
    const diaryEntries = JSON.parse(localStorage.getItem('diaryEntries')) || [];
    const totalEntries = diaryEntries.length;
    const completedEntries = diaryEntries.filter(entry => entry.status === 'completed').length;
    const progressPercentage = totalEntries > 0 ? Math.round((completedEntries / totalEntries) * 100) : 0;
    
    coursesContainer.innerHTML = `
        <div class="mb-3">
            <h3 class="h6">Общий прогресс обучения</h3>
            <div class="progress" role="progressbar" aria-label="Прогресс обучения" aria-valuenow="${progressPercentage}" aria-valuemin="0" aria-valuemax="100">
                <div class="progress-bar" style="width: ${progressPercentage}%">
                    ${progressPercentage}%
                </div>
            </div>
        </div>
        <div>
            <p><strong>Завершено задач:</strong> ${completedEntries} из ${totalEntries}</p>
            <p><strong>Всего задач:</strong> ${totalEntries}</p>
        </div>
    `;
}

function updateDiaryStats() {
    const statsContainer = document.getElementById('diaryStats');
    if (!statsContainer) return;
    
    const diaryEntries = JSON.parse(localStorage.getItem('diaryEntries')) || [];
    const totalEntries = diaryEntries.length;
    const completedEntries = diaryEntries.filter(entry => entry.status === 'completed').length;
    const inProgressEntries = diaryEntries.filter(entry => entry.status === 'in-progress').length;
    
    statsContainer.innerHTML = `
        <div class="row text-center">
            <div class="col-md-4 mb-3">
                <div class="card bg-light">
                    <div class="card-body">
                        <h3 class="h2 text-primary">${totalEntries}</h3>
                        <p class="mb-0">Всего задач</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4 mb-3">
                <div class="card bg-light">
                    <div class="card-body">
                        <h3 class="h2 text-success">${completedEntries}</h3>
                        <p class="mb-0">Завершено</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4 mb-3">
                <div class="card bg-light">
                    <div class="card-body">
                        <h3 class="h2 text-warning">${inProgressEntries}</h3>
                        <p class="mb-0">В процессе</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatDate(dateString) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
}

// Ф-ция для проверки поддержки различных функций
function checkBrowserSupport() {
    const supports = {
        containerQueries: 'container' in document.documentElement.style,
        grid: 'grid' in document.documentElement.style,
        flexbox: 'flex' in document.documentElement.style,
        prefersReducedMotion: window.matchMedia('(prefers-reduced-motion)').matches,
        prefersContrast: window.matchMedia('(prefers-contrast)').matches
    };
    
    console.log('Поддержка браузером:', supports);
    
    // fallback-и
    if (!supports.containerQueries) {
        document.documentElement.classList.add('no-container-queries');
    }
    
    if (!supports.grid) {
        document.documentElement.classList.add('no-grid');
    }
}

checkBrowserSupport();