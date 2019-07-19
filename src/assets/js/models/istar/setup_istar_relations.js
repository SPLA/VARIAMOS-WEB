var setup_istar_relations = function setup_istar_relations(graph,relations){
    graph.connectionHandler.insertEdge = function(parent, id, value, source, target, style)
    {
        let relationType = 'rel_'+source.getAttribute("type")+'_'+target.getAttribute("type");
        
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
        
        var cell = graph.insertEdge(parent, id, node, source, target, style);
        return cell;
    };
}

export default setup_istar_relations