/**
* PHP Email Form Validation - v3.6
* URL: https://bootstrapmade.com/php-email-form/
* Author: BootstrapMade.com
*/
(function () {
  "use strict";

  /**
   * ES-PRO: dia chi Google Apps Script nhan form lien he
   * (luu vao Google Sheet + gui email thong bao).
   * Doi dia chi o day neu trien khai lai Apps Script.
   */
  const FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbw4N_9ghayawPlkgyrfvnSLJPqEgsDHbaegqkBneERbz5zPSo1cpsFOEMffehldYez1/exec';
  const isEn = /_en\.html$/i.test(location.pathname);
  const MSG_FAIL = isEn
    ? 'Sorry, your message could not be sent. Please try again or contact us by phone/email.'
    : 'Xin lỗi, chưa gửi được tin nhắn. Vui lòng thử lại hoặc liên hệ qua điện thoại/email.';

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach( function(e) {
    if (!e.querySelector('input[name="website"]')) {
      let hp = document.createElement('input');
      hp.type = 'text'; hp.name = 'website'; hp.tabIndex = -1; hp.autocomplete = 'off';
      hp.setAttribute('aria-hidden', 'true');
      hp.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;opacity:0';
      e.appendChild(hp);
    }
    e.addEventListener('submit', function(event) {
      event.preventDefault();

      let thisForm = this;

      let action = thisForm.getAttribute('action');
      if (!action || /contact\.php$/i.test(action)) action = FORM_ENDPOINT;
      let recaptcha = thisForm.getAttribute('data-recaptcha-site-key');
      
      if( ! action ) {
        displayError(thisForm, 'The form action property is not set!');
        return;
      }
      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');

      let formData = new FormData( thisForm );
      formData.set('page', location.pathname.replace(/^\//, '') || 'index.html');
      formData.set('lang', isEn ? 'EN' : 'VI');

      if ( recaptcha ) {
        if(typeof grecaptcha !== "undefined" ) {
          grecaptcha.ready(function() {
            try {
              grecaptcha.execute(recaptcha, {action: 'php_email_form_submit'})
              .then(token => {
                formData.set('recaptcha-response', token);
                php_email_form_submit(thisForm, action, formData);
              })
            } catch(error) {
              displayError(thisForm, error);
            }
          });
        } else {
          displayError(thisForm, 'The reCaptcha javascript API url is not loaded!')
        }
      } else {
        php_email_form_submit(thisForm, action, formData);
      }
    });
  });

  function php_email_form_submit(thisForm, action, formData) {
    fetch(action, {
      method: 'POST',
      // gui dang urlencoded de Google Apps Script doc duoc (e.parameter)
      body: new URLSearchParams(formData)
    })
    .then(response => {
      if( response.ok ) {
        return response.text();
      } else {
        throw new Error(`${response.status} ${response.statusText} ${response.url}`); 
      }
    })
    .then(data => {
      thisForm.querySelector('.loading').classList.remove('d-block');
      if (data.trim() == 'OK') {
        thisForm.querySelector('.sent-message').classList.add('d-block');
        thisForm.reset(); 
      } else {
        throw new Error(data ? data : 'Form submission failed and no error message returned from: ' + action); 
      }
    })
    .catch((error) => {
      console.error(error);
      let m = (error && error.message) || '';
      displayError(thisForm, (m && m.length < 200 && !/^(Failed|NetworkError|Load failed|\d{3} )/.test(m)) ? m : MSG_FAIL);
    });
  }

  function displayError(thisForm, error) {
    thisForm.querySelector('.loading').classList.remove('d-block');
    thisForm.querySelector('.error-message').innerHTML = error;
    thisForm.querySelector('.error-message').classList.add('d-block');
  }

})();
