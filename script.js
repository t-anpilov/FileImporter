const field = document.getElementById('upload_container');
const input = document.getElementById('file_upload');
const typeA = 'xls';
const typeB = 'xlsx';
const file_size = 240000;

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
    let files = e.originalEvent.dataTransfer.files;
    sendFiles(files);
}

function getFiles() {
    outFocus()
    let files = this.files;
    sendFiles(files);    
}

function sendFiles(files) {
    let Data = new FormData();
    for (const key in files) {
        let file = files[key];
        if ((file.size <= file_size) && ((file.type == typeA) || (file.type == typeB))) {
            Data.append('images[]', file);
        }
    }; 
}