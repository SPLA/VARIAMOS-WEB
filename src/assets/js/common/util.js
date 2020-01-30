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
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename); 
    element.style.display = 'none';
    document.body.appendChild(element); 
    element.click(); 
    document.body.removeChild(element);
}

export function modalComponentInformation(structure, idx_cat, idx_subcat, cell, graph, handleResize){
    let table = document.createElement('table');
    const category_keys = Object.keys(structure);
    const subcategory_keys = Object.keys(structure[category_keys[idx_cat]]);
    const elements = structure[category_keys[idx_cat]][subcategory_keys[idx_subcat]];

    elements.forEach(element => {
        let tr = document.createElement('tr');
        let td = document.createElement('td');
        td.innerHTML=element.element_id;
        tr.appendChild(td);

        let input = null;

        if(element.element_type === 'label'){
            input = document.createElement('th');
            input.innerHTML = element.element_txt !== undefined ? element.element_txt.bold() : '';
            input.setAttribute('align', 'center');
        }
        else if(element.element_type === 'text'){
            input = document.createElement('input');
            input.size=48;
            if(element.element_placeholder_txt !== undefined && element.value === null){
                input.value = element.element_placeholder_txt;
            } else {
                input.value = element.value;
            }
            //Set up an event listener that modifies the cell's attributes
            //when the input's text is changed.
            //This function selects which part to change according to
            //the field's type.
            input.addEventListener('input', () => {
                console.log(element.element_instance);
                const field = graph.getModel().getCell(element.element_instance);
                graph.getModel().beginUpdate();
                try{
					let edit = new mxCellAttributeChange(
                            field, 
                            ['attr_text', 'method_text'].includes(element.element_field_type) 
                                ? 'label' : 'description',
							input.value);
                    graph.getModel().execute(edit);
                    element.value = input.value;
				}
				finally{
					graph.getModel().endUpdate();
				}
            });
        }
        else if(element.element_type === 'combo'){
            input = document.createElement('select');
            let index = 0;
            element.element_items.forEach(optionText => {
                const option = document.createElement('option');
                option.value = index++;
                option.text = optionText;
                input.appendChild(option);
            });
        } else if(element.element_type === 'textarea'){
            input = document.createElement('textarea');
            input.cols = 50;
            input.rows = 10;
            if(element.value !== null){
                input.value = element.value;
            }
            input.addEventListener('input', () => {
                const cell = graph.getModel().getCell(element.element_instance);
                graph.getModel().beginUpdate();
                try{
					let edit = new mxCellAttributeChange(
                            cell, 
                            'information',
							input.value);
                    graph.getModel().execute(edit);
                    element.value = input.value;
                    console.log('element.value :', element.value);
				}
				finally{
					graph.getModel().endUpdate();
				}
            });
        } else if(element.element_type === 'button') {
            input = document.createElement('div');
            const b1 = document.createElement('button');
            b1.innerHTML = element.button1_txt !== undefined ? element.button1_txt.bold() : '';
            b1.addEventListener('click', () => {
                //Add field to class
                //If attributes, get second child, otherwise get the third (for methods);
                const field_container = cell.getChildAt(element.element_prefix === 'attribute' ? 1 : 2);
                const n_children = field_container.getChildCount();

                const field_type = element.element_prefix;
                const doc_field = mxUtils.createXmlDocument();
                const node_field = doc_field.createElement(field_type);
                node_field.setAttribute('type', field_type);
                node_field.setAttribute('label', element.element_prefix === 'attribute' ? '- attribute : type' : '- method()');
                node_field.setAttribute('description', '');
                const field = graph.insertVertex(field_container, null, node_field, 1, (20 * n_children) + 1, 98, 18,'fillColor=#FFFFFF;selectable=0;align=left;fontColor=black;strokeColor=none;');
                field.setConnectable(false);

                //Handle Class Resize
                handleResize(null, {getProperty(_string) {return [cell];}});

                const count = (structure.basic_information[element.element_prefix+'s'].length - 1)/2 + 1;
                structure.basic_information[element.element_prefix+'s'].push(
                    {
                        element_id: element.element_prefix+`${count}-name`, 
                        element_type: 'text',
                        element_instance: field.getId(),
                        element_field_type: element.element_prefix === 'attribute' ? 'attr_text' : 'method_text', 
                        value: element.element_prefix === 'attribute' ? '- attribute : type' : '- method()'
                    },
                    {   element_id: element.element_prefix+`${count}-Description`, 
                        element_type: 'text',
                        element_instance: field.getId(),
                        element_field_type: element.element_prefix === 'attribute' ? 'attr_desc' : 'method_desc',
                        value: ''
                    }
                );
                let main_modal_body = document.getElementById('main_modal_body');
                main_modal_body.innerHTML="";
                let c_body = modalComponentInformation(structure, idx_cat, idx_subcat, cell, graph, handleResize);
                main_modal_body.appendChild(c_body);
            });
            const b2 = document.createElement('button');
            b2.innerHTML = element.button2_txt !== undefined ? element.button2_txt.bold() : '';
            b2.addEventListener('click', () => {
                if(structure.basic_information[element.element_prefix+'s'].length > 1){
                    structure.basic_information[element.element_prefix+'s'].pop();
                    structure.basic_information[element.element_prefix+'s'].pop();
                    let main_modal_body = document.getElementById('main_modal_body');
                    main_modal_body.innerHTML="";
                    let c_body = modalComponentInformation(structure, idx_cat, idx_subcat, cell, graph, handleResize);
                    main_modal_body.appendChild(c_body);
                    const container = cell.getChildAt(element.element_prefix === 'attribute' ? 1 : 2);
                    const lastCell = container.getChildAt(container.getChildCount()-1);
                    graph.removeCells([lastCell]);

                    //Handle Class Resize
                    handleResize(null, {getProperty(_string) {return [cell];}});
                }
            });
            input.appendChild(b1);
            input.appendChild(b2);
        } else {
            alert("A problem occurred");
        }

        let td2 = document.createElement('td');
        if(input !== null){
            input.addEventListener('input', function(){
                element.value = input.value;
            });
            if(element.value !== undefined && element.value !== null){
                if(element.element_type === 'combo'){
                    input.selectedIndex = element.value;
                } else {
                    input.value = element.value;
                    input.innerHTML = element.value;
                }
            }
            td2.appendChild(input);
        }
        tr.appendChild(td2);
        table.appendChild(tr);
    });
    return table;
}

/* end util */