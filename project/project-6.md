# Меняем на ".min" в index.html для prod
Финализируем `gulpfile.js` 😎

---

## ⚠️ **.min в `prod`, но index.html ссылается на не-`.min`**
* В `prod` режиме генерируются `style.min.css` и `script.min.js`
* Но `index.html` (или другой HTML через `pug`) по-прежнему может ссылаться на `style.css` и `script.js`, что ломает загрузку.

---

### 💡 Что делать?
Нужно сделать **автоматическую замену URL в Pug-шаблонах** при прод-сборке. Есть два пути:

---

### 🔧 Вариант 1: Простая замена с переменной окружения в Pug

1. **В `compilePug()` передаём переменную `isProd` в шаблон**:

```js
.pipe(pug({ pretty: !isProd, locals: { isProd } }))
```

2. **В `src/pug/layouts/*.pug` (или где у тебя подключаются ресурсы)** заменить:

```pug
link(rel="stylesheet", href="css/style#{isProd ? '.min' : ''}.css")
script(src="js/script#{isProd ? '.min' : ''}.js")
```

Это **простой и надёжный способ**, без замены через Gulp-плагины. Работает шикарно, если ты используешь Pug.

---

### ⚙️ Альтернатива (если был HTML, не Pug): `gulp-replace`
Если бы ты использовал обычный HTML, тогда можно было бы подключить `gulp-replace` и заменить `.css` и `.js` пути на `.min.css` / `.min.js` только в `prod`.

---

### 🧹 Вывод
* 🗑️ Удаляем `htmlmin` — ✅
* 🛠️ Внедряем `isProd` в `pug` через `locals`, и на его основе подставляем `.min` — ✅

---

### Хочешь, я тебе сейчас перепишу `compilePug()` и дам пример `layout.pug` с этой логикой?
Если да — скажи, где подключаешь стили и скрипты (или пришли `layout.pug`) — и я добью это красиво 💥

---

Конечно, Даян! Вот **идеальная структура проекта на Gulp**, которая учитывает:

* SCSS
* Pug (с layout-ами, блоками и страницами)
* assets (шрифты, иконки, видео, и т.д.)
* изображения (`img/`)
* удобство для разработки и прод-сборки

---

## 📁 Структура проекта

```
📦project-root/
├── 📁src/                   # Исходники
│   ├── 📁assets/            # Сторонние ассеты: шрифты, favicon, иконки, видео
│   │   ├── fonts/
│   │   ├── icons/
│   │   └── video/
│   ├── 📁img/               # Все изображения (будут webp/avif)
│   ├── 📁js/                # Все JS-файлы
│   │   └── main.js
│   ├── 📁scss/              # Все SCSS-файлы
│   │   ├── base/           # Сброс, базовая типографика и переменные
│   │   │   ├── _reset.scss
│   │   │   ├── _vars.scss
│   │   │   └── _mixins.scss
│   │   ├── components/     # Кнопки, формы и другие компоненты
│   │   │   └── _button.scss
│   │   ├── layout/         # Header, Footer и прочее
│   │   │   ├── _header.scss
│   │   │   └── _footer.scss
│   │   └── style.scss      # Главный импорт-файл
│
│   ├── 📁pug/               # Все Pug-файлы
│   │   ├── 📁layouts/       # Главный layout
│   │   │   └── main.pug
│   │   ├── 📁partials/      # Части: header, footer, scripts, head
│   │   │   ├── _head.pug
│   │   │   ├── _header.pug
│   │   │   ├── _footer.pug
│   │   │   └── _scripts.pug
│   │   ├── 📁blocks/        # Компоненты: карточки, секции и т.п.
│   │   │   └── _hero.pug
│   │   └── 📁pages/         # Страницы
│   │       └── index.pug
│
├── 📁dist/                  # Сюда собирается production/dev билд
│   ├── css/
│   ├── js/
│   ├── img/
│   └── index.html
│
├── gulpfile.js             # ❤️ Наш Gulp-мозг
├── package.json
└── .gitignore
```

---

## 🔌 В Pug-странице `index.pug`:

```pug
extends ../layouts/main.pug

block content
  include ../blocks/_hero.pug
```

---

## 💅 В `scss/style.scss`:

```scss
@import 'base/reset';
@import 'base/vars';
@import 'base/mixins';

@import 'layout/header';
@import 'layout/footer';

@import 'components/button';
```

---

Готов показать как в `main.pug` и `_head.pug` правильно подключать `.min.css` и `.min.js` — с логикой `isProd` из `gulpfile.js`. Скажи только, ты хочешь подключение вручную, или с циклом через миксин?

Отлично, тогда поехали с ручной версией подключения ресурсов через `Pug`, с учётом прод/дев сборки и переменной `isProd`.

---

## 🧠 Шаг 1. Обновим `compilePug()` в `gulpfile.js`

Чтобы передавать флаг `isProd` в Pug-шаблоны:

### 🔧 Найди и замени в `gulpfile.js`:

```js
.pipe(pug({ pretty: !isProd }))
```

на:

```js
.pipe(pug({
  pretty: !isProd,
  locals: { isProd }  // ✅ Передаём флаг внутрь шаблона
}))
```

---

## 📄 Шаг 2. Пример `layouts/main.pug`

```pug
doctype html
html(lang="ru")
  head
    include ../partials/_head.pug
  body
    block content
    include ../partials/_scripts.pug
```

---

## 📄 Шаг 3. `partials/_head.pug` — стили

```pug
meta(charset="UTF-8")
meta(name="viewport", content="width=device-width, initial-scale=1.0")
title Мой Сайт

// CSS
if isProd
  link(rel="stylesheet", href="css/style.min.css")
else
  link(rel="stylesheet", href="css/style.css")
```

---

## 📄 Шаг 4. `partials/_scripts.pug` — скрипты

```pug
// JS
if isProd
  script(src="js/main.min.js")
else
  script(src="js/main.js")
```

---

## ✅ Что теперь работает?

* В `dev` режиме: `style.css` и `main.js`
* В `prod` режиме: `style.min.css` и `main.min.js`

Gulp сам добавляет `.min` в `prod`, а `pug` сам понимает, какой файл подключить. 🎯

---

## 🔜 Хочешь — следующим шагом можем:

* сделать автоматическое копирование favicon, fonts и видео из `assets`
* подключение картинок и `webp`
* циклическое подключение CSS/JS через миксины

Скажи, куда двигаемся дальше 😎
