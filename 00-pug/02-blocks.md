# Блоки
Блоки удобно использовать для разных страниц, которые внедряют один и тот же шаблон, но при этом имеют разный контент, например шапка и подвал одинаковые, а вместо контента может быть статья, фотогалерея, товар и т.д.

Шаблон `main.pug`:

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
                header.header.header-2#header
                .content
                    block content
                footer.footer
            script(src="js/custom.js")
            block script

Контент для блоков пишут в файле `index.pug` который экспортирует общий код из шаблона `main.pug`. Например в блоке контент ведется основная верстка для главной страницы.

`index.pug`:

    extends ../layouts/main

    block content
        p
            | Lorem ipsum dolor sit amet consectetur adipisicing elit.
            | Ipsam fuga vero sunt alias laudantium molestiae qui ex neque
            | necessitatibus, illum quis asperiores quisquam fugiat repellat iure?
            | Consequuntur mollitia beatae odit.

    block script
        script(src="js/custom-2.js")
        script(src="js/custom-3.js")

`index.html`:

    <!DOCTYPE html>
    <html lang="ru">
    <head>
        <meta charset="UTF-8">
        <title>Название страницы</title>
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="css/style.css">
    </head>
    <body>
        <div class="wrapper">
        <header class="header header-2" id="header"></header>
        <div class="content">
            <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Ipsam fuga vero sunt alias laudantium molestiae qui ex neque
            necessitatibus, illum quis asperiores quisquam fugiat repellat iure?
            Consequuntur mollitia beatae odit.
            </p>
        </div>
        <footer class="footer"></footer>
        </div>
        <script src="js/custom.js"></script>
        <script src="js/custom-2.js"></script>
        <script src="js/custom-3.js"></script>
    </body>
    </html>
