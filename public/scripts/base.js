'use strict';
$(function () {


  $('a.tile-item').hover(function () {
    $('div.tile-item-content').css({backgroundColor: 'rgba(0,0,0,0.7)'});
    // $('div.tile-item-content').css({backgroundColor: '#ffffff'});


    this.children[1].style.backgroundColor = 'transparent';

  });

  $('a.tile-item').mouseleave(function () {
      // $('div.tile-item-back').css('opacity', 1);
      $('div.tile-item-content').css({backgroundColor: 'rgba(0,0,0,0.5)'});

      // this.children[0].style.backgroundColor = 'rgba(0,0,0,0)';


  });

});
