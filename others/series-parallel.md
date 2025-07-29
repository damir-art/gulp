# 🛠 `gulp.series()` и `gulp.parallel()` — зачем они?
Это как раз про **то, как Gulp запускает задачи — по очереди или одновременно.**

В Gulp 5 (и 4) **таски — это обычные функции**, а `series` и `parallel` позволяют управлять порядком их выполнения:

---

### 🧱 `gulp.series()` — **последовательно** (один за другим)

Пример:

```js
export const clean = () => { /* чистим dist */ };
export const html = () => { /* компилим HTML */ };

export default gulp.series(clean, html);
```

📌 Сначала выполнится `clean()`, только после завершения — `html()`.

Полезно, если порядок важен: например, сначала чистим, потом создаём.

---

### ⚡ `gulp.parallel()` — **одновременно**

```js
export const styles = () => { /* SCSS → CSS */ };
export const scripts = () => { /* JS */ };
export const images = () => { /* Картинки */ };

export const build = gulp.parallel(styles, scripts, images);
```

📌 Все три задачи запускаются **одновременно** (параллельно). Быстрее, если они не зависят друг от друга.

---

### 🧩 Комбинируем вместе:

```js
export const build = gulp.series(
  clean,
  gulp.parallel(html, styles, scripts, images)
);
```

📌 Сначала `clean`, потом **все остальные** одновременно.

---

## 🔥 Это даёт нам:

* 📐 Контроль над порядком действий
* ⚙️ Ускорение сборки (через параллелизм)
* ✅ Минимум кода — максимум гибкости

---

Хочешь, я покажу тебе **живой пример с `series + parallel`** на твоих тасках: `clean`, `html`, `styles`, `scripts`, `images`?

Будет боевой gulpfile.js с `watch` и `browser-sync`. Только скажи! 💣
