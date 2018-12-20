var setup_elements = function setup_elements(graph, elements, custom_attributes, c_clon_cells, c_constraints_ic, toolbar, c_type){    
    
    if(c_type=="binding"){
        //disable palette for "binding" models
        var tbContainer = document.getElementById('tbContainer');
        var span = document.createElement('span');
        span.innerHTML = messages["setup_elements_palette_binding"];
        tbContainer.appendChild(span);
    }else{
        //add elements to the palette
        for (var i = 0; i < elements.length; i++) {
            addVertex(graph, toolbar, elements[i].src, elements[i].wd, elements[i].hg, elements[i].style, elements[i].type, elements[i].pname, custom_attributes, c_clon_cells, c_constraints_ic);
        }
    }

    function addVertex(graph, toolbar, icon, w, h, style, type, namepalette, custom_attributes, c_clon_cells, c_constraints_ic)
    {
        var doc = mxUtils.createXmlDocument();
        var node = doc.createElement(type);
        node.setAttribute('label', type);
        node.setAttribute('type', type);

        //include custom attributes
        if(custom_attributes){
            for (var z = 0; z < custom_attributes.length; z++) {
                if((custom_attributes[z]["types"].indexOf(type) > -1)){
                    for(var j = 0; j < custom_attributes[z]["custom_attributes"].length; j++){
                        node.setAttribute(custom_attributes[z]["custom_attributes"][j]["name"], custom_attributes[z]["custom_attributes"][j]["def_value"]);
                    }
                }
            }
        }
        
        var vertex = new mxCell(node, new mxGeometry(0, 0, w, h), style);
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
        var funct = function(graph, evt, cell)
		{
            var oncreation_allowed = true;

            if(c_constraints_ic!=""){
                oncreation_allowed = c_constraints_ic(graph);
            }

            if(oncreation_allowed){
                graph.stopEditing(false);
                var pt = graph.getPointForEvent(evt);
                var vertex = graph.getModel().cloneCell(prototype);
                vertex.geometry.x = pt.x;
                vertex.geometry.y = pt.y;

                var new_cells = graph.importCells([vertex], 0, 0, cell);
                graph.setSelectionCells(new_cells);

                //execute if there are clons for the current element
                if(c_clon_cells!=null){
                    var type = new_cells[0].getAttribute("type");
                    if(c_clon_cells[type]){ //clon cell in a new model
                        graph.getModel().prefix="clon"; //cloned cell contains clon prefix
                        graph.getModel().nextId=graph.getModel().nextId-1;
                        var vertex2 = graph.getModel().cloneCell(new_cells[0]);
                        var parent2 = graph.getModel().getCell(c_clon_cells[type]);
                        graph.importCells([vertex2], 0, 0, parent2);
                        graph.getModel().prefix=""; //restart prefix
                    }
                }
            }

		}
        
        var tbContainer = document.getElementById('tbContainer');
        var span = document.createElement('span');
        span.innerHTML = namepalette+"<br />";
        tbContainer.appendChild(span);

        // Creates the image which is used as the drag icon (preview)
        var img = toolbar.addMode(namepalette, image, funct);
        mxUtils.makeDraggable(img, graph, funct);
        
        span = document.createElement('span');
        span.innerHTML = "<br />";
        tbContainer.appendChild(span);
    }
}

export default setup_elements