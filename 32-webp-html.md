## webp-html
Создаёт HTML-код для работы с webp изображениями.

- https://www.npmjs.com/package/gulp-webp-html
- `npm install --save-dev gulp-webp-html`

Данный плагин, вместо тега img создаёт код:

    <picture>
        <source srcset="img/1.webp" type="image/webp">
        <img src="img/1.jpg" width="800" height="600" alt="" />
    </picture>

Код:

    webphtml = require('gulp-webp-html') // Переменная для `gulp-imagemin`

    // Функция для работы с HTML-файлами
    function html() {
        return src(path.src.html)        // Корень исходной папки проекта
            .pipe(fileinclude())         // Собираем включаемые файлы
            .pipe(webphtml())
            .pipe(dest(path.build.html)) // Перебрасываем файлы из исходной папки, в папку назначения
            .pipe(browsersync.stream())  // Обновляем страницу
    }
