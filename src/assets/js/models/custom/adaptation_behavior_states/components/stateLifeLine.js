import { GraphComponent } from "../../../../common/components/graph_component";
export function StateLifeLine() {
  GraphComponent.call(
    this,
    "stateLifeLine",
    "sll",
    "images/models/adaptation_binding_state_hardware/lifeLine.png",
    "shape=lifeLine",
    10,
    50,
    [
      {
          "name": "alias",
          "def_value": "sll",
          "input_type": "none"
      },
      {
          "name": "label",
          "def_value": "sll",
          "input_type": "disabled"
      },{
				"name": "phase",
				"def_value": "while",
				"input_type": "select",
				"input_values": ["begin", "while", "end"]
			}
    ]
  );
}

StateLifeLine.prototype = Object.create(GraphComponent.prototype);