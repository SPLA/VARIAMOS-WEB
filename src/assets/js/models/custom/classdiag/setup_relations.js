let setupRelations = function setupRelations(graph, relations, relationStyles, constraintsRelations){
    graph.connectionHandler.insertEdge = function(parent, id, value, source, target, style){
        const sourceType = source.getAttribute("type");
        const targetType = target.getAttribute("type");
        const relationType = 'rel_'+sourceType+'_'+targetType;
        const doc = mxUtils.createXmlDocument();
        const node = doc.createElement(relationType);
        node.setAttribute('type', relationType);

        //by default bidirectional edges are not allowed (disjoint)
        if(target.edges != null && target.edges.length>0){
            for (let i = 0; i < target.edges.length; i++) {
                if(target.edges[i].target.getId() == source.getId()){
                    alert(global.messages["setup_relations_bidirectional"]);
                    return null;
                }
            }
        }

        //custom constraints for relations
        if(constraintsRelations){
            let validConnection = constraintsRelations(graph, source, target);
            if(!validConnection){
                return null;
            }
        }

        //setup custom attributes for relations
        if(relations){
            for (let i = 0; i < relations.length; i++) {
                if(relations[i]["rel_source_target"] == "and"){
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
        if(relationStyles){
            for (let i = 0; i < relationStyles.length; i++) {
                if(relationStyles[i]["rel_source_target"]=="and"){
                    if((relationStyles[i]["source"].indexOf(source.getAttribute("type")) > -1) && (relationStyles[i]["target"].indexOf(target.getAttribute("type"))> -1)){
                        style=relationStyles[i]["style"];
                    }
                }
                else{
                    if((relationStyles[i]["source"].indexOf(source.getAttribute("type")) > -1) || (relationStyles[i]["target"].indexOf(target.getAttribute("type"))> -1)){
                        style=relationStyles[i]["style"];
                    }
                }
            }
        }
        
        let cell = graph.insertEdge(parent, id, node, source, target, style);
        return cell;
    };
}

export default setupRelations