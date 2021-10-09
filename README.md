# gulp
**gulp** сборщик задач и менеджер проектов. gulp автоматизирует множество рутинных процессов, возникающих во время web-разработки.

- конвертирует и подключает шрифты
- обновляет страницу браузера
- собирает в один, несколько HTML-файлов
- работает с CSS-препроцессорами
- сжимает изображения, преобразовывает в webP
- сжимает и собирает воедино JavaScript-файлы
- создает SVG-спрайты

Основной принцип работы gulp: взять файлы из папки с исходниками, например `src`, преобразовать их (передать плагинам), а потом поместить в папку продакшена, например `dist`.

## Перед началом работы
- Проверяем установлен ли у вас **node.js**: `node --version`
- Проверяем версию **npm**: `npm --version`
- Проверить, установлен ли у вас **gulp**: `gulp --version`
- Если у вас глобально установлен **gulp** удалите его командой: `npm rm --global gulp`
- Сначала устанавливаем **gulp-cli** глобально: `npm install --global gulp-cli`
- Затем устанавливаем **gulp** локально (для конкретного проекта) `npm install --save-dev gulp`
- Далее создаём файл **package.json** `npm init`

В папке проекта появилась папка `node_modules`, файл `package-lock.json`.

А в файле `package.json`:

    "devDependencies": {
        "gulp": "^4.0.2"
    }

**--save-dev** (`-D`) флаг который указывает что данный пакет не попадёт в продакшн, пакет для разработки. Если установить **gulp** без `--save-dev` то код в `package.json` будет:

    "dependencies": {
        "gulp": "^4.0.2"
    }

Если установить с `--global` то в файл **package.json** ничего не добавится.

Снова проверяем `gulp --version`, должно быть так:

    CLI version: 2.3.0
    Local version: 4.0.2

## gulpfile.js
Для работы с `gulp` нужно написать сценарий, он пишется в файле `gulpfile.js`. Но перед этим, создадим структуру файлов и папок в проекте.

## Структура папок
Создаём структуру папок и файлов проекта в папке `src`, `dist` (не создаем):

    /#src (или app)
        /fonts
        /img
        /js
            script.js
        /scss
            style.scss
        /pug
            /layouts
                main.pug
            /pages
                index.pug
    /dist - эта папка создаётся автоматически
        /css
            style.css
        /img
        /js
            custom.js
        index.html
    gulpfile.js
    package.json
    package-lock.json

**src** - исходники, разработка проекта, перед названием папки можно поставить решетку `#src`, чтобы она всегда была сверху.

**dist** - результат работы `gulp`, продакшн, конечные обработанные файлы. Эта папка грузится на сервер, передаётся заказчику. Создаётся автоматически.

## Команды консоли
CMD, Git Bash, Cmder:
- `clear` - очистить консоль (Ctrl + L)
- `Ctrl + C` - выйти из gulp
- `gulp -h` - команды gulp
- `gulp -v` - узнать версию gulp
- `npm uninstall имя_пакета` -  удаляем из gulp пакет

## Создание проекта с gulp
Создаём новый проект уже имея настроенные файлы `package.json` и `gulpfile.js`.

- Создаем папку проекта `mysite`
- Копируем в эту папку: `src`, `gulpfile.js`, `package.json`
    - внимание, не копируем `package-lock.json`
- В консоли переходим в папку `mysite`
- Набираем `npm install`
- Набираем `gulp`

Если выдаст ошибку, то установите конвертер: `npm install webp-converter@2.2.3 --save-dev`

## Ссылки
- NPM: https://www.npmjs.com
- Gulp: https://gulpjs.com
- Перевод Gulp: https://webdesign-master.ru/blog/docs/gulp-documentation.html
- https://webdesign-master.ru/blog/tools/gulp-4-lesson.html
