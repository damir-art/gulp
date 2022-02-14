# svg4everybody

**svg4everybody** - позволяет корректно рботать с SVG-спрайтами, svg спрайты облегчают работу со множеством иконок.

Код:

    npm i svg4everybody

Таск с `svg4everybody`:

    function jsLibraries () {
        return gulp.src([
            'node_modules/svg4everybody/dist/svg4everybody.min.js'
        ]) // пути откуда берем файлы библиотек js, в виде массива
        .pipe(gulp.dest('dist/js/exp')) // пути куда складываются библиотеки js после обработки
        .pipe(browserSync.stream())     // browserSync
    }
