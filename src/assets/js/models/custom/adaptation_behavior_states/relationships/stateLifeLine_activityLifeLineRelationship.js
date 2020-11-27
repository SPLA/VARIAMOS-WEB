import { GraphRelationship } from "../../../../common/components/graph_relationship";
export function StateLifeLine_activityLifeLineRelationship() {
    GraphRelationship.call(
    this,
    "StateLifeLine_activityLifeLineRelationship",
    "StateLifeLine_activityLifeLineRelationship",
    {
        "source": ["state", "initialState"],
        "rel_source_target": "and",
        "target": ["stateLifeLine"],
        "style": "strokeColor=#333333;strokeWidth=2;dashed=1;edgeStyle=elbowEdgeStyle;elbow=horizontal;orthogonal=1;",
        "attributes": [{
            "name": "time",
            "def_value": "0"
        }, {
            "name": "execution",
            "def_value": "Synchronous",
            "input_type": "select",
            "input_values": ["Synchronous", "Asynchronous"]
        }]
    }
  );
}

StateLifeLine_activityLifeLineRelationship.prototype = Object.create(GraphRelationship.prototype);