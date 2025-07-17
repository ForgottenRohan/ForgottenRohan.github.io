// Initialize todoList from localStorage or empty array
let todoList = JSON.parse(localStorage.getItem('todoList')) || [];
const baseTodoId = 'todoitem';

// Save to localStorage
function saveToLocalStorage() {
    localStorage.setItem('todoList', JSON.stringify(todoList));
}
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log( 'Service Worker registered with scope:', registration.scope);
            })
            .catch (error => {
                console.error ('Service Worker registration failed:', error);
            });
    });
}
// Load todos on page load
window.onload = function() {
    renderAllTodos();
};

function renderAllTodos() {
    const container = document.getElementById('todoItemsContainer');
    container.innerHTML = '';
    todoList.forEach(todo => {
        addToDoToHtml(todo);
    });
}

function deleteElement(id) {
    const index = todoList.findIndex(item => item.id === id);
    if (index !== -1) {
        todoList.splice(index, 1);
        saveToLocalStorage();
        document.getElementById(baseTodoId + id).remove();
    }
}

function addToDo() {
    const form = document.forms.toDoForm;
    
    // Validate form
    if (!form.elements.title.value || !form.elements.date.value) {
        alert('Title and Date are required!');
        return;
    }

    const newTodo = {
        id: createNewId(),
        title: form.elements.title.value,
        color: form.elements.color.value,
        description: form.elements.description.value,
        date: form.elements.date.value,
        priority: form.elements.priority.value,
        completed: false,
        selected: false
    };
    
    todoList.push(newTodo);
    saveToLocalStorage();
    addToDoToHtml(newTodo);
    
    // Reset form
    form.reset();
    form.elements.color.value = '#6c757d';
    form.elements.priority.value = 'medium';
}

function createNewId() {
    return todoList.length === 0 ? 1 : Math.max(...todoList.map(todo => todo.id)) + 1;
}

function addToDoToHtml(todo) {
    const div = document.createElement('div');
    div.id = baseTodoId + todo.id;
    div.className = `row my-3 priority-${todo.priority} ${todo.completed ? 'completed' : ''}`;

    div.innerHTML = `
        <div class="col">
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center" style="height: 35px; background-color: ${todo.color}">
                    <span>${new Date(todo.date).toLocaleDateString()}</span>
                    <div>
                        <span class="badge bg-${getPriorityBadgeColor(todo.priority)} me-2">${todo.priority.toUpperCase()}</span>
                        <input type="checkbox" class="form-check-input me-2" ${todo.selected ? 'checked' : ''} onclick="toggleSelect(${todo.id})">
                    </div>
                </div>
                <div class="card-body">
                    <div class="d-flex justify-content-between">
                        <h5 class="card-title">${todo.title}</h5>
                        <div>
                            <span class="move-btn me-2" onclick="moveUp(${todo.id})">↑</span>
                            <span class="move-btn me-2" onclick="moveDown(${todo.id})">↓</span>
                            <button type="button" class="btn btn-sm ${todo.completed ? 'btn-success' : 'btn-outline-secondary'}" onclick="toggleComplete(${todo.id})">
                                ${todo.completed ? 'Completed' : 'Complete'}
                            </button>
                        </div>
                    </div>
                    <p class="card-text">${todo.description}</p>
                    <button type="button" class="btn btn-link text-danger" onclick="deleteElement(${todo.id})">Delete Task</button>
                </div>
            </div>
        </div>`;
    
    document.getElementById('todoItemsContainer').appendChild(div);
}

function getPriorityBadgeColor(priority) {
    switch(priority) {
        case 'high': return 'danger';
        case 'medium': return 'warning';
        case 'low': return 'success';
        default: return 'secondary';
    }
}

function toggleComplete(id) {
    const index = todoList.findIndex(item => item.id === id);
    if (index !== -1) {
        todoList[index].completed = !todoList[index].completed;
        saveToLocalStorage();
        renderAllTodos();
    }
}

function toggleSelect(id) {
    const index = todoList.findIndex(item => item.id === id);
    if (index !== -1) {
        todoList[index].selected = !todoList[index].selected;
        saveToLocalStorage();
    }
}

function deleteSelected() {
    // Filter out selected items
    todoList = todoList.filter(todo => !todo.selected);
    saveToLocalStorage();
    renderAllTodos();
}

function sortByDate() {
    todoList.sort((a, b) => new Date(a.date) - new Date(b.date));
    saveToLocalStorage();
    renderAllTodos();
}

function filterByPriority(priority) {
    const container = document.getElementById('todoItemsContainer');
    container.innerHTML = '';
    
    if (priority === 'all') {
        renderAllTodos();
        return;
    }
    
    const filteredTodos = todoList.filter(todo => todo.priority === priority);
    filteredTodos.forEach(todo => {
        addToDoToHtml(todo);
    });
}

function moveUp(id) {
    const index = todoList.findIndex(item => item.id === id);
    if (index > 0) {
        // Swap elements in array
        [todoList[index], todoList[index - 1]] = [todoList[index - 1], todoList[index]];
        saveToLocalStorage();
        renderAllTodos();
    }
}

function moveDown(id) {
    const index = todoList.findIndex(item => item.id === id);
    if (index < todoList.length - 1) {
        // Swap elements in array
        [todoList[index], todoList[index + 1]] = [todoList[index + 1], todoList[index]];
        saveToLocalStorage();
        renderAllTodos();
    }
}