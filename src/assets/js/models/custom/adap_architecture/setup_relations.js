let setup_relations = function setup_relations(graph, relations, relation_styles){
    graph.connectionHandler.insertEdge = function(parent, id, value, source, target, style)
    {
        let doc = mxUtils.createXmlDocument();
        let node = doc.createElement('rel_'+source.getAttribute("type")+'_'+target.getAttribute("type"));
        node.setAttribute('type', "relation");

        //by default bidirectional edges are not allowed (disjoint)
        if(target.edges != null && target.edges.length>0){
            for (let i = 0; i < target.edges.length; i++) {
                if(target.edges[i].target.getId()==source.getId()){
                    alert(global.messages["setup_relations_bidirectional"]);
                    return null;
                }
            }
        }

        //setup custom attributes for relations
        if(relations){
            for (let i = 0; i < relations.length; i++) {
                if(relations[i]["rel_source_target"]=="and"){
                    if((relations[i]["source"].indexOf(source.getAttribute("type")) > -1) && (relations[i]["target"].indexOf(target.getAttribute("type"))> -1)){
                        for(let j = 0; j < relations[i]["attributes"].length; j++){
                            node.setAttribute(relations[i]["attributes"][j]["name"],relations[i]["attributes"][j]["def_value"]);
                        }
                    }

                }
                else{
                    if((relations[i]["source"].indexOf(source.getAttribute("type")) > -1) || (relations[i]["target"].indexOf(target.getAttribute("type"))> -1)){
                        for(let j = 0; j < relations[i]["attributes"].length; j++){
                            console.log(relations[i]["attributes"][j]["name"], relations[i]["attributes"][j]["def_value"] );
                            node.setAttribute(relations[i]["attributes"][j]["name"],relations[i]["attributes"][j]["def_value"]);
                        }
                    }
                }
            }
        }

        //setup custom styles for relations
        if(relation_styles){
            for (let i = 0; i < relation_styles.length; i++) {
                if(relation_styles[i]["rel_source_target"]=="and"){
                    if((relation_styles[i]["source"].indexOf(source.getAttribute("type")) > -1) && (relation_styles[i]["target"].indexOf(target.getAttribute("type"))> -1)){
                        style=relation_styles[i]["style"];
                    }
                }
                else{
                    if((relation_styles[i]["source"].indexOf(source.getAttribute("type")) > -1) || (relation_styles[i]["target"].indexOf(target.getAttribute("type"))> -1)){
                        style=relation_styles[i]["style"];
                         
                    }
                }
            }
        }
        
        let cell = graph.insertEdge(parent, id, node, source, target, style);
        let styles = null;

        node = doc.createElement(cell.value.attributes[2].nodeName)
        node.setAttribute('label', cell.value.attributes[2].value);
        styles = graph.insertVertex(cell, null, node , -0.7, 10, 20, 20,'fontSize=12;fontColor=black;fillColor=transparent;strokeColor=transparent', true);
        styles.geometry.offset = new mxPoint(-styles.geometry.width / 2, -styles.geometry.height / 2);
        styles.connectable = false;

        node = doc.createElement(cell.value.attributes[3].nodeName)
        node.setAttribute('label', cell.value.attributes[3].value);
        styles = graph.insertVertex(cell, null, node , 0.7, 10, 20, 20,'fontSize=12;fontColor=black;fillColor=transparent;strokeColor=transparent;', true);
        styles.geometry.offset = new mxPoint(-styles.geometry.width / 2, -styles.geometry.height / 2);
        styles.connectable = false;

        if (cell.source.value.nodeName == "actuator" && cell.target.value.nodeName == "resource"){
            styles = graph.insertVertex(cell, null, 'Label', 0, 0, 20, 14,'shape=Resource_link;labelBackgroundColor=#ffffff;labelPosition=left;spacingRight=2;align=right;');
        }
        else if (cell.source.value.nodeName == "device" && cell.target.value.nodeName == "device"){
            styles = graph.insertVertex(cell, null, 'Label', 0, 0, 20, 14,'shape=Aggregation;labelBackgroundColor=#ffffff;labelPosition=left;spacingRight=2;align=right;');
        }      
        else if (cell.source.value.nodeName == "device" && cell.target.value.nodeName == "computer"){
            styles = graph.insertVertex(cell, null, 'Label', 0, 0, 20, 14,'shape=Aggregation;labelBackgroundColor=#ffffff;labelPosition=left;spacingRight=2;align=right;');
        }    
        else if (cell.source.value.nodeName == "device" && cell.target.value.nodeName == "actuator"){
            styles = graph.insertVertex(cell, null, 'Label', 0, 0, 20, 14,'shape=Signal;labelBackgroundColor=#ffffff;labelPosition=left;spacingRight=2;align=right;');
        }  
        else if (cell.source.value.nodeName == "device" && cell.target.value.nodeName == "network"){
            styles = graph.insertVertex(cell, null, 'Label', 0, 0, 20, 14,'shape=Wired_comunication;labelBackgroundColor=#ffffff;labelPosition=left;spacingRight=2;align=right;');
        }  
        else if (cell.source.value.nodeName == "computer" && cell.target.value.nodeName == "actuator"){
            styles = graph.insertVertex(cell, null, 'Label', 0, 0, 20, 14,'shape=Signal;labelBackgroundColor=#ffffff;labelPosition=left;spacingRight=2;align=right;');
        } 
        else if (cell.source.value.nodeName == "computer" && cell.target.value.nodeName == "network"){
            styles = graph.insertVertex(cell, null, 'Label', 0, 0, 20, 14,'shape=Wired_comunication;labelBackgroundColor=#ffffff;labelPosition=left;spacingRight=2;align=right;');
        } 
        else if (cell.source.value.nodeName == "software" && cell.target.value.nodeName == "device"){
            styles = graph.insertVertex(cell, null, 'Label', 0, 0, 20, 14,'shape=Aggregation;labelBackgroundColor=#ffffff;labelPosition=left;spacingRight=2;align=right;');
        } 
        else if (cell.source.value.nodeName == "software" && cell.target.value.nodeName == "computer"){
            styles = graph.insertVertex(cell, null, 'Label', 0, 0, 20, 14,'shape=Aggregation;labelBackgroundColor=#ffffff;labelPosition=left;spacingRight=2;align=right;');
        }
        else if (cell.source.value.nodeName == "software" && cell.target.value.nodeName == "software"){
            styles = graph.insertVertex(cell, null, 'Label', 0, 0, 20, 14,'shape=Wired_comunication;labelBackgroundColor=#ffffff;labelPosition=left;spacingRight=2;align=right;');
        } 
        else if (cell.source.value.nodeName == "software" && cell.target.value.nodeName == "software"){
            styles = graph.insertVertex(cell, null, 'Label', 0, 0, 20, 14,'shape=Integration;labelBackgroundColor=#ffffff;labelPosition=left;spacingRight=2;align=right;');
        } 
        else if (cell.source.value.nodeName == "sensor" && cell.target.value.nodeName == "device"){
            styles = graph.insertVertex(cell, null, 'Label', 0, 0, 20, 14,'shape=DataIn;labelBackgroundColor=#ffffff;labelPosition=left;spacingRight=2;align=right;');
        }
        else if (cell.source.value.nodeName == "sensor" && cell.target.value.nodeName == "computer"){
            styles = graph.insertVertex(cell, null, 'Label', 0, 0, 20, 14,'shape=DataIn;labelBackgroundColor=#ffffff;labelPosition=left;spacingRight=2;align=right;');
        }
        else if (cell.source.value.nodeName == "sensor" && cell.target.value.nodeName == "resource"){
            styles = graph.insertVertex(cell, null, 'Label', 0, 0, 20, 14,'shape=Aggregation;labelBackgroundColor=#ffffff;labelPosition=left;spacingRight=2;align=right;');
        }
        else if (cell.source.value.nodeName == "actuator" && cell.target.value.nodeName == "device"){
            styles = graph.insertVertex(cell, null, 'Label', 0, 0, 20, 14,'shape=DataIn;labelBackgroundColor=#ffffff;labelPosition=left;spacingRight=2;align=right;');
        }
        else if (cell.source.value.nodeName == "actuator" && cell.target.value.nodeName == "computer"){
            styles = graph.insertVertex(cell, null, 'Label', 0, 0, 20, 14,'shape=DataIn;labelBackgroundColor=#ffffff;labelPosition=left;spacingRight=2;align=right;');
        }
        else if (cell.source.value.nodeName == "actuator" && cell.target.value.nodeName == "resource"){
            styles = graph.insertVertex(cell, null, 'Label', 0, 0, 20, 14,'shape=Aggregation;labelBackgroundColor=#ffffff;labelPosition=left;spacingRight=2;align=right;');
        }
        else if (cell.source.value.nodeName == "resource" && cell.target.value.nodeName == "resource"){
            styles = graph.insertVertex(cell, null, 'Label', 0, 0, 20, 14,'shape=Resource_link;labelBackgroundColor=#ffffff;labelPosition=left;spacingRight=2;align=right;');
        }
        else{
            styles = graph.insertVertex(cell, null, 'Label', 0, 0, 20, 14,'shape=link;labelBackgroundColor=#ffffff;labelPosition=left;spacingRight=2;align=right;');
        }
        
        styles.geometry.offset = new mxPoint(-10, -7);
		styles.geometry.relative = true;
        styles.connectable = false;
        return styles;  
    };
}

export default setup_relations