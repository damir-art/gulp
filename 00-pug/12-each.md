# Циклы
С помощью циклов например можно продублировать карточку товара, несколько раз.

Пример создания циклом три пункта меню:

`mixins.pug`

    mixin nav(url, txt)
        li.nav__item
            a(href=url).nav__link=txt

`header.pug`

    header.header
        ul.nav
            each index in [1, 2, 3]
                +nav('http://ya.ru', 'Яндекс')

`index` - переменной, может быть любым и его можно выводить:

    each val in [ 'Ссылка 1', 'Ссылка 2', 'Ссылка 3', 'Ссылка 4', 'Ссылка 5' ]
        +nav('http://ya.ru', val)

В `val` попадает значение из массива `[ 'Ссылка 1', 'Ссылка 2', 'Ссылка 3', 'Ссылка 4', 'Ссылка 5' ]`

Помимо значений, можно выводить индексы, которые начинаются с `0`:

    mixin nav(url, txt, ind)
        li.nav__item
            a(href=url id=ind).nav__link=txt
    
    each val, ind in [ 'Ссылка 1', 'Ссылка 2', 'Ссылка 3', 'Ссылка 4', 'Ссылка 5' ]
        +nav('http://ya.ru', val, ind)

Значениями массива могут быть объекты. Массив можно присвоить переменной и обращаться к ним через точечную нотацию.
