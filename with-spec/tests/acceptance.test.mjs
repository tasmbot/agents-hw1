import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createInitialTasks,
  filterTasks,
  getMetrics,
  removeTask,
  toggleDone,
  validateTaskInput,
} from '../domain.mjs';

test('T1: исходные задачи дают 8 часов, 2 готово и 25%', () => {
  const tasks = createInitialTasks();

  assert.equal(tasks.length, 3);
  assert.deepEqual(getMetrics(tasks), {
    totalHours: 8,
    doneHours: 2,
    progress: 25,
  });
});

test('T2: завершение Практики даёт 6 из 8 часов и 75%', () => {
  const tasks = toggleDone(createInitialTasks(), 2);

  assert.deepEqual(getMetrics(tasks), {
    totalHours: 8,
    doneHours: 6,
    progress: 75,
  });
});

test('T3: фильтр активных не меняет общий прогресс', () => {
  const tasks = createInitialTasks();
  const activeTasks = filterTasks(tasks, 'active');

  assert.deepEqual(
    activeTasks.map((task) => task.title),
    ['Практика', 'Повторение'],
  );
  assert.equal(getMetrics(tasks).progress, 25);
  assert.equal(tasks.length, 3);
});

test('T4: невалидные поля не проходят валидацию, валидные проходят', () => {
  const invalidInputs = [
    ['', '1'],
    ['   ', '1'],
    ['Задача', ''],
    ['Задача', '-1'],
    ['Задача', '0.25'],
    ['Задача', '0.75'],
    ['Задача', '24.5'],
  ];

  invalidInputs.forEach(([title, hours]) => {
    assert.equal(validateTaskInput(title, hours).valid, false);
  });

  const valid = validateTaskInput(' Новая задача ', '0.5');
  assert.equal(valid.valid, true);
  assert.deepEqual(valid.value, { title: 'Новая задача', hours: 0.5 });
});

test('T5: удаление всех задач даёт пустое состояние метрик без NaN и Infinity', () => {
  let tasks = createInitialTasks();
  tasks = removeTask(tasks, 1);
  tasks = removeTask(tasks, 2);
  tasks = removeTask(tasks, 3);

  const metrics = getMetrics(tasks);
  assert.deepEqual(metrics, { totalHours: 0, doneHours: 0, progress: 0 });
  assert.equal(Number.isFinite(metrics.progress), true);
});

test('прогресс полностью завершённых задач отображается как 100%', () => {
  const completedTasks = createInitialTasks().map((task) => ({
    ...task,
    done: true,
  }));

  assert.equal(getMetrics(completedTasks).progress, 100);
});
