'use strict';
$(function () {


  $('a.tile-item').hover(function () {
    $('div.tile-item-content').css({backgroundColor: 'rgba(0,0,0,0.7)'});
    this.children[1].style.backgroundColor = 'transparent';
    this.children[1].style.color = 'transparent';
  });

  $('a.tile-item').mouseleave(function () {
      $('div.tile-item-content').css({backgroundColor: 'rgba(0,0,0,0.5)'});
      this.children[1].style.color = '#dcdcdc';
  });

});
