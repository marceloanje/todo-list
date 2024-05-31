const ICONS = {
    CHECKED: "check_box",
    UNCHECKED: "check_box_outline_blank",
    EDIT: "edit",
    DELETE: "delete",
};
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

const createRow = ({ id, title, created_at, status }) => {
    const divTask = createElement("div");
    const checkBoxSpan = createElement(
        "span",
        status === "concluido" ? ICONS.CHECKED : ICONS.UNCHECKED
    );
    const divForm = createElement("div");
    const pTitle = createElement("p", title);
    const editButton = createButton(ICONS.EDIT);
    const deleteButton = createButton(ICONS.DELETE);
    const editForm = createEditForm(title);

    divTask.classList.add("task-container");
    checkBoxSpan.classList.add(
        "material-symbols-outlined",
        "check-box-outline",
        "no-select"
    );
    divForm.classList.add("task-write");

    if (status === "concluido") pTitle.classList.add("p-conclued");
    if (status === "pendente") pTitle.classList.remove("p-conclued");

    deleteButton.addEventListener("click", () => deleteTask(id));

    checkBoxSpan.addEventListener("click", () => {
        const newStatus = status === "concluido" ? "pendente" : "concluido";
        checkBoxSpan.innerHTML =
            newStatus === "concluido" ? ICONS.CHECKED : ICONS.UNCHECKED;
        pTitle.classList.toggle("p-conclued", newStatus === "concluido");
        updateTask({ id, title, status: newStatus });
    });

    editButton.addEventListener("click", () => {
        pTitle.innerHTML = "";
        pTitle.appendChild(editForm);
        editForm.querySelector("input").focus();
    });

    editForm.addEventListener("submit", (event) => {
        event.preventDefault();
        updateTask({
            id,
            title: editForm.querySelector("input").value,
            status,
        });
    });

    appendChildren(divForm, [pTitle, editButton, deleteButton]);
    appendChildren(divTask, [checkBoxSpan, divForm]);

    return divTask;
};

const createButton = (icon) => {
    const button = createElement("button");
    const span = createElement("span", icon);
    button.classList.add("btn-action");
    span.classList.add("material-symbols-outlined", `icon-${icon}`);
    button.appendChild(span);
    return button;
};

const createEditForm = (title) => {
    const form = createElement("form");
    const input = createElement("input");
    input.classList.add("task-input");
    input.value = title;
    form.appendChild(input);
    return form;
};

const appendChildren = (parent, children) => {
    children.forEach((child) => parent.appendChild(child));
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
