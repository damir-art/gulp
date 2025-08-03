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
