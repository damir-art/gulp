# webpcss
Создаёт CSS-код для работы с webp изображениями.

- https://www.npmjs.com/package/gulp-webpcss
- `npm install --save-dev gulp-webpcss`
- Добавляем к тегу body класс `.webp`
- Если с плагином возникли проемы, то нужно еще установить `webp-converter`: `npm install webp-converter@2.2.3 --save-dev`

Код CSS:

    body {
        background: url("../img/bg.jpg") 0 0 no-repeat;
    }
    .webp body { background: url(../img/bg.webp) 0 0 no-repeat; }

Код:

    webpcss = require('gulp-webpcss') // Переменная для `gulp-webpcss`

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
            ) // Код CSS для webpcss
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

Код для `script.js`, автоматически добавляет `class='webp'` для тега `body` при условии если браузер поддерживает формат изображений **webp**:

    function testWebP(callback) {
        var webP = new Image();
        webP.onload = webP.onerror = function () {
            callback(webP.height == 2);
        };
        webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
    }

    testWebP(function (support) {
        if (support == true) {
            document.querySelector('body').classList.add('webp');
        } else {
            document.querySelector('body').classList.add('no-webp');
        }
    });
