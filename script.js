let currentColumn = null;
let draggedTask = null;

// Drag and Drop functionality
function initDragAndDrop() {
    const tasks = document.querySelectorAll('.task');
    const columns = document.querySelectorAll('.column');

    tasks.forEach(task => {
        task.addEventListener('dragstart', dragStart);
        task.addEventListener('dragend', dragEnd);
        
        // Add delete task functionality
        const deleteBtn = task.querySelector('.delete-task');
        deleteBtn.addEventListener('click', deleteTask);
    });

    columns.forEach(column => {
        column.addEventListener('dragover', dragOver);
        column.addEventListener('drop', drop);
    });
}

function dragStart(e) {
    draggedTask = e.target.closest('.task');
    draggedTask.classList.add('dragging');
}

function dragEnd(e) {
    draggedTask.classList.remove('dragging');
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    const column = e.currentTarget;
    const beforeTask = getDragAfterElement(column, e.clientY);
    
    if (beforeTask == null) {
        column.insertBefore(draggedTask, column.querySelector('.add-task-btn'));
    } else {
        column.insertBefore(draggedTask, beforeTask);
    }
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Delete Task functionality
function deleteTask(e) {
    const task = e.target.closest('.task');
    task.remove();
}

// Popup functionality
function openTaskPopup(columnId) {
    currentColumn = columnId;
    document.getElementById('taskPopup').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('taskInput').value = '';
    document.getElementById('prioritySelect').value = 'high';
    document.getElementById('taskInput').focus();
}

function closeTaskPopup() {
    document.getElementById('taskPopup').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    currentColumn = null;
}

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const prioritySelect = document.getElementById('prioritySelect');
    const taskName = taskInput.value.trim();
    const priority = prioritySelect.value;

    if (taskName && currentColumn) {
        const column = document.getElementById(currentColumn);
        const taskElement = document.createElement('div');
        taskElement.classList.add('task', `${priority}-priority`);
        taskElement.setAttribute('draggable', 'true');
        
        taskElement.innerHTML = `
            ${taskName}
            <button class="delete-task">X</button>
        `;
        
        // Adicionar eventos de drag and drop e delete para a nova tarefa
        taskElement.addEventListener('dragstart', dragStart);
        taskElement.addEventListener('dragend', dragEnd);
        
        const deleteBtn = taskElement.querySelector('.delete-task');
        deleteBtn.addEventListener('click', deleteTask);
        
        // Inserir antes do botão de adicionar tarefa
        column.insertBefore(taskElement, column.lastElementChild);
        
        closeTaskPopup();
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initDragAndDrop();

    document.getElementById('taskInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
});