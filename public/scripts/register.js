'use strict';

$(function () {

  /** REGISTER BUTTON handler */
  $('div.registerUser').click(function () {
    let form = document.getElementById('formRegister');
    let number = form.number.value.replace(/ /g, '');
    let password = form.password.value.trim();
    let name = form.uName.value.trim();

    if(name.length === 0){
      niceAlert('Введите имя пользователя');
      return;
    }
    if(!check_Password(password)) {
      return;
    }
    if(!check_Number(number)) {
      return;
    }

    $.ajax({
      url: "/register",
      method: "POST",
      cache: false,
      data: {
        name: name,
        number: number,
        password: password
      },
      success: function (data) {
        console.log(data);
        switch (data){
          case '&OK&':{
            niceAlert('Вы успешно зарегестрировались');
            window.location.href = '/profile';
            break;
          }
          case '&USER_EXIST&':{
            niceAlert('Клиент с таким телефоном уже зарегестрирован');
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
    // проверка больше 6 симовлов, состоит из англ букв, цифр, есть одна прописная и строчная
    // if(pass.search(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/) != -1){
    if(pass.search(/^(?=.*\d)(?=.*[A-z])[0-9a-zA-Z]{6,}$/) != -1){
      return true;
    }
    niceAlert('Пароль не соответствует требованиям. Пароль должен состоять минимум из 6 символов: английских букв и цифр, содержать хотя бы одну букву и одну цифру');
    return false;
  }

});
