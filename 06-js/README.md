# JavaScript
Работаем с файлами JavaScript в Gulp.

Функция `js2js` работы с файлами `.js`:

    function js2js () {
        return gulp.src('app/js/main.js') // путь откуда берем файл .js
        .pipe(gulp.dest('dist/js'))       // путь куда складываются файлы .js после обработки
        .pipe(browserSync.stream())       // browserSync
    }

В функцию `watch` добавляем строку для слежения за JavaScript файламми:

    gulp.watch('app/js/*.js', js2js) // Следим за файлами JS, если они зменятся то запускаем таск js2js

Запускаем функцию `js2js`:

    const devTasks = gulp.parallel(pug2html, scss2css, js2js) // таски запускаются параллельно
