var setup_elements = function setup_elements(graph, elements, custom_attributes, toolbar){    
    for (var i = 0; i < elements.length; i++) {
        addVertex(graph, toolbar, elements[i].src, elements[i].wd, elements[i].hg, elements[i].style, elements[i].type, elements[i].pname, custom_attributes);
    }

    function addVertex(graph, toolbar, icon, w, h, style, type, namepalette, custom_attributes)
    {
        var doc = mxUtils.createXmlDocument();
        var node = doc.createElement(type);
        node.setAttribute('label', type);
        node.setAttribute('type', type);

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

        addToolbarItem(graph, toolbar, vertex, icon, namepalette);
    }

    function addToolbarItem(graph, toolbar, prototype, image, namepalette)
    {
        // Function that is executed when the image is dropped on
        // the graph. The cell argument points to the cell under
        // the mousepointer if there is one.
        var funct = function(graph, evt, cell)
		{
			graph.stopEditing(false);

			var pt = graph.getPointForEvent(evt);
            var vertex = graph.getModel().cloneCell(prototype);
            vertex.geometry.x = pt.x;
			vertex.geometry.y = pt.y;
			graph.setSelectionCells(graph.importCells([vertex], 0, 0, cell));
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