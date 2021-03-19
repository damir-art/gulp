# imagemin
Сжатие изображений без потери качества.

- https://www.npmjs.com/package/gulp-imagemin
- `npm install --save-dev gulp-imagemin`

Код:

    imagemin = require('gulp-imagemin') // Переменная для `gulp-imagemin`

    // Функция для работы с изображениями
    function images() {
        return src(path.src.img)        // Корень исходной папки проекта
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

    gulp.watch([path.watch.img],  images)  // Браузер обновляется при изменении изображений

    exports.images  = images
