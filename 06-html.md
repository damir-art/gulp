# HTML
Работаем с HTML файлами. После размещения данного сценария, прописываем в консоли `gulp`, теперь в браузере в titlt нет слова `error`, потому что теперь **gulp**  уже создал папку `dist` с файлом `index.html` взятый из папки `src`.

    // Пути исходников
    src: {
        html:   source_folder + '/*.html', // Путь к папке с HTML-файлами

    // Функция для работы с HTML-файлами
    function html() {
        return src(path.src.html)        // Корень исходной папки проекта
            .pipe(dest(path.build.html)) // Перебрасываем файлы из исходной папки, в папку назначения
            .pipe(browsersync.stream())  // Обновляем страницу
    }

    let build = gulp.series(html) // В параметрах прописываем функции, которые должны выполняться при команде запуске gulp и изменениях в файлах
    let watch = gulp.parallel(build, browserSync) // Пишем в консоли gulp, запускается gulp и browser-sync

    exports.html    = html
    exports.build   = build
    exports.watch   = watch
    exports.default = watch // Выполняется при запуске gulp
