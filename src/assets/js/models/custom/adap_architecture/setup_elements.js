let setupElements = function setupElements(graph, elements, customAttributes, cClonCells, cConstraintsIc, toolbar, c_type){    
    if(elements == null){
        //disable palette for "binding" models
        let tbContainer = document.getElementById('tbContainer');
        let span = document.createElement('span');
        span.innerHTML = global.messages["setup_elements_palette_no_elements"];
        tbContainer.appendChild(span);
    }else{
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
            let oncreationAllowed = true;

            if(cConstraintsIc != ""){
                oncreationAllowed = cConstraintsIc(graph);
            }
            if(oncreationAllowed){
                graph.stopEditing(false);
                let pt = graph.getPointForEvent(evt);
                let vertex = graph.getModel().cloneCell(prototype);
                vertex.geometry.x = pt.x;
                vertex.geometry.y = pt.y;
                let newCells = graph.importCells([vertex], 0, 0, cell);
                graph.setSelectionCells(newCells);

                //Implementation of default style for adap_architecture
                switch (newCells[0].getAttribute("type")) {
                    case "layer":
                        personalShapes(graph, 0, newCells[0]);
                        let doc = mxUtils.createXmlDocument();
                        let node = doc.createElement("layer");
                        let geometry = new mxGeometry(0, 0, 600, 180);
                        geometry.offset = new mxPoint(0, 0);
                        geometry.relative = false;
                        let connector = new mxCell(node, geometry, "");
                        graph.setCellStyles(mxConstants.STYLE_MOVABLE, "0", [connector]);
                        graph.setCellStyles(mxConstants.STYLE_RESIZABLE, "0", [connector]);
                        connector.setConnectable(false);
                        connector.setVertex(false);
                        graph.addCell(connector, newCells[0]);
            
                        break;
                    case "module":
                        personalShapes(graph,1, newCells[0]);
                        
                        doc = mxUtils.createXmlDocument();
                        node = doc.createElement("module");
                        geometry = new mxGeometry(0, 0, 300, 150);
                        geometry.offset = new mxPoint(0, 0);
                        geometry.relative = false;
                        connector = new mxCell(node, geometry, "");
                        graph.setCellStyles(mxConstants.STYLE_MOVABLE, "0", [connector]);
                        graph.setCellStyles(mxConstants.STYLE_RESIZABLE, "0", [connector]);
                        connector.setConnectable(false);
                        connector.setVertex(false); 
                        graph.addCell(connector, newCells[0]); 
            
                        break;
                    case "package":
                        personalShapes(graph, 2, newCells[0]);
                        doc = mxUtils.createXmlDocument();
                        node = doc.createElement("package");
                        geometry = new mxGeometry(0, 0, 200, 130);
                        geometry.offset = new mxPoint(0, 0);
                        geometry.relative = false;
                        connector = new mxCell(node, geometry, "");
                        graph.setCellStyles(mxConstants.STYLE_MOVABLE, "0", [connector]);
                        graph.setCellStyles(mxConstants.STYLE_RESIZABLE, "0", [connector]);
                        connector.setConnectable(false);
                        connector.setVertex(false);
                        graph.addCell(connector, newCells[0]);
            
                        break;
                    case "device":
                        personalShapes(graph, 3, newCells[0]);
                        break;
                    case "software":
                        personalShapes(graph, 4, newCells[0]);
                        break;
                    case "sensor":
                        personalShapes(graph, 5, newCells[0]);
                        break;
                    case "actuator":
                        personalShapes(graph, 6, newCells[0]);
                        break;
                    case "resource":
                        personalShapes(graph, 7, newCells[0]);
                        break;
                    case "network":
                        personalShapes(graph, 8, newCells[0]);
                        break;
                    case "computer":
                        personalShapes(graph, 9, newCells[0]);
                        break;
                    case "b_variable":
                        personalShapes(graph, 10, newCells[0]);
                        break;         
                    case "p_variable":
                        personalShapes(graph, 11, newCells[0]);
                        break;          
                    case "e_variable":
                        personalShapes(graph, 12, newCells[0]);
                        break;
                    case "port_in":
                        personalShapes(graph, 13, newCells[0]);
                        geometry = new mxGeometry(0, 16, 16, 16);
                        break;    
                    case "port_out":
                        personalShapes(graph, 14, newCells[0]);
                        break;                                                                                                                                                        
                    default:
                        break;
                }
                //execute if there are clons for the current element
                if(cClonCells != null){
                    let type = newCells[0].getAttribute("type");
                    if(cClonCells[type]){ //clon cell in a new model
                        graph.getModel().prefix = "clon"; //cloned cell contains clon prefix
                        graph.getModel().nextId=graph.getModel().nextId-1;
                        let vertex2 = graph.getModel().cloneCell(newCells[0]);
                        let parent2 = graph.getModel().getCell(cClonCells[type]);
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

    function personalShapes(graph, pos, newCells){
        graph.setCellStyles(mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_TOP, [newCells]);
        graph.setCellStyles(mxConstants.STYLE_FONTSIZE, 9, [newCells]);
        graph.setCellStyles(mxConstants.STYLE_ALIGN, mxConstants.ALIGN_CENTER, [newCells]);
        
        let overlayLeft = null;
        let overlayRigth = null;
         
        if(pos == 0 ){
            //image frame
            graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, "transparent", [newCells]);
            overlayLeft = new mxCellOverlay(new mxImage('images/models/adap_architecture/layer.png', 16, 16), 'Overlay tooltip');
            overlayLeft.offset = new mxPoint(10,10);

        }
        if(pos == 1 ){
            //image frame
            graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, "transparent", [newCells]);
            overlayLeft = new mxCellOverlay(new mxImage('images/models/adap_architecture/module.png', 16, 16), 'Overlay tooltip');
            overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/paralelo.png', 16, 16), 'Overlay tooltip');
            overlayLeft.offset = new mxPoint(10,10);
        }
	    
        if(pos == 2 ){
            //image frame
            graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, "transparent", [newCells]);
            overlayLeft = new mxCellOverlay(new mxImage('images/models/adap_architecture/package.png', 16, 16), 'Overlay tooltip');
            overlayLeft.offset = new mxPoint(10,10);
        }
        if(pos == 3 ){
            //image frame
            graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, "#FFFFFF", [newCells]);
            overlayLeft = new mxCellOverlay(new mxImage('images/models/adap_architecture/device.png', 16, 16), 'Overlay tooltip');
            overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/electric.png', 16, 16), 'Overlay tooltip');
            overlayLeft.offset = new mxPoint(10,10);
        }
        if(pos == 4 ){
            //image frame
            graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, "#FFFFFF", [newCells]);
            overlayLeft = new mxCellOverlay(new mxImage('images/models/adap_architecture/software.png', 16, 16), 'Overlay tooltip');
            overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/os.png', 16, 16), 'Overlay tooltip');
            overlayLeft.offset = new mxPoint(10,10);
        }
        if(pos == 5 ){
            //image frame
            graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, "#FFFFFF", [newCells]);
            overlayLeft = new mxCellOverlay(new mxImage('images/models/adap_architecture/sensor.png', 16, 16), 'Overlay tooltip');
            overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/digital.png', 16, 16), 'Overlay tooltip');
            overlayLeft.offset = new mxPoint(10,10);
        }
        if(pos == 6 ){
            //image frame
            graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, "#FFFFFF", [newCells]);
            overlayLeft = new mxCellOverlay(new mxImage('images/models/adap_architecture/actuator.png', 16, 16), 'Overlay tooltip');
            overlayLeft.offset = new mxPoint(10,10);
        }
        if(pos == 7 ){
            //image frame
            graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, "#FFFFFF", [newCells]);
            overlayLeft = new mxCellOverlay(new mxImage('images/models/adap_architecture/resource.png', 16, 16), 'Overlay tooltip');
            overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/cyber.png', 16, 16), 'Overlay tooltip');
            overlayLeft.offset = new mxPoint(10,10);
        }
        if(pos == 8 ){
            //image frame
            graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, "#FFFFFF", [newCells]);
            overlayLeft = new mxCellOverlay(new mxImage('images/models/adap_architecture/network.png', 16, 16), 'Overlay tooltip');
            overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/internet.png', 16, 16), 'Overlay tooltip');
            overlayLeft.offset = new mxPoint(10,10);
        }
        if(pos == 9 ){
            //image frame
            graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, "#FFFFFF", [newCells]);
            overlayLeft = new mxCellOverlay(new mxImage('images/models/adap_architecture/computer.png', 16, 16), 'Overlay tooltip');
            overlayRigth = new mxCellOverlay(new mxImage('images/models/adap_architecture/icons/cloudComputer.png', 16, 16), 'Overlay tooltip');
            overlayLeft.offset = new mxPoint(10,10);
        }
        if(pos == 10 ){
            //image frame
            graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, "#FFFFFF", [newCells]);
            overlayLeft = new mxCellOverlay(new mxImage('images/models/adap_architecture/b_variable.png', 16, 16), 'Overlay tooltip');
            overlayLeft.offset = new mxPoint(10,10);
        }
        if(pos == 11 ){
          //image frame
          graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, "#FFFFFF", [newCells]);
          overlayLeft = new mxCellOverlay(new mxImage('images/models/adap_architecture/p_variable.png', 16, 16), 'Overlay tooltip');
          overlayLeft.offset = new mxPoint(10,10);
        }
        if(pos == 12 ){
          //image frame
          graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, "#FFFFFF", [newCells]);
          overlayLeft = new mxCellOverlay(new mxImage('images/models/adap_architecture/e_variable.png', 16, 16), 'Overlay tooltip');
          overlayLeft.offset = new mxPoint(10,10);
        }
        if(pos == 13 ){
          //image frame
          newCells.setAttribute("label","");
          graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, "#FFBB33", [newCells]);
          graph.setCellStyles(mxConstants.STYLE_SHAPE, 'triangle', [newCells]);
          graph.setCellStyles(mxConstants.STYLE_DIRECTION, 'north', [newCells]);
          overlayLeft = new mxCellOverlay(new mxImage('images/models/adap_architecture/port_in.png', 16, 16), 'Overlay tooltip');
          overlayLeft.offset = new mxPoint(18,18);
        }
        if(pos == 14 ){
          //image frame
          newCells.setAttribute("label","");
          graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, "#FFBB33", [newCells]);
          graph.setCellStyles(mxConstants.STYLE_SHAPE, 'triangle', [newCells]);
          graph.setCellStyles(mxConstants.STYLE_DIRECTION, 'south', [newCells]);
          overlayLeft = new mxCellOverlay(new mxImage('images/models/adap_architecture/port_out.png', 16, 16), 'Overlay tooltip');
          overlayLeft.offset = new mxPoint(18,18);
        }

        if (overlayRigth != null){
            overlayRigth.align = mxConstants.ALIGN_RIGTH;
			      overlayRigth.verticalAlign = mxConstants.ALIGN_TOP;	
            overlayRigth.offset = new mxPoint(-10,10);
            graph.addCellOverlay(newCells, overlayRigth);
        }

        overlayLeft.align = mxConstants.ALIGN_LEFT;
        overlayLeft.verticalAlign = mxConstants.ALIGN_TOP;	
        graph.addCellOverlay(newCells, overlayLeft);
    }
}

export default setupElements