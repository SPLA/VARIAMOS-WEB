var setup_elements = function setup_elements(graph, elements, toolbar){
    //var elements="";
    //elements=model_specific_main(graph);
    
    for (var i = 0; i < elements.length; i++) {
        addVertex(graph, toolbar, elements[i].src, elements[i].wd, elements[i].hg, elements[i].style, elements[i].type, elements[i].pname, elements[i].attr);
    }

    function addVertex(graph, toolbar, icon, w, h, style, type, namepalette, attributes)
    {
        var doc = mxUtils.createXmlDocument();
        var node = doc.createElement(type);
        node.setAttribute('label', type);
        node.setAttribute('type', type);
        
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
            var rootCounter = 0;
			graph.stopEditing(false);

			var pt = graph.getPointForEvent(evt);
			var vertex = graph.getModel().cloneCell(prototype);
			if(prototype.getAttribute("type") === "root"){
               var cells = graph.getModel().cells
                Object.keys(cells).forEach(function(key) {
                if(mxUtils.isNode(cells[key]['value'])){
                    if(cells[key].getAttribute("type") == "root"){
                        rootCounter ++;
                    } 
                }
                });
				if(rootCounter >= 1){
					alert("Only 1 root")
					return
				}else{
					rootCounter ++;
				}
			}

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