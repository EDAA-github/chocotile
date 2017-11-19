'use strict';
let num = 0;
let pagePreloader = document.getElementById('page-preloader');
let intervalID =  setInterval(function () {
    pagePreloaderAnimation();
}, 500);
function pagePreloaderAnimation() {
    num++;
    if(num>4) num = 0;
    pagePreloader.style.backgroundImage = `url('/assets/images/pre/${num}.svg')`;
    console.log(num);
}
document.body.onload = function () {

  setTimeout(function () {
      if(!pagePreloader.classList.contains('done')) {
          pagePreloader.classList.add('done');
          clearInterval(intervalID);
      }
  }, 500);


};
