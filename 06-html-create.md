# Обновление HTML
Создаём HTML файлы. В `gulpfile.js` прописываем:

    // Пути исходников
    src: {
        html:   source_folder + '/*.html', // Путь к папке с HTML-файлами

    // Функция для работы с HTML-файлами
    function html() {
        return src(path.src.html)        // Корень исходной папки проекта
            .pipe(dest(path.build.html)) // Перебрасываем файлы из исходной папки, в папку назначения
            .pipe(browsersync.stream())  // Обновляем страницу
    }

    // В параметрах, прписываем те функции которые выполняются при заупуске `gulp` и изменении файлов
    let build = gulp.series(html)

    // По команде `gulp`, запускается gulp и browser-sync
    let watch = gulp.parallel(build, browserSync)

    exports.html    = html
    exports.build   = build
    exports.watch   = watch
    exports.default = watch // Выполняется при запуске gulp

После размещения данного сценария, прописываем в консоли `gulp`, теперь в браузере в title нет слова `error`, потому что теперь **gulp**  уже создал папку `dist` с файлом `index.html` взятый из папки `src`.
