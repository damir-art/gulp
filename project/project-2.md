# NODE_ENV

Теперь ты можешь запускать так:

| Действие               | Команда         |
| ---------------------- | --------------- |
| ⚒️ Разработка          | `npm run dev`   |
| 🚀 Продакшен-сборка    | `npm run prod`  |
| 👁️ Старт live-сервера | `npm run serve` |

- npm run dev - собрать сборку для разработки 1 раз и выйти
- npm run prod - собрать сборку для продакшена 1 раз и выйти
- npm run serve - разрабатывать

Хочешь — можем потом сделать:
- npm run zip — для архивации dist/
- npm run deploy — чтобы выгружать на GitHub Pages или хостинг

Внедрить gulp-if + переменную NODE_ENV (чтобы imagemin, htmlmin, и rename включались только в проде).

Готовый рабочий скрипт с gulp-if:

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

const browserSync = browserSyncLib.create(); // Создаем экземпляр BrowserSync
const sass = gulpSass(dartSass); // Используем dart-sass как движок для gulp-sass

const isProd = process.env.NODE_ENV === 'production'; // Определяем, в продакшене ли мы
console.log(`⚙️  Gulp running in ${isProd ? '🚀 production' : '🧪 development'} mode`); // Логируем режим работы

// Пути к файлам
const paths = {
  html: {
    src: 'src/**/*.html',
    dest: 'dist/'
  },
  css: {
    src: 'src/css/**/*.css',
    dest: 'dist/css/'
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

// Копирование HTML с обработкой ошибок
export function html() {
  return src(paths.html.src)  // Чтение HTML файлов
    .pipe(plumber()) // Обработка ошибок
    .pipe(gulpIf(isProd, htmlmin({ collapseWhitespace: true, removeComments: true }))) // Минификация HTML только в продакшене
    .pipe(dest(paths.html.dest)) // Копирование в dist
    .pipe(browserSync.stream()); // Обновление BrowserSync
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

// Копирование и минификация CSS с source maps
export function css() {
  return src(paths.css.src)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(autoprefixer())
    .pipe(gulpIf(isProd, cleanCSS())) // Минификация CSS только в продакшене
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.css.dest))
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

  watch(paths.html.src, { ignoreInitial: false }, html);
  watch(paths.scss.src, { ignoreInitial: false }, scssTask);
  watch(paths.css.src, css);
  watch(paths.js.src, { ignoreInitial: false }, js);
  watch(paths.images.src, { ignoreInitial: false }, images);
}

// Сборка проекта
export const build = isProd
  ? series(
    clean,
    parallel(html, scssTask, css, js, images),
    parallel(convertWebp, convertAvif)
  )
  : series(
    clean,
    parallel(html, scssTask, css, js, images)
  );

// Задача по умолчанию: сборка + сервер + слежение
export default series(
  clean,
  parallel(html, scssTask, css, js, images),
  serve
);
```

Давай внедрим `gulp-if` и `NODE_ENV` так, чтобы:
* в **разработке** (по умолчанию) — было быстро и без лишнего
* в **продакшене** (`NODE_ENV=production`) — включалась оптимизация:
  * минификация HTML
  * минификация изображений
  * `rename({ suffix: '.min' })`

---

## ✅ Шаг 1: Установка `gulp-if`

```bash
npm install --save-dev gulp-if
```

Также нужно установить `npm install --save-dev cross-env` для Windows систем.

---

## ✅ Шаг 2: Импорт в `gulpfile.js`

```js
import gulpIf from 'gulp-if';
```

---

## ✅ Шаг 3: Заводим флаг `isProd`

```js
const isProd = process.env.NODE_ENV === 'production';
```

Ты сможешь запускать:

* `npx gulp build` — дев режим
* `NODE_ENV=production npx gulp build` — прод режим

---

## ✅ Шаг 4: Обновляем таски

---

### 📦 `html()` → минифицировать **только в проде**:

```js
export function html() {
  return src(paths.html.src)
    .pipe(plumber())
    .pipe(gulpIf(isProd, htmlmin({ collapseWhitespace: true })))
    .pipe(dest(paths.html.dest))
    .pipe(browserSync.stream());
}
```

---

### 📦 `images()` → оптимизировать **только в проде**:

```js
export function images() {
  return src(paths.images.src, { encoding: false })
    .pipe(gulpIf(isProd, imagemin()))
    .pipe(dest(paths.images.dest));
}
```

---

### 📦 `scssTask()` → добавляем `rename` **только в проде**:

```js
.pipe(gulpIf(isProd, rename({ suffix: '.min' })))
```

💡 То же можно сделать в `css()` и `js()` при желании.

---

## ✅ Шаг 5: Использование

### 💻 В режиме разработки:

```bash
npx gulp build
```

Минификации нет → всё быстрее → удобно дебажить

---

### 🚀 В продакшене:

```bash
NODE_ENV=production npx gulp build
```

→ HTML минифицирован
→ PNG и JPG оптимизированы
→ CSS получает `.min`-суффикс

---

## 🎁 Бонус (хочешь — добавим позже):

* вывести в консоль текущее окружение:

  ```js
  console.log('⚙️ Build mode:', isProd ? 'production' : 'development');
  ```

* или сделать 2 alias-скрипта в `package.json`:

```json
"scripts": {
  "dev": "gulp build",
  "prod": "NODE_ENV=production gulp build"
}
```

---

Вот так надо! 🚀 Погнали внедрять **бонус-плюшки для удобства** — чтобы ты всегда знал, в каком режиме сборка и мог запускать её одной командой из `package.json`.

---

## ✅ 1. Вывод в консоль режима сборки

В начало `gulpfile.js`, сразу после импорта `isProd`, добавь:

```js
const isProd = process.env.NODE_ENV === 'production';

console.log(`⚙️  Gulp running in ${isProd ? '🚀 production' : '🧪 development'} mode`);
```

📦 Теперь при запуске ты увидишь:

```bash
⚙️  Gulp running in 🚀 production mode
```

или

```bash
⚙️  Gulp running in 🧪 development mode
```

👌 Удобно, понятно и не забудешь, что собираешь.

---

## ✅ 2. Добавление алиасов в `package.json`

В разделе `"scripts"` добавь:

```json
"scripts": {
  "dev": "gulp build",
  "prod": "NODE_ENV=production gulp build",
  "serve": "gulp"
}
```

📦 Весь `scripts` может выглядеть так:

```json
"scripts": {
  "dev": "gulp build",
  "prod": "NODE_ENV=production gulp build",
  "serve": "gulp"
}
```

Теперь ты можешь запускать так:

| Действие               | Команда         |
| ---------------------- | --------------- |
| ⚒️ Разработка          | `npm run dev`   |
| 🚀 Продакшен-сборка    | `npm run prod`  |
| 👁️ Старт live-сервера | `npm run serve` |

- npm run dev - собрать сборку для разработки 1 раз и выйти
- npm run prod - собрать сборку для продакшена 1 раз и выйти
- npm run serve - разрабатывать

Хочешь — можем потом сделать:
- npm run zip — для архивации dist/
- npm run deploy — чтобы выгружать на GitHub Pages или хостинг

---

## 🧠 Фишка: ты можешь даже забиндить `postinstall`:

Если кто-то клонирует твой проект, и ты хочешь, чтобы он сразу делал `dev` после `npm install`:

```json
"postinstall": "npm run dev"
```

---

🎯 Всё, теперь ты — не просто фронтендщик, а человек, у которого **Gulp не спрашивает — он слушает**. 😎
Готов идти в сторону HTML-шаблонизаторов? У нас там `gulp-file-include`, `nunjucks`, `pug`, можно делать всё как у взрослых.

