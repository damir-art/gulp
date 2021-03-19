# Разное

## dist как имя проекта
Чтобы папка `dist` называлась как имя проекта, то вместо `let project_folder = 'dist'`, прописываем:

    let project_folder = require("path").basename(__dirname);

## Создание нового проекта gulp
Создаём новый проект уже имея настроенные файлы `package.json` и `gulpfile.js`.

- Создаем папку проекта `mysite`
- Копируем в эту папку: `src`, `gulpfile.js`, `package.json`
- В консоли переходит в папку `mysite`
- Набираем `npm install`
- `gulp`

Если выдаст ошибку, то установите конвертер: `npm install webp-converter@2.2.3 --save-dev`