# Создание плагина для Gulp
## 🚀 Что такое Gulp-плагин?

Плагин для Gulp — это **обычный npm-модуль**, написанный на JavaScript (чаще на Node.js). Он принимает входной поток (stream), обрабатывает файлы и возвращает изменённый поток обратно в Gulp-пайплайн. Это расширение функционала Gulp’а: минификация, трансформация, конвертация, что угодно!

## 🧠 Как это работает?

Gulp использует [Node.js Streams](https://nodejs.org/api/stream.html), и большинство плагинов основаны на [through2](https://www.npmjs.com/package/through2) — это обёртка над потоком для удобства.

---

## 🛠️ Структура плагина

```js
// gulp-awesome-plugin/index.js

const through = require('through2');
const PluginError = require('plugin-error');

// Имя плагина
const PLUGIN_NAME = 'gulp-awesome-plugin';

function gulpAwesomePlugin(options = {}) {
  return through.obj(function(file, enc, cb) {
    if (file.isNull()) return cb(null, file);
    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported!'));
      return cb();
    }

    // 🔧 Тут ты меняешь содержимое файла
    const contents = file.contents.toString(enc);
    const transformed = contents.replace(/foo/g, 'bar'); // Пример: замена текста

    file.contents = Buffer.from(transformed, enc);

    cb(null, file);
  });
}

module.exports = gulpAwesomePlugin;
```

А потом ты используешь его в `gulpfile.js`:

```js
const gulp = require('gulp');
const awesome = require('./gulp-awesome-plugin');

gulp.task('transform', () => {
  return gulp.src('src/*.txt')
    .pipe(awesome())
    .pipe(gulp.dest('dist/'));
});
```

---

## 📦 Как публикуются плагины?
Плагины — это **npm-пакеты**. Если хочешь сделать свой плагин публичным:
1. Создай `package.json`:
   ```bash
   npm init
   ```
2. Укажи `keywords`: `"gulpplugin"`
3. Имя желательно начинать с `gulp-`, например: `gulp-replace-foo`
4. Залей на GitHub и опубликуй:
   ```bash
   npm publish
   ```

---

## 📚 Основы, которые нужно знать
1. **Node.js Streams** — обязательно.
2. `through2` — для упрощённого создания трансформирующих потоков.
3. `plugin-error` — стандарт для ошибок.
4. **Buffer и строки** — чтобы работать с `file.contents`.
5. Знание `vinyl` — это виртуальное представление файла в Gulp.

---

## 📌 Советы
* Не ломай `source maps`, если используешь их.
* Уважай `file.isNull()` и `file.isStream()` — это обязательные проверки.
* Делай плагин с минимальной зависимостью.
* Пиши README с примером использования.
* Проверь через `npm link`, чтобы использовать локально до публикации.

---

## ❓Для кого это?
Если ты хочешь делать что-то своё — например, конвертер юникода, автозамена, кастомная валидация — то пиши плагин. Если просто юзаешь — тогда обычные gulpfile таски.

---

Хочешь, покажу, как сделать свой плагин, который, например, удаляет все комментарии из CSS-файлов? Прямо по шагам и с запуском в gulpfile.

---

Мы можем и **должны** писать на современном JS с `import/export`, особенно если у тебя стоит **Gulp 5.0.1** — он полностью поддерживает **ES-модули** (ESM). 👨‍💻🚀

Но есть нюанс: Gulp **не просто так** работает с модулями — нужно немного подготовиться. Сейчас расскажу всё как есть, без воды:

---

## ✅ Что нужно, чтобы писать Gulp-плагины или `gulpfile.js` на ESM?
### 1. **Указать в `package.json`**

```json
{
  "type": "module"
}
```

Это переключает Node.js в режим ESM по умолчанию.

---

### 2. **Расширение файлов**

* Все файлы должны быть `.js` (не `.cjs` или `.mjs`, если используешь `"type": "module"`).
* `gulpfile.js` и твой плагин должны использовать `import` вместо `require`.

---

## ✍️ Пример плагина на современном JavaScript

```js
// plugins/remove-css-comments.js
import { PluginError } from 'plugin-error';
import through2 from 'through2';

const PLUGIN_NAME = 'gulp-remove-css-comments';

export default function removeCssComments() {
  return through2.obj(function (file, enc, cb) {
    if (file.isNull()) return cb(null, file);
    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported!'));
      return cb();
    }

    const contents = file.contents.toString(enc);
    const cleaned = contents.replace(/\/\*[\s\S]*?\*\//g, '');
    file.contents = Buffer.from(cleaned, enc);
    cb(null, file);
  });
}
```

---

## 🧪 Использование в `gulpfile.js`

```js
// gulpfile.js
import gulp from 'gulp';
import removeCssComments from './plugins/remove-css-comments.js';

const { src, dest } = gulp;

export function cleanCss() {
  return src('src/**/*.css')
    .pipe(removeCssComments())
    .pipe(dest('dist/'));
}

export default cleanCss;
```

---

## 🔗 Как подключать сторонние модули?
Если модуль экспортируется как ESM — `import` работает из коробки. Если нет — можно использовать `createRequire` из `module`, чтобы подключить CommonJS модуль в ESM-окружении. Но это редко нужно.

---

## 🔧 Проверка и отладка
Если хочешь использовать свой плагин до публикации — просто делай `npm link` или подключай напрямую через относительный путь, как выше.

---

## 📦 И да, это всё равно npm-плагин
Ты **пишешь плагин на современном JS**, но публикуешь его как обычный npm-модуль. Главное — укажи `"type": "module"` в его `package.json`.

---

Хочешь, я соберу тебе пример на Gulp 5.0.1, с `gulpfile.js`, папкой `plugins/` и плагином на ESM? Всё настроим за 5 минут, и можно будет гонять свой кастомный gulp-плагин как профи.

---

Сейчас я тебе напишу плагин `gulp-remove-css-comments` на **современном JavaScript с модулями**, и всё подробно прокомментирую — чтобы не осталось ни одной тёмной зоны 💡

---

## 📁 `plugins/remove-css-comments.js`

```js
// Импортируем PluginError — это стандарт для ошибок в плагинах Gulp
import { PluginError } from 'plugin-error';

// Импортируем through2 — обёртка для создания потоков (stream)
import through2 from 'through2';

// Имя плагина (используется в ошибках)
const PLUGIN_NAME = 'gulp-remove-css-comments';

/**
 * Экспортируем функцию-плагин по умолчанию.
 * Она возвращает объект потока, через который будут прогоняться файлы Gulp.
 */
export default function removeCssComments() {
  return through2.obj(
    /**
     * Это основная функция трансформации.
     * @param {Vinyl} file - объект файла (в Gulp все файлы — это vinyl-объекты)
     * @param {string} enc - кодировка (обычно 'utf8'), нужна для преобразования в строку
     * @param {Function} cb - callback, который сообщает Gulp, что обработка файла завершена
     */
    function (file, enc, cb) {
      // Пропускаем пустые файлы
      if (file.isNull()) return cb(null, file);

      // Потоки (Stream) пока не поддерживаем — кидаем ошибку
      if (file.isStream()) {
        this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported!'));
        return cb();
      }

      // Получаем содержимое файла как строку
      const contents = file.contents.toString(enc);

      // Удаляем CSS-комментарии: /* ... */
      const cleaned = contents.replace(/\/\*[\s\S]*?\*\//g, '');

      // Записываем обратно в file.contents как Buffer
      file.contents = Buffer.from(cleaned, enc);

      // Сообщаем, что обработка завершена
      cb(null, file);
    }
  );
}
```

---

## 💡 Объяснение аргументов `function(file, enc, cb)`

| Аргумент | Что это?                                                                                                               | Зачем нужен                                                         |
| -------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `file`   | Это vinyl-файл из Gulp. Он содержит `path`, `contents`, `stat`, и методы `isNull()`, `isStream()`, `isBuffer()` и т.д. | Через него мы получаем содержимое, изменяем его и возвращаем        |
| `enc`    | Кодировка файла. Обычно `'utf8'`                                                                                       | Используется при `file.contents.toString(enc)` и обратно в `Buffer` |
| `cb`     | Callback-функция. Вызывается, чтобы сообщить Gulp, что файл обработан                                                  | Если вызвать `cb(null, file)` — файл идёт дальше по пайплайну       |

---

## 🧪 Как использовать этот плагин в `gulpfile.js`

```js
// gulpfile.js
import gulp from 'gulp';
import removeCssComments from './plugins/remove-css-comments.js';

const { src, dest } = gulp;

// Таск: удаляет комментарии из CSS и сохраняет в папку dist
export function cleanCss() {
  return src('src/**/*.css')
    .pipe(removeCssComments()) // ← наш плагин тут!
    .pipe(dest('dist/'));
}

export default cleanCss;
```

---

## ✅ Что нужно в `package.json`?

```json
{
  "type": "module",
  "name": "gulp-my-plugin-example",
  "version": "1.0.0",
  "main": "gulpfile.js",
  "dependencies": {
    "gulp": "^5.0.1",
    "plugin-error": "^2.0.1",
    "through2": "^5.0.0"
  }
}
```

---

Если хочешь, я могу упаковать этот пример в структуру проекта и скинуть дерево каталогов — чтобы ты прям взял и запустил у себя без вопросов.

Хочешь дальше сделать ещё и автозамену чего-то в HTML? Например, убрать все `<script>`-теги или вставить какой-нибудь кастомный баннер в конце? 😉
