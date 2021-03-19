// Создаём переменные, присваиваем им пути к файлам и папкам
// let project_folder = 'dist' // В эту папку выводится результат работы gulp, продакшн
let project_folder = require("path").basename(__dirname);
let source_folder  = 'src'  // Папка с иходниками

let fs = require('fs') // Для создания CSS-стилей шрифтов, file system

// Объект содержащий пути к файлам и папкам проекта
let path = {
    // Пути вывода, обработанные файлы
    build: {
        html:   project_folder + '/',       // Путь к папке с HTML-файлами
        css:    project_folder + '/css/',   // Путь к папке CSS-файлами
        js:     project_folder + '/js/',    // Путь к папке JS-файлами
        img:    project_folder + '/img/',   // Путь к папке с изображениями
        fonts:  project_folder + '/fonts/', // Путь к папке со шрифтами
    },
    // Пути исходников
    src: {
        html:   [source_folder + '/*.html', '!' + source_folder + '/_*.html'], // Путь к папке с HTML-файлами
        css:    source_folder + '/scss/style.scss', // Путь к папке CSS-файлами
        js:     source_folder + '/js/script.js',    // Путь к папке JS-файлами
        img:    source_folder + '/img/**/*.{jpg, png, svg, gif, ico, webp}', // Путь к папке с изображениями
        fonts:  source_folder + '/fonts/*.ttf',     // Путь к папке со шрифтами
    },
    // Пути к файлам которые нужно слушать постоянно, отлавливать их изменения и сразу выполнять
    watch: {
        html:   source_folder + '/**/*.html',      // Путь к папке с HTML-файлами
        css:    source_folder + '/scss/**/*.scss', // Путь к папке CSS-файлами
        js:     source_folder + '/js/**/*.js',     // Путь к папке JS-файлами
        img:    source_folder + '/img/**/*.{jpg, png, svg, gif, ico, webp}', // Путь к папке с изображениями
    },
    // Удаление папки проекта при каждом запуске gulp
    clean: './' + project_folder + '/'
}

// Переменные помогающие в написании сценария, помимо установки плагинов, список переменных пополняется
let { src, dest } = require('gulp'),                        // `gulp` присваивается переменным
    gulp         = require('gulp'),                         // Для выполнения отдельных задач
    browsersync  = require('browser-sync').create(),        // Переменная для `browser-sync`
    fileinclude  = require('gulp-file-include'),            // Переменная для `gulp-file-include`
    del          = require('del'),                          // Переменная для `del`
    scss         = require('gulp-sass'),                    // Переменная для `gulp-sass`
    autoprefixer = require('gulp-autoprefixer'),            // Переменная для `gulp-autoprefixer`
    group_media  = require('gulp-group-css-media-queries'), // Переменная для `gulp-group-css-media-queries`
    clean_css    = require('gulp-clean-css'),               // Переменная для `gulp-clean-css`
    rename       = require('gulp-rename'),                  // Переменная для `gulp-rename`
    uglify       = require('gulp-uglify-es').default,       // Переменная для `gulp-uglify-es`
    imagemin     = require('gulp-imagemin'),                // Переменная для `gulp-imagemin`
    webp         = require('gulp-webp'),                    // Переменная для `gulp-webp`
    webphtml     = require('gulp-webp-html'),               // Переменная для `gulp-webp-html`
    webpcss      = require('gulp-webpcss'),                 // Переменная для `gulp-webpcss`
    svgsprite    = require('gulp-svg-sprite'),              // Переменная для `gulp-svg-sprite`
    ttf2woff     = require('gulp-ttf2woff'),                // Переменная для `gulp-ttf2woff`
    ttf2woff2    = require('gulp-ttf2woff2'),               // Переменная для `gulp-ttf2woff2`
    fonter       = require('gulp-fonter')                   // Переменная для `gulp-fonter`

// Функция обновляющая страницу, имя функции дожно оличаться от имени переменной поэтому через `camelCase`
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
        .pipe(fileinclude())         // Собираем включаемые файлы
        .pipe(webphtml())
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
        .pipe(
            webpcss({
                webpClass: '.webp',
                noWebpClass: '.no-webp'
            })
        ) // Код CSS для webp
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

// Функция для работы с JavaScript-файлами
function js() {
    return src(path.src.js)         // Корень исходной папки проекта
        .pipe(fileinclude())        // Собираем включаемые файлы
        .pipe(dest(path.build.js))  // Перебрасываем файлы из исходной папки, в папку назначения
        .pipe(
            uglify()
        )
        .pipe(
            rename({
                extname: '.min.js'  // Переименование
            })
        )
        .pipe(dest(path.build.js))  // Сжатая выгрузка
        .pipe(browsersync.stream()) // Обновляем страницу
}

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

function fonts() {
    src(path.src.fonts) // Получаем исходники шрифтов
        .pipe(ttf2woff())
        .pipe(dest(path.build.fonts))
    return src(path.src.fonts) // Получаем исходники шрифтов
        .pipe(ttf2woff2())
        .pipe(dest(path.build.fonts))
}

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

// Функция для создания ttf шрифтов из шрифта otf, запускаем отдельно
gulp.task('otf2ttf', function () {
    return src([source_folder + '/fonts/*.otf']) // Получаем только те файлы, которые с расширением otf
        .pipe(fonter({
            formats: ['ttf']
        }))
        .pipe(dest(source_folder + '/fonts/')) // Выгружаем в папку исходников
})

// Функция для записи и подключения шрифтов в стили
function fontsStyle(params) {
    let file_content = fs.readFileSync(source_folder + '/scss/fonts.scss');
    if (file_content == '') {
        fs.writeFile(source_folder + '/scss/fonts.scss', '', cb);
        return fs.readdir(path.build.fonts, function (err, items) {
            if (items) {
                let c_fontname;
                for (var i = 0; i < items.length; i++) {
                    let fontname = items[i].split('.');
                    fontname = fontname[0];
                    if (c_fontname != fontname) {
                        fs.appendFile(source_folder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
                    }
                    c_fontname = fontname;
                }
            }
        })
    }
}

// Функция калбэк для создания стилей шрифтов
function cb () {}

// Функция слежения за файлами
function watchFiles(params) {
    gulp.watch([path.watch.html], html) // Браузер обновляется при изменении HTML-файлов
    gulp.watch([path.watch.css],  css)  // Браузер обновляется при изменении SCSS-файлов
    gulp.watch([path.watch.js],   js)   // Браузер обновляется при изменении JS-файлов
    gulp.watch([path.watch.img],  images)  // Браузер обновляется при изменении изображений
}

// Функция для удаления папки `dist`
function clean(params) {
    return del(path.clean)
}

let build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts), fontsStyle) // В параметрах прописываем функции, которые должны выполняться при команде запуске gulp и изменениях в файлах
let watch = gulp.parallel(build, watchFiles, browserSync) // Пишем в консоли gulp, запускается gulp, слежения, browser-sync

exports.fontsStyle = fontsStyle
exports.fonts     = fonts
exports.images    = images
exports.js        = js
exports.html      = html
exports.build     = build
exports.watch     = watch
exports.default   = watch // Выполняется при запуске gulp
