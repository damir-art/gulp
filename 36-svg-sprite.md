# svg-sprite
SVG-спрайт, множество SVG-иконок объединяем в одно изображение.

- https://www.npmjs.com/package/gulp-svg-sprite
- `npm install --save-dev gulp-svg-sprite`

Код:

    svgsprite = require('gulp-svg-sprite') // Переменная для `gulp-svg-sprite`

    // Функция для создания SVG-спрайтов, задачу вызываем отдельно
    gulp.task('svgsprite', function () {
        return gulp.src([source_folder + '/iconsprite/*.svg']) // Иконки исходники
            .pipe(
                svgsprite({
                    mode: {
                        stack: {
                            sprite: '../icons/icons.svg', // Выгрузка спрайта
                            example: true // Создаёт HTML-файл с примерами иконок
                        }
                    }
                })
            )
            .pipe(dest(path.build.img)) // Выгружаем в папку с изображениями
    })

В консоли набираем: `gulp svgsprite`

Подключение SVG-файлов в HTML после создания спрайта:

    <img src="../icons/icons.svg#svgname" class="svg-svgname-dims" alt="svgname" />
