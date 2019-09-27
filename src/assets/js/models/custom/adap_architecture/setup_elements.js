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
        node.setAttribute('label', type);
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
                //Implementation of default style for adap_architecture
    switch (new_cells[0].getAttribute("type")) {
        case "layer":
            personal_shapes(graph, 0, new_cells[0]);
            break;
        case "module":
            personal_shapes(graph,1, new_cells[0]);
            break;
        case "package":
            personal_shapes(graph, 2, new_cells[0]);
            break;
        case "device":
            personal_shapes(graph, 3, new_cells[0]);
            break;
        case "software":
            personal_shapes(graph, 4, new_cells[0]);
            break;
        case "sensor":
            personal_shapes(graph, 5, new_cells[0]);
            break;
        case "actuator":
            personal_shapes(graph, 6, new_cells[0]);
            break;
        case "resource":
            personal_shapes(graph, 7, new_cells[0]);
            break;
        case "network":
            personal_shapes(graph, 8, new_cells[0]);
            break;
        case "computer":
            personal_shapes(graph, 9, new_cells[0]);
            break;
        default:
            break;
    }

                //execute if there are clons for the current element
                if(c_clon_cells!=null){
                    let type = new_cells[0].getAttribute("type");
                    if(c_clon_cells[type]){ //clon cell in a new model
                        graph.getModel().prefix="clon"; //cloned cell contains clon prefix
                        graph.getModel().nextId=graph.getModel().nextId-1;
                        let vertex2 = graph.getModel().cloneCell(new_cells[0]);
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

    function personal_shapes(graph, pos, new_cells){

        graph.setCellStyles(mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_TOP, [new_cells]);
        graph.setCellStyles(mxConstants.STYLE_FONTSIZE, 9, [new_cells]);
        graph.setCellStyles(mxConstants.STYLE_ALIGN, mxConstants.ALIGN_CENTER, [new_cells]);
        var overlay_left = null;
        var overlay_rigth = null;
        
        if(pos == 0 ){
            //image frame
            graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, "transparent", [new_cells]);
            overlay_left = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/layer-frame.png', 16, 16), 'Overlay tooltip');
            overlay_left.offset = new mxPoint(10,10);

        }
        if(pos == 1 ){
            //image frame
            graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, "transparent", [new_cells]);
            overlay_left = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/module-frame.png', 16, 16), 'Overlay tooltip');
            overlay_rigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/paralelo.png', 16, 16), 'Overlay tooltip');
            overlay_left.offset = new mxPoint(10,10);
        }
            /*
            new_cells.setValue({'type':'boundary'});
            console.log(new_cells);

            const uuidv1 = require('uuid/v1');
		    //this.name points to the id of the cell that contains the element.  
		    const currentCell = new_cells;
		    graph.setCellStyles(mxConstants.STYLE_RESIZE_WIDTH, boundary.geometry.width , [currentCell]);
		    //console.log(currentCell);
		    const parent = currentCell.getParent();
	
		    currentCell.setAttribute('boundary', true);
		    //graph.stopEditing(false);
		    graph.getModel().beginUpdate();
		    try {
                    const boundaryCell = graph.insertVertex(parent, uuidv1(), '', currentCell.getGeometry().x, currentCell.getGeometry().y, 100, 100, 'shape=rectangle;fillColor=none;arcSize=15;');
                    boundaryCell.setConnectable(false);
                    boundaryCell.setValue({'type':'boundary'});
                    graph.groupCells(boundaryCell, 0, [currentCell]);
                    const geo = currentCell.getGeometry();
                    geo.x = 0;
                    geo.y = 0;
                    graph.setCellStyles(mxConstants.STYLE_MOVABLE, '0', [currentCell])
                    //Set the size of the boundary.
                    let boundaryH = 300;
                    let boundaryW = 300;
                    //If the boundary was already set before, set it to the old limits.
                    if(currentCell.boundarySize !== undefined){
                        boundaryH = currentCell.boundarySize.height;
                        boundaryW = currentCell.boundarySize.width;
                    delete currentCell.boundarySize;
                    }
                    //Apply the changes. The bounds indicate the absolute shape of the cell.
                    const bounds = new mxRectangle(boundaryCell.getGeometry().x, boundaryCell.getGeometry().y, boundaryW, boundaryH);
                    graph.resizeCell(boundaryCell, bounds);
                    //Find any edges that were promoted and remove them.
                    const edgeCount = currentCell.getEdgeCount();
                    const promotedEdges = [];
                    if (edgeCount > 0){
                    for(let i = 0; i < edgeCount; i++){
                        const edge = currentCell.getEdgeAt(i);
                        if(edge.promotedEdge !== undefined && edge.promotedEdge){
                        promotedEdges.push(edge);
                        }
                    }
                    }
                    //Remove the edges that were promoted.
                    graph.removeCells(promotedEdges);
                    //If there were elements that existed previously, reconstruct them.
                    const newCells = new Map;
                    if(currentCell.elements !== undefined){
                    //key is the id of the old cell
                    //value contains the cell.
                        for(let [key, value] of currentCell.elements){
                            const cells = graph.importCells([value], 0,0, boundaryCell);
                            //This ties the old cell's id to the new one's so that the relations can be reconstructed.
                            newCells.set(key, cells[0].getId());
                            //graph.insertVertex(boundaryCell, null, child.getValue(), childGeo.x, childGeo.y, childGeo.width, childGeo.height, child.getStyle());
                        }
                    delete currentCell.elements;
                    }
                    const done = [];
                    const boundaryGeo = boundaryCell.getGeometry();
                    if(currentCell.relations !== undefined){
                    for(let [key, value] of currentCell.relations){
                        console.log('key :', key);
                        console.log('value :', value);
                        //Within value is every edge coming or going from the <<old>> cell given by key.
                        value.forEach(edge => {
                            //For both the terminals, check if the reference is one of the cells that are destroyed, otherwise it is the normal one.
                            const sourceCell = graph.getModel().getCell(newCells.has(edge.source) ? newCells.get(edge.source) : edge.source);
                            const srcId = sourceCell.getId();
                            const targetCell = graph.getModel().getCell(newCells.has(edge.target) ? newCells.get(edge.target) : edge.target);
                            const tgtId = targetCell.getId();
                            //If the relation was already added, skip all of the code to add it.
                            if(!done.some(pair => {
                                return (pair.t1 === srcId && pair.t2 === tgtId) || (pair.t1 === tgtId && pair.t2 === tgtId);
                            })){
                                console.log('sourceCell :', sourceCell);
                                console.log('targetCell :', targetCell);
                                const newEdge = graph.insertEdge(boundaryCell, uuidv1(), edge.value, sourceCell, targetCell, edge.style);
                                if(newEdge.getAttribute('type').includes('dependum')){
                                    //Gather the state information of both the source and target elements.
                                    const sourceState = graph.view.getState(sourceCell);
                                    const sourceGeo = sourceCell.getGeometry();
                                    const targetState = graph.view.getState(targetCell);
                                    const targetGeo = targetCell.getGeometry();

                                    console.log(boundaryGeo);
                                    //Obtain the coordinates and offset to the center of the bounding rectangle.
                                    //If the state is undefined, it is because it has just been created.
                                    const initX = sourceState !== undefined ? (sourceState.origin.x + (sourceGeo.width/2)) : (boundaryGeo.x + sourceGeo.getCenterX());
                                    const initY = sourceState !== undefined ? (sourceState.origin.y + (sourceGeo.height/2)) : (boundaryGeo.y + sourceGeo.getCenterY());
                                    const destX = targetState !== undefined ? (targetState.origin.x + (targetGeo.width/2)) : (boundaryGeo.x + targetGeo.getCenterX());
                                    const destY = targetState !== undefined ? (targetState.origin.y + (targetGeo.height/2)) : (boundaryGeo.y + targetGeo.getCenterY());
                                    //Calculate the angle given by the edge in its current orientation.
                                    const angle = (Math.atan2(destY-initY,destX-initX) * (180/Math.PI)).toFixed(0);
                                    //Insert a new element onto the the edge with the calculated angle.
                                    const capitald = graph.insertVertex(newEdge,uuidv1(),null,0,0,20,20,'shape=capitald;fillColor=#FFFFFF;rotation='+angle+';');
                                    //Set the offset of the element so that it is centered. 
                                    capitald.geometry.offset = new mxPoint(-10, -10);
                                    capitald.geometry.relative = true;
                                    //Set the element as unconnectable.
                                    capitald.connectable = false;
                                }
                                done.push({t1:sourceCell.getId(),t2:targetCell.getId()});
                            }
                        })
                }
            }
            
		} finally {
		  //console.log(currentCell.getAttribute('boundary'))
		  graph.getModel().endUpdate();
        }
        */
	    
        if(pos == 2 ){
            //image frame
            graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, "transparent", [new_cells]);
            overlay_left = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/package.png', 16, 16), 'Overlay tooltip');
            overlay_left.offset = new mxPoint(10,10);
            

        }
        if(pos == 3 ){
            //image frame
            graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, '#CCFFCC', [new_cells]);
            overlay_left = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/DEVICES.png', 16, 16), 'Overlay tooltip');
            overlay_rigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/Electric.png', 16, 16), 'Overlay tooltip');
            overlay_left.offset = new mxPoint(10,10);

        }
        if(pos == 4 ){
            //image frame
            graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, '#CCFFCC', [new_cells]);
            overlay_left = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/software.png', 16, 16), 'Overlay tooltip');
            overlay_rigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/OS.png', 16, 16), 'Overlay tooltip');
            overlay_left.offset = new mxPoint(10,10);

        }
        if(pos == 5 ){
            //image frame
            graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, '#CCFFCC', [new_cells]);
            overlay_left = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/Sensor.png', 16, 16), 'Overlay tooltip');
            overlay_rigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/digital.png', 16, 16), 'Overlay tooltip');
            overlay_left.offset = new mxPoint(10,10);

        }
        if(pos == 6 ){
            //image frame
            graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, '#CCFFCC', [new_cells]);
            overlay_left = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/actuator.png', 16, 16), 'Overlay tooltip');
            overlay_left.offset = new mxPoint(10,10);

        }
        if(pos == 7 ){
            //image frame
            graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, '#CCFFCC', [new_cells]);
            var overlay_left = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/resource.png', 16, 16), 'Overlay tooltip');
            overlay_rigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/cyber.png', 16, 16), 'Overlay tooltip');
            overlay_left.offset = new mxPoint(10,10);
        }
        if(pos == 8 ){
            //image frame
            graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, '#CCFFCC', [new_cells]);
            var overlay_left = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/network.png', 16, 16), 'Overlay tooltip');
            overlay_rigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/internet.png', 16, 16), 'Overlay tooltip');
            overlay_left.offset = new mxPoint(10,10);

        }
        if(pos == 9 ){
            //image frame
            graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, '#CCFFCC', [new_cells]);
            var overlay_left = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/computer.png', 16, 16), 'Overlay tooltip');
            overlay_rigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/internet.png', 16, 16), 'Overlay tooltip');
            overlay_left.offset = new mxPoint(10,10);

        }

        if (overlay_rigth != null){
            overlay_rigth.align = mxConstants.ALIGN_RIGTH;
			overlay_rigth.verticalAlign = mxConstants.ALIGN_TOP;	
            overlay_rigth.offset = new mxPoint(-10,10);
            graph.addCellOverlay(new_cells, overlay_rigth);
        }

        overlay_left.align = mxConstants.ALIGN_LEFT;
        overlay_left.verticalAlign = mxConstants.ALIGN_TOP;	
        graph.addCellOverlay(new_cells, overlay_left);
    }
}

export default setup_elements