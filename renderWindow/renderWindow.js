//Import Modules
const electron = require('electron');
const {ipcRenderer} = electron;

const $ = jQuery = require('jquery');
require('jquery-ui');
require('jquery-ui-sortable');

//Main COde
jQuery(function($) {
    $.getScript('../node_modules/formBuilder/dist/form-render.min.js', function() {
        console.log('Load was performed.');
    });

    var formData = '<form-template><fields><field class="form-control" label="Full Name" name="text-input-1459436848806" type="text" subtype="text"></field><field class="form-control" label="Select" name="select-1459436851691" type="select"><option value="option-1">Option 1</option><option value="option-2">Option 2</option></field><field class="form-control" label="Your Message" name="textarea-1459436854560" type="textarea"></field></fields></form-template>',
    formRenderOpts = {
      dataType: 'xml',
      formData: formData
    };
  
  var renderedForm = $('<div>');
  renderedForm.formRender(formRenderOpts);

  console.log(renderedForm.html());
  });