import { GraphComponent } from "../../../../common/components/graph_component";
export function Predicate() {
  GraphComponent.call(
    this,
    "predicate",
    "Predicate",
    "images/models/adaptation_binding_state_hardware/predicate.png",
    "shape=predicate",
    100,
    35,
    [
      {
        "name": "operator",
      "def_value": "=",
      "input_type": "select",
      "input_values": ["=", ">", "<", ">=", "<=", "!="]
      }
    ],
    [
      {
        "type": "predicateArgument",
        "label": "v1",
        "style": "movable=0;resizable=0;shape=triangle;perimeter=trianglePerimeter;direction=north",
        "x": 90,
        "y":0,
        "width": 10,
        "height":10
      },
      {
        "type": "predicateArgument",
        "label": "v2",
        "style": "movable=0;resizable=0;shape=triangle;perimeter=trianglePerimeter;direction=north",
        "x": 90,
        "y":23,
        "width": 10,
        "height":10
      }
    ]
  );
}

Predicate.prototype = Object.create(GraphComponent.prototype);
