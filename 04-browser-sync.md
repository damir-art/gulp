# browser sync
Установка browsersync для gulp `npm install browser-sync --save-dev`

**browser sync** - плагин обновляющий страницу

Код, запускается через команду `gulp`:

    // Переменные помогающие в написании сценария, помимо установки плагинов, список переменных пополняется
    let { src, dest } = require('gulp'), // gulp присваивается переменным
        gulp = require('gulp'),          // Для выполнения отдельных задач
        browsersync = require('browser-sync').create()

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

    // Пишем в консоли gulp, запускается gulp и browser-sync 
    let watch       = gulp.parallel(browserSync)
    exports.watch   = watch
    exports.default = watch // Выполняется при запуске gulp
