//Import Modules
const electron = require('electron');
const { remote } = electron;
const {BrowserWindow, dialog } = electron.remote;
const axios = require('axios');
const ipcRenderer = electron.ipcRenderer;
const $ = jQuery = require('jquery');
require('jquery-ui');
require('jquery-ui-sortable');
require('formBuilder');
const fs = require('fs');

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
    var fbEditor = document.getElementById('newForm');
    var formBuilder = $(fbEditor).formBuilder();
    var setJSONWin;
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

    ipcRenderer.on('JSONData:value', (e, arg) => {
        formBuilder.actions.setData(arg);
    });
    

    //Save JSON Data
    document.getElementById('saveJSON').addEventListener('click', function() {
        var formData = formBuilder.formData;

        dialog.showSaveDialog(fileTypes,(fileName) => {
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
    //file type filters for fs
    const fileTypes = {
        filters: [
          {name: 'JSON', extensions: ['json']},
          {name: 'Javascript', extensions: ['js']},
          {name: 'XML', extensions: ['xml','xsd']},
          {name: 'All Files', extensions: ['*']}
        ]
    }
    //open and read file
    document.getElementById('importJSON').addEventListener('click', function() {
        dialog.showOpenDialog(fileTypes, (fileNames) => {
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
        dialog.showOpenDialog(fileTypes,(fileNames) => {
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
  });