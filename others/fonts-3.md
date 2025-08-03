# Скрипт создания кода для подключения шрифтов
## 🎯 Что такое “автоматическая генерация `@font-face`”?

Это процесс, когда Gulp **сам ищет все `.woff2` файлы в папке `assets/fonts/`** и **автоматически создаёт SCSS или CSS файл** с нужными `@font-face` правилами.

Чтобы тебе **не писать вручную вот такое** каждый раз:

```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

---

## 💡 Зачем это нужно?
Потому что если у тебя:
* 5–10 шрифтов,
* с разными `font-weight`,
* с `Italic` и `Bold`,
* и их меняют дизайнеры или заказчик кидает новые —
  **ты не хочешь руками переписывать `@font-face`** каждый раз.

---

## ⚙️ Как это работает?
Используем специальный gulp-таск, который:
1. Берёт все `.woff2` из `assets/fonts/`
2. Парсит их имена (`FontName-Bold.woff2`, `Roboto-Italic.woff2` и т.п.)
3. Генерирует SCSS-файл вроде `src/scss/fonts.scss` со всеми `@font-face`
4. Ты просто подключаешь `@import 'fonts';` в `style.scss` — и всё 🔥

---

## 🧪 Пример SCSS, который генерируется автоматически:

```scss
@font-face {
  font-family: 'Roboto';
  src: url('/fonts/Roboto-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Roboto';
  src: url('/fonts/Roboto-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

---

## ✅ Плюсы:
* 🔁 Автоматически подхватываются все новые шрифты
* ❌ Не нужно писать руками `@font-face`
* 🧼 Чисто и прозрачно

## ⚠️ Минусы:

* Надо соблюдать **наименование файлов**: `FontName-Weight.woff2` (`Roboto-Regular.woff2`, `Inter-Bold.woff2`)
* Иногда нужен ручной контроль (`italic`, `bold`, `light`, и т.д.)

---

## 🚀 Готов внедрить такую автоматизацию?
* покажу плагин или
* напишу свой мини-скрипт на Node.js (без зависимостей),
* или добавлю задачу в твой `gulpfile.js`

Говори только, как хочешь: **в `fonts.scss`? или прямо в `style.scss`?**

**Без плагинов и внешних зависимостей**, но всё равно **автоматически?** Да, вполне реально — потому что Gulp работает на Node.js, а значит можно просто использовать **встроенный `fs` (File System)** и написать **мини-Node-логику прямо внутри `gulpfile.js`**.

## 🎯 Цель:

Автоматически сгенерировать `fonts.scss`, в котором будут прописаны `@font-face` для всех `.woff2` из `assets/fonts/`.

---

## 🔧 Что я сделаю:

1. Внутри `gulpfile.js` добавлю новый таск `generateFontFace()`
2. Он:
   * прочитает папку `src/assets/fonts/`
   * отфильтрует `.woff2`
   * создаст/перезапишет `src/scss/fonts.scss`
3. А ты просто подключишь `@import 'fonts';` в `style.scss`

---

## 📦 И всё это **без плагинов**, только с `fs`:
Хочешь, напишу прямо сейчас этот кусок кода и встрою в твой `gulpfile.js`?
📁 Он займёт 20–30 строк

Сейчас вольём в твой `gulpfile.js` задачу `generateFontFace`, которая будет сама создавать `fonts.scss` из файлов `.woff2` в `assets/fonts/`. Всё просто, элегантно и на **чистом Node.js** — без плагинов и зависимостей.

---

## 📄 Что будет сделано:

1. Прочитается папка `src/assets/fonts/`
2. Все `.woff2` → превратятся в `@font-face`
3. Результат запишется в `src/scss/fonts.scss`

---

## 🧠 Где появится результат:

Ты получишь:

```scss
// src/scss/fonts.scss

@font-face {
  font-family: 'Roboto';
  src: url('../assets/fonts/Roboto-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

---

## ✅ Добавляем в `gulpfile.js`

### 👇 Вставь в любой удобный блок (обычно перед `build`):

```js
// 🆕 Таск generateFontFace — автоматическое создание fonts.scss
import fs from 'fs';
import path from 'path';

export function generateFontFace(cb) {
  const fontsDir = path.resolve(srcFolder, 'assets/fonts');
  const scssOutput = path.resolve(srcFolder, 'scss/fonts.scss');

  fs.readdir(fontsDir, (err, files) => {
    if (err) {
      console.error('❌ Не удалось прочитать папку fonts:', err);
      return cb();
    }

    const woff2Files = files.filter(file => file.endsWith('.woff2'));

    if (woff2Files.length === 0) {
      console.log('ℹ️ Нет .woff2 файлов для генерации fonts.scss');
      return cb();
    }

    let scssContent = '';

    woff2Files.forEach(file => {
      const fontName = file.split('-')[0];
      const weightStr = file.split('-')[1]?.replace('.woff2', '').toLowerCase();

      // Устанавливаем вес по суффиксу
      const weightMap = {
        thin: 100,
        extralight: 200,
        light: 300,
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
        black: 900
      };

      const weight = weightMap[weightStr] || 400;
      const style = weightStr?.includes('italic') ? 'italic' : 'normal';

      scssContent += `@font-face {\n`;
      scssContent += `  font-family: '${fontName}';\n`;
      scssContent += `  src: url('../assets/fonts/${file}') format('woff2');\n`;
      scssContent += `  font-weight: ${weight};\n`;
      scssContent += `  font-style: ${style};\n`;
      scssContent += `  font-display: swap;\n`;
      scssContent += `}\n\n`;
    });

    fs.writeFile(scssOutput, scssContent, (err) => {
      if (err) {
        console.error('❌ Ошибка при записи fonts.scss:', err);
      } else {
        console.log(`✅ Сгенерирован файл: ${scssOutput}`);
      }
      cb();
    });
  });
}
```

---

## 🚀 Как использовать

1. Клади свои `.woff2` файлы в `src/assets/fonts/`
2. Выполняй:

```bash
npx gulp generateFontFace
```

3. В `style.scss` подключи:

```scss
@import 'fonts';
```

---

## ❓ Хочешь, чтобы `generateFontFace` запускался автоматически при `build`?

Если да — добавим в `build`:

```js
export const build = isProd
  ? series(
      cleanDist,
      generateFontFace, // ← вот здесь
      parallel(copyAssets, compilePug, compileScss, processJs, processImages),
      parallel(convertWebp, convertAvif)
    )
  : series(
      cleanDist,
      generateFontFace,
      parallel(copyAssets, compilePug, compileScss, processJs, processImages)
    );
```
