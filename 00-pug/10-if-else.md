# Условия
Условия можно использовать везде, на любом файле `.pug`.

Пример использования условия и массива:

    extends ../layouts/main

    block variables
        -var title = 'Главная страница'
        -var car = { name: 'bmw', year: 2003 }
        -var cars = [ 'БМВ', 'Ауди' ]

    block content
        p
            | Lorem ipsum dolor sit amet consectetur adipisicing elit.
            | Ipsam fuga vero sunt alias laudantium molestiae qui ex neque
            | necessitatibus, illum quis asperiores quisquam fugiat repellat iure?
            | Consequuntur mollitia beatae odit.
        p
            if (title == 'Главная страница')
                span #{ cars[0] }
            else
                span #{ cars[1] }

    block script
        script(src="js/custom-2.js")
        script(src="js/custom-3.js")
