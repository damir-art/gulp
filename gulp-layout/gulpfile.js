// Импортируем Gulp и современные плагины (ES-модули)
import { src, dest, watch, series, parallel } from 'gulp';    // Основные функции Gulp
import browserSyncLib from 'browser-sync';                    // BrowserSync для live reload
import { deleteAsync } from 'del';                            // del для очистки dist
import gulpSass from 'gulp-sass';                             // gulp-sass для SCSS
import * as dartSass from 'sass';                             // sass-движок для gulp-sass
import autoprefixer from 'gulp-autoprefixer';                 // Автопрефиксер для CSS
import cleanCSS from 'gulp-clean-css';                        // Минификация CSS
import terser from 'gulp-terser';                             // Современная минификация JS
import plumber from 'gulp-plumber';                           // Для обработки ошибок
import sourcemaps from 'gulp-sourcemaps';                     // Source maps для отладки
import imagemin from 'gulp-imagemin';                         // Минификация изображений
import webp from 'gulp-webp';                                 // Конвертация изображений в WebP
import avif from 'gulp-avif';                                 // Конвертация изображений в AVIF
import rename from 'gulp-rename';                             // Переименование файлов
import htmlmin from 'gulp-htmlmin';                           // Минификация HTML
import gulpIf from 'gulp-if';                                 // Условное выполнение задач
import pug from 'gulp-pug';                                   // Pug для шаблонизации HTML
import groupMediaQueries from 'gulp-group-css-media-queries'; // Группировка медиа-запросов в CSS

const browserSync = browserSyncLib.create(); // Создаем экземпляр BrowserSync
const sass = gulpSass(dartSass); // Используем dart-sass как движок для gulp-sass

const isProd = process.env.NODE_ENV === 'production'; // Определяем, в продакшене ли мы
console.log(`⚙️  Gulp running in ${isProd ? '🚀 production' : '🧪 development'} mode`); // Логируем режим работы

// Используем объект для хранения путей к файлам
const paths = {
  assets: {
    src: 'src/assets/**/*',
    base: 'src/assets',
    dest: 'dist/'
  },
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
// npx gulp clean - самостоятельная задача для очистки dist
export function clean() { // Удаляем папку dist
  // console.log('🧹 Cleaning dist folder...');
  return deleteAsync(['dist']);
}

// Копирование статических файлов (assets) в папку dist
// npx gulp assets - самостоятельная задача для копирования статических файлов
export function assets() {
  return src(paths.assets.src, { base: paths.assets.base })
    .pipe(dest(paths.assets.dest));
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
    .pipe(plumber()) // Обработка ошибок
    .pipe(sourcemaps.init()) // Инициализация source maps
    .pipe(sass().on('error', sass.logError)) // Компиляция SCSS с логированием ошибок
    .pipe(groupMediaQueries()) // Группировка медиа-запросов
    .pipe(autoprefixer()) // Автопрефиксер для кроссбраузерности
    .pipe(gulpIf(isProd, cleanCSS())) // Минификация CSS только в продакшене
    .pipe(sourcemaps.write('.')) // Запись source maps
    .pipe(rename({ suffix: '.min' })) // Переименование файла с добавлением .min
    .pipe(dest(paths.scss.dest)) // Сохранение в папку dist/css
    .pipe(browserSync.stream()); // Обновление браузера в реальном времени
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

  watch(paths.assets.src, { ignoreInitial: false }, assets);
  watch(paths.pug.src, { ignoreInitial: false }, pugToHtml);
  watch(paths.scss.src, { ignoreInitial: false }, scssTask);
  watch(paths.js.src, { ignoreInitial: false }, js);
  watch(paths.images.src, { ignoreInitial: false }, images);
}

// Сборка проекта
export const build = isProd
  ? series(
    clean,
    parallel(assets, pugToHtml, scssTask, js, images),
    parallel(convertWebp, convertAvif)
  )
  : series(
    clean,
    parallel(assets, pugToHtml, scssTask, js, images),
  );

// Задача по умолчанию: сборка + сервер + слежение
export default series(
  clean,
  parallel(assets, pugToHtml, scssTask, js, images),
  serve
);
