
import {getElementById, getElementsByType, getRelationsFromTypes, getRelationsFromSource, getRelationsToTarget } from '@/assets/js/common/graphutils'
import { GraphUtil } from "@/assets/js/common/graphutil";
import { Transition } from "@/assets/js/models/custom/adaptation_state/components/transition";
import { LogicalOperator_transitionRelationship } from "@/assets/js/models/custom/adaptation_behavior_transitions/relationships/logicalOperator_transitionRelationship";

import { LogicalOperator } from "@/assets/js/models/custom/adaptation_behavior_transitions/components/logicalOperator";
import { Predicate } from "@/assets/js/models/custom/adaptation_behavior_transitions/components/predicate";
import { Predicate_logicalOperatorRelationship } from "@/assets/js/models/custom/adaptation_behavior_transitions/relationships/predicate_logicalOperatorRelationship";


let setupRelations = function setupRelations(graph, relations, relationStyles, constraintsRelations){
    graph.connectionHandler.insertEdge = function(parent, id, value, source, target, style){
        let sourceType=source.getAttribute("type");
        let targetType=target.getAttribute("type");
        if(["state", "initialState"].includes(sourceType) && ["state", "initialState"].includes(targetType)){
            let modelName="adaptation_state";  

            let x = (source.getGeometry().x + target.getGeometry().x)/2; 
            let y = (source.getGeometry().y + target.getGeometry().y)/2; 

            let graphUtil = new GraphUtil();
            let transition = new Transition();
            let transitionCells = graphUtil.createComponent(graph, transition.getPrototype(), modelName, x, y, source.getAttribute("label") + '_' + target.getAttribute("label") );
            
            let transitionClonCells =graphUtil.cloneComponent(graph, transitionCells, "adaptation_behavior_transitions");

            
            graphUtil.createRelationship(graph, modelName, source, transitionCells[0], new LogicalOperator_transitionRelationship());
            graphUtil.createRelationship(graph, modelName, transitionCells[0], target, new LogicalOperator_transitionRelationship());
 
            modelName="adaptation_behavior_transitions"; 
            let logicalOperator = new LogicalOperator();
            let logicalOperatorCells = graphUtil.createComponent(graph, logicalOperator.getPrototype(), modelName, x + 150, y);
            graphUtil.createRelationship(graph, modelName, logicalOperatorCells[0], transitionClonCells[0], new LogicalOperator_transitionRelationship());

            let predicate = new Predicate();
            let predicateCells = graphUtil.createComponent(graph, predicate.getPrototype(), modelName, x + 150 + 100, y, "to_" + source.getAttribute("label") + '_' + target.getAttribute("label"));
            graphUtil.createRelationship(graph, modelName, predicateCells[0], logicalOperatorCells[0], new Predicate_logicalOperatorRelationship());
            
            graphUtil.organizeModel(graph, modelName);
            
            return;
        }
        
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