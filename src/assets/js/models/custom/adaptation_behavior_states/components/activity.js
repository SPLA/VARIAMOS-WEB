import { GraphComponent } from "../../../../common/components/graph_component";
export function Activity() {
  GraphComponent.call(
    this,
    "activity",
    "Activity",
    "images/models/adaptation_binding_state_hardware/activity.png",
    "shape=activity",
    100,
    35,
    []
  );
}

Activity.prototype = Object.create(GraphComponent.prototype);