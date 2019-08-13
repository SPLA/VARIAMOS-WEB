var setup_istar_relations = function setup_istar_relations(graph,relations,relation_styles){
    graph.connectionHandler.insertEdge = function(parent, id, value, source, target, style)
    {
        let sourceType = source.getAttribute("type");
        let targetType = target.getAttribute("type");
        //Dependum is either true or false depending on wether or not the connection has been made
        //to or from a dependum element. it calculates this by looking at the source and target type.
        const dependum = (
            ["goal-dependum","quality-dependum","task-dependum","resource-dependum"].includes(sourceType) 
            && source.getAttribute("dependum") === "true"
        ) || (
            ["goal-dependum","quality-dependum","task-dependum","resource-dependum"].includes(targetType) 
            && target.getAttribute("dependum") === "true"
        )

        let relationType = 'rel_'+sourceType+'_'+targetType;

        var doc = mxUtils.createXmlDocument();
        var node = doc.createElement(relationType);
        node.setAttribute('type', relationType);

        //by default bidirectional edges are not allowed (disjoint)
        if(target.edges != null && target.edges.length>0){
            for (var i = 0; i < target.edges.length; i++) {
                if(target.edges[i].target.getId()==source.getId()){
                    alert(global.messages["setup_relations_bidirectional"]);
                    return null;
                }
            }
        }

        //Disallow direct connections from within different parents from nested elements
        const sourceParent = source.getParent();
        const sourceParentValue = sourceParent.getValue();
        const targetParent = target.getParent();
        const targetParentValue = targetParent.getValue();
        if(
            sourceParentValue !== undefined &&
            sourceParentValue.type !== undefined && 
            sourceParentValue.type === "boundary" &&
            targetParentValue !== undefined &&
            targetParentValue.type !== undefined && 
            targetParentValue.type === "boundary" && 
            sourceParent !== targetParent
        ){
            alert("You may not connect an intentional element within a boundary to another in some other actor's boundary");
            return null;
        }

        //setup custom attributes for relations
        if(relations){
            for (var i = 0; i < relations.length; i++) {
                if(relations[i]["rel_source_target"]=="and"){
                    if((relations[i]["source"].indexOf(source.getAttribute("type")) > -1) && (relations[i]["target"].indexOf(target.getAttribute("type"))> -1)){
                        for(var j = 0; j < relations[i]["attributes"].length; j++){
                            node.setAttribute(relations[i]["attributes"][j]["name"],relations[i]["attributes"][j]["def_value"]);
                        }
                    }
                }
                else{
                    if((relations[i]["source"].indexOf(source.getAttribute("type")) > -1) || (relations[i]["target"].indexOf(target.getAttribute("type"))> -1)){
                        for(var j = 0; j < relations[i]["attributes"].length; j++){
                            node.setAttribute(relations[i]["attributes"][j]["name"],relations[i]["attributes"][j]["def_value"]);
                        }
                    }
                }
            }
        }

        if(relation_styles){
            for (var i = 0; i < relation_styles.length; i++) {
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

        //Check for or Refinement in existing edges and change the type accordingly.
        if(["rel_goal_task","rel_goal_goal","rel_task_task","rel_task_goal"].includes(relationType) 
                && target.getEdgeCount() > 0 
                && target.getEdgeAt(0).getAttribute("refinement") === "or"){
            style = "endArrow=block;";
            node.setAttribute("refinement", "or");
        }
        
        const cell = graph.insertEdge(parent, id, node, source, target, style);

        //Check if the edge belongs is connected to a dependum element.
        if(dependum){
            //Gather the state information of both the source and target elements.
            const sourceState = graph.view.getState(source);
            const targetState = graph.view.getState(target);
            //Obtain the coordinates and offset to the center of the bounding rectangle.
            const initX = sourceState.x + (sourceState.width/2);
            const initY = sourceState.y + (sourceState.height/2);
            const destX = targetState.x + (targetState.width/2);
            const destY = targetState.y + (targetState.height/2);
            //Calculate the angle given by the edge in its current orientation.
            const angle = (Math.atan2(destY-initY,destX-initX) * (180/Math.PI)).toFixed(0);
            //Insert a new element onto the the edge with the calculated angle.
            const capitald = graph.insertVertex(cell,null,null,0,0,20,20,'shape=capitald;fillColor=#FFFFFF;rotation='+angle+';');
            //Set the offset of the element so that it is centered. 
            capitald.geometry.offset = new mxPoint(-10, -10);
            capitald.geometry.relative = true;
            //Set the element as unconnectable.
            capitald.connectable = false;
            /* console.log('initX :', initX);
            console.log('initY :', initY);
            console.log('destX :', destX);
            console.log('destY :', destY);
            console.log('angle :', angle); */
        }
        return cell;
    };
}

export default setup_istar_relations