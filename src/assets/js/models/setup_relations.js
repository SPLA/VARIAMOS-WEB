var setup_relations = function setup_relations(graph,relations){
    graph.connectionHandler.insertEdge = function(parent, id, value, source, target, style)
    {
        var doc = mxUtils.createXmlDocument();
        var node = doc.createElement('rel_'+source.getAttribute("type")+'_'+target.getAttribute("type"));
        node.setAttribute('type', "relation");

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

        return graph.insertEdge(parent, id, node, source, target, style);
    };
}

export default setup_relations