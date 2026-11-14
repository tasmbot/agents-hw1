import {
  calculateProgress,
  filterTasks,
  initialTasks,
  validateTask,
} from "./domain.mjs";

let tasks = initialTasks.map((task) => ({ ...task }));
let currentFilter = "all";
let nextId = 1;

const form = document.querySelector("#task-form");
const titleInput = document.querySelector("#task-title");
const hoursInput = document.querySelector("#task-hours");
const titleError = document.querySelector("#title-error");
const hoursError = document.querySelector("#hours-error");
const taskList = document.querySelector("#task-list");
const totalHours = document.querySelector("#total-hours");
const doneHours = document.querySelector("#done-hours");
const progress = document.querySelector("#progress");

function render() {
  const metrics = calculateProgress(tasks);
  totalHours.textContent = String(metrics.totalHours);
  doneHours.textContent = String(metrics.doneHours);
  progress.textContent = `${metrics.progress}%`;

  const visibleTasks = filterTasks(tasks, currentFilter);
  taskList.replaceChildren();

  if (visibleTasks.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-state";
    empty.textContent = "Нет задач в этом списке.";
    taskList.append(empty);
    return;
  }

  visibleTasks.forEach((task) => {
    const item = document.createElement("li");
    item.className = "task";

    const doneLabel = document.createElement("label");
    doneLabel.className = "task-done";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.setAttribute("aria-label", `Отметить «${task.title}» готовой`);
    checkbox.addEventListener("change", () => {
      tasks = tasks.map((candidate) =>
        candidate.id === task.id ? { ...candidate, done: checkbox.checked } : candidate,
      );
      render();
    });
    const taskText = document.createElement("span");
    taskText.textContent = `${task.title} — ${task.hours} ч`;
    doneLabel.append(checkbox, taskText);

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "remove-button";
    removeButton.textContent = "Удалить";
    removeButton.setAttribute("aria-label", `Удалить «${task.title}»`);
    removeButton.addEventListener("click", () => {
      tasks = tasks.filter((candidate) => candidate.id !== task.id);
      render();
    });

    item.append(doneLabel, removeButton);
    taskList.append(item);
  });
}

function showErrors(errors) {
  titleError.textContent = errors.title ?? "";
  hoursError.textContent = errors.hours ?? "";
  titleInput.setAttribute("aria-invalid", String(Boolean(errors.title)));
  hoursInput.setAttribute("aria-invalid", String(Boolean(errors.hours)));
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const validation = validateTask({
    title: titleInput.value,
    hours: hoursInput.value,
  });

  showErrors(validation.errors);
  if (!validation.valid) return;

  tasks = [
    ...tasks,
    { id: `task-${nextId++}`, ...validation.value, done: false },
  ];
  form.reset();
  showErrors({});
  render();
});

document.querySelector("#filters").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-filter]");
  if (!button) return;

  currentFilter = button.dataset.filter;
  document.querySelectorAll("[data-filter]").forEach((filterButton) => {
    const selected = filterButton === button;
    filterButton.classList.toggle("selected", selected);
    filterButton.setAttribute("aria-pressed", String(selected));
  });
  render();
});

render();
