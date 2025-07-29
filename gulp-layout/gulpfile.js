// Внимание: ES-модули — используем import!
import gulp from 'gulp';

// Простой таск, который выводит сообщение
export const hello = (done) => {
  console.log('✅ Привет из Gulp 5!');
  done(); // обязательно для синхронных тасков
};

// Таск по умолчанию
export default gulp.series(hello);
