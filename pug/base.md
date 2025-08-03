# Универсальный base.pug
⚙️ Соберём **универсальный `base.pug`**, который станет твоим стартовым шаблоном для всех будущих лендингов, мультистраничников и даже WordPress-тем. Сделаю с прицелом на:

✅ современные стандарты
✅ подключение CSS, JS, шрифтов, favicon
✅ поддержку SEO и соцсетей (Open Graph)
✅ правильные meta
✅ нормальную структуру для `extends` и `block`

---

## 📂 Структура проекта (предполагаемая)

```
src/
├── assets/
│   └── fonts/
├── pug/
│   ├── layout/
│   │   └── base.pug     ← ВОТ ЭТОТ ФАЙЛ
│   └── pages/
│       └── index.pug    ← Будет его расширять
└── scss/
    └── style.scss
```

---

## 📄 `base.pug` — универсальная база

```pug
//- src/pug/layout/base.pug

doctype html
html(lang="ru")
  head
    meta(charset="UTF-8")
    meta(name="viewport", content="width=device-width, initial-scale=1.0")
    meta(http-equiv="X-UA-Compatible", content="ie=edge")
    meta(name="format-detection", content="telephone=no")
    meta(name="theme-color", content="#ffffff")

    //- SEO
    title #{title || 'Название страницы'}
    meta(name="description", content=description || 'Описание страницы')
    meta(name="keywords", content=keywords || 'ключевые слова')

    //- Open Graph для соцсетей
    meta(property="og:title", content=title || 'Название страницы')
    meta(property="og:description", content=description || 'Описание страницы')
    meta(property="og:type", content="website")
    meta(property="og:image", content=ogImage || '/img/og-image.jpg')
    meta(property="og:url", content=ogUrl || '/')

    //- Favicon
    link(rel="icon" href="/favicon.ico" type="image/x-icon")
    link(rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png")
    link(rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png")
    link(rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png")

    //- Подключение шрифтов
    style.
      @font-face {
        font-family: 'MyFont';
        src: url('/fonts/myfont.woff2') format('woff2');
        font-weight: 400;
        font-style: normal;
        font-display: swap;
      }

    //- CSS
    link(rel="stylesheet" href="/css/style.min.css")

  body
    block content

    //- JS (если надо — можно убрать)
    script(src="/js/app.min.js")
```

---

## 📄 Пример `index.pug`, который использует `base.pug`

```pug
//- src/pug/pages/index.pug

extends ../layout/base.pug

block vars
  - var title = 'Главная страница'
  - var description = 'Это описание главной страницы для SEO'
  - var keywords = 'грузоперевозки, китай, логистика'
  - var ogImage = '/img/share.jpg'
  - var ogUrl = 'https://example.com/'

block content
  main
    h1 Привет, мир!
    p Это главная страница.
```
