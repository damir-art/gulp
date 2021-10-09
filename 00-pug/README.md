# Pug

Pug - это шаблонизатор для языка HTML.

    npm install --save-dev gulp-pug

Pug в себя включает:
- шаблоны
- include (включения)
- block (блоки)
- переменные
- циклы и мн.др.

Pug например можно использовать для редактирования одной шапки, поключив её к нескольким HTML-страницам.

## package.json

    "devDependencies": {
        "gulp": "^4.0.2",
        "gulp-pug": "^5.0.0"
    }

## gulpfile.js

    const gulp = require('gulp')     // переменной `gulp` присваиваем установленный пакет `require('gulp')`
    const pug  = require('gulp-pug')

    function pug2html () {
        return gulp.src('src/pug/pages/*.pug') // путь откуда берем файлы pug
        .pipe(pug({ // подключаем пакет pug
            // опции pug: https://pugjs.org/api/reference.html
            pretty: true // без этой опции, HTML-код будет минифицирован
        }))
        .pipe(gulp.dest('dist')) // путь куда складываются файлы pug после обработки
    }

    exports.default = gulp.series(pug2html) // у переменной gulp есть метод series
