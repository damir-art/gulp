# clean-css
Чистит и сжимает CSS-файл. Создаём два файла, один сжатый, другой нет, для этого нужно установить еще один плагин: `rename`

- https://www.npmjs.com/package/gulp-clean-css
- `npm install gulp-clean-css --save-dev`

Код:

    clean_css = require('gulp-clean-css') // Переменная для `gulp-clean-css`

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
            .pipe(clean_css())
            .pipe(dest(path.build.css))
            .pipe(browsersync.stream()) // Обновляем страницу
    }
