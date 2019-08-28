const field = document.getElementById('upload_container');
const input = document.getElementById('file_upload');

input.addEventListener('focus', setFocus);
input.addEventListener('blur', outFocus);

function setFocus() {
    field.classList.add('in_focus');
}

function outFocus() {
    field.classList.remove('in_focus');
}