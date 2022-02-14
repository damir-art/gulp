# Библиотеки
Подключаем библиотеки CSS или JavaScript.

## Таск JavaScript библиотеки

Создаём таск `jsLibraries`:

    function jsLibraries () {
        return gulp.src([
            'node_modules/svg4everybody/dist/svg4everybody.min.js'
        ]) // пути откуда берем файлы библиотек js, в виде массива
        .pipe(gulp.dest('dist/js/exp')) // пути куда складываются библиотеки js после обработки
        .pipe(browserSync.stream())     // browserSync
    }

    const devTasks = gulp.parallel(pug2html, scss2css, js2js, jsLibraries)
