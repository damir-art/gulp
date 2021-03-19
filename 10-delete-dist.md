# delete dist
- https://www.npmjs.com/package/del
- `npm install --save-dev del`

Удаляем папку `dist` на автомате, чтобы не удалять в ручную. При запуске `gulp` папка `dist` удаляется, а затем создаётся из `src` через функцию `html`.

Код:
    del = require('del') // Переменная для `del`

    // Функция для удаления папки `dist`
    function clean(params) {
        return del(path.clean)
    }

    let build = gulp.series(clean, html) // В параметрах прописываем функции, которые должны выполняться при команде запуске gulp и изменениях в файлах

Запускаем **gulp** по команде в консоли: `gulp`.

Будьте внимательны при установке плагина, походу он самостоятельно прописывает в `gulpfile.js` строку `const del = require('del')`
