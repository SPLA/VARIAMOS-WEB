
import {getElementById, getElementsByType, getRelationsFromTypes, getRelationsFromSource, getRelationsToTarget } from '@/assets/js/common/graphutils'

let setupRelations = function setupRelations(graph, relations, relationStyles, constraintsRelations){
    graph.connectionHandler.insertEdge = function(parent, id, value, source, target, style){
        let doc = mxUtils.createXmlDocument();
        let node = doc.createElement('rel_' + source.getAttribute("type") + '_' + target.getAttribute("type"));
        node.setAttribute('type', "relation");

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

        let sourceType = source.getAttribute("type");
        let targetType = target.getAttribute("type"); 
        let transition=null;
        if((sourceType=="initialState" || sourceType=="state") && targetType=="transition"){ 
            transition=target;
            transition.setAttribute("sourceState", source.getAttribute("label"));
        }else if((targetType=="initialState" || targetType=="state") && sourceType=="transition"){ 
            transition=source;
            source.setAttribute("targetState", target.getAttribute("label"));
        }
        let nameTransition=transition.getAttribute("sourceState") + "_" + transition.getAttribute("targetState");
        transition.setAttribute("label", nameTransition);
        graph.refresh();

        let idClonTransition="clon"+transition.getId(); 
        let clonTransition=getElementById(graph, "adaptation_behavior_transitions",idClonTransition);
        clonTransition.setAttribute("label", nameTransition);
        graph.refresh();

        
        let cell = graph.insertEdge(parent, id, node, source, target, style);
        return cell;
    };
}

export default setupRelations