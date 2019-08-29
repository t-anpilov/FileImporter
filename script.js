const field = document.getElementById('upload_container');
const input = document.getElementById('file_upload');
const text = document.getElementById('upload_text');
const typeA = 'application/vnd.ms-excel';
const typeB = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const file_size = 10000000;
const initText = 'Перетащите сюда файл или нажмите чтобы выбрать';

text.innerText = initText;

input.addEventListener('focus', setFocus);
input.addEventListener('blur', outFocus);

function setFocus() {
    field.classList.add('in_focus');
}

function outFocus() {
    field.classList.remove('in_focus');
}

field.addEventListener('drag', abortDefault)
field.addEventListener('dragstart', abortDefault)
field.addEventListener('dragend', abortDefault)
field.addEventListener('dragover', addDragClass)
field.addEventListener('dragenter', addDragClass)
field.addEventListener('dragleave', removeDragClass)
field.addEventListener('drop', abortDefault)
field.addEventListener('drop', getDropFiles)

input.addEventListener('change', getFiles)

function abortDefault(event) {
    event.preventDefault()
}

function addDragClass(event) {
    abortDefault(event);
    field.classList.add('drag_over')
}

function removeDragClass(event) {
    abortDefault(event);
    field.classList.remove('drag_over')
}

function getDropFiles(event) {
    removeDragClass(event)
    let files = event.originalEvent.dataTransfer.files;
    sendFiles(files);
}

function getFiles() {
    outFocus()
    let files = this.files;
    sendFiles(files);    
}

function sendFiles(files) {
    if (files.length == 1) {        
        //console.log(files)
        let file = files[0]        
            if ((file.size <= file_size) && ((file.type == typeA) || (file.type == typeB))) {                 
                text.innerText = file.name;          
            } else if (file.size > file_size) {
                text.innerText = 'Допустимый размер файла ' +  (file_size/1000000) + 'Мб, выберите другой файл';
            } else if ((file.type != typeA) || (file.type != typeB)) {
                text.innerText = 'Недопустимый тип файла \'' + getExtension(file.name) + '\', выберите другой файл';
            }
    } else {
        text.innerText = 'Необходимо выбрать один файл';
    }
}

function getExtension(name) {                    //определение расширения файла
    let index = name.indexOf('.') + 1;
    return name.slice(index, name.length);
}
