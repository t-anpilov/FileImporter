const field = document.getElementById('upload_container');
const input = document.getElementById('file_upload');
const extensions = ['xls', 'sxls'];
const file_size = 10000;

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


function abortDefault(event) {
    event.preventDefault()
}

function addDragClass(event) {
    abortDefault(event);
    event.target.classList.add('drag_over')
}

function removeDragClass(event) {
    abortDefault(event);
    event.target.classList.remove('drag_over')
}