# watch
# Слежение за файлами
Пишем код, который при изменении HTML-файлов, автоматически их обновляет в папке дистрибутива и обновляет старнциу браузера.

После функции `html()` записываем:

    // Функция слежения за файлами
    function watchFiles(params) {
        gulp.watch([path.watch.html], html) // Браузер обновляется при изменении HTML-файлов
    }

Изменяем переменную `watch`:

    // Пишем в консоли gulp, запускается gulp, слежения, browser-sync
    let watch = gulp.parallel(build, watchFiles, browserSync)
