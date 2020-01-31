let setup_elements = function setup_elements(graph, elements, custom_attributes, c_clon_cells, c_constraints_ic, toolbar, c_type){    
    if(elements==null){
        //disable palette for "binding" models
        let tbContainer = document.getElementById('tbContainer');
        let span = document.createElement('span');
        span.innerHTML = global.messages["setup_elements_palette_no_elements"];
        tbContainer.appendChild(span);
    }else{
        //add elements to the palette
        for (let i = 0; i < elements.length; i++) {
            addVertex(graph, toolbar, elements[i].src, elements[i].wd, elements[i].hg, elements[i].style, elements[i].type, elements[i].pname, custom_attributes, c_clon_cells, c_constraints_ic);
        }
    }

    function addVertex(graph, toolbar, icon, w, h, style, type, namepalette, custom_attributes, c_clon_cells, c_constraints_ic)
    {
        let doc = mxUtils.createXmlDocument();
        let node = doc.createElement(type);
        node.setAttribute('type', type);

        //include custom attributes
        if(custom_attributes){
            for (let z = 0; z < custom_attributes.length; z++) {
                if((custom_attributes[z]["types"].indexOf(type) > -1)){
                    for(let j = 0; j < custom_attributes[z]["custom_attributes"].length; j++){
                        node.setAttribute(custom_attributes[z]["custom_attributes"][j]["name"], custom_attributes[z]["custom_attributes"][j]["def_value"]);
                    }
                }
            }
        }
        
        let vertex = new mxCell(node, new mxGeometry(0, 0, w, h), style);
        vertex.setConnectable(true);
        vertex.setVertex(true);

        if(c_constraints_ic != null && c_constraints_ic[type]){
            addToolbarItem(graph, toolbar, vertex, icon, namepalette, c_clon_cells, c_constraints_ic[type]);
        }else{
            addToolbarItem(graph, toolbar, vertex, icon, namepalette, c_clon_cells, "");
        }
    }

    function addToolbarItem(graph, toolbar, prototype, image, namepalette, c_clon_cells, c_constraints_ic)
    {
        // Function that is executed when the image is dropped on
        // the graph. The cell argument points to the cell under
        // the mousepointer if there is one.
        let funct = function(graph, evt, cell)
		{
            let oncreation_allowed = true;

            if(c_constraints_ic!=""){
                //prototype is the toolbar item
                //cell is what is underneath
                oncreation_allowed = c_constraints_ic(prototype, cell);
            }

            if(oncreation_allowed){
                graph.stopEditing(false);
                let pt = graph.getPointForEvent(evt);
                let vertex = graph.getModel().cloneCell(prototype);
                vertex.geometry.x = pt.x;
                vertex.geometry.y = pt.y;

                let new_cells = graph.importCells([vertex], 0, 0, cell);
                //Set up handling of new classes.
                new_cells.forEach(element => {
                    const type = element.getAttribute("type");
                    if(["class"].includes(type)){
                        const class_name_type = 'class_name';
                        const doc_name = mxUtils.createXmlDocument();
                        const node_name = doc_name.createElement(class_name_type);
                        node_name.setAttribute('type', class_name_type);
                        node_name.setAttribute('label', '');
                        const class_name = graph.insertVertex(element,null,node_name,0,0,100,20,'fillColor=#FFFFFF;selectable=0;fontColor=black;');
                        class_name.setConnectable(false);

                        const class_attributes_type = 'class_attributes';
                        const doc_attributes = mxUtils.createXmlDocument();
                        const node_attributes = doc_attributes.createElement(class_attributes_type);
                        node_attributes.setAttribute('type', class_attributes_type);
                        const class_attributes = graph.insertVertex(element,null,node_attributes,0,20,100,40,'fillColor=#FFFFFF;selectable=0;');
                        class_attributes.setConnectable(false);

                        /* const placeholder_attribute_type = 'attribute';
                        const doc_placeholder_attribute = mxUtils.createXmlDocument();
                        const node_placeholder_attribute = doc_placeholder_attribute.createElement(placeholder_attribute_type);
                        node_placeholder_attribute.setAttribute('type', placeholder_attribute_type);
                        node_placeholder_attribute.setAttribute('label', '- attribute : type')
                        const placeholder_attribute = graph.insertVertex(class_attributes,null,node_placeholder_attribute,1,1,98,18,'fillColor=#FFFFFF;selectable=0;align=left;fontColor=black;strokeColor=none;');
                        placeholder_attribute.setConnectable(false); */

                        const class_methods_type = 'class_methods';
                        const doc_methods = mxUtils.createXmlDocument();
                        const node_methods = doc_methods.createElement(class_methods_type);
                        node_methods.setAttribute('type', class_methods_type);
                        const class_methods = graph.insertVertex(element,null,node_methods,0,60,100,40,'fillColor=#FFFFFF;selectable=0;');
                        class_methods.setConnectable(false);

                        /* const placeholder_method_type = 'method';
                        const doc_placeholder_method = mxUtils.createXmlDocument();
                        const node_placeholder_method = doc_placeholder_method.createElement(placeholder_method_type);
                        node_placeholder_method.setAttribute('type', placeholder_method_type);
                        node_placeholder_method.setAttribute('label', '- method()')
                        const placeholder_method = graph.insertVertex(class_methods,null,node_placeholder_method,1,1,98,18,'fillColor=#FFFFFF;selectable=0;align=left;fontColor=black;strokeColor=none;');
                        placeholder_method.setConnectable(false); */
                    }
                })
                graph.setSelectionCells(new_cells);
            }

		}
        
        let tbContainer = document.getElementById('tbContainer');
        let mdiv = document.createElement('div');
        let span = document.createElement('span');
        span.innerHTML = namepalette+"<br />";
        mdiv.appendChild(span);

        // Creates the image which is used as the drag icon (preview)
        let img = toolbar.addMode(namepalette, image, funct);
        mxUtils.makeDraggable(img, graph, funct);
        
        mdiv.classList.add("pallete-div"); 
        mdiv.appendChild(img);
        tbContainer.appendChild(mdiv);
    }
}

export default setup_elements