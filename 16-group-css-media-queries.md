# gulp-group-css-media-queries
Собирает все медиазапросы, группирует их и ставит в конец файла.

- https://www.npmjs.com/package/gulp-group-css-media-queries
- `npm install --save-dev gulp-group-css-media-queries`

Код:

    group_media = require('gulp-group-css-media-queries') // Переменная для `gulp-group-css-media-queries`

    // Функция для работы с CSS-файлами
    function css() {
        return src(path.src.css)
            .pipe(
                scss({
                    outputStyle: 'expanded', // Не сжато
                })
            )
            .pipe(
                group_media()
            )
            .pipe(
                autoprefixer({
                    overrideBrowserslist: ['last 5 versions'], // Поддержка браузеров
                    cascade: true                              // Стиль написания автопрефиксов
                })
            )
            .pipe(dest(path.build.css))
            .pipe(browsersync.stream()) // Обновляем страницу
    }
