# 🔥 HTML-шаблонизаторы в Gulp
🔥 HTML-шаблонизаторы в Gulp **живы, бодры и даже обновляются!** Вот тебе список самых удобных плагинов и подходов для **шаблонизации HTML в Gulp 5** — как простые include-файлы, так и настоящие движки.

---

## 🔧 1. `gulp-file-include` — самый простой и популярный (работает в Gulp 5)

### Что делает:

Позволяет вставлять куски HTML (header, footer и т.п.) с помощью `@@include`.

```html
<!-- index.html -->
@@include('partials/header.html')
<main>Контент</main>
@@include('partials/footer.html')
```

📦 Установка:

```bash
npm install --save-dev gulp-file-include
```

---

## 🧠 2. `gulp-nunjucks-render` — мощный шаблонизатор (от Mozilla)

### Что делает:

Использует движок [Nunjucks](https://mozilla.github.io/nunjucks/) — логику, переменные, циклы, наследование шаблонов.

📦 Установка:

```bash
npm install --save-dev gulp-nunjucks-render nunjucks
```

📄 Пример кода:

```html
<!-- templates/page.html -->
{% extends "layout.html" %}
{% block content %}
  <h1>{{ title }}</h1>
  <p>{{ description }}</p>
{% endblock %}
```

🔥 Отлично подходит для полноценной сборки сайтов с логикой в HTML.

---

## 💡 3. `gulp-pug` — если тебе нравится Pug (ex-Jade)

### Что делает:

Компилирует Pug-файлы (`.pug`) в HTML. Минимализм, отступы вместо тегов, поддержка шаблонов и миксинов.

📦 Установка:

```bash
npm install --save-dev gulp-pug
```

📄 Пример:

```pug
doctype html
html
  head
    title= title
  body
    h1 Привет
```

⚠️ Внимание: некоторым сложно читается, но очень мощный и лаконичный.

---

## 🪄 4. Альтернатива: `gulp-ejs`

### Что делает:

Использует шаблоны EJS (`<%= title %>`) — простая и понятная логика.

📦 Установка:

```bash
npm install --save-dev gulp-ejs
```

---

## 🧾 Краткая таблица:

| Плагин                 | Особенности                          |
| ---------------------- | ------------------------------------ |
| `gulp-file-include`    | Простой `@@include`, без логики      |
| `gulp-nunjucks-render` | Шаблоны с логикой, циклы, переменные |
| `gulp-pug`             | Лаконичный синтаксис, шаблоны        |
| `gulp-ejs`             | JS-подобная логика в шаблонах        |

---

## ✅ Что выбрать новичку?

\| Хочешь быстро и просто — бери `gulp-file-include`
\| Хочешь мощь шаблонов и динамику — `gulp-nunjucks-render`
\| Любишь чистоту и короткие конструкции — `gulp-pug`

---

💬 Напиши, какой вариант тебе интересен — и я соберу тебе `gulpfile.js` с рабочим примером, всё по новой версии Gulp 5. Хоть с `series`, хоть с `parallel`, хоть с `watch` и BrowserSync.
