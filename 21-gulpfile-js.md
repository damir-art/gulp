# gulpfile.js
Рабочий gulpfile.js:

    // Создаём переменные, присваиваем им пути к файлам и папкам
    let project_folder = 'dist' // В эту папку выводится результат работы gulp, продакшн
    let source_folder  = 'src'  // Папка с иходниками

    // Объект содержащий пути к файлам и папкам проекта
    let path = {
        // Пути вывода, обработанные файлы
        build: {
            html:   project_folder + '/',       // Путь к папке с HTML-файлами
            css:    project_folder + '/css/',   // Путь к папке с CSS-файлами
            js:     project_folder + '/js/',    // Путь к папке с JS-файлами
            img:    project_folder + '/img/',   // Путь к папке с изображениями
            fonts:  project_folder + '/fonts/', // Путь к папке со шрифтами
        },
        // Пути исходников
        src: {
            html:   source_folder + '/*.html',          // Путь к папке с HTML-файлами
            css:    source_folder + '/scss/style.scss', // Путь к папке с SCSS-файлами
            js:     source_folder + '/js/script.js',    // Путь к папке с JS-файлами
            img:    source_folder + '/img/**/*.{jpg, png, svg, gif, ico, webp}', // Путь к папке с изображениями
            fonts:  source_folder + '/fonts/*.ttf',     // Путь к папке со шрифтами
        },
        // Пути к файлам которые нужно слушать постоянно, отлавливать их изменения и сразу выполнять
        watch: {
            html:   source_folder + '/**/*.html',      // Путь к папке с HTML-файлами
            css:    source_folder + '/scss/**/*.scss', // Путь к папке с SCSS-файлами
            js:     source_folder + '/js/**/*.js',     // Путь к папке с JS-файлами
            img:    source_folder + '/img/**/*.{jpg, png, svg, gif, ico, webp}', // Путь к папке с изображениями
        },
        // Удаление папки проекта при каждом запуске gulp
        clean: './' + project_folder + '/'
    }

    // Переменные пакетов
    let { src, dest } = require('gulp'), // gulp присваивается переменным
        gulp = require('gulp'),          // Для выполнения отдельных задач
        browsersync = require('browser-sync').create(),
        scss = require('gulp-sass'),
        autoprefixer = require('gulp-autoprefixer'),
        group_media = require('gulp-group-css-media-queries'),
        clean_css = require('gulp-clean-css'),
        rename = require('gulp-rename')

    // Функция обновляющая страница
    function browserSync(params) {
        browsersync.init({
            // Указываем базовую папку
            server: {
                baseDir: './' + project_folder + '/'
            },
            // Указываем порт по которому будет открываться браузер
            port: 3000,
            // notify: false, // Можно убрать сообщения плагина
        })
    }

    // Функция для работы с HTML-файлами
    function html() {
        return src(path.src.html)        // Корень исходной папки проекта
            .pipe(dest(path.build.html)) // Перебрасываем файлы из исходной папки, в папку назначения
            .pipe(browsersync.stream())  // Обновляем страницу
    }

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
            .pipe(clean_css())
            .pipe(
                rename({
                    extname: '.min.css' // Сжатая выгрузка
                })
            )
            .pipe(dest(path.build.css))
            .pipe(browsersync.stream()) // Обновляем страницу
    }

    // Функция слежения за файлами
    function watchFiles(params) {
        gulp.watch([path.watch.html], html) // Браузер обновляется при изменении HTML-файлов
        gulp.watch([path.watch.css], css)   // Браузер обновляется при изменении SCSS-файлов
    }

    // В параметрах, прписываем те функции которые выполняются при заупуске `gulp` и изменении файлов
    let build = gulp.series(gulp.parallel(css, html))

    // По команде `gulp`, запускается gulp и browser-sync
    let watch = gulp.parallel(build, watchFiles, browserSync)

    exports.css     = css
    exports.html    = html
    exports.build   = build
    exports.watch   = watch
    exports.default = watch
