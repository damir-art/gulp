# gulpfile.js
Для создания сценария, нужно создать файл `gulpfile.js`.

Структура файла `gulpfile.js`:
- объект с путями
- переменные пакетов (плагинов)
- функции для обработки: HTML, CSS, JS, изображений, шрифтов
- функция слежения

После создания структуры папок и файлов проекта, проверяем работу `gulpfile.js`,  с помощью тестового кода:

    // Проверяем работу gulp, в терминале набираем команду `gulp`
    function defaultTask(cb) {
        // place code for your default task here
        cb();
    }
    exports.default = defaultTask

Если что-то пошло не так, то полностью очищаем пакетный менеджер npm и устанавливаем всё заного:

    npm cache clean --force
    npm i npm -g

## Пишем сценарий
Сначала удаляем тестовый код. Затем добавляем начальный сценарий **gulp**:

    // Создаём переменные, присваиваем им пути к файлам и папкам
    let project_folder = 'dist' // В эту папку выводится результат работы gulp, продакшн
    let source_folder  = 'src'  // Папка с иходниками

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
            html:   source_folder + '/',                // Путь к папке с HTML-файлами
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
    let { src, dest } = require('gulp'), // gulp присваивается переменным
        gulp = require('gulp'),           // Для выполнения отдельных задач

`/img/**/*.{jpg, png, svg, gif, ico, webp}` - берем файлы с любой подпапки и только с расширениями `jpg, png, svg, gif, ico, webp`

## Выход из gulp
Чтобы выйти из gulp, пишем `Ctrl + C`
