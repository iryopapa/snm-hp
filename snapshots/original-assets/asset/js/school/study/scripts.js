function scrollAddClass() {
  const scrollEffect = document.querySelectorAll('.anim');
  let windowHeight = Math.floor(window.innerHeight * .75);
  for (let i = 0; i < scrollEffect.length; i++) {
    target = scrollEffect[i].getBoundingClientRect().top;
    if (target < windowHeight) {
      scrollEffect[i].classList.add('in');
    }
  }
}
document.addEventListener('scroll', scrollAddClass);

// function learningBg() {
//   const scrollEffect = document.querySelectorAll('.learning-block');
//   let windowHeight = Math.floor(window.innerHeight);
//   for (let i = 0; i < scrollEffect.length; i++) {
//     target = scrollEffect[i].getBoundingClientRect().top;
//     if (target < windowHeight) {
//       scrollEffect[i].classList.add('in');
//     } else {
//       scrollEffect[i].classList.remove('in');
//     }
//   }
// }
// document.addEventListener('scroll', learningBg);
