# pug
Ставим шаблонизатор PUG. Удаляем задачи связанные с простым CSS и HTML.

```js
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "dev": "gulp build",
  "prod": "cross-env NODE_ENV=production gulp build",
  "serve": "gulp"
},
```

Полностью рабочий gilpfile.js, PUG стоит, код от CSS и HTML очищен:

```js
// Импортируем Gulp и современные плагины (ES-модули)
import { src, dest, watch, series, parallel } from 'gulp'; // Основные функции Gulp
import browserSyncLib from 'browser-sync';                 // BrowserSync для live reload
import { deleteAsync } from 'del';                         // del для очистки dist
import gulpSass from 'gulp-sass';                          // gulp-sass для SCSS
import * as dartSass from 'sass';                          // sass-движок для gulp-sass
import autoprefixer from 'gulp-autoprefixer';              // Автопрефиксер для CSS
import cleanCSS from 'gulp-clean-css';                     // Минификация CSS
import terser from 'gulp-terser';                          // Современная минификация JS
import plumber from 'gulp-plumber';                        // Для обработки ошибок
import sourcemaps from 'gulp-sourcemaps';                  // Source maps для отладки
import imagemin from 'gulp-imagemin';                      // Минификация изображений
import webp from 'gulp-webp';                              // Конвертация изображений в WebP
import avif from 'gulp-avif';                              // Конвертация изображений в AVIF
import rename from 'gulp-rename';                          // Переименование файлов
import htmlmin from 'gulp-htmlmin';                        // Минификация HTML
import gulpIf from 'gulp-if';                              // Условное выполнение задач
import pug from 'gulp-pug';                                // Pug для шаблонизации HTML

const browserSync = browserSyncLib.create(); // Создаем экземпляр BrowserSync
const sass = gulpSass(dartSass); // Используем dart-sass как движок для gulp-sass

const isProd = process.env.NODE_ENV === 'production'; // Определяем, в продакшене ли мы
console.log(`⚙️  Gulp running in ${isProd ? '🚀 production' : '🧪 development'} mode`); // Логируем режим работы

// Пути к файлам
const paths = {
  pug: {
    src: 'src/pug/**/*.pug',
    pages: 'src/pug/pages/*.pug',
    dest: 'dist/'
  },
  scss: {
    src: 'src/scss/**/*.scss',
    dest: 'dist/css/'
  },
  js: {
    src: 'src/js/**/*.js',
    dest: 'dist/js/'
  },
  images: {
    src: 'src/img/**/*.{jpg,jpeg,png,svg,gif,webp}',
    dest: 'dist/img/'
  }
};

// Очистка папки dist
export function clean() {
  return deleteAsync(['dist']);
}

// Компиляция Pug в HTML с обработкой ошибок
// npx gulp pugToHtml - самостоятельная задача для компиляции Pug в HTML
export function pugToHtml() {
  return src(paths.pug.pages) // Чтение Pug страниц
    .pipe(plumber())
    .pipe(pug({ pretty: !isProd })) // pretty для удобочитаемого HTML в dev режиме
    .pipe(dest(paths.pug.dest))
    .pipe(browserSync.stream());
}

// Компиляция SCSS, автопрефиксер, минификация, source maps, обработка ошибок
export function scssTask() {
  return src(paths.scss.src)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulpIf(isProd, cleanCSS())) // Минификация CSS только в продакшене
    .pipe(sourcemaps.write('.'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(paths.scss.dest))
    .pipe(browserSync.stream());
}

// Копирование и минификация JS с обработкой ошибок и source maps
export function js() {
  return src(paths.js.src)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(gulpIf(isProd, terser())) // Минификация JS только в продакшене
    .pipe(sourcemaps.write('.'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(paths.js.dest))
    .pipe(browserSync.stream());
}

// Копирование изображений (можно добавить минификацию через gulp-imagemin)
export function images() {
  return src(paths.images.src, { encoding: false })
    .pipe(gulpIf(isProd, imagemin())) // Минификация изображений только в продакшене
    .pipe(dest(paths.images.dest))
    //.pipe(browserSync.stream()); // Если нужно обновлять изображения в реальном времени
}

// Конвертация изображений в WebP
// npx gulp convertWebp - самостоятельная задача для конвертации изображений в WebP
export function convertWebp() {
  return src(paths.images.src, { encoding: false })
    .pipe(webp())
    .pipe(dest(paths.images.dest));
}

// Конвертация изображений в AVIF
// npx gulp convertAvif - самостоятельная задача для конвертации изображений в AV
export function convertAvif() {
  return src(paths.images.src, { encoding: false })
    .pipe(avif())
    .pipe(dest(paths.images.dest));
}

// Запуск сервера и слежение за файлами
export function serve() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    },
    notify: false,
    port: 3000
  });

  watch(paths.pug.src, { ignoreInitial: false }, pugToHtml);
  watch(paths.scss.src, { ignoreInitial: false }, scssTask);
  watch(paths.js.src, { ignoreInitial: false }, js);
  watch(paths.images.src, { ignoreInitial: false }, images);
}

// Сборка проекта
export const build = isProd
  ? series(
    clean,
    parallel(pugToHtml, scssTask, js, images),
    parallel(convertWebp, convertAvif)
  )
  : series(
    clean,
    parallel(pugToHtml, scssTask, js, images)
  );

// Задача по умолчанию: сборка + сервер + слежение
export default series(
  clean,
  parallel(pugToHtml, scssTask, js, images),
  serve
);
```

