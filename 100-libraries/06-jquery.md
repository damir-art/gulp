# jQuery
Подключаем файл jQuery отдельно от других библиотек не конкатенируя его с другими файлами.

    npm i jquery

Создаём отдельный таск на основе `jsLibraries` переименовываем его в `jsJquery`:

    function jsJquery () {
        return gulp.src([
            'node_modules/Путь к jQuery'
        ])
        .pipe(gulp.dest('dist/js/jquery')) // путь складирования
        .pipe(browserSync.stream())        // browserSync
    }

В основной шаблон `pug` добавляем путь к jQuery.
