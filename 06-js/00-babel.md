# gulp-babel
Пакет для поддержки нового синтаксиса JS.

    npm install --save-dev gulp-babel @babel/core @babel/preset-env

Переменная `babel`:

    const babel = require('gulp-babel');

Функция `js2js`

    function js2js () {
        return gulp.src('app/js/main.js') // путь откуда берем файл .js
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulp.dest('dist/js'))       // путь куда складываются файлы .js после обработки
        .pipe(browserSync.stream())       // browserSync
    }

Проверка кода:

    // новый код
    [1,2,3,4].forEach((a) => console.log(a))

    // обработанный
    "use strict";

    [1, 2, 3, 4].forEach(function (a) {
    return console.log(a);
    });
