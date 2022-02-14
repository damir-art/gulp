## gulp-concat
Соединяем файлы, в нашем случае библиотеки.

    npm install --save-dev gulp-concat

Таск с `concat`:

    function jsLibraries () {
        return gulp.src([
            'node_modules/svg4everybody/dist/svg4everybody.min.js'
        ]) // пути откуда берем файлы библиотек js, в виде массива
        .pipe(concat('libs.js'))        // соединяем наши js-библиотеки в один файл
        .pipe(gulp.dest('dist/js/exp')) // пути куда складываются библиотеки js после обработки
        .pipe(browserSync.stream())     // browserSync
    }
