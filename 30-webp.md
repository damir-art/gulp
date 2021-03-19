# webp
Конвертация изображений в формат `webp`.

- https://www.npmjs.com/package/gulp-webp
- `npm install --save-dev gulp-webp`

Код:

    webp = require('gulp-webp') // Переменная для `gulp-imagemin`

    // Функция для работы с изображениями
    function images() {
        return src(path.src.img) // Корень исходной папки проекта
            .pipe(
                webp({
                    quality: 70 // Качество изображения
                })
            )
            .pipe(dest(path.build.img))
            .pipe(src(path.src.img))
            .pipe(
                imagemin({
                    progressive: true,
                    svgoPlugins: [{ removeViewBox: false }],
                    interlaced: true,
                    optimizationLevel: 3 // 0 to 7
                })
            )
            .pipe(dest(path.build.img)) // Перебрасываем файлы из исходной папки, в папку назначения
            .pipe(browsersync.stream()) // Обновляем страницу
    }