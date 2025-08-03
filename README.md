# Установка gulp.js
```bash
npm run dev — для верстальщика
npm run build — для продакшена
```

```js
"scripts": {
  "dev": "cross-env NODE_ENV=development gulp",
  "build": "cross-env NODE_ENV=production gulp build"
},
```

## 🚀 Установка Gulp с нуля (по‑современному, на Gulp 5)

Итак, начнём с установки **Node.js**, потому что Gulp работает на нём.

---

### 🛠 Шаг 1: Установка Node.js

1. Идём на [официальный сайт Node.js](https://nodejs.org/).
2. Там будет две кнопки:

   * **LTS** (рекомендуется для большинства — стабильная)
   * **Current** (самая свежая, но может быть с багами)

👉 Выбирай **LTS** — идеально для Gulp 5.

3. Скачай установщик, **установи с галочкой "Add to PATH"** — чтобы ты мог писать `node` и `npm` в терминале (Git Bash в твоем случае).
4. Перезагрузи компьютер

---

### ✅ Проверка после установки

Открывай Git Bash или VS Code терминал и пиши:

```bash
node -v
```

Должно показать что-то типа:

```
v22.17.1
```

А затем:

```bash
npm -v
```

Например:

```
10.9.2
```

Если всё работает — супер, мы на коне 🐎

---

### 🎯 Дальше будет вот такой план:

| Шаг | Что делаем                            |
| --- | ------------------------------------- |
| 1   | ✅ Устанавливаем Node.js               |
| 2   | Ставим **Gulp CLI** глобально         |
| 3   | Создаём проект и ставим Gulp локально |
| 4   | Создаём `gulpfile.js`                 |
| 5   | Учимся делать первую задачу (таск)    |

Если Node уже встал — пиши, идём ко 2-му шагу: установка Gulp CLI и инициализация проекта.

## Запуск нового проекта
Чеклист запуска нового Gulp-проекта:

---

## ✅ Шаги по созданию нового Gulp-проекта

### 1. 📁 **Создай структуру проекта**

Создай пустую папку (назови как хочешь) и внутри — базовую структуру, например:

```
project-name/
├── gulpfile.js
├── package.json
├── src/
│   ├── pug/
│   ├── scss/
│   ├── js/
│   ├── img/
│   └── assets/
```

> `gulpfile.js` и `package.json` — копируй в корень.

---

### 2. 📦 **Установи зависимости**
```bash
npm i
```

> Это подтянет все зависимости (`gulp`, `gulp-sass`, `browser-sync`, `pug`, `autoprefixer`, и т.д.)

---

### 3. 📦 Если `package.json` ещё нет — создай:

```bash
npm init -y
```

А потом установи зависимости вручную:

```bash
npm install --save-dev \
gulp \
gulp-sass \
sass \
browser-sync \
del \
gulp-autoprefixer \
gulp-clean-css \
gulp-terser \
gulp-plumber \
gulp-sourcemaps \
gulp-imagemin \
gulp-webp \
gulp-avif \
gulp-rename \
gulp-if \
gulp-pug \
gulp-group-css-media-queries
```

*(да, всё в одной строке — удобно!)*

---

### 4. 🔄 **Добавь скрипт в `package.json` для запуска Gulp**
В блок `scripts` добавь:

```json
"scripts": {
  "dev": "cross-env NODE_ENV=development gulp",
  "build": "cross-env NODE_ENV=production gulp build"
}
```

Чтобы работало `cross-env`, поставь его:

```bash
npm i --save-dev cross-env
```

---

### 5. 🚀 **Запуск проекта**
* Для разработки:
  ```bash
  npm run dev
  ```
* Для продакшена:
  ```bash
  npm run build
  ```

---

### 🎁 Бонус: `.gitignore`
Не забудь `.gitignore`:

```
node_modules/
dist/
```
