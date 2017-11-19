'use strict';
$(function () {

  /** LOGIN BUTTON handler */
  $('div.userLogin').click(function () {
    let form = document.getElementById('formLogin');
    let number = form.number.value.replace(/ /g, '');
    let password = form.password.value.trim();

    if(!check_Password(password)) {
      return;
    }
    if(!check_Number(number)) {
      return;
    }

    $.ajax({
      url: "/admin",
      method: "POST",
      cache: false,
      data: {
        number: number,
        password: password
      },
      success: function (data) {
        switch (data){
          case '&OK&':{
            window.location.href = '/admin/timetable';
            break;
          }
          case '&BAD_PASS&':{
            niceAlert('Пароль введен не верно');
            break;
          }
          case '&NO_USER&':{
            niceAlert('Телефон введен не верно');
            break;
          }
        }
      }
    });
  });

  function check_Number(num) {
    if(num.length < 10) {
      niceAlert('Вы ввели слишком короткий номер телефона. Он должен состоять минимум из 10 цифр');
      return false;
    }
    let chars = Array.from(num).filter(e => !$.isNumeric(e));
    if(chars.length>0){
      niceAlert('Вы ввели недопустимые символы: ' + chars.join(','));
      return false;
    }
    return true;
  }

  function check_Password(pass) {
    if(pass.search(/^(?=.*\d)(?=.*[A-z])[0-9a-zA-Z]{6,}$/) != -1){
      return true;
    }
    niceAlert('Пароль не соответствует требованиям. Пароль должен состоять минимум из 6 символов: английских букв и цифр, содержать хотя бы одну букву и одну цифру');
    return false;
  }

});
