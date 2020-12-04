import { DefaultOrganizer } from "@/assets/js/common/organizers/defaultOrganizer";
import { Adaptation_behavior_statesOrganizer } from "@/assets/js/common/organizers/adaptation_behavior_statesOrganizer";
import { Adaptation_behavior_transitionsOrganizer } from "@/assets/js/common/organizers/adaptation_behavior_transitionsOrganizer";
import { Adaptation_behavior_hardwareOrganizer } from "@/assets/js/common/organizers/adaptation_behavior_hardwareOrganizer";
import { Adaptation_hardwareOrganizer } from "@/assets/js/common/organizers/adaptation_hardwareOrganizer";
import { FeatureOrganizer } from "@/assets/js/common/organizers/featureOrganizer";

export function OrganizerFabric() {
} 

OrganizerFabric.prototype.create = function(graph, modelName) {
    switch(modelName){
        case "adaptation_hardware": return new Adaptation_hardwareOrganizer(graph);
        case "adaptation_behavior_states": return new Adaptation_behavior_statesOrganizer(graph);
        case "adaptation_behavior_transitions": return new Adaptation_behavior_transitionsOrganizer(graph);
        case "adaptation_behavior_hardware": return new Adaptation_behavior_hardwareOrganizer(graph);
        case "feature": return new FeatureOrganizer(graph);
        default: return new DefaultOrganizer(graph);
    } 
}