# file include
Собираем файл из разных отдельных блоков, например: header, footer и т.д.

В консоли набираем `gulp`

- https://www.npmjs.com/package/gulp-file-include
- `npm install --save-dev gulp-file-include`

Код:

    fileinclude = require('gulp-file-include')      // Переменная для gulp-file-include

    // Функция для работы с HTML-файлами
    function html() {
        return src(path.src.html) // Корень исходной папки проекта
            .pipe(fileinclude())  // Собираем включаемые файлы


    // Функция слежения за HTML-файлами
    function watchFiles(params) {
        gulp.watch([path.watch.html], html) // Браузер обновляется при изменении HTML-файлов
    }

    let watch = gulp.parallel(build, watchFiles, browserSync) // Пишем в консоли gulp, запускается gulp, слежения, browser-sync

Делаем так чтобы подключаемые файлы не копировались в папку `dist`:
- имена подключаемых файлов начинаем с подчеркивания `_header`
- исключаем файлы с символом подчёркивания: `html: [source_folder + '/*.html', "!" + source_folder + '/_*.html']`
