# Шаблоны (layouts, templates)
Создаём `pug/layouts/main.pug` (или `common.pug`, `template.pug`), основной шаблон и записываем туда следующий код:

    doctype // создаст <!DOCTYPE html> 

Создаём `pug/pages/index.pug`. И импортируем туда основной шаблон:

    extends ../layouts/main

Запускаем `gulp`.

## Стартовый шаблон

`main.pug`

    doctype html
    html(lang="ru")
        head
            meta(charset="UTF-8")
            title Название страницы
            meta(http-equiv="X-UA-Compatible" content="IE=edge")
            meta(name="viewport" content="width=device-width, initial-scale=1.0")
            link(rel="stylesheet" href="css/style.css")
        body
            .wrapper
                .header
                .content
                    block content
                .footer
            script(src="js/custom.js")

- вложенность тегов, через табуляцию
- атрибуты в скобках
- текст без скобок
- `.wrapper`
    - `.wrapper` div с классом,
    - `header.header` тег с классом
    - `header#header` тег с id
    - `#header` див с id
    - `header#header.header` тег с классом и id
    - `header.header.header-2#header` тег с несколькими классами и id

## lorem

    p lorem `enter`

Тоже самое но в две строки (в конечном файле перевода не будет):

    p
        | lorem `enter`

С переводом строк тегом внутри (в конечном файле переводы будут):

    p
        | Lorem ipsum, dolor sit amet consectetur adipisicing elit.
        | Modi perferendis voluptate porro quisquam #[a(href="#") vitae]
        | officia ullam ratione ut reprehenderit debitis, quam qui!
        | Eaque nulla possimus culpa autem, ipsum ratione laudantium.
