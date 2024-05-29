const mainElement = document.querySelector("main");
const tasksList = document.querySelector(".tasks-list");
const addForm = document.querySelector(".add-form");
const inputTask = document.querySelector(".input-task");

const fetchTasks = async () => {
    const response = await fetch("http://localhost:3333/tasks");
    const tasks = await response.json();

    return tasks;
};

const addTask = async (event) => {
    event.preventDefault();

    const task = { title: inputTask.value };

    await fetch("http://localhost:3333/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
    });

    loadTasks();
    inputTask.value = "";
};

const deleteTask = async (id) => {
    await fetch(`http://localhost:3333/tasks/${id}`, {
        method: "DELETE",
    });

    loadTasks();
};

const updateTask = async ({ id, title, status }) => {
    await fetch(`http://localhost:3333/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, status }),
    });

    loadTasks();
};

const createElement = (tag, innerText = "", innerHTML = "") => {
    const element = document.createElement(tag);

    if (innerText) element.innerText = innerText;
    if (innerHTML) element.innerHTML = innerHTML;

    return element;
};

const createRow = (task) => {
    const { id, title, created_at, status } = task;

    const divTask = createElement("div");
    const checkBoxSpan = createElement("span", "check_box_outline_blank");
    const divForm = createElement("div");
    const pTitle = createElement("p", title);
    const editButton = createElement("button");
    const editSpan = createElement("span", "edit");
    const deleteButton = createElement("button");
    const deleteSpan = createElement("span", "delete");
    const editForm = createElement("form");
    const editInput = createElement("input");

    divTask.classList.add("task-container");
    checkBoxSpan.classList.add(
        "material-symbols-outlined",
        "check-box-outline"
    );
    divForm.classList.add("task-write");
    editButton.classList.add("btn-action");
    editSpan.classList.add("material-symbols-outlined", "icon-edit");
    deleteButton.classList.add("btn-action");
    deleteSpan.classList.add("material-symbols-outlined", "icon-delete");

    deleteButton.addEventListener("click", () => deleteTask(id));

    editInput.classList.add("task-input");
    editInput.value = title;
    editForm.appendChild(editInput);
    editForm.addEventListener("submit", (event) => {
        event.preventDefault();

        updateTask({ id, title: editInput.value, status });
    });
    editButton.addEventListener("click", () => {
        pTitle.innerHTML = "";
        pTitle.appendChild(editForm);
        editInput.focus();
    });

    editButton.appendChild(editSpan);
    deleteButton.appendChild(deleteSpan);
    divForm.appendChild(pTitle);
    divForm.appendChild(editButton);
    divForm.appendChild(deleteButton);
    divTask.appendChild(checkBoxSpan);
    divTask.appendChild(divForm);

    return divTask;
};

const loadTasks = async () => {
    const tasks = await fetchTasks();

    tasksList.innerHTML = "";

    tasks.forEach((task) => {
        const divTask = createRow(task);
        tasksList.appendChild(divTask);
    });
};

addForm.addEventListener("submit", addTask);
loadTasks();
