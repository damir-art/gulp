## gulp-autoprefixer
https://www.npmjs.com/package/gulp-autoprefixer

Установка префиксов CSS-свойствам для старых браузеров.

    npm install --save-dev gulp-autoprefixer

В `gulpfile.js` записываем:

    const autoprefixer = require('gulp-autoprefixer')

    .pipe(sass())                          // подключаем пакет sass
    .pipe(autoprefixer())                  // подключаем autoprefixer

В `package.json` записываем:

    "browserslist": [
        "last 4 versions"
    ]

## gulp-clean-css
https://www.npmjs.com/package/gulp-clean-css

Создание минифицируемых файлов CSS.

    npm install gulp-clean-css --save-dev

В `gulpfile.js` записываем:

    const cleanCss = require('gulp-clean-css')

    .pipe(sass())                          // подключаем пакет sass
    .pipe(autoprefixer())                  // подключаем autoprefixer
    .pipe(cleanCss({
        level: 2
    }))                                    // минификация CSS
