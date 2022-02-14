# gulp-uglify
**gulp-uglify** - минификация JavaScript-файлов

    npm install --save-dev gulp-uglify

Переменная:

    const uglify = require('gulp-uglify');

Таск:

    function js2js () {
        return gulp.src('app/js/main.js') // путь откуда берем файл .js
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())                   // минифицируем наш файл
        .pipe(gulp.dest('dist/js'))       // путь куда складываются файлы .js после обработки
        .pipe(browserSync.stream())       // browserSync
    }
