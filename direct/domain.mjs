export const initialTasks = [
  { id: "reading", title: "Чтение", hours: 2, done: true },
  { id: "practice", title: "Практика", hours: 4, done: false },
  { id: "review", title: "Повторение", hours: 2, done: false },
];

export function calculateProgress(tasks) {
  const totals = tasks.reduce(
    (result, task) => {
      const hours = Number(task.hours);
      if (!Number.isFinite(hours) || hours < 0) return result;

      result.totalHours += hours;
      if (task.done) result.doneHours += hours;
      return result;
    },
    { totalHours: 0, doneHours: 0 },
  );

  return {
    ...totals,
    progress: totals.totalHours === 0
      ? 0
      : Math.round((100 * totals.doneHours) / totals.totalHours),
  };
}

export function filterTasks(tasks, filter = "all") {
  if (filter === "active") return tasks.filter((task) => !task.done);
  if (filter === "done") return tasks.filter((task) => task.done);
  return [...tasks];
}

export function validateTask({ title, hours }) {
  const errors = {};
  const trimmedTitle = typeof title === "string" ? title.trim() : "";
  const hoursText = typeof hours === "string" ? hours.trim() : String(hours ?? "");

  if (!trimmedTitle) {
    errors.title = "Введите название задачи.";
  }

  if (!hoursText) {
    errors.hours = "Укажите количество часов.";
  } else {
    const numericHours = Number(hoursText);
    const hasHalfHourStep = Number.isFinite(numericHours)
      && Math.abs(numericHours * 2 - Math.round(numericHours * 2)) < 1e-9;

    if (!Number.isFinite(numericHours) || numericHours < 0.5 || numericHours > 24 || !hasHalfHourStep) {
      errors.hours = "Часы: от 0.5 до 24 с шагом 0.5.";
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    value: {
      title: trimmedTitle,
      hours: Number(hoursText),
    },
  };
}
