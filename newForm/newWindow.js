//Import Modules
const electron = require('electron');
const { remote } = electron;
const {BrowserWindow, dialog, ipcMain } = electron.remote;
const axios = require('axios');

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

//Buid, Edit, Save
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
        setJSONWin.setMenu(null);
    });

    //Catch 'SetJSON' Data
    ipcMain.on('JSONData:value', (e, arg) => {
        formBuilder.actions.setData(arg);
    });


    //File type filters for Built fs
    const buildFileTypes = [
        {filters: [
          {name: 'JSON', extensions: ['json']},
          {name: 'All Files', extensions: ['*']}
        ]},
        {filters: [
            {name: 'XML', extensions: ['xml','xsd']},
            {name: 'All Files', extensions: ['*']}
        ]},
        {filters: [
            {name: 'Javascript', extensions: ['js']},
            {name: 'All Files', extensions: ['*']}
        ]}
    ]

    //Save JSON Data
    document.getElementById('saveJSON').addEventListener('click', function(filter) {
        var formData = formBuilder.formData;
        
        dialog.showSaveDialog(buildFileTypes[0],(fileName) => {
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
    
    //Open and read file
    document.getElementById('importJSON').addEventListener('click', function() {
        dialog.showOpenDialog(buildFileTypes, (fileNames) => {
            if( fileNames === undefined) {
                alert('No file selected');
            } else {
                readFile(fileNames[0])
            }
        });
    });

    //Read file func
    function readFile(filepath) {
        fs.readFile(filepath, 'utf-8', (err, data) => {
            if(err){
               alert(`Something went wrong:\n ${err}`);
               return; 
            }
            formBuilder.actions.setData(data);
        });
    }

    //Update file
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
   //Save html: filter file types
    const renderFileTypes = {
        filters: [
            {name: 'HTML', extensions: ['html']},
            {name: 'All Files', extensions: ['*']}
          ]
    }

    //Save html
    var addLineBreaks = function(html) {
            return html.replace(new RegExp('><', 'g'), '>\n<').replace(new RegExp('><', 'g'), '>\n<');
        },
        $markup = $('<div/>');

    document.getElementById('saveHTML').addEventListener('click', function() {
        new Promise(function(res, rej){
            var formData = formBuilder.formData;
            res(formData);
        }).then(function(formData){
            $markup.formRender({formData});
            var formHTML = addLineBreaks($markup[0].innerHTML);

            dialog.showSaveDialog(renderFileTypes,(fileName) => {
            //Need Improve this part
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
        let previewWindow = new BrowserWindow({
            width: 600,
            height: 800,
            transparent: true,
            //frame: false,
            parent: remote.getCurrentWindow(),
            modal: true,
            show: false
        });
        previewWindow.loadURL(`file://${__dirname}/preview.html`);
        previewWindow.setMenu(null);

        //Generate and send html code    
        new Promise(function(res, rej){
            var formData = formBuilder.formData;
            res(formData);
        }).then(function(formData){
            $markup.formRender({formData});
            previewWindow.webContents.on('did-finish-load', () => {
                previewWindow.webContents.send('formHTML:Data', $markup[0].innerHTML);
            });
        });  
    });

  });