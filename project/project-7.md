# Дорабатываем assets
Фавиконки грузятся в дист с ошибкой иза отсутствия: `{ encoding: false }`.  
Также сократили код который запускает dev и build.

Gulp по умолчанию читает файлы как текст (UTF-8), а бинарные файлы (например .ico, .woff, .webm) при этом портятся. Чтобы этого не происходило, нужно явно указать.

Получается надо удалить таск переноса из assets и создать таски отдельно для иконок, шрифтов и видео?

Проблема действительно была в **неправильной кодировке потока**. И вот снова та же история — но теперь с фавиконками из `assets`.

---

Полностью рабочий код:

```js
// ✅ Добавлены переменные srcFolder и distFolder
const srcFolder = 'src';
const distFolder = 'dist';

// Импортируем Gulp и современные плагины (ES-модули)
import { src, dest, watch, series, parallel } from 'gulp';
import browserSyncLib from 'browser-sync';
import { deleteAsync } from 'del';
import gulpSass from 'gulp-sass';
import * as dartSass from 'sass';
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import terser from 'gulp-terser';
import plumber from 'gulp-plumber';
import sourcemaps from 'gulp-sourcemaps';
import imagemin from 'gulp-imagemin';
import webp from 'gulp-webp';
import avif from 'gulp-avif';
import rename from 'gulp-rename';
import gulpIf from 'gulp-if';
import pug from 'gulp-pug';
import groupMediaQueries from 'gulp-group-css-media-queries';

const browserSync = browserSyncLib.create();
const sass = gulpSass(dartSass);

const isProd = process.env.NODE_ENV === 'production';
console.log(`⚙️  Gulp running in ${isProd ? '🚀 production' : '🧪 development'} mode`);

const paths = {
  assets: {
    src: `${srcFolder}/assets/**/*`,
    base: `${srcFolder}/assets`,
    dest: `${distFolder}/`
  },
  pug: {
    src: `${srcFolder}/pug/**/*.pug`,
    pages: `${srcFolder}/pug/pages/*.pug`,
    dest: `${distFolder}/`
  },
  scss: {
    src: `${srcFolder}/scss/**/*.scss`,
    dest: `${distFolder}/css/`
  },
  js: {
    src: `${srcFolder}/js/**/*.js`,
    dest: `${distFolder}/js/`
  },
  images: {
    src: `${srcFolder}/img/**/*.{jpg,jpeg,png,svg,gif,webp}`,
    dest: `${distFolder}/img/`
  }
};

// 🧹 clean → cleanDist
export function cleanDist() {
  return deleteAsync([distFolder]);
}

// 📦 assets → copyAssets
export function copyAssets() {
  return src(paths.assets.src, { base: paths.assets.base, encoding: false })
    .pipe(dest(paths.assets.dest));
}

// 🧱 pugToHtml → compilePug
export function compilePug() {
  return src(paths.pug.pages)
    .pipe(plumber())
    .pipe(pug({ pretty: !isProd }))
    .pipe(dest(paths.pug.dest))
    .pipe(browserSync.stream());
}

// 🎨 scssTask → compileScss
export function compileScss() {
  return src(paths.scss.src)
    .pipe(plumber())
    .pipe(gulpIf(!isProd, sourcemaps.init()))         // ✅ Только для dev: инициализация sourcemaps
    .pipe(sass().on('error', sass.logError))
    .pipe(groupMediaQueries())
    .pipe(autoprefixer())
    .pipe(gulpIf(isProd, cleanCSS()))                 // ✅ Только для prod: минификация CSS
    .pipe(gulpIf(!isProd, sourcemaps.write('.')))     // ✅ Только для dev: запись sourcemaps
    .pipe(gulpIf(isProd, rename({ suffix: '.min' }))) // ✅ Только для prod: добавляем суффикс .min
    .pipe(dest(paths.scss.dest))
    .pipe(browserSync.stream());
}

// ⚙️ js → processJs
export function processJs() {
  return src(paths.js.src)
    .pipe(plumber())
    .pipe(gulpIf(!isProd, sourcemaps.init()))         // ✅ Только для dev: инициализация sourcemaps
    .pipe(gulpIf(isProd, terser()))                   // ✅ Только для prod: минификация JS
    .pipe(gulpIf(!isProd, sourcemaps.write('.')))     // ✅ Только для dev: запись sourcemaps
    .pipe(gulpIf(isProd, rename({ suffix: '.min' }))) // ✅ Только для prod: добавляем суффикс .min
    .pipe(dest(paths.js.dest))
    .pipe(browserSync.stream());
}

// 🖼 images → processImages
export function processImages() {
  return src(paths.images.src, { encoding: false })
    .pipe(gulpIf(isProd, imagemin()))
    .pipe(dest(paths.images.dest));
}

// 💾 convertWebp — без изменений
export function convertWebp() {
  return src(paths.images.src, { encoding: false })
    .pipe(webp())
    .pipe(dest(paths.images.dest));
}

// 💾 convertAvif — без изменений
export function convertAvif() {
  return src(paths.images.src, { encoding: false })
    .pipe(avif())
    .pipe(dest(paths.images.dest));
}

// 🔁 serve — без изменений
export function serve() {
  browserSync.init({
    server: {
      baseDir: distFolder
    },
    notify: false,
    port: 3000
  });

  watch(paths.assets.src, { ignoreInitial: false }, copyAssets);
  watch(paths.pug.src, { ignoreInitial: false }, compilePug);
  watch(paths.scss.src, { ignoreInitial: false }, compileScss);
  watch(paths.js.src, { ignoreInitial: false }, processJs);
  watch(paths.images.src, { ignoreInitial: false }, processImages);
}

// 🧱 npm run build: build - для production
export const build = series(
  cleanDist,
  parallel(copyAssets, compilePug, compileScss, processJs, processImages, convertWebp, convertAvif)
);

// 🚀 npm run dev: default — для разработки
export default series(
  cleanDist,
  parallel(copyAssets, compilePug, compileScss, processJs, processImages),
  serve
);
```

