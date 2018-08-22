//Import Modules
const electron = require('electron');
const { remote } = electron;
const {BrowserWindow, dialog } = electron.remote;
const axios = require('axios');
const ipcRenderer = electron.ipcRenderer;

const fs = require('fs');

const $ = jQuery = require('jquery');
require('jquery-ui');
require('jquery-ui-sortable');
require('bootstrap');

//render modules
require('../assets/js/vendor.js');
const formRender = require('../node_modules/formBuilder/dist/form-render.min.js');
require('tinymce');


//Main COde
jQuery(function($) {
  var escapeEl = document.createElement('textarea'),
    code = document.getElementById('markup'),
    escapeHTML = function(html) {
      escapeEl.textContent = html;
      return escapeEl.innerHTML;
    },
    formData = '[{"type":"textarea","label":"Text Area","className":"form-control","name":"textarea-1492616908223","subtype":"textarea"},{"type":"select","label":"Select","className":"form-control","name":"select-1492616913781","values":[{"label":"Option 1","value":"option-1","selected":true},{"label":"Option 2","value":"option-2"},{"label":"Option 3","value":"option-3"}]},{"type":"checkbox-group","label":"Checkbox Group","name":"checkbox-group-1492616915392","values":[{"label":"Option 1","value":"option-1","selected":true}]}]',
    addLineBreaks = function(html) {
      return html.replace(new RegExp('&gt; &lt;', 'g'), '&gt;\n&lt;').replace(new RegExp('&gt;&lt;', 'g'), '&gt;\n&lt;');
    };

  // Grab markup and escape it
  var $markup = $('<div/>');
  $markup.formRender({formData});

  // set < code > innerHTML with escaped markup
  code.innerHTML = addLineBreaks(escapeHTML($markup[0].innerHTML));

  hljs.highlightBlock(code);
});