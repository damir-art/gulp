# PUG
Работа с PUG

Вот это поворот, Даян! 🎉
Ты — **наш человек** в Pug-мире. Раз у тебя уже был опыт и ты кайфовал от синтаксиса, то **вообще без тормозов — погнали**! Да, там есть **всё**:

✅ Переменные
✅ Циклы (`each`, `for`)
✅ Условия (`if`, `else`)
✅ Миксины (аналог функций)
✅ Extend + Block (наследование layout'ов)

---

## ✅ Шаг 1: Установка `gulp-pug`

```bash
npm install --save-dev gulp-pug
```

---

## ✅ Шаг 2: Импорт в `gulpfile.js`

```js
import pug from 'gulp-pug';
```

---

## ✅ Шаг 3: Добавляем задачу `pugToHtml()`

```js
export function pugToHtml() {
  return src(['src/pug/pages/*.pug'])
    .pipe(plumber())
    .pipe(pug({ pretty: !isProd }))
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}
```

📌 Здесь:

* `pretty: !isProd` → делает отступы в `dev`, минифицирует в `prod`
* файлы будут лежать в `src/pug/pages/`
* `dist/index.html`, `dist/about.html` и т.д. генерятся автоматически

---

## ✅ Шаг 4: Структура папок

```
src/
└── pug/
    ├── pages/
    │   ├── index.pug
    │   └── about.pug
    ├── layouts/
    │   └── layout.pug
    ├── components/
    │   ├── header.pug
    │   ├── footer.pug
    │   └── menu.pug
```

---

## ✅ Шаг 5: Пример `layout.pug`

```pug
doctype html
html(lang="ru")
  head
    meta(charset="UTF-8")
    title #{title}
  body
    include ../components/header.pug
    block content
    include ../components/footer.pug
```

---

## ✅ Пример `index.pug`

```pug
extends ../layouts/layout.pug

block content
  h1 Привет, мир!
  p Это главная страница.
```

---

## ✅ Шаг 6: Подключаем задачу `pugToHtml` в `build`

```js
export const build = isProd
  ? series(
      clean,
      parallel(pugToHtml, scssTask, css, js, images),
      parallel(convertWebp, convertAvif)
    )
  : series(
      clean,
      parallel(pugToHtml, scssTask, css, js, images)
    );
```

📌 Заменяем `html` на `pugToHtml` — ты теперь живёшь по-красоте 😎

---

## 🚀 Проверка

```bash
npm run dev
```

Идёшь в `dist/index.html` — и там уже скомпилированный HTML на основе твоего Pug + layout.

---

## 🎉 Бонус: циклы, массивы, условия — всё на борту

### 🔁 Цикл:

```pug
ul
  each item in ['яблоко', 'банан', 'вишня']
    li= item
```

### 🔘 Условие:

```pug
if isMainPage
  h2 Это главная
else
  h2 Это внутренняя
```

### 💬 Переменные можно передавать вот так:

```js
.pipe(pug({
  pretty: true,
  locals: {
    isMainPage: true,
    title: 'Главная'
  }
}))
```

---

Хочешь — можем даже JSON подключить, чтоб данные были в отдельном файле.
Ну что, поехали писать настоящие шаблоны? 😎
