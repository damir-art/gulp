# project-1
Дорабатываем стандартный рабочий шаблон: изображения минификация, прочие моменты.

Вставляем эти плагины:
- gulp-imagemin - удаляет мусор из JPG, PNG, SVG и т.д., уменьшает размер.
- gulp-webp - создаёт .webp и .avif версии картинок
- gulp-avif - создаёт .webp и .avif версии картинок
- gulp-rename - добавляет .min, версии, меняет расширение
- gulp-htmlmin - удаляет лишние пробелы, переносы, комментарии

Проверка новых изображений?

```bash
npm install --save-dev gulp-imagemin
npm install --save-dev gulp-webp
npm install --save-dev gulp-avif
npm install --save-dev gulp-htmlmin

npm install --save-dev gulp-imagemin gulp-webp gulp-avif gulp-rename gulp-htmlmin
```

Копирование шрифтов (ничего ставить не нужно):

```js
export function fonts() {
  return src('src/fonts/**/*.{woff,woff2,ttf,otf}', { encoding: false })
    .pipe(dest('dist/fonts'));
}
```

Задачи convertWebp и convertAvif, можно вызывать отдельно:
```bash
npx gulp convertWebp
npx gulp convertAvif
```

Рабочий gulpfile.js:
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

const browserSync = browserSyncLib.create();
const sass = gulpSass(dartSass);

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
  return src(paths.html.src)
    .pipe(plumber()) // Обработка ошибок
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true })) // Минификация HTML
    .pipe(dest(paths.html.dest))
    .pipe(browserSync.stream());
}

// Компиляция SCSS, автопрефиксер, минификация, source maps, обработка ошибок
export function scssTask() {
  return src(paths.scss.src)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
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
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.css.dest))
    .pipe(browserSync.stream());
}

// Копирование и минификация JS с обработкой ошибок и source maps
export function js() {
  return src(paths.js.src)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(terser())
    .pipe(sourcemaps.write('.'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(paths.js.dest))
    .pipe(browserSync.stream());
}

// Копирование изображений (можно добавить минификацию через gulp-imagemin)
export function images() {
  return src(paths.images.src, { encoding: false })
    // .pipe(imagemin()) // Сделаем код для продакшена, до этого не минимизируем
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
export const build = series(
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

Вот это настрой, Даян! 🛠️
Ты не просто юзаешь Gulp — ты его **приручаешь**. Ниже я тебе собрал **шпаргалку по каждому плагину**, чтобы ты мог вставлять по частям, без запары.

---

## 📦 1. `gulp-imagemin`

### 🔧 Установка:

```bash
npm install --save-dev gulp-imagemin
```

### 🧩 Импорт:

```js
import imagemin from 'gulp-imagemin';
```

### 🔁 Заменить `images()`:

```js
export function images() {
  return src(paths.images.src, { encoding: false })
    .pipe(imagemin())
    .pipe(dest(paths.images.dest));
}
```

---

## 📦 2. `gulp-webp`

### 🔧 Установка:

```bash
npm install --save-dev gulp-webp
```

### 🧩 Импорт:

```js
import webp from 'gulp-webp';
```

### 🔁 Новая задача:

```js
export function convertWebp() {
  return src(paths.images.src, { encoding: false })
    .pipe(webp())
    .pipe(dest(paths.images.dest));
}
```
Можно задать качество .pipe(webp({ quality: 90 })), по-умолчанию 70:
- Если это фото или баннер — 70–80 норм
- Если это лого, иконки, UI — лучше 90+
- Если прям совсем нельзя терять — оставляй PNG

---

## 📦 3. `gulp-avif`

### 🔧 Установка:

```bash
npm install --save-dev gulp-avif
```

### 🧩 Импорт:

```js
import avif from 'gulp-avif';
```

### 🔁 Новая задача:

```js
export function convertAvif() {
  return src(paths.images.src, { encoding: false })
    .pipe(avif())
    .pipe(dest(paths.images.dest));
}
```

---

## 📦 4. `gulp-rename`

### 🔧 Установка:

```bash
npm install --save-dev gulp-rename
```

### 🧩 Импорт:

```js
import rename from 'gulp-rename';
```

### 🔁 Добавь в SCSS задачу:

Пример:

```js
.pipe(rename({ suffix: '.min' }))
.pipe(dest(paths.scss.dest))
```

---

## 📦 5. `gulp-htmlmin`

### 🔧 Установка:

```bash
npm install --save-dev gulp-htmlmin
```

### 🧩 Импорт:

```js
import htmlmin from 'gulp-htmlmin';
```

### 🔁 Обнови `html()`:

```js
export function html() {
  return src(paths.html.src)
    .pipe(plumber())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest(paths.html.dest))
    .pipe(browserSync.stream());
}
```

---

Если где-то споткнёшься — зови. Можем потом даже добавить `NODE_ENV=production` и переключать поведение с `gulp-if`.
Ты уже близок к созданию своей идеальной сборки 💪


Страница составлена грамотно и полезно для практики с Gulp.  
Вот несколько замечаний и советов:

---

### Плюсы:
- Указаны нужные плагины для оптимизации изображений и HTML.
- Приведены команды установки npm.
- Есть пример задачи для копирования шрифтов с `{ encoding: false }` — это правильно для Gulp 5+.

---

### Что можно улучшить или добавить:

1. **Установка плагинов:**  
   Достаточно одной строки с установкой всех плагинов, как у вас внизу.  
   Можно оставить только её для краткости.

2. **Пример задачи для минификации HTML:**  
   Добавьте пример использования `gulp-htmlmin`, чтобы было понятно, как его применять:

   ```js
   import htmlmin from 'gulp-htmlmin';

   export function html() {
     return src('src/**/*.html')
       .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
       .pipe(dest('dist/'));
   }
   ```

3. **Пример задачи для минификации и конвертации изображений:**  
   Можно добавить пример с imagemin, webp и avif:

   ```js
   import imagemin from 'gulp-imagemin';
   import webp from 'gulp-webp';
   import avif from 'gulp-avif';

   export function images() {
     return src('src/img/**/*.{jpg,jpeg,png,svg,gif,webp}', { encoding: false })
       .pipe(imagemin())
       .pipe(dest('dist/img'));
   }

   export function webpImages() {
     return src('src/img/**/*.{jpg,jpeg,png}', { encoding: false })
       .pipe(webp())
       .pipe(dest('dist/img'));
   }

   export function avifImages() {
     return src('src/img/**/*.{jpg,jpeg,png}', { encoding: false })
       .pipe(avif())
       .pipe(dest('dist/img'));
   }
   ```

4. **Про шрифты:**  
   Всё верно, для копирования шрифтов ничего дополнительно ставить не нужно.

---

**Вывод:**  
Страница полезная, всё по делу.  
Добавьте примеры задач для новых плагинов — это сделает материал ещё практичнее!  
Если нужно — могу подготовить полный пример gulpfile.js с этими задачами.

Можно подробнее про Prod/Dev-флаг в gulpfile.js и плагин critical, зачем нужны что делают?
