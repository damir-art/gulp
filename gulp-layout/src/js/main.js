// data-animate анимации через CSS
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
});

document.querySelectorAll("[data-animate]").forEach(el => {
  observer.observe(el);
});

// Кнопка "Наверх"
const backToTop = document.querySelector(".back-to-top");

window.addEventListener("scroll", () => {
  backToTop.classList.toggle("show", window.scrollY > 300);
});
