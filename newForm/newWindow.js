//Import Modules
const electron = require('electron');
const { webContents, remote } = electron;
const {BrowserWindow, dialog } = electron.remote;
const axios = require('axios');
const ipcRenderer = electron.ipcRenderer;

const fs = require('fs');

const $ = jQuery = require('jquery');
require('jquery-ui');
require('jquery-ui-sortable');
require('bootstrap');
require('formBuilder');

//Render Modules
require('../assets/js/vendor.js');
const formRender = require('../node_modules/formBuilder/dist/form-render.min.js');
require('tinymce');


//Main Code
const curWindow = require('electron').remote.getCurrentWindow();

//Save btn
curWindow.once('did-finish-load',function(){
    let saveBtn = document.getElementsByClassName('save-template')[0];
    console.log(saveBtn);
    saveBtn.addEventListener('click',() => {
        console.log('btn clicked');
        let formNewData = formBuilder.actions.getData('json');
        console.log(formNewData);
    });
});



//Action Buttons
jQuery(function($) {
    var fbEditor = document.getElementById('newForm'),
        formBuilder = $(fbEditor).formBuilder(),
        setJSONWin;
        
    //Get XML Data
    document.getElementById('getXML').addEventListener('click', function() {
      alert(formBuilder.actions.getData('xml'));
    });
    //Get JSON Data
    document.getElementById('getJSON').addEventListener('click', function() {
      alert(formBuilder.actions.getData('json'));
    });
    
    //Get JS Data
    document.getElementById('getJS').addEventListener('click', function() {
      alert('check console');
      console.log(formBuilder.actions.getData());
    });



    //Set JSON Data and Edit
    document.getElementById('setData').addEventListener('click', function(){
        setJSONWin = new BrowserWindow({
            width: 400,
            height: 400,
            transparent: true,
            //frame: false,
            parent: remote.getCurrentWindow(),
            modal: true
        });
        setJSONWin.loadURL(`file://${__dirname}/setJSON.html`);
        //setJSONWin.setMenu(null);
    });

    ipcRenderer.on('JSONData:value', (e, arg) => {
        formBuilder.actions.setData(arg);
    });


    //file type filters for fs
    const buildFileTypes = {
        filters: [
          {name: 'JSON', extensions: ['json']},
          {name: 'Javascript', extensions: ['js']},
          {name: 'XML', extensions: ['xml','xsd']},
          {name: 'All Files', extensions: ['*']}
        ]
    }

    //Save JSON Data
    document.getElementById('saveJSON').addEventListener('click', function() {
        var formData = formBuilder.formData;

        dialog.showSaveDialog(buildFileTypes,(fileName) => {
        //Improve this part
            if( fileName === undefined) {
                alert('Write the name of the file.');
                return;
            } else if( fileName === '') {
                alert('Write the name of the file.');
                return;
            }
            fs.writeFile(fileName, formData, (err) => {
                if(err) console.error(err);
                alert('The File Has Been Successfully Saved!');
            })
        });
    });
    
    //open and read file
    document.getElementById('importJSON').addEventListener('click', function() {
        dialog.showOpenDialog(buildFileTypes, (fileNames) => {
            if( fileNames === undefined) {
                alert('No file selected');
            } else {
                readFile(fileNames[0])
            }
        });
    });
    //read file func
    function readFile(filepath) {
        fs.readFile(filepath, 'utf-8', (err, data) => {
            if(err){
               alert(`Something went wrong:\n ${err}`);
               return; 
            }
            formBuilder.actions.setData(data);
        });
    }
    //update file
    document.getElementById('updateJSON').addEventListener('click', function() {
        dialog.showOpenDialog(buildFileTypes,(fileNames) => {
            if( fileNames === undefined) {
                alert('No file selected');
            } else {
                let formData = formBuilder.formData;
                fs.writeFile(fileNames[0], formData, (err) => {
                    if(err){
                        alert(`Something went wrong: ${err}`);
                    return;
                    }
                    alert('The file has been successfully updated');
                });
            }
        });
    });



    /*
        Render Actions
    */
    const renderFileTypes = {
        filters: [
            {name: 'HTML', extensions: ['html']},
            {name: 'All Files', extensions: ['*']}
          ]
    }
    //Save html
    var escapeEl = document.createElement('textarea'),
        code = document.getElementById('markup'),
        escapeHTML = function(html) {
            escapeEl.textContent = html;
            return escapeEl.innerHTML;
        },
        addLineBreaks = function(html) {
            return html.replace(new RegExp('><', 'g'), '>\n<').replace(new RegExp('><', 'g'), '>\n<');
        };
        var $markup = $('<div/>');
        var formOuterHTML;
    document.getElementById('saveHTML').addEventListener('click', function() {
        new Promise(function(res, rej){
            var formData = formBuilder.formData;
            res(formData);
        }).then(function(formData){
            $markup.formRender({formData});
            var formHTML = addLineBreaks($markup[0].innerHTML);

            dialog.showSaveDialog(renderFileTypes,(fileName) => {
            //Improve this part
                if( fileName === undefined) {
                    alert('Write the name of the file.');
                    return;
                } else if( fileName === '') {
                    alert('Write the name of the file.');
                    return;
                }
                fs.writeFile(fileName, formHTML, (err) => {
                    if(err) console.error(err);
                    alert('The File Has Been Successfully Saved!');
                })
            });
        });        
    });

    //Preview
    document.getElementById('preview').addEventListener('click', function() {
        console.log('Hello');
        
        var formData = formBuilder.formData;
        ipcRenderer.send('formHTML:data', formData);

        let previewWindow = new BrowserWindow({
            width: 600,
            height: 800,
            show: false,
            transparent: true,
            //frame: false,
            parent: remote.getCurrentWindow(),
            modal: true
        });
        previewWindow.loadURL(`file://${__dirname}/preview.html`);
        //previewWindow.setMenu(null);
        previewWindow.webContents.on('dom-ready', () => {
            
            new Promise(function(res, rej){
                var formData = formBuilder.formData;
                res(formData);
            }).then(function(formData){
                $markup.formRender({formData});
                var formHTML = addLineBreaks($markup[0].innerHTML);
                $('#previewForm').append($(formHTML));
            }); 
        });
        previewWindow.webContents.on('did-finish-load', () => {
            previewWindow.show();
            console.log('window is now visible!')
          })
    });

  });