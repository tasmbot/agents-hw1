# ДЗ №1 — вариант Б

Сравнение двух способов разработки автономного мини-трекера учебных задач:

- `direct/` — прямая разработка без OpenSpec;
- `with-spec/` — разработка с OpenSpec/OpenCode, включая архив изменения и отчёт ручной проверки.

## Запуск

Обе версии не используют CDN, внешние библиотеки, API или ключи. Для автоматических проверок нужен Node.js:

```bash
cd direct
node --test tests/acceptance.test.mjs
```

```bash
cd with-spec
node --test tests/acceptance.test.mjs
```

Для просмотра интерфейса откройте соответствующий `index.html` в браузере. Ручные результаты и ограничения перечислены в `report.md` и отчётах внутри папок.

## Результаты

| Показатель | Direct | With-spec |
|---|---:|---:|
| Время | 5 мин | 45 мин |
| Обращения к модели | 2 | 13 |
| Автотесты | 5/5 PASS | 6/6 PASS |
| T1–T5 | PASS | PASS |
| Адаптивность | PASS | PASS |
| OpenSpec | не применялся | 15/15, валиден |

Модель: `openai/gpt-5.6-terra`.

## Скриншоты

Direct:
<img width="1511" height="867" alt="image" src="https://github.com/user-attachments/assets/e0ab4f8e-da94-4d57-95c8-1658c0e0ece1" />
<img width="893" height="901" alt="image" src="https://github.com/user-attachments/assets/08a6e90e-9e18-46dc-8388-5c69b550301f" />


With Spec:
<img width="1507" height="838" alt="image" src="https://github.com/user-attachments/assets/06995c44-6720-47d5-bd55-0a8a5a83c2ad" />
<img width="890" height="879" alt="image" src="https://github.com/user-attachments/assets/943cdf2b-1026-4b99-b663-6489b989ee8c" />

## Состав

- `report.md` — сравнительный отчёт;
- `prompts.txt` — только доступные фрагменты истории и отмеченные пробелы;
- `direct/` — исходники, тесты и отчёт Direct;
- `with-spec/` — исходники, тесты, логи и архив OpenSpec.

Исходники и историю исправлений намеренно сохранены.
