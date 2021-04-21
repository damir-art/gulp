# autoprefixer
Добавляет префиксы для CSS-свойств.

- https://www.npmjs.com/package/gulp-autoprefixer
- `npm install gulp-autoprefixer --save-dev`

Код:

    autoprefixer = require('gulp-autoprefixer') // Переменная для `gulp-autoprefixer`

    // Функция для работы с CSS-файлами
    function css() {
        return src(path.src.css)
            .pipe(
                scss({
                    outputStyle: 'expanded', // Не сжато
                })
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
