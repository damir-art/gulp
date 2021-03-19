# sass
- https://www.npmjs.com/package/gulp-sass
- `npm install gulp-sass --save-dev`

Устанавливаем плагин преобразующий `scss` файлы в `css`.

Код:

    scss = require('gulp-sass') // Переменная для `gulp-sass`

    // Функция для работы с CSS-файлами
    function css() {
        return src(path.src.css)
            .pipe(
                scss({
                    outputStyle: 'expanded', // Не сжато
                })
            )
            .pipe(dest(path.build.css))
            .pipe(browsersync.stream()) // Обновляем страницу
    }

    // Функция слежения за файлами
    function watchFiles(params) {
        gulp.watch([path.watch.html], html) // Браузер обновляется при изменении HTML-файлов
        gulp.watch([path.watch.css], css)   // Браузер обновляется при изменении SCSS-файлов
    }

    let build = gulp.series(clean, gulp.parallel(css, html)) // В параметрах прописываем функции, которые должны выполняться при команде запуске gulp и изменениях в файлах
    let watch = gulp.parallel(build, watchFiles, browserSync) // Пишем в консоли gulp, запускается gulp, слежения, browser-sync

    exports.css     = css

Для запуска скрипта в консоли вводим команду: `gulp`.
В папке `dist` создастся папка `css` в которой будет лежать файл `style.css`.
