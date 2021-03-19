# rename
Переименовывает файлы.

- https://www.npmjs.com/package/gulp-rename
- `npm install gulp-rename --save-dev`

Код:

    rename = require('gulp-rename') // Переменная для `gulp-rename

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
            .pipe(dest(path.build.css)) // Обычная выгрузка
            .pipe(clean_css())
            .pipe(
                rename({
                    extname: '.min.css' // Сжатая выгрузка
                })
            )
            .pipe(dest(path.build.css))
            .pipe(browsersync.stream()) // Обновляем страницу
    }