Тоже самое но с комментариями:

```js
// ✅ Добавлены переменные srcFolder и distFolder
const srcFolder = 'src';      // Папка исходников
const distFolder = 'dist';    // Папка сборки

// Импортируем Gulp и современные плагины (ES-модули)
import { src, dest, watch, series, parallel } from 'gulp'; // Основные функции Gulp
import browserSyncLib from 'browser-sync';                 // Live-reload сервер
import { deleteAsync } from 'del';                         // Удаление файлов/папок
import gulpSass from 'gulp-sass';                          // Компилятор SCSS
import * as dartSass from 'sass';                          // Движок Sass
import autoprefixer from 'gulp-autoprefixer';              // Автоматические префиксы для CSS
import cleanCSS from 'gulp-clean-css';                     // Минификация CSS
import terser from 'gulp-terser';                          // Минификация JS
import plumber from 'gulp-plumber';                        // Защита от ошибок в потоках
import sourcemaps from 'gulp-sourcemaps';                  // Source maps для отладки
import imagemin from 'gulp-imagemin';                      // Оптимизация изображений
import webp from 'gulp-webp';                              // Конвертация в WebP
import avif from 'gulp-avif';                              // Конвертация в AVIF
import rename from 'gulp-rename';                          // Переименование файлов
import gulpIf from 'gulp-if';                              // Условные операции в потоках
import pug from 'gulp-pug';                                // Компиляция Pug в HTML
import groupMediaQueries from 'gulp-group-css-media-queries'; // Группировка медиа-запросов

const browserSync = browserSyncLib.create();               // Инициализация BrowserSync
const sass = gulpSass(dartSass);                           // Инициализация Sass

const isProd = process.env.NODE_ENV === 'production';      // Определение режима сборки
console.log(`⚙️  Gulp running in ${isProd ? '🚀 production' : '🧪 development'} mode`); // Лог текущего режима

// Пути к файлам проекта
const paths = {
  assets: {
    src: `${srcFolder}/assets/**/*`,      // Все файлы в assets
    base: `${srcFolder}/assets`,          // Базовая папка для копирования
    dest: `${distFolder}/`                // Куда копировать assets
  },
  pug: {
    src: `${srcFolder}/pug/**/*.pug`,     // Все pug-файлы
    pages: `${srcFolder}/pug/pages/*.pug`,// Только страницы pug
    dest: `${distFolder}/`                // Куда складывать HTML
  },
  scss: {
    src: `${srcFolder}/scss/**/*.scss`,   // Все SCSS-файлы
    dest: `${distFolder}/css/`            // Куда складывать CSS
  },
  js: {
    src: `${srcFolder}/js/**/*.js`,       // Все JS-файлы
    dest: `${distFolder}/js/`             // Куда складывать JS
  },
  images: {
    src: `${srcFolder}/img/**/*.{jpg,jpeg,png,svg,gif,webp}`, // Все изображения
    dest: `${distFolder}/img/`            // Куда складывать изображения
  }
};

// 🧹 clean → cleanDist
// Очищает папку сборки dist перед новой сборкой
export function cleanDist() {
  return deleteAsync([distFolder]); // Удаляет папку dist
}

// 📦 assets → copyAssets
// Копирует все файлы из assets в папку сборки
export function copyAssets() {
  return src(paths.assets.src, { base: paths.assets.base, encoding: false }) // Берет все файлы из assets
    .pipe(dest(paths.assets.dest)); // Копирует в dist
}

// 🧱 pugToHtml → compilePug
// Компилирует Pug-файлы в HTML
export function compilePug() {
  return src(paths.pug.pages) // Берет только страницы pug
    .pipe(plumber())          // Защита от ошибок
    .pipe(pug({ pretty: !isProd })) // Компиляция Pug, форматирование только в dev
    .pipe(dest(paths.pug.dest))     // Кладет HTML в dist
    .pipe(browserSync.stream());    // Обновляет страницу при изменениях
}

// 🎨 scssTask → compileScss
// Компилирует SCSS в CSS, добавляет префиксы, минифицирует и пишет sourcemaps
export function compileScss() {
  return src(paths.scss.src)                // Берет все SCSS
    .pipe(plumber())                        // Защита от ошибок
    .pipe(gulpIf(!isProd, sourcemaps.init())) // Sourcemaps только для dev
    .pipe(sass().on('error', sass.logError)) // Компиляция SCSS
    .pipe(groupMediaQueries())              // Группировка медиа-запросов
    .pipe(autoprefixer())                   // Префиксы для CSS
    .pipe(gulpIf(isProd, cleanCSS()))       // Минификация только для prod
    .pipe(gulpIf(!isProd, sourcemaps.write('.'))) // Запись sourcemaps только для dev
    .pipe(gulpIf(isProd, rename({ suffix: '.min' }))) // Суффикс .min только для prod
    .pipe(dest(paths.scss.dest))            // Кладет CSS в dist
    .pipe(browserSync.stream());            // Обновляет страницу при изменениях
}

// ⚙️ js → processJs
// Минифицирует JS, пишет sourcemaps, добавляет суффикс .min
export function processJs() {
  return src(paths.js.src)                  // Берет все JS
    .pipe(plumber())                        // Защита от ошибок
    .pipe(gulpIf(!isProd, sourcemaps.init())) // Sourcemaps только для dev
    .pipe(gulpIf(isProd, terser()))         // Минификация только для prod
    .pipe(gulpIf(!isProd, sourcemaps.write('.'))) // Запись sourcemaps только для dev
    .pipe(gulpIf(isProd, rename({ suffix: '.min' }))) // Суффикс .min только для prod
    .pipe(dest(paths.js.dest))              // Кладет JS в dist
    .pipe(browserSync.stream());            // Обновляет страницу при изменениях
}

// 🖼 images → processImages
// Оптимизирует изображения (только для prod)
export function processImages() {
  return src(paths.images.src, { encoding: false }) // Берет все изображения
    .pipe(gulpIf(isProd, imagemin()))              // Оптимизация только для prod
    .pipe(dest(paths.images.dest));                // Кладет изображения в dist
}

// 💾 convertWebp — конвертирует изображения в формат WebP
export function convertWebp() {
  return src(paths.images.src, { encoding: false }) // Берет все изображения
    .pipe(webp())                                  // Конвертация в WebP
    .pipe(dest(paths.images.dest));                 // Кладет WebP в dist
}

// 💾 convertAvif — конвертирует изображения в формат AVIF
export function convertAvif() {
  return src(paths.images.src, { encoding: false }) // Берет все изображения
    .pipe(avif())                                  // Конвертация в AVIF
    .pipe(dest(paths.images.dest));                 // Кладет AVIF в dist
}

// 🔁 serve — запускает локальный сервер и следит за изменениями файлов
export function serve() {
  browserSync.init({
    server: {
      baseDir: distFolder // Корневая папка для сервера
    },
    notify: false,        // Отключает уведомления
    port: 3000            // Порт сервера
  });

  // Следит за изменениями файлов и запускает соответствующие задачи
  watch(paths.assets.src, { ignoreInitial: false }, copyAssets);      // assets
  watch(paths.pug.src, { ignoreInitial: false }, compilePug);         // pug
  watch(paths.scss.src, { ignoreInitial: false }, compileScss);       // scss
  watch(paths.js.src, { ignoreInitial: false }, processJs);           // js
  watch(paths.images.src, { ignoreInitial: false }, processImages);   // images
}

// 🧱 build — основная задача сборки (разделяет dev/prod)
export const build = series(
  cleanDist, // Очищает dist
  parallel(copyAssets, compilePug, compileScss, processJs, processImages, convertWebp, convertAvif) // Основные задачи
);

// 🚀 default — задача по умолчанию (с сервером и вотчерами)
export default series(
  cleanDist, // Очищает dist
  parallel(copyAssets, compilePug, compileScss, processJs, processImages), // Основные задачи
  serve // Запускает сервер и вотчеры
);

```
---

