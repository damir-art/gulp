# Sass
Для 5-й версии.

Вводим в консоли:

    npm install sass gulp-sass --save-dev

После установки, в `package.json` появится два пакета:

    "gulp-sass": "^5.0.0",
    "sass": "^1.42.1"

Добавляем в `gulpfile.js`:

    const sass = require('gulp-sass')(require('sass'));

Копируем код функции `pug2html ()` и подстраиваем под `sass`:

    function scss2css () {
        return gulp.src('app/scss/style.scss') // путь откуда берем файл .scss
            .pipe(sass())                      // подключаем пакет sass
            .pipe(gulp.dest('dist/css'))       // путь куда складываются файлы .scss после обработки
    }

В `exports.default` добавляем:

    exports.default = gulp.series(pug2html, scss2css) // добавляем имя функции

## Итого с подключённым Sass

    const gulp = require('gulp')               // переменной gulp присваиваем установленный пакет 'gulp'
    const pug  = require('gulp-pug')
    const sass = require('gulp-sass')

    function pug2html () {
        return gulp.src('app/pug/pages/*.pug') // путь откуда берем файлы .pug
        .pipe(pug({                            // подключаем пакет pug
            pretty: true                       // без этой опции, HTML-код будет минифицирован
        }))                                    // все опции pug: https://pugjs.org/api/reference.html
        .pipe(gulp.dest('dist'))               // путь куда складываются файлы .pug после обработки
    }

    function scss2css () {
        return gulp.src('app/scss/style.scss') // путь откуда берем файл .scss
            .pipe(sass())                      // подключаем пакет sass
            .pipe(gulp.dest('dist/css'))       // путь куда складываются файлы .scss после обработки
    } 

    exports.default = gulp.series(pug2html, scss2css) // добавляем имя функции
