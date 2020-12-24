import { GraphComponent } from "../../../../common/components/graph_component";
export function LogicalOperator() {
  GraphComponent.call(
    this,
    "logicalOperator",
    "Logical operator",
    "images/models/adaptation_binding_state_hardware/logicalOperator.png",
    "shape=logicalOperator",
    35,
    35,
    [
      {
        name: "value",
        def_value: "SINGLE",
        input_type: "select",
        input_values: ["SINGLE", "OR", "AND"],
      },
      {
        name: "alias",
        def_value: "op",
        input_type: "none",
      },
      {
        attribute: "label",
        input_type: "disabled",
      }
    ]
  );
}

LogicalOperator.prototype = Object.create(GraphComponent.prototype);

// LogicalOperator.prototype.getPrototype = function() {
//   let type = "logicalOperator";
//   let doc = mxUtils.createXmlDocument();
//   let node = doc.createElement(type);
//   node.setAttribute("label", type);
//   node.setAttribute("type", type);

//   if (this.attributes) {
//     for (let z = 0; z < this.attributes.length; z++) {
//       node.setAttribute(
//         this.attributes[z]["name"],
//         this.attributes[z]["def_value"]
//       );
//     }
//   }

//   let vertex = new mxCell(
//     node,
//     new mxGeometry(0, 0, this.width, this.height),
//     this.style
//   );
//   vertex.setConnectable(true);
//   vertex.setVertex(true);
//   return vertex;
// };
