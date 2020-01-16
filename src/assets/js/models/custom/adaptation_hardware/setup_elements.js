let setup_elements = function setup_elements(graph, elements, custom_attributes, c_clon_cells, c_constraints_ic, toolbar, c_type){
    if(elements==null){
        //disable palette for "binding" models
        let tbContainer = document.getElementById('tbContainer');
        let span = document.createElement('span');
        span.innerHTML = global.messages["setup_elements_palette_no_elements"];
        tbContainer.appendChild(span);
    }else{
        //add elements to the palette
        if(!custom_attributes){
            custom_attributes=[];
        }
        for (let i = 0; i < elements.length; i++) {
            //select custom attributes coco
            let element=elements[i];
            let type=element.type;
            let attributes=[];
            if(custom_attributes){
                for (let z = 0; z < custom_attributes.length; z++) {
                    if((custom_attributes[z]["types"].indexOf(type) > -1)){
                        attributes=custom_attributes[z]["custom_attributes"];
                    }
                }
            }
            if(element.attributes){
                for (let a = 0; a < element.attributes.length; a++) {
                    let attribute=element.attributes[a];
                    let name=attribute.name;
                    let value=attribute.def_value;
                    let exists=false;
                    for(let j = 0; j < attributes.length; j++){
                        if(attributes[j]["name"]==name){
                            attributes[j]["def_value"]=value;
                            exists=true;
                        }
                    }
                    if(!exists){
                        attributes.push({
                            "name":name,
                            "def_value":value
                        });
                    }
                }
            }

            addVertex(graph, toolbar, elements[i].src, elements[i].wd, elements[i].hg, elements[i].style, elements[i].type, elements[i].pname, attributes, c_clon_cells, c_constraints_ic);
        }
    }

    function addVertex(graph, toolbar, icon, w, h, style, type, namepalette, custom_attributes, c_clon_cells, c_constraints_ic)
    {
        let doc = mxUtils.createXmlDocument();
        let node = doc.createElement(type);
        node.setAttribute('type', type);
        node.setAttribute('label', type);

        //include custom attributes
        // if(custom_attributes){
        //     for (let z = 0; z < custom_attributes.length; z++) {
        //         if((custom_attributes[z]["types"].indexOf(type) > -1)){
        //             for(let j = 0; j < custom_attributes[z]["custom_attributes"].length; j++){
        //                 node.setAttribute(custom_attributes[z]["custom_attributes"][j]["name"], custom_attributes[z]["custom_attributes"][j]["def_value"]);
        //             }
        //         }
        //     }
        // }
        if(custom_attributes){
            for(let j = 0; j < custom_attributes.length; j++){
                node.setAttribute(custom_attributes[j]["name"], custom_attributes[j]["def_value"]);
                if(custom_attributes[j]["name"]=="subtype"){
                    if(["writeAction", "readAction"].includes(type)){
                        node.setAttribute('label', custom_attributes[j]["def_value"]);
                    }
                }
            }
        }

        let vertex = new mxCell(node, new mxGeometry(0, 0, w, h), style);
        vertex.setConnectable(true);
        vertex.setVertex(true);

        if(["board"].includes(type) || ["device"].includes(type)){
            try{
                vertex.setConnectable(false);
                if(custom_attributes){

                    let width = 10;
                    let height = 10;

                    let expandedx = false;
                    let expandedy = 0;

                    for(let j = 0; j < custom_attributes.length; j++){

                        let x = 10;
                        let y = 22;
                        let o = 5;

                        if(custom_attributes[j]["name"] == "digitalPins"){

                            let args = custom_attributes[j]["def_value"];

                            for(let a = 0; a < args.length; a++){

                                let pinID = args[a];
                                let doc = mxUtils.createXmlDocument();
                                let node = doc.createElement(pinID);

                                node.setAttribute('label', pinID);
                                node.setAttribute('type', "digital");

                                let geometry = new mxGeometry(x, y, 10, 10);
                                geometry.offset = new mxPoint(0, 0);
                                geometry.relative = false;
                                let connector = new mxCell(node, geometry, "shape=ellipse;perimeter=trianglePerimeter;direction=north");
                                graph.setCellStyles(mxConstants.STYLE_MOVABLE, '0', [connector]);
                                graph.setCellStyles(mxConstants.STYLE_RESIZABLE, '0', [connector]);
                                connector.setConnectable(true);
                                connector.setVertex(true);
                                vertex.insert(connector, 0);

                                x += 15;

                                if(!expandedx && width < x) {
                                    width += 15;
                                    vertex.geometry.width = width;
                                }

                                if(x >= 10 + (15 * o)) {

                                    y += 22;
                                    x = 10;

                                    width += 15;
                                    vertex.geometry.width = width;

                                    if(!expandedx) { expandedx = true; }

                                }

                            }

                        }

                        x = 10;
                        y += 44;
                        height += 44;

                        if(custom_attributes[j]["name"] == "analogPins"){

                            let args = custom_attributes[j]["def_value"];

                            for(let a = 0; a < args.length; a++){

                                let pinID = args[a];
                                let doc = mxUtils.createXmlDocument();
                                let node = doc.createElement(pinID);
                                node.setAttribute('label', pinID);
                                node.setAttribute('type', "analog");

                                let geometry = new mxGeometry(x, y, 10, 10);
                                geometry.offset = new mxPoint(0, 0);
                                geometry.relative = false;

                                let connector = new mxCell(node, geometry, "shape=triangle;perimeter=trianglePerimeter;direction=north");
                                graph.setCellStyles(mxConstants.STYLE_MOVABLE, '0', [connector]);
                                graph.setCellStyles(mxConstants.STYLE_RESIZABLE, '0', [connector]);
                                connector.setConnectable(true);
                                connector.setVertex(true);

                                vertex.insert(connector, 0);

                                x += 15;

                                if(!expandedx && width < x) {
                                    width += 15;
                                    vertex.geometry.width = width;
                                }

                                if(x >= 10 + (15 * o)) {

                                    y += 22;
                                    x = 10;

                                    width += 15;
                                    vertex.geometry.width = width;

                                    if(!expandedx) { expandedx = true; }

                                }

                            }

                        }

                        x = 10;
                        y += 44;
                        height += 44;

                        if(custom_attributes[j]["name"] == "pwmPins"){

                            let args = custom_attributes[j]["def_value"];

                            for(let a = 0; a < args.length; a++){

                                let pinID = args[a];
                                let doc = mxUtils.createXmlDocument();
                                let node = doc.createElement(pinID);
                                node.setAttribute('label', pinID);
                                node.setAttribute('type', "pwm");

                                let geometry = new mxGeometry(x, y, 10, 10);
                                geometry.offset = new mxPoint(0, 0);
                                geometry.relative = false;
                                let connector = new mxCell(node, geometry, "shape=square;perimeter=trianglePerimeter;direction=north");
                                graph.setCellStyles(mxConstants.STYLE_MOVABLE, '0', [connector]);
                                graph.setCellStyles(mxConstants.STYLE_RESIZABLE, '0', [connector]);
                                connector.setConnectable(true);
                                connector.setVertex(true);
                                vertex.insert(connector, 0);

                                x += 15;

                                if(!expandedx && width < x) {
                                    width += 15;
                                    vertex.geometry.width = width;
                                }

                                if(x >= 10 + (15 * o)) {

                                    y += 22;
                                    x = 10;

                                    width += 15;
                                    vertex.geometry.width = width;

                                    if(!expandedx) { expandedx = true; }

                                }

                            }

                        }

                    }
                }
            }catch(error){
                alert(error);
            }
        }

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
                oncreation_allowed = c_constraints_ic(graph);
            }

            if(oncreation_allowed){
                graph.stopEditing(false);
                let pt = graph.getPointForEvent(evt);
                let vertex = graph.getModel().cloneCell(prototype);
                vertex.geometry.x = pt.x;
                vertex.geometry.y = pt.y;

                let new_cells = graph.importCells([vertex], 0, 0, cell);
                graph.setSelectionCells(new_cells);

                //execute if there are clons for the current element
                if(c_clon_cells!=null){
                    let type = new_cells[0].getAttribute("type");
                    if(c_clon_cells[type]){ //clon cell in a new model
                        graph.getModel().prefix="clon"; //cloned cell contains clon prefix
                        //graph.getModel().nextId=graph.getModel().nextId-1;
                        graph.getModel().nextId=new_cells[0].getId();
                        let vertex2 = graph.getModel().cloneCell(new_cells[0]);
                        vertex2.setConnectable(true);
                        let parent2 = graph.getModel().getCell(c_clon_cells[type]);
                        graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, "#DCDCDC", [vertex2]); //different background for a cloned cell
                        graph.importCells([vertex2], 0, 0, parent2);
                        graph.getModel().prefix=""; //restart prefix
                    }
                }
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