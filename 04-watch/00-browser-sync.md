# Устанавливаем browser-sync
Обновляет страницу браузера.

    npm install browser-sync gulp --save-dev

Записываем в `gulpfile.js`:

    const browserSync = require('browser-sync').create()

    function watch() {
        browserSync.init({
            server: {
                baseDir: "dist"
            }
        })
    }
