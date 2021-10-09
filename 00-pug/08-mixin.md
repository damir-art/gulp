# Миксины
Миксин это функция. В файле `mixins.pug` может храниться сколько угодно функций.

Создаём файл `src/pug/helpers/mixins.pug`, подключаем этот файл перед блоком переменных:

`main.pug`:

    include ../helpers/mixins

    block variables

## Меню миксин
Создаём меню с помощью миксина.

Обычное меню:

    ul.nav
        li.nav__item
            a(href="#").nav__link Текст ссылки
        li.nav__item
            a(href="#").nav__link Текст ссылки
        li.nav__item
            a(href="#").nav__link Текст ссылки
        li.nav__item
            a(href="#").nav__link Текст ссылки

Миксин `mixins.pug`:

    mixin nav(url, txt)
        li.nav__item
            a(href=url).nav__link=txt

Меню с помощью миксина:

    header.header
        ul.nav
            +nav('http://ya.ru', 'Яндекс')
            +nav('http://ya.ru', 'Яндекс')
            +nav('http://ya.ru', 'Яндекс')
            +nav('http://ya.ru', 'Яндекс')
            +nav('http://ya.ru', 'Яндекс')
