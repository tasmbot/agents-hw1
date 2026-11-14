import {
  addTask,
  createInitialTasks,
  filterTasks,
  getMetrics,
  removeTask,
  toggleDone,
  validateTaskInput,
} from './domain.mjs';

const form = document.querySelector('#task-form');
const titleInput = document.querySelector('#task-title');
const hoursInput = document.querySelector('#task-hours');
const titleError = document.querySelector('#title-error');
const hoursError = document.querySelector('#hours-error');
const taskList = document.querySelector('#task-list');
const emptyState = document.querySelector('#empty-state');
const filterButtons = [...document.querySelectorAll('[data-filter]')];

let tasks = createInitialTasks();
let selectedFilter = 'all';
let nextId = Math.max(...tasks.map((task) => task.id)) + 1;

function renderMetrics() {
  const { totalHours, doneHours, progress } = getMetrics(tasks);
  document.querySelector('#total-hours').textContent = `${totalHours} ч`;
  document.querySelector('#done-hours').textContent = `${doneHours} ч`;
  document.querySelector('#progress').textContent = `${progress}%`;
}

function renderTasks() {
  const visibleTasks = filterTasks(tasks, selectedFilter);
  taskList.replaceChildren();
  emptyState.hidden = visibleTasks.length !== 0;

  visibleTasks.forEach((task) => {
    const item = document.createElement('li');
    item.className = 'task';

    const doneLabel = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.dataset.action = 'toggle';
    checkbox.dataset.id = task.id;
    checkbox.setAttribute('aria-label', `Отметить задачу «${task.title}» готовой`);
    doneLabel.append(checkbox, document.createTextNode(` ${task.title}`));

    const hours = document.createElement('span');
    hours.className = 'task-hours';
    hours.textContent = `${task.hours} ч`;

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.textContent = 'Удалить';
    removeButton.dataset.action = 'remove';
    removeButton.dataset.id = task.id;
    removeButton.setAttribute('aria-label', `Удалить задачу «${task.title}»`);

    item.append(doneLabel, hours, removeButton);
    taskList.append(item);
  });
}

function renderFilters() {
  filterButtons.forEach((button) => {
    const isSelected = button.dataset.filter === selectedFilter;
    button.classList.toggle('is-selected', isSelected);
    button.setAttribute('aria-pressed', String(isSelected));
  });
}

function render() {
  renderMetrics();
  renderTasks();
  renderFilters();
}

function showErrors(errors = {}) {
  titleError.textContent = errors.title ?? '';
  hoursError.textContent = errors.hours ?? '';
  titleInput.setAttribute('aria-invalid', String(Boolean(errors.title)));
  hoursInput.setAttribute('aria-invalid', String(Boolean(errors.hours)));
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const validation = validateTaskInput(titleInput.value, hoursInput.value);
  showErrors(validation.errors);

  if (!validation.valid) {
    return;
  }

  tasks = addTask(tasks, {
    id: nextId,
    title: validation.value.title,
    hours: validation.value.hours,
    done: false,
  });
  nextId += 1;
  form.reset();
  showErrors();
  render();
});

taskList.addEventListener('change', (event) => {
  const target = event.target;
  if (target.dataset.action !== 'toggle') {
    return;
  }

  tasks = toggleDone(tasks, Number(target.dataset.id));
  render();
});

taskList.addEventListener('click', (event) => {
  const target = event.target;
  if (target.dataset.action !== 'remove') {
    return;
  }

  tasks = removeTask(tasks, Number(target.dataset.id));
  render();
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    selectedFilter = button.dataset.filter;
    render();
  });
});

render();
