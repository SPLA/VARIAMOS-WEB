/* begin util */
// converts the first letter in uppercase
export function jsUcfirst(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// setup main modal view
export function setupModal(headerContent, bodyContent = "", footerContent = ""){
    let mainModal = document.getElementById('main_modal');
    let mainModalHeader = document.getElementById('main_modal_header');
    let mainModalBody = document.getElementById('main_modal_body');
    let mainModalFooter = document.getElementById('main_modal_footer');
    mainModalHeader.innerHTML = "";
    mainModalBody.innerHTML = "";
    mainModalFooter.innerHTML = "";
    mainModal.style.display = "inline-table";

    mainModalHeader.appendChild(headerContent);
    if(bodyContent != ""){
        mainModalBody.appendChild(bodyContent);
    }
    if(footerContent != ""){
        if(Array.isArray(footerContent)){
            footerContent.forEach(footerElement => {
                mainModalFooter.appendChild(footerElement);
            });
        } else {
            mainModalFooter.appendChild(footerContent);
        }
    }
}

export function modalH3(text, type="normal"){
    let cH3 = document.createElement('h3');
    cH3.innerText = text;
    if(type == "error"){
        cH3.style.color = "crimson";
    }else if(type == "success"){
        cH3.style.color = "forestgreen";
    }
    return cH3;
}

export function modalSimpleText(text){
    let cSpan = document.createElement('span');
    cSpan.innerText = text;
    return cSpan;
}

export function modalInputTexts(texts, inputs, defaultVals){
    let table = document.createElement('table');
    for(let i = 0; i < texts.length; i++){
        let tr = document.createElement('tr');
        let td = document.createElement('td');
        td.innerHTML=texts[i];
        tr.appendChild(td);
        
        let input = document.createElement('input');
        input.value = defaultVals[i];
        input.type = "text";
        input.id = inputs[i];
        input.size = 40;
        input.name = inputs[i];
        let td2 = document.createElement('td');
        td2.appendChild(input);
        tr.appendChild(td2);
        table.appendChild(tr);
    }
    return table;
}

export function modalCustomization(texts, inputs, defaultVals){
    let table = document.createElement('table');
    for(let i = 0; i < texts.length; i++){
        let tr = document.createElement('tr');
        if(i == 3){
            tr.id = "filetouploadtr";
            tr.style.display = "none";
        }
        let td = document.createElement('td');
        td.innerHTML = texts[i];
        tr.appendChild(td);

        let input = {};

        if(i == 0){
            input = document.createElement('input');
            input.size = 48;
        }
        else if(i == 3){
            input = document.createElement('input');
            input.type = "file";
        }else{
            input = document.createElement('textarea');
            input.cols = 50;
        }

        input.value = defaultVals[i];
        input.id = inputs[i];
        input.name = inputs[i];
        if(i == 0 || i == 1 || i == 4){
            input.disabled = "disabled";
        }

        let td2 = document.createElement('td');
        td2.appendChild(input);
        tr.appendChild(td2);
        table.appendChild(tr);
    }
    return table;
}

export function modalButton(text, functionToAppend){
    let button = document.createElement('button');
    button.innerText = text;
    button.id = text;
    button.addEventListener("click", functionToAppend, false);
    return button;
}
 
export function downloadFile(filename, text){
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename); 
    element.style.display = 'none';
    document.body.appendChild(element); 
    element.click(); 
    document.body.removeChild(element);
}

/* end util */