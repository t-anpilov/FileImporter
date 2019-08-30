const field = document.getElementById('upload_container');
const input = document.getElementById('file_upload');
const text = document.getElementById('upload_text');
const typeA = 'application/vnd.ms-excel';
const typeB = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const file_size = 10000000;
const initText = 'Перетащите сюда файл или нажмите чтобы выбрать';
const file_data = [];

text.innerText = initText;

input.addEventListener('focus', setFocus);
input.addEventListener('blur', outFocus);

function setFocus() {
    field.classList.add('in_focus');
}

function outFocus() {
    field.classList.remove('in_focus');
}

document.body.onclick = () => { text.innerText = initText };

field.addEventListener('drag', abortDefault);
field.addEventListener('dragstart', abortDefault);
field.addEventListener('dragend', abortDefault);
field.addEventListener('dragover', addDragClass);
field.addEventListener('dragenter', addDragClass);
field.addEventListener('dragleave', removeDragClass);
field.addEventListener('drop', abortDefault);
field.addEventListener('drop', getDropFiles);

input.addEventListener('change', getFiles);

function abortDefault(event) {
    event.preventDefault();
}

function addDragClass(event) {
    abortDefault(event);
    field.classList.add('drag_over');
}

function removeDragClass(event) {
    abortDefault(event);
    field.classList.remove('drag_over');
}

function getDropFiles(event) {
    field.classList.remove('drag_over');
    let files = event.dataTransfer.files;
    parseFiles(files);
}

function getFiles() {
    outFocus();
    let files = this.files;
    parseFiles(files);    
}

function parseFiles(files) {
    if (files.length == 1) {
        let file = files[0];      
        if ((file.size <= file_size) && ((file.type == typeA) || (file.type == typeB))) {               
            convertFile(file);
            text.innerText = 'Отправлен файл - ' + file.name;            
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

function convertFile(exsel_file) {
    let reader = new FileReader();
    reader.onload = (event) => {
        let data = new Uint8Array(event.target.result);
        let workbook = XLSX.read(data, {type: 'array'});
        for (let key in workbook.Sheets) {
            let sheet = workbook.Sheets[key];
            for (let j in sheet) {
                if (typeof(sheet[j]) == 'object') {
                    let cell = {};
                    cell[j] = sheet[j];
                    file_data.push(cell);
                }                
            } 
        }; 
        showData(file_data); 
        let xhr = new XMLHttpRequest();
        let body = {
            'resultArray' : file_data
        }
        xhr.open('POST', 'http://193.243.158.230:4500/api/import');
        xhr.setRequestHeader('Authorization', 'test-task');
        xhr.onreadystatechange = () => console.log(xhr.responseText + ' - ' + xhr.status);
        xhr.send(body);      
    };
    reader.readAsArrayBuffer(exsel_file); 
    file_data.length = 0;  
}

/*Вывод таблиц предусмотрен для документа с одним листом и 
без пропусков между заполненными ячейками*/
function showData(array) { 
    let table = document.createElement('table');
    let tHead = document.createElement('thead');
    let headRow = document.createElement('tr');
    let tBody = document.createElement('tbody');
    let headLength = 0;
    let bodyArray = [];
    for (let i=0; i<array.length; i++) {
        for (let key in array[i]) {
            let rowIndex = key.slice(1)
            if (rowIndex == 1) {                
                let headCell = document.createElement('th');
                headCell.innerText = array[i][key].w;
                headRow.append(headCell);
                headLength++;
            }
            else if ((rowIndex != 1) && !isNaN(+rowIndex)) {                
                bodyArray.push(array[i][key].w)
            }
        }    
    }
    bodyArray.reverse();
    let rowsCount = bodyArray.length / headLength;
    for (let i=0; i<rowsCount; i++) {
        let row = document.createElement('tr');
        for (let j=0; j<headLength; j++) {        
            let cell = document.createElement('td');
            cell.innerText = bodyArray.pop();  
            row.append(cell);      
        }
        tBody.append(row);
    }    
    tHead.append(headRow);
    table.append(tHead);
    table.append(tBody);
    table.classList.add('data_table')
    document.body.append(table);
}