## 📌 В чём суть?

Gulp по умолчанию читает файлы как текст (UTF-8), а **бинарные файлы (например `.ico`, `.woff`, `.webm`) при этом портятся**. Чтобы этого не происходило, нужно явно указать:

```js
{ encoding: false }
```

при копировании ассетов.

---

## 🔧 Как исправить `copyAssets()` правильно

Открой `gulpfile.js` и найди:

```js
return src(paths.assets.src, { base: paths.assets.base })
```

замени на:

```js
return src(paths.assets.src, { base: paths.assets.base, encoding: false })
```

---

## ✅ Теперь будет работать правильно:

* `.ico`, `.woff2`, `.mp4`, `.webm`, `.ttf`, `.otf`, `.png` и т.д.
* ничего не ломается, не превращается в битые фавиконки и глюкавые шрифты

---

## 💬 Хочешь — добавим отдельную таску `copyFonts()`, `copyFavicon()` или разбивку внутри `assets`?

А то если у тебя там иконки, шрифты и видео — можно сделать по таске на каждый тип для удобства 💪

---

Добавки от копилота:

Вот краткий аудит и рекомендации по вашему gulpfile.js:

### 1. **Ошибки не обнаружены**
Код структурирован, импорты корректны, задачи названы понятно, переменные используются правильно.

