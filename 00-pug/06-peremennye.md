# Переменные
Переменные удобно использовать для разных страниц, которые внедряют один и тот же шаблон, но имеют некоторые различия, например разные `title` или `h1`.

## main.pug
Динамически присваиваем `title`

Первой строкой пишем:

    block variables

В коде шаблона отмечаем места дял значений переменных, например вместо `title`, пишем:

    title #{title}

Код `main.pug`

    block variables

    doctype html
    html(lang="ru")
        head
            meta(charset="UTF-8")
            title #{title}
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

## index.pug
После `extends ../layouts/main`, пишем:

    block variables
        - var title = 'Главная страница

## Переменная как объект
Вместо значений мы можем передавать объекты, например если на старнице используются в разных местах разные емаилы и телефоны.

`index.pug`:

    extends ../layouts/main

    block variables
        -var title = 'Главная страница'
        -var car = { name: 'bmw', year: 2003 }

    block content
        p
            | Lorem ipsum dolor sit amet consectetur adipisicing elit.
            | Ipsam fuga vero sunt alias laudantium molestiae qui ex neque
            | necessitatibus, illum quis asperiores quisquam fugiat repellat iure?
            | Consequuntur mollitia beatae odit.
        p
            span #{ car.name }
            span #{ car.year }

    block script
        script(src="js/custom-2.js")
        script(src="js/custom-3.js")
