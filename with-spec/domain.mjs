export const INITIAL_TASKS = Object.freeze([
  Object.freeze({ id: 1, title: 'Чтение', hours: 2, done: true }),
  Object.freeze({ id: 2, title: 'Практика', hours: 4, done: false }),
  Object.freeze({ id: 3, title: 'Повторение', hours: 2, done: false }),
]);

export function createInitialTasks() {
  return INITIAL_TASKS.map((task) => ({ ...task }));
}

export function addTask(tasks, task) {
  return [...tasks, task];
}

export function removeTask(tasks, id) {
  return tasks.filter((task) => task.id !== id);
}

export function toggleDone(tasks, id) {
  return tasks.map((task) => (
    task.id === id ? { ...task, done: !task.done } : task
  ));
}

export function getMetrics(tasks) {
  const totalHours = tasks.reduce((sum, task) => sum + task.hours, 0);
  const doneHours = tasks.reduce(
    (sum, task) => sum + (task.done ? task.hours : 0),
    0,
  );
  const progress = totalHours === 0
    ? 0
    : Math.round((100 * doneHours) / totalHours);

  return { totalHours, doneHours, progress };
}

export function filterTasks(tasks, filter) {
  if (filter === 'active') {
    return tasks.filter((task) => !task.done);
  }

  if (filter === 'done') {
    return tasks.filter((task) => task.done);
  }

  return [...tasks];
}

export function validateTaskInput(titleInput, hoursInput) {
  const title = String(titleInput ?? '').trim();
  const errors = {};

  if (!title) {
    errors.title = 'Введите название задачи.';
  }

  const rawHours = String(hoursInput ?? '').trim();
  if (!rawHours) {
    errors.hours = 'Введите количество часов.';
  } else {
    const hours = Number(rawHours);
    const hasValidStep = Number.isInteger(hours * 2);

    if (!Number.isFinite(hours) || hours < 0.5 || hours > 24 || !hasValidStep) {
      errors.hours = 'Часы должны быть от 0.5 до 24 с шагом 0.5.';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    value: {
      title,
      hours: Number(rawHours),
    },
  };
}
