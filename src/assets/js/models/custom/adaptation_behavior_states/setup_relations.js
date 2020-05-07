let setup_relations = function setup_relations(graph,relations,relation_styles,constraints_relations){
     
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

        //custom constraints for relations
        if(constraints_relations){
            let valid_connection = constraints_relations(graph, source, target);
            if(!valid_connection){
                return null;
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

        //style ="dashed=1;endFill=0;orthogonal=true" 
        //style="edgeStyle=elbowEdgeStyle;elbow=horizontal;orthogonal=1;entryX=0;entryY=0;entryPerimeter=1;"
        style="edgeStyle=elbowEdgeStyle;elbow=horizontal;orthogonal=1;" + style; 
        let sourceType = source.getAttribute("type");
        let targetType = target.getAttribute("type");
        let relationType = 'rel_'+sourceType+'_'+targetType;
        if(sourceType=="lifeLine" && targetType=="lifeLine"){
            if(node.getAttribute("execution")=="Asynchronous"){
                style="dashed=1;" + style; 
                alert(style);
            }
        }

        // //Check for or Refinement in existing edges and change the type accordingly.
        // if(["rel_goal_task","rel_goal_goal","rel_task_task","rel_task_goal"].includes(relationType) 
        //         && target.getEdgeCount() > 0 
        //         && target.getEdgeAt(0).getAttribute("refinement") === "or"){
        //     style = "endArrow=block;";
        //     node.setAttribute("refinement", "or");
        // }

        

        let cell = graph.insertEdge(parent, id, node, source, target, style);
        return cell;
    };
}

export default setup_relations