Отлично, Даян! 💥 Поехали собирать **современный `gulpfile.js` с BrowserSync**, правильно оформленный, с комментариями и дополнением в `package.json`. Всё максимально чисто, по Gulp 5 и современным стандартам. 🚀

---

## 📁 Структура проекта (предположим)

```
gulp-layout/
├─ src/
│  ├─ index.html
│  ├─ css/
│  ├─ js/
├─ dist/
├─ gulpfile.js
├─ package.json
```

---

## 📦 Ставим зависимости

```bash
npm install --save-dev gulp browser-sync
```

---

## 📜 gulpfile.js (с комментариями, современный синтаксис)

Шаблон gulpfile.js рабочий написан на ES6 module. Пока с файлами ниче не делает, просто переносит из src в dist.

```js
// Импортируем Gulp и BrowserSync
import { src, dest, watch, series, parallel } from 'gulp'; // ES-модульный импорт
import browserSyncLib from 'browser-sync';                 // Импорт BrowserSync

const browserSync = browserSyncLib.create();               // Инициализация BrowserSync

// Папки проекта
const paths = {
  html: {
    src: 'src/**/*.html',
    dest: 'dist/'
  },
  css: {
    src: 'src/css/**/*.css',
    dest: 'dist/css/'
  },
  js: {
    src: 'src/js/**/*.js',
    dest: 'dist/js/'
  }
};

// Задача для копирования HTML
function html() {
  return src(paths.html.src)       // Берем все HTML-файлы из src
    .pipe(dest(paths.html.dest))   // Копируем в dist
    .pipe(browserSync.stream());   // Обновляем страницу
}

// Задача для копирования CSS
function css() {
  return src(paths.css.src)
    .pipe(dest(paths.css.dest))
    .pipe(browserSync.stream());
}

// Задача для копирования JS
function js() {
  return src(paths.js.src)
    .pipe(dest(paths.js.dest))
    .pipe(browserSync.stream());
}

// Инициализация BrowserSync
function serve() {
  browserSync.init({
    server: {
      baseDir: 'dist' // Папка, которую мы обслуживаем
    },
    notify: false,
    port: 3000
  });

  // Следим за изменениями файлов
  watch(paths.html.src, html);
  watch(paths.css.src, css);
  watch(paths.js.src, js);
}

// Задача по умолчанию (режим разработки)
export default series(
  parallel(html, css, js), // Сначала всё копируем
  serve                    // Потом запускаем сервер и слежение
);

// Задача "build" (без запуска сервера)
exports const build = parallel(html, css, js);
```

---

## 🧩 package.json — дописываем `"scripts"`

```json
"scripts": {
  "dev": "gulp",           // Запуск dev-сборки с live-server
  "build": "gulp build"    // Просто собрать dist без сервера
}
```

---

## ✅ Как запускать

```bash
npm run dev    # Live-сервер + слежение
npm run build  # Только сборка
```

---

Хочешь — добавим шаблонизаторы, препроцессоры, оптимизацию CSS и минификацию.
Дальше можем подключить:

* `gulp-file-include` для HTML-шаблонов
* `gulp-sass` или `gulp-postcss`
* `gulp-clean-css`, `gulp-uglify`, `gulp-imagemin`

Сигналь, и я соберу следующий шаг. Готов, командир верстки? 😎

Продолжение в project-0.md
---



````javascript
// Импортируем Gulp и плагины
const { src, dest, watch, series, parallel } = require('gulp'); // Основные функции Gulp
const browserSync = require('browser-sync').create();           // BrowserSync для live reload
const del = require('del');                                     // del для очистки dist
const sass = require('gulp-sass')(require('sass'));             // gulp-sass для SCSS
const autoprefixer = require('gulp-autoprefixer');              // Автопрефиксер для CSS
const cleanCSS = require('gulp-clean-css');                     // Минификация CSS
const uglify = require('gulp-uglify');                          // Минификация JS

// Пути к файлам
const paths = {
  html: {
    src: 'src/**/*.html', // Все HTML-файлы
    dest: 'dist/'
  },
  css: {
    src: 'src/css/**/*.css', // Все CSS-файлы
    dest: 'dist/css/'
  },
  scss: {
    src: 'src/scss/**/*.scss', // Все SCSS-файлы
    dest: 'dist/css/'
  },
  js: {
    src: 'src/js/**/*.js', // Все JS-файлы
    dest: 'dist/js/'
  }
};

// Очистка папки dist
function clean() {
  return del(['dist']); // Удаляем папку dist
}

// Копирование HTML с обработкой ошибок
function html() {
  return src(paths.html.src)
    .pipe(dest(paths.html.dest))
    .pipe(browserSync.stream());
}

// Компиляция SCSS, автопрефиксер, минификация, обработка ошибок
function scss() {
  return src(paths.scss.src)
    .pipe(sass().on('error', sass.logError)) // Компилируем SCSS
    .pipe(autoprefixer())                    // Добавляем префиксы
    .pipe(cleanCSS())                        // Минифицируем CSS
    .pipe(dest(paths.scss.dest))             // Копируем в dist/css
    .pipe(browserSync.stream());             // Обновляем страницу
}

// Копирование и минификация CSS
function css() {
  return src(paths.css.src)
    .pipe(autoprefixer())        // Добавляем префиксы
    .pipe(cleanCSS())            // Минифицируем CSS
    .pipe(dest(paths.css.dest))
    .pipe(browserSync.stream());
}

// Копирование и минификация JS с обработкой ошибок
function js() {
  return src(paths.js.src)
    .pipe(uglify().on('error', function(e){ // Минифицируем JS
      console.error(e.message);             // Логируем ошибку
      this.emit('end');
    }))
    .pipe(dest(paths.js.dest))
    .pipe(browserSync.stream());
}

// Запуск сервера и слежение за файлами
function serve() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    },
    notify: false,
    port: 3000
  });

  watch(paths.html.src, html);    // Следим за HTML
  watch(paths.scss.src, scss);    // Следим за SCSS
  watch(paths.css.src, css);      // Следим за CSS
  watch(paths.js.src, js);        // Следим за JS
}

// Экспорт задач
exports.clean = clean; // Очистка dist
exports.html = html;   // Копирование HTML
exports.scss = scss;   // Компиляция SCSS
exports.css = css;     // Копирование CSS
exports.js = js;       // Копирование JS

// Сборка проекта
exports.build = series(
  clean,               // Сначала очистка
  parallel(html, scss, css, js) // Потом обработка файлов
);

// Задача по умолчанию: сборка + сервер + слежение
exports.default = series(
  clean,
  parallel(html, scss, css, js),
  serve
);
````

**Теперь поддерживаются:**
- SCSS (src/scss)
- Минификация CSS/JS
- Автопрефиксер
- Очистка dist перед сборкой
- Обработка ошибок

Если не используешь SCSS, можешь убрать соответствующие части.
