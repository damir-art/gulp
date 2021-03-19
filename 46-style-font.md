# style font 
Автоматически создаём CSS-свойства для шрифтов.

- В папке исходников создаём файл `src/scss/fonts.scss`
- Подключаем этот файл к `style.scss` через `@import "fonts";`
- Создаём в файле `style.scss` миксин (подключаем файлы шрифтов), с первой строки

Код миксина:

    @mixin font($font_name, $file_name, $weight, $style) {
        @font-face {
            font-family: $font_name;
            font-display: swap;
            src: url("../fonts/#{$file_name}.woff") format("woff"), url("../fonts/#{$file_name}.woff2") format("woff2");
            font-weight: #{$weight};
            font-style: #{$style};
        }
    }


Код:

    let fs = require('fs') // Для создания CSS-стилей шрифтов, file system

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

    let build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts), fontStyle) // В параметрах прописываем функции, которые должны выполняться при команде запуске gulp и изменениях в файлах

    exports.fontsStyle = fontsStyle

Запуcкаем `gulp`, в папке `src/scss/` должен появиться файл `fonts.scss`, со строками, пример:

    @include font("Roboto-Bold", "Roboto-Bold", "400", "normal");
    @include font("Roboto-Thin", "Roboto-Thin", "400", "normal");

Первое значение меняем на имя семества, а третье значение меняем на размер шрифта, пример:

    @include font("Roboto", "Roboto-Bold", "700", "normal");
    @include font("Roboto", "Roboto-Thin", "100", "normal");

Второе значение это имя файла, его не трогаем.

Далее смотрим скомпилированный CSS-файл `dist/css/style.css`, там должно быть следующее:

    @font-face {
        font-family: "Roboto";
        font-display: swap;
        src: url("../fonts/Roboto-Bold.woff") format("woff"), url("../fonts/Roboto-Bold.woff2") format("woff2");
        font-weight: 700;
        font-style: normal;
    }

    @font-face {
        font-family: "Roboto";
        font-display: swap;
        src: url("../fonts/Roboto-Thin.woff") format("woff"), url("../fonts/Roboto-Thin.woff2") format("woff2");
        font-weight: 100;
        font-style: normal;
    }
