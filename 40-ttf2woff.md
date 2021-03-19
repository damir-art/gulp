# ttf2woff
Создаём файл шрифта с расширением `woff` и `woff2` из файла шрифта `ttf`

- https://www.npmjs.com/package/gulp-ttf2woff
- https://www.npmjs.com/package/gulp-ttf2woff2
- `npm install --save-dev gulp-ttf2woff`
- `npm install --save-dev gulp-ttf2woff2`

Устанваливаем сразу 2 плагина: `gulp-ttf2woff` и `gulp-ttf2woff2` (лучше уроки разделить по каждому плагину в отдельности)

    npm install --save-dev gulp-ttf2woff gulp-ttf2woff2

Код:

    ttf2woff     = require('gulp-ttf2woff'), // Переменная для `gulp-ttf2woff`
    ttf2woff2    = require('gulp-ttf2woff2') // Переменная для `gulp-ttf2woff`

    function fonts() {
        src(path.src.fonts) // Получаем исходники шрифтов
            .pipe(ttf2woff())
            .pipe(dest(path.build.fonts))
        return src(path.src.fonts) // Получаем исходники шрифтов
            .pipe(ttf2woff2())
            .pipe(dest(path.build.fonts))
    }

    // Функцию fonts записываем в задачу
    let build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts))

    exports.fonts = fonts

Запускаем по команде в терминале `gulp`.
