# fonter
Создаём файл шрифта с расширением `ttf` из файла шрифта `otf`.

- https://www.npmjs.com/package/gulp-fonter
- `npm install --save-dev gulp-fonter`

Код:

    fonter = require('gulp-fonter') // Переменная для `gulp-fonter`

    // Функция для создания ttf шрифтов из шрифта otf, запускаем отдельно
    gulp.task('otf2ttf', function () {
        return src([source_folder + '/fonts/*.otf']) // Получаем только те файлы, которые с расширением otf
            .pipe(fonter({
                formats: ['ttf']
            }))
            .pipe(dest(source_folder + '/fonts/')) // Выгружаем в папку исходников
    })

Запускаем функцию отдельно `gulp otf2ttf`, функция берет файлы otf конвертирует в ttf, выгружает в ту же папку с исходниками, а уже после этого  плагин `ttf2woff` переводит шрифт в `woff`.
