// Основные функции сайта
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация прогресс-баров
    initProgressBars();
    
    // Инициализация обработчиков форм
    initForms();
    
    // Инициализация модальных окон проектов
    initProjectModals();
    
    // Инициализация фильтрации проектов
    initProjectFilters();
    
    // Инициализация функционала дневника
    initDiary();
    
    // Добавление плавной прокрутки для всех ссылок
    initSmoothScroll();
});

// Функция для анимации прогресс-баров
function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.style.width;
                progressBar.style.width = '0';
                
                setTimeout(() => {
                    progressBar.style.transition = 'width 1.5s ease-in-out';
                    progressBar.style.width = width;
                }, 300);
                
                observer.unobserve(progressBar);
            }
        });
    }, { threshold: 0.5 });
    
    progressBars.forEach(bar => observer.observe(bar));
}

// Функция для инициализации обработчиков форм
function initForms() {
    // Обработка формы контактов
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            let isValid = true;
            
            if (name === '') {
                showError('name', 'Пожалуйста, введите ваше имя');
                isValid = false;
            } else {
                clearError('name');
            }
            
            if (email === '') {
                showError('email', 'Пожалуйста, введите ваш email');
                isValid = false;
            } else if (!isValidEmail(email)) {
                showError('email', 'Пожалуйста, введите корректный email');
                isValid = false;
            } else {
                clearError('email');
            }
            
            if (message === '') {
                showError('message', 'Пожалуйста, введите ваше сообщение');
                isValid = false;
            } else {
                clearError('message');
            }
            
            if (isValid) {
                // Вывод данных формы в консоль
                const formData = {
                    name: name,
                    email: email,
                    message: message,
                    timestamp: new Date().toISOString()
                };
                
                console.log('Данные формы контактов:', formData);
                console.table(formData);
                
                showNotification('Сообщение успешно отправлено!', 'success');
                contactForm.reset();
            }
        });
    }
    
    // Обработка формы добавления записи в дневник
    const diaryForm = document.getElementById('diaryForm');
    if (diaryForm) {
        // Устанавливаем сегодняшнюю дату по умолчанию
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('entryDate').value = today;
        
        diaryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('entryTitle').value.trim();
            const date = document.getElementById('entryDate').value;
            const status = document.getElementById('entryStatus').value;
            
            if (title === '') {
                showError('entryTitle', 'Пожалуйста, введите название задачи');
                return;
            } else {
                clearError('entryTitle');
            }
            
            addDiaryEntry(title, date, status);
            diaryForm.reset();
            // Снова устанавливаем сегодняшнюю дату
            document.getElementById('entryDate').value = today;
            showNotification('Запись успешно добавлена в дневник!', 'success');
        });
    }
}

// Функция для плавной прокрутки
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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
}

// Функция для проверки валидности email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Функция для отображения ошибки
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
}

