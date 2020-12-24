let setupElements = function setupElements(graph, elements, customAttributes, cClonCells, cConstraintsIc, toolbar, cType){    
    if(elements == null){
        //disable palette for "binding" models
        let tbContainer = document.getElementById('tbContainer');
        let span = document.createElement('span');
        span.innerHTML = global.messages["setup_elements_palette_no_elements"];
        tbContainer.appendChild(span);
    } else {
        //add elements to the palette
        for (let i = 0; i < elements.length; i++) {
            addVertex(graph, toolbar, elements[i].src, elements[i].wd, elements[i].hg, elements[i].style, elements[i].type, elements[i].pname, customAttributes, cClonCells, cConstraintsIc);
        }
    }

    function addVertex(graph, toolbar, icon, w, h, style, type, namepalette, customAttributes, cClonCells, cConstraintsIc){
        let doc = mxUtils.createXmlDocument();
        let node = doc.createElement(type);
        node.setAttribute('label', type);
        node.setAttribute('type', type);

        //include custom attributes
        if(customAttributes){
            for (let z = 0; z < customAttributes.length; z++) {
                if((customAttributes[z]["types"].indexOf(type) > -1)){
                    for(let j = 0; j < customAttributes[z]["custom_attributes"].length; j++){
                        node.setAttribute(customAttributes[z]["custom_attributes"][j]["name"], customAttributes[z]["custom_attributes"][j]["def_value"]);
                    }
                }
            }
        }
        
        let vertex = new mxCell(node, new mxGeometry(0, 0, w, h), style);
        vertex.setConnectable(true);
        vertex.setVertex(true);

        if(cConstraintsIc != null && cConstraintsIc[type]){
            addToolbarItem(graph, toolbar, vertex, icon, namepalette, cClonCells, cConstraintsIc[type]);
        }else{
            addToolbarItem(graph, toolbar, vertex, icon, namepalette, cClonCells, "");
        }
    }

    function addToolbarItem(graph, toolbar, prototype, image, namepalette, cClonCells, cConstraintsIc){
        // Function that is executed when the image is dropped on
        // the graph. The cell argument points to the cell under
        // the mousepointer if there is one.
        let funct = function(graph, evt, cell){
            let onCreationAllowed = true;

            if(cConstraintsIc != ""){
                onCreationAllowed = cConstraintsIc(graph);
            }

            if(onCreationAllowed){
                graph.stopEditing(false);
                let pt = graph.getPointForEvent(evt);
                let vertex = graph.getModel().cloneCell(prototype);
                vertex.geometry.x = pt.x;
                vertex.geometry.y = pt.y;

                let newCells = graph.importCells([vertex], 0, 0, cell);
                graph.setSelectionCells(newCells);

                //execute if there are clons for the current element
                if(cClonCells != null){
                    let type = newCells[0].getAttribute("type");
                    if(cClonCells[type]){ //clon cell in a new model
                        graph.getModel().prefix="clon"; //cloned cell contains clon prefix
                        graph.getModel().nextId=graph.getModel().nextId-1;
                        let vertex2 = graph.getModel().cloneCell(newCells[0]);
                        let parent2 = graph.getModel().getCell(cClonCells[type]);
                        graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, "#DCDCDC", [vertex2]); //different background for a cloned cell
                        graph.importCells([vertex2], 0, 0, parent2);
                        graph.getModel().prefix = ""; //restart prefix
                    }
                }
            }

        }
        
        let tbContainer = document.getElementById('tbContainer');
        let mdiv = document.createElement('div');
        let span = document.createElement('span');
        span.innerHTML = namepalette + "<br />";
        mdiv.appendChild(span);

        // Creates the image which is used as the drag icon (preview)
        let img = toolbar.addMode(namepalette, image, funct);
        mxUtils.makeDraggable(img, graph, funct);
        
        mdiv.classList.add("pallete-div"); 
        mdiv.appendChild(img);
        tbContainer.appendChild(mdiv);
    }
}

export default setupElements