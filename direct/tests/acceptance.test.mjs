import test from "node:test";
import assert from "node:assert/strict";
import { calculateProgress, filterTasks, initialTasks, validateTask } from "../domain.mjs";

test("T1: исходные данные дают 8 часов, 2 выполнено и 25%", () => {
  assert.equal(initialTasks.length, 3);
  assert.deepEqual(calculateProgress(initialTasks), {
    totalHours: 8,
    doneHours: 2,
    progress: 25,
  });
});

test("T2: завершение Практики даёт 6 из 8 часов и 75%", () => {
  const tasks = initialTasks.map((task) =>
    task.id === "practice" ? { ...task, done: true } : task,
  );
  assert.deepEqual(calculateProgress(tasks), {
    totalHours: 8,
    doneHours: 6,
    progress: 75,
  });
});

test("T3: фильтр не влияет на общие метрики", () => {
  const activeTasks = filterTasks(initialTasks, "active");
  assert.deepEqual(activeTasks.map((task) => task.title), ["Практика", "Повторение"]);
  assert.equal(calculateProgress(initialTasks).progress, 25);
});

test("T4: валидация отклоняет некорректные значения и принимает границы", () => {
  for (const candidate of [
    { title: "", hours: "2" },
    { title: "   ", hours: "2" },
    { title: "Задача", hours: "" },
    { title: "Задача", hours: "-1" },
    { title: "Задача", hours: "0.4" },
    { title: "Задача", hours: "24.5" },
    { title: "Задача", hours: "1.25" },
  ]) {
    assert.equal(validateTask(candidate).valid, false, JSON.stringify(candidate));
  }
  assert.equal(validateTask({ title: "Задача", hours: "0.5" }).valid, true);
  assert.equal(validateTask({ title: "Задача", hours: "24" }).valid, true);
});

test("T5: пустой список имеет нулевой безопасный прогресс", () => {
  assert.deepEqual(calculateProgress([]), {
    totalHours: 0,
    doneHours: 0,
    progress: 0,
  });
});
