import { GraphComponent } from "../../../../common/components/graph_component";
export function Transition() {
  GraphComponent.call(
    this,
    "transition",
    "Transition",
    "images/models/adaptation_binding_state_hardware/transition.png",
    "shape=transition",
    100,
    35,
    []
  );
}

Transition.prototype = Object.create(GraphComponent.prototype);