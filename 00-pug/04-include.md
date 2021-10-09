# include
include внедряют в layouts.

Include удобно использовать для разных страниц, которые внедряют один и тот же шаблон. Например менять шапку, футер и т.д.

Включения - выносим часть блоков в отдельные компоненты.

Создаём новую папку: `src/pug/includes` или `src/pug/modules`.

Внутри неё создаём файл для шапки `src/pug/modules/header/header.pug`, где разместим следующий код:

    header.header

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
                include ../modules/header/header.pug
                .content
                    block content
                include ../modules/footer/footer.pug
            script(src="js/custom.js")
            block script

Тоже самое делаем и для футера.
