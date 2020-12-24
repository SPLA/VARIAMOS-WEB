import { GraphComponent } from "../../../../common/components/graph_component";
export function ActivityLifeLine() {
  GraphComponent.call(
    this,
    "activityLifeLine",
    "all",
    "images/models/adaptation_binding_state_hardware/lifeLine.png",
    "shape=lifeLine",
    10,
    50,
    [
      {
          "name": "alias",
          "def_value": "all",
          input_type: "none"
      },
      {
          "name": "label",
          "def_value": "all",
          input_type: "disabled"
      }
    ]
  );
}

ActivityLifeLine.prototype = Object.create(GraphComponent.prototype);