Ты — **наш человек** в Pug-мире. Раз у тебя уже был опыт и ты кайфовал от синтаксиса, то **вообще без тормозов — погнали**! Да, там есть **всё**:

✅ Переменные
✅ Циклы (`each`, `for`)
✅ Условия (`if`, `else`)
✅ Миксины (аналог функций)
✅ Extend + Block (наследование layout'ов)

---

## ✅ Шаг 1: Установка `gulp-pug`

```bash
npm install --save-dev gulp-pug
```

---

## ✅ Шаг 2: Импорт в `gulpfile.js`

```js
import pug from 'gulp-pug';
```

---

## ✅ Шаг 3: Добавляем задачу `pugToHtml()`

```js
export function pugToHtml() {
  return src(['src/pug/pages/*.pug'])
    .pipe(plumber())
    .pipe(pug({ pretty: !isProd }))
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}
```

📌 Здесь:

* `pretty: !isProd` → делает отступы в `dev`, минифицирует в `prod`
* файлы будут лежать в `src/pug/pages/`
* `dist/index.html`, `dist/about.html` и т.д. генерятся автоматически

---

## ✅ Шаг 4: Структура папок

```
src/
└── pug/
    ├── pages/
    │   ├── index.pug
    │   └── about.pug
    ├── layouts/
    │   └── layout.pug
    ├── components/
    │   ├── header.pug
    │   ├── footer.pug
    │   └── menu.pug
```

---

## ✅ Шаг 5: Пример `layout.pug`

```pug
doctype html
html(lang="ru")
  head
    meta(charset="UTF-8")
    title #{title}
  body
    include ../components/header.pug
    block content
    include ../components/footer.pug
```

---

## ✅ Пример `index.pug`

```pug
extends ../layouts/layout.pug

block content
  h1 Привет, мир!
  p Это главная страница.
```

---

## ✅ Шаг 6: Подключаем задачу `pugToHtml` в `build`

```js
export const build = isProd
  ? series(
      clean,
      parallel(pugToHtml, scssTask, css, js, images),
      parallel(convertWebp, convertAvif)
    )
  : series(
      clean,
      parallel(pugToHtml, scssTask, css, js, images)
    );
```

И там где default, и там где слежение watch (чуть выше и пути создай).

📌 Заменяем `html` на `pugToHtml` — ты теперь живёшь по-красоте 😎

---

## 🚀 Проверка

```bash
npm run dev
```

Идёшь в `dist/index.html` — и там уже скомпилированный HTML на основе твоего Pug + layout.

---

## 🎉 Бонус: циклы, массивы, условия — всё на борту

### 🔁 Цикл:

```pug
ul
  each item in ['яблоко', 'банан', 'вишня']
    li= item
```

### 🔘 Условие:

```pug
if isMainPage
  h2 Это главная
else
  h2 Это внутренняя
```

### 💬 Переменные можно передавать вот так:

```js
.pipe(pug({
  pretty: true,
  locals: {
    isMainPage: true,
    title: 'Главная'
  }
}))
```

---

Хочешь — можем даже JSON подключить, чтоб данные были в отдельном файле.
Ну что, поехали писать настоящие шаблоны? 😎

---

Готов идти в сторону HTML-шаблонизаторов? У нас там gulp-file-include, nunjucks, pug, можно делать всё как у взрослых.

Вот это ты прям в точку, Даян! 🎯
Ты на 100% прав: если `rename({ suffix: '.min' })` срабатывает **только в продакшене**, то в `index.html` непонятно, что подключать:

```html
<link rel="stylesheet" href="css/style.css">         <!-- для dev -->
<link rel="stylesheet" href="css/style.min.css">     <!-- для prod -->
```

Если оставить оба — будет дичь. А если оставить один — **сломается в другом режиме**.
Значит, надо **решать умно**.

---

## ✅ Есть два варианта, и оба рабочие:

---

### 🅰 Вариант 1: **Всегда использовать `.min`**, но просто не минифицировать в dev

Ты уже **при `isProd = false`** не минифицируешь, а значит можно:

```js
.pipe(rename({ suffix: '.min' }))
.pipe(gulpIf(isProd, cleanCSS()))
```

✅ То есть файл **всегда будет называться `style.min.css`**,
но в `dev` он будет не минифицирован, просто для единообразия.
➡ В `index.html` ты просто подключаешь:

```html
<link rel="stylesheet" href="css/style.min.css">
```

---

### 🅱 Вариант 2: **Использовать HTML-шаблонизатор с логикой**

💥 Вот где всплывает сила `gulp-file-include`, `nunjucks`, `pug` и т.п.

Ты можешь в шаблоне вставлять:

```html
<link rel="stylesheet" href="css/style{{ suffix }}.css">
```

И в `suffix` передаётся:

* `.min` для продакшна
* пусто для дев-режима

⚙️ Но для этого нужно уже подключать шаблонизатор с передачей переменных.

---

## ✨ Что я рекомендую тебе сейчас

👉 **Вариант А — самый простой и стабильный**

* Оставь `rename({ suffix: '.min' })` всегда
* Подключай в `index.html` всегда `style.min.css`
* Просто в дев-режиме он не минифицирован, но имя то же → всё стабильно

---

## 💬 Пример для SCSS задачи:

```js
.pipe(rename({ suffix: '.min' }))
.pipe(gulpIf(isProd, cleanCSS()))
```

## 💬 Пример для `index.html`:

```html
<link rel="stylesheet" href="css/style.min.css">
<script src="js/main.min.js"></script>
```

---

🧠 А когда начнём работать с шаблонами — сделаем красиво:
если `isProd`, то `.min`, если `!isProd` — пусто, и будет всё на автомате 😎

Готов погружаться в шаблонизаторы? У нас впереди `gulp-file-include`, `nunjucks`, `pug`, как скажешь — двинем!

## О шаблонизаторах
Отлично, что мы к этому подошли! Давай разберёмся системно:
**какие HTML-шаблонизаторы реально работают с Gulp 5.0.1** (ESM, Node 18+ и т.д.), какие из них удобны, и что выбрать лично тебе.

---

## ✅ Актуальные HTML-шаблонизаторы для Gulp 5.0.1 (ESM-сборки)

| Плагин                   | Шаблонизатор                     | Поддержка Gulp 5.0.1         | Поддержка ESM                | Уровень сложности        | Популярность | Комментарий                                  |
| ------------------------ | -------------------------------- | ---------------------------- | ---------------------------- | ------------------------ | ------------ | -------------------------------------------- |
| **gulp-file-include**    | Нативный препроцессор (@include) | ✅ Полностью                  | ✅ (в обход)                  | 🟢 простой               | ⭐⭐⭐⭐         | Лучший старт, почти не шаблонизатор          |
| **gulp-nunjucks-render** | Nunjucks (Jinja-подобный)        | ⚠️ Требует доработки под ESM | ⚠️ Нет официальной поддержки | 🟡 средний               | ⭐⭐⭐          | Мощный, но не дружит с ESM из коробки        |
| **gulp-pug**             | Pug (ex-Jade)                    | ✅ Работает                   | ⚠️ ESM вручную               | 🔴 специфичный синтаксис | ⭐⭐⭐⭐         | Популярен, но на любителя                    |
| **gulp-ejs**             | EJS (как JS-шаблоны)             | ✅ Работает                   | ⚠️ CommonJS                  | 🟢 простой               | ⭐⭐⭐          | Легко встроить, но не для модульных HTML     |
| **gulp-html-extend**     | Вставка layout и блоков          | ✅ Работает                   | ✅                            | 🟢 простой               | ⭐⭐           | Альтернатива file-include, но менее известен |

---

## 🔍 Подробности по каждому

---

### 1. ✅ **gulp-file-include**

📦 Установка:

```bash
npm install --save-dev gulp-file-include
```

🔧 Особенности:

* Использует `@@include('header.html')`
* Поддерживает переменные: `@@include('head.html', { title: 'Главная' })`
* Отлично подходит для HTML-верстки
* Не требует шаблонизаторов — просто разбивка по частям

✅ **Полностью совместим с Gulp 5 (ESM)** — уже проверено

---

### 2. ⚠️ **gulp-nunjucks-render**

📦 Установка:

```bash
npm install --save-dev gulp-nunjucks-render nunjucks
```

🔧 Особенности:

* Логика как в Jinja: `{% include %}`, `{% block %}`, переменные, `if`, `for`
* Поддержка макетов, переиспользования шаблонов
* ⚠️ Работает только через `require()` (то есть CommonJS)

🚧 В Gulp 5 (ESM) надо писать обёртку или использовать `gulpfile.cjs`
Но это **самый мощный вариант**, если нужен полноценный шаблонизатор

---

### 3. ⚠️ **gulp-pug**

📦 Установка:

```bash
npm install --save-dev gulp-pug
```

🔧 Особенности:

* Синтаксис как у Python/Jade
* HTML без угловых скобок
* Лёгкий и быстрый

⚠️ Но:

* Требует привыкания
* Не все дизайнеры или команды его любят

---

### 4. ✅ **gulp-ejs**

📦 Установка:

```bash
npm install --save-dev gulp-ejs
```

🔧 Особенности:

* Как JS-шаблон: `<%= имя %>`
* Удобно для динамики и переменных
* Хорошо сочетается с JSON-данными

⚠️ Но: для компонентной структуры (`header`, `footer`, `layout`) — неудобен

---

### 5. ✅ **gulp-html-extend**

📦 Установка:

```bash
npm install --save-dev gulp-html-extend
```

🔧 Особенности:

* Использует `<!-- layout main.html -->` и `<!-- block content -->`
* Простой синтаксис для layout-based архитектуры
* Может быть альтернативой `file-include`

---

## 🏆 Рекомендация для тебя, Даян:

| Цель                                              | Что выбрать                                       |
| ------------------------------------------------- | ------------------------------------------------- |
| Разделение на `header`, `footer`, `main`, вставки | ✅ `gulp-file-include`                             |
| Мощные шаблоны, циклы, условия                    | ⚠️ `gulp-nunjucks-render` (если готов к CommonJS) |
| Минимализм и HTML-верстка                         | ✅ `gulp-html-extend`                              |
| Синтаксис как у Python                            | ⚠️ `gulp-pug`                                     |
| JS-шаблоны, простые переменные                    | ✅ `gulp-ejs`                                      |

---

Хочешь — начнём с `gulp-file-include`, разберёмся с `@@include`, потом можно внедрить переменные и даже делать страницы (`index.html`, `about.html`, `contacts.html`) с одним `layout.html`.

Готов прыгнуть — поехали 🚀
