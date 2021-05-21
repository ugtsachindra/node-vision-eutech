$(() => {
  let labelsElement = $('#labels');
  let labelListElement = $('#label-list');
  let errorElement = $('#error');
  let submitButton = $("button#classify");
  let resetButton = $("button#reset");
  let inputFileElement = $('#file');

  inputFileElement.on('change', () => {
    let files = inputFileElement.prop('files');

    if (!!files && files.length > 0) {
      // limit upload to 5 MB
      if (files[0].size > 5 * 1024 * 1024) {
        alert('Max allowed filesize is 5 MB');

        inputFileElement.val(null);

        return;
      }

      // we are safe to enable submit
      enableSubmitButton(); 
    }
  });

  function submitForm() {
    try {
      let url = '/vision/classify';
      submittingForm = true;
      let files = inputFileElement.prop('files');
      let formData = new FormData();
  
      formData.append('file', files[0]);

      submitButton.text('Classifying...');
  
      // prevent further submits
      disableSubmitButton();  
  
      // submit form
      $.ajax(url, {
        method: 'POST',
        data: formData,
        cache: false,
        // necessary for file upload to work
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
      }).done(data => {
        console.log('Data: ' + JSON.stringify(data));
  
        try {
          if (!data || !data.labels) {
            throw 'Unable to extract labels';
          }
            
          let labels = data.labels;
  
          // clear list
          labelListElement.empty();

          labels.forEach(label => {
            let labelItem = $('<li />');
            
            labelItem.text(label);
            
            labelListElement.append(labelItem);
          });

          labelsElement.removeClass('hidden');
          errorElement.addClass('hidden');
        } catch (error) {
          // this probably means that responose is not what we expected
          alert('Unrecoverable Error: ' + error);
        }
      }).fail(jqXHR => {
        console.error('Error: ' + jqXHR.responseText);
  
        try {
          let errorThrown = JSON.parse(jqXHR.responseText);
  
          if (!errorThrown.error) {
            throw 'Error message not found';
          }
  
          errorElement.text(errorThrown.error);
  
          labelsElement.addClass('hidden');
          errorElement.removeClass('hidden');
        } catch (error) {
          // this probably means that responose is not what we expected
          alert('Unrecoverable Error: ' + error);
        }
      }).always(() => { // make sure to enable submit button after we get any result
        enableSubmitButton();
      });
    } catch (error) { // make sure to enable submit button on any errors
      console.error('Error submitting form: ' + error);
      alert('Error submitting form: ' + error);

      enableSubmitButton();
    }
  }

  function resetForm() {
    // reset file
    inputFileElement.val(null);

    // hide result & error section
    labelListElement.empty();
    labelsElement.addClass('hidden');
    errorElement.addClass('hidden');

    disableSubmitButton();
  }

  function enableSubmitButton() {
    submitButton.text('Classify').prop("disabled", false);
  }

  function disableSubmitButton() {
    submitButton.prop("disabled", true);
  }

  submitButton.on('click', submitForm);

  resetButton.on('click', resetForm);

  // clear form on readys
  resetForm();
});
