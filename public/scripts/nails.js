'use strict';
$(function () {

  /** generate rhomb layout */
  $(".gallery").diamonds({
    size : 300,
    gap : 10,
    hideIncompleteRow : false, // default: false
    autoRedraw : true, // default: true
    itemSelector : ".gallery_item"
  });

  /** SHOW IMAGE button */
  $('div.gallery_item').click(function () {
    let src = $(this).css('background-image').replace('url(', '');
    /** with braces (" ... ") */
    src = src.substr(0, src.length-1);
    $('body').prepend(`<div class="showImage_wrapper">
                          <div class="showImage">
                            <img src=${src} > 
                            <div class="closeImage">🞩</div>
                          </div>
                        </div>`);

    /** CLOSE IMAGE - button */
    $('div.closeImage').click(function () {
      let imgWrapper = $(this).parent().addClass('hide').parent().addClass('hide');
      setInterval(()=> imgWrapper.remove(), 250);
    });

    /** CLOSE IMAGE - area around the image */
    $('div.showImage_wrapper').click(function () {
      $(this).addClass('hide').children().eq(0).addClass('hide');
      setInterval(()=> $(this).remove(), 250);
    });
  });




});