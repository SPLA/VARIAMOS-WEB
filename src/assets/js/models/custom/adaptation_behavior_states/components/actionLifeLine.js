import { GraphComponent } from "../../../../common/components/graph_component";
export function ActionLifeLine() {
  GraphComponent.call(
    this,
    "actionLifeLine",
    "acll",
    "images/models/adaptation_binding_state_hardware/lifeLine.png",
    "shape=lifeLine",
    10,
    50,
    [
      {
          "name": "alias",
          "def_value": "acll",
          input_type: "none"
      },
      {
          "name": "label",
          "def_value": "acll",
          input_type: "disabled"
      }
    ]
  );
}

ActionLifeLine.prototype = Object.create(GraphComponent.prototype);