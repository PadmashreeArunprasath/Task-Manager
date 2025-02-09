document.addEventListener("DOMContentLoaded", loadTasks);
const taskList = document.getElementById("task-list");

// 🌙 Dark Mode Toggle
document.getElementById("dark-mode-toggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

// Add Task
function addTask() {
    const taskInput = document.getElementById("task").value;
    const category = document.getElementById("category").value;
    const priority = document.getElementById("priority").value;

    if (!taskInput) return alert("Please enter a task!");

    const task = { text: taskInput, category, priority, completed: false };
    saveTask(task);
    renderTask(task);
}

// Save Task to Local Storage
function saveTask(task) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

//  Load Tasks from Local Storage
function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(renderTask);
}

//  Render Task in UI
function renderTask(task) {
    const li = document.createElement("li");
    li.classList.add("task", task.priority.toLowerCase());
    li.draggable = true;
    li.innerHTML = `
        ${task.text} <span>(${task.category})</span>
        <button onclick="deleteTask(this)">❌</button>
    `;
    li.addEventListener("dragstart", dragStart);
    li.addEventListener("dragover", dragOver);
    li.addEventListener("drop", drop);
    taskList.appendChild(li);
}

// Delete Task
function deleteTask(btn) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let taskText = btn.parentElement.textContent.trim();
    tasks = tasks.filter(t => !taskText.includes(t.text));
    localStorage.setItem("tasks", JSON.stringify(tasks));
    btn.parentElement.remove();
}

// Drag & Drop Tasks
let draggedItem = null;
function dragStart(e) {
    draggedItem = e.target;
}
function dragOver(e) {
    e.preventDefault();
}
function drop(e) {
    if (draggedItem !== this) {
        let parent = this.parentNode;
        parent.insertBefore(draggedItem, this);
        updateTaskOrder();
    }
}
function updateTaskOrder() {
    let tasks = [];
    document.querySelectorAll(".task").forEach(task => {
        let text = task.textContent.trim().split(" (")[0];
        let category = task.textContent.trim().split("(")[1].split(")")[0];
        let priority = task.classList.contains("high") ? "High" :
                      task.classList.contains("medium") ? "Medium" : "Low";
        tasks.push({ text, category, priority });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
