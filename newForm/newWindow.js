//Import Modules
const electron = require('electron');
const {ipcRenderer} = electron;

const $ = jQuery = require('jquery');
require('jquery-ui');
require('jquery-ui-sortable');
const formBuilder = require('formBuilder');

//Main Code
const curWindow = require('electron').remote.getCurrentWindow();
console.log(curWindow);
const formEditor = document.getElementById('newForm');
let formBuild = $(formEditor).formBuilder();
curWindow.once('did-finish-load',function(){
    let saveBtn = document.getElementsByClassName('save-template')[0];
    console.log(saveBtn);
    saveBtn.addEventListener('click',() => {
        console.log('btn clicked');
        let formNewData = formBuilder.actions.getData('json');
        console.log(formNewData);
    });
});