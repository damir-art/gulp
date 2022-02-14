# Watch
Слежение за файлами.

- Таски срабатывают при изменении файлов.
- Таск `watch()` должен всегда запускаться последним.
    - поэтому в `gulpfile.js` размещаем его ниже и позже всех
- Watch обычно следит за файлами:
    - pug
    - scss
    - js (main.js)
    - изображений
- В конце каждого таска вставляем `.pipe(browserSync.stream())` кроме тасков изображений, шрифтов и библиотек

Создаём таск watch():

    function watch() {

    }

    const devTasks  = gulp.parallel(pug2html, scss2css) // таски запускаются параллельно
    exports.default = gulp.series(devTasks, watch)

## При изменении файлов запускаем таски

    const gulp         = require('gulp') // переменной gulp присваиваем установленный пакет 'gulp'
    const pug          = require('gulp-pug')
    const sass         = require('gulp-sass')(require('sass'))
    const cleanCss     = require('gulp-clean-css')
    const autoprefixer = require('gulp-autoprefixer')
    var browserSync = require('browser-sync').create()

    function pug2html () {
        return gulp.src('app/pug/pages/*.pug') // путь откуда берем файлы .pug
        .pipe(pug({                            // подключаем пакет pug
            pretty: true                       // без этой опции, HTML-код будет минифицирован
        }))                                    // все опции pug: https://pugjs.org/api/reference.html
        .pipe(gulp.dest('dist'))               // путь куда складываются файлы pug после обработки
        .pipe(browserSync.stream())            // browserSync
    }

    function scss2css () {
        return gulp.src('app/scss/style.scss') // путь откуда берем файл .scss
        .pipe(sass())                          // подключаем пакет sass
        .pipe(autoprefixer())                  // подключаем autoprefixer
        // .pipe(cleanCss())                      // минификация CSS
        .pipe(gulp.dest('dist/css'))           // путь куда складываются файлы .scss после обработки
        .pipe(browserSync.stream())            // browserSync
    }

    function watch() {
        browserSync.init({
            server: {
                baseDir: "dist"
            }
        })
        // Следим за файлами Pug, если они зменятся то запускаем таск pug2html
        gulp.watch('app/pug/**/*.pug', pug2html)
        gulp.watch('app/scss/**/*.scss', scss2css)
    }

    const devTasks = gulp.parallel(pug2html, scss2css) // указываем чтобы таски запускались параллельно
    exports.default = gulp.series(devTasks, watch)

