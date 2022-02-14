# normalize.css

    npm i normalize.css

В общий файл `.scss` пишем путь к файлу `normalize.css`:

    @import '../../node_modules/normalize.css/normalize';

Если не хотите чтобы normalize.css или другая CSS-библиотека были в общем файле с вашими стилями или хотите минимизировать файлы только CSS-библиотек т сделайте для них отдельный таск на основе таска `scss2css`:

    function scss2css () {
        return gulp.src('app/scss/style.scss') // путь откуда берем файл .scss
        .pipe(sass())                          // подключаем пакет sass
        .pipe(autoprefixer())                  // подключаем autoprefixer
        // .pipe(cleanCss())                      // минификация CSS
        .pipe(gulp.dest('dist/css'))           // путь куда складываются файлы .scss после обработки
        .pipe(browserSync.stream())            // browserSync
    }

В шаблоне `pug` пропишите отдельную строку для подключения скомпилированных файлов CSS-библиотек.