// Функция для очистки ошибки
function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}Error`);
    
    field.classList.remove('is-invalid');
    
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

// Функция для показа уведомлений
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 100px; right: 20px; z-index: 1050; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Функция для имитации скачивания резюме
function downloadResume() {
    showNotification('Резюме начинает скачиваться...', 'info');
    setTimeout(() => {
        showNotification('Резюме успешно скачано!', 'success');
    }, 1500);
}

// Функции для работы с проектами
function initProjectModals() {
    const projectsData = {
        'project1': {
            title: 'Личный сайт',
            description: 'Адаптивный веб-сайт с использованием HTML и CSS. Проект включает в себя главную страницу, портфолио и контактную форму.',
            technologies: ['HTML5', 'CSS3'],
            liveLink: '#',
            codeLink: '#',
            category: 'html'
        },
        'project2': {
            title: 'Todo-приложение',
            description: 'Интерактивное приложение для управления задачами с возможностью добавления, редактирования и удаления задач.',
            technologies: ['JavaScript', 'LocalStorage', 'Bootstrap'],
            liveLink: '#',
            codeLink: '#',
            category: 'js'
        },
        'project3': {
            title: 'Портфолио на Bootstrap',
            description: 'Современное адаптивное портфолио с использованием Bootstrap 5. Включает анимации и интерактивные элементы.',
            technologies: ['Bootstrap 5', 'JavaScript', 'CSS3'],
            liveLink: '#',
            codeLink: '#',
            category: 'html'
        },
        'project4': {
            title: 'Интернет-магазин',
            description: 'Прототип интернет-магазина с корзиной покупок и системой фильтрации товаров.',
            technologies: ['React', 'Node.js', 'MongoDB'],
            liveLink: '#',
            codeLink: '#',
            category: 'react'
        },
        'project5': {
            title: 'Игра "Память"',
            description: 'Карточная игра на запоминание на чистом JavaScript с системой подсчета очков и таймером.',
            technologies: ['JavaScript', 'CSS3', 'HTML5'],
            liveLink: '#',
            codeLink: '#',
            category: 'js'
        },
        'project6': {
            title: 'Лендинг продукта',
            description: 'Продающая страница для цифрового продукта с адаптивным дизайном и формой заказа.',
            technologies: ['HTML5', 'CSS3', 'JavaScript'],
            liveLink: '#',
            codeLink: '#',
            category: 'html'
        }
    };

    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project');
            const project = projectsData[projectId];
            
            if (project) {
                showProjectModal(project);
            }
        });
    });
}

function showProjectModal(project) {
    let modal = document.getElementById('projectModal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'projectModal';
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="projectModalTitle">${project.title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p id="projectModalDescription">${project.description}</p>
                        <h6>Технологии:</h6>
                        <div id="projectModalTechnologies"></div>
                        <div class="mt-3">
                            <a href="${project.liveLink}" class="btn btn-primary me-2" target="_blank">Живая версия</a>
                            <a href="${project.codeLink}" class="btn btn-outline-secondary" target="_blank">Исходный код</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    } else {
        document.getElementById('projectModalTitle').textContent = project.title;
        document.getElementById('projectModalDescription').textContent = project.description;
        
        const technologiesContainer = document.getElementById('projectModalTechnologies');
        technologiesContainer.innerHTML = project.technologies.map(tech => 
            `<span class="badge bg-secondary me-1">${tech}</span>`
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
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            filterProjects(filter);
        });
    });
}

function filterProjects(filter) {
    const projects = document.querySelectorAll('.project-card');
    
    projects.forEach(project => {
        const projectCategory = project.getAttribute('data-category');
        
        if (filter === 'all') {
            project.style.display = 'block';
            project.style.opacity = '1';
        } else if (projectCategory === filter) {
            project.style.display = 'block';
            project.style.opacity = '1';
        } else {
            project.style.display = 'none';
            project.style.opacity = '0';
        }
    });
}

// Функции для работы с дневником
function initDiary() {
    loadDiaryEntries();
    updateCourseProgress();
    updateDiaryStats();
}

function loadDiaryEntries() {
    const diaryEntries = JSON.parse(localStorage.getItem('diaryEntries')) || [
        { 
            id: 1,
            title: 'Верстка макета сайта', 
            date: '2024-12-15', 
            status: 'completed' 
        },
        { 
            id: 2,
            title: 'JavaScript основы', 
            date: '2024-12-10', 
            status: 'completed' 
        },
        { 
            id: 3,
            title: 'Работа с формами', 
            date: '2024-12-05', 
            status: 'in-progress' 
        },
        { 
            id: 4,
            title: 'Адаптивный дизайн', 
            date: '2024-12-01', 
            status: 'in-progress' 
        }
    ];
    
    const entriesContainer = document.getElementById('diaryEntries');
    if (entriesContainer) {
        renderDiaryEntries(entriesContainer, diaryEntries);
    }
}

function renderDiaryEntries(container, entries) {
    container.innerHTML = '';
    
    // Сортируем записи по дате (новые сверху)
    entries.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    entries.forEach(entry => {
        const entryElement = document.createElement('div');
        entryElement.className = `diary-entry ${entry.status}`;
        entryElement.setAttribute('data-entry-id', entry.id);
        
        const statusIcon = entry.status === 'completed' ? '✓' : '⟳';
        const statusText = entry.status === 'completed' ? 'Завершено' : 'В процессе';
        const statusClass = entry.status === 'completed' ? 'text-success' : 'text-warning';
        
        entryElement.innerHTML = `
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <h5 class="mb-1">${entry.title}</h5>
                    <p class="text-muted mb-0">${formatDate(entry.date)}</p>
                </div>
                <span class="${statusClass} fw-bold">${statusText} ${statusIcon}</span>
            </div>
            <div class="mt-2">
                <button class="btn btn-sm btn-outline-danger" onclick="deleteDiaryEntry(${entry.id})">Удалить</button>
            </div>
        `;
        
        container.appendChild(entryElement);
    });
    
    updateDiaryStats();
}

function addDiaryEntry(title, date, status) {
    const diaryEntries = JSON.parse(localStorage.getItem('diaryEntries')) || [];
    
    // Генерируем уникальный ID
    const newId = diaryEntries.length > 0 ? Math.max(...diaryEntries.map(e => e.id)) + 1 : 1;
    
    const newEntry = {
        id: newId,
        title,
        date: date || new Date().toISOString().split('T')[0],
        status: status || 'in-progress'
    };
    
    diaryEntries.push(newEntry);
    localStorage.setItem('diaryEntries', JSON.stringify(diaryEntries));
    
    const entriesContainer = document.getElementById('diaryEntries');
    if (entriesContainer) {
        renderDiaryEntries(entriesContainer, diaryEntries);
    }
}

function deleteDiaryEntry(entryId) {
    let diaryEntries = JSON.parse(localStorage.getItem('diaryEntries')) || [];
    diaryEntries = diaryEntries.filter(entry => entry.id !== entryId);
    localStorage.setItem('diaryEntries', JSON.stringify(diaryEntries));
    
    const entriesContainer = document.getElementById('diaryEntries');
    if (entriesContainer) {
        renderDiaryEntries(entriesContainer, diaryEntries);
    }
    
    showNotification('Запись удалена из дневника!', 'warning');
}

function updateCourseProgress() {
    const courses = [
        { name: 'Веб-разработка', progress: 90 },
        { name: 'JavaScript', progress: 70 },
        { name: 'React', progress: 50 }
    ];
    
    const coursesContainer = document.getElementById('coursesProgress');
    if (coursesContainer) {
        coursesContainer.innerHTML = '';
        
        courses.forEach(course => {
            const courseElement = document.createElement('div');
            courseElement.className = 'mb-3';
            courseElement.innerHTML = `
                <div class="d-flex justify-content-between">
                    <span>${course.name}</span>
                    <span>${course.progress}%</span>
                </div>
                <div class="progress">
                    <div class="progress-bar" role="progressbar" style="width: ${course.progress}%"></div>
                </div>
            `;
            coursesContainer.appendChild(courseElement);
        });
        
        initProgressBars();
    }
}

function updateDiaryStats() {
    const diaryEntries = JSON.parse(localStorage.getItem('diaryEntries')) || [];
    const completedTasks = diaryEntries.filter(entry => entry.status === 'completed').length;
    const inProgressTasks = diaryEntries.filter(entry => entry.status === 'in-progress').length;
    const totalTasks = diaryEntries.length;
    
    const completedElement = document.getElementById('completedTasks');
    const inProgressElement = document.getElementById('inProgressTasks');
    const totalElement = document.getElementById('totalTasks');
    
    if (completedElement) completedElement.textContent = completedTasks;
    if (inProgressElement) inProgressElement.textContent = inProgressTasks;
    if (totalElement) totalElement.textContent = totalTasks;
}

// Вспомогательные функции
function formatDate(dateString) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', options);
}

// Глобальные функции для вызова из HTML
window.downloadResume = downloadResume;
window.deleteDiaryEntry = deleteDiaryEntry;