### 2. **Рекомендации по улучшению**

#### 2.1. **Пути для изображений**
- В `paths.images.src` вы не включаете форматы `.avif` и `.webp` для конвертации. Это ок, если исходники только jpg/png/svg/gif, но если исходники уже содержат webp/avif, возможно, стоит их исключить из конвертации.

#### 2.2. **Кэширование изображений**
- Для ускорения сборки можно добавить кэширование изображений с помощью [gulp-cached](https://www.npmjs.com/package/gulp-cached) или [gulp-newer](https://www.npmjs.com/package/gulp-newer).

#### 2.3. **Обработка ошибок**
- Везде используется `plumber`, это хорошо. Можно добавить уведомления через [gulp-notify](https://www.npmjs.com/package/gulp-notify) для более информативных ошибок.

#### 2.4. **Source Maps для production**
- Обычно sourcemaps нужны только для dev, но иногда их оставляют и для prod (например, для отладки). Сейчас у вас всё правильно.

#### 2.5. **Автоматическая очистка старых файлов**
- После конвертации webp/avif старые версии файлов остаются. Можно добавить задачу для очистки старых webp/avif перед конвертацией.

#### 2.6. **Обработка HTML после Pug**
- Если в проекте есть отдельные HTML-файлы, их стоит добавить в сборку.

#### 2.7. **Обработка SVG-спрайтов**
- Если используете SVG-спрайты, можно добавить задачу для их генерации.

#### 2.8. **Возможные зависимости**
- Проверьте, что все плагины установлены в `package.json`.

### 3. **Мелкие улучшения**

- В `serve` можно добавить автооткрытие браузера:  
  ```javascript
  browserSync.init({
    server: { baseDir: distFolder },
    notify: false,
    port: 3000,
    open: true // откроет браузер автоматически
  });
  ```
- В `processImages` можно добавить обработку ошибок через plumber:
  ```javascript
  export function processImages() {
    return src(paths.images.src, { encoding: false })
      .pipe(plumber())
      .pipe(gulpIf(isProd, imagemin()))
      .pipe(dest(paths.images.dest));
  }
  ```

### 4. **Документация**
- Добавьте краткое описание задач в начале файла для новых участников команды.

---

**В целом ваш gulpfile.js написан грамотно и современно. Ошибок не обнаружено, только рекомендации по улучшению и расширению функционала.**
