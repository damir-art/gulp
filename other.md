# Разное

## dist как имя проекта
Чтобы папка `dist` называлась как имя проекта, то вместо `let project_folder = 'dist'`, прописываем:

    let project_folder = require("path").basename(__dirname);
