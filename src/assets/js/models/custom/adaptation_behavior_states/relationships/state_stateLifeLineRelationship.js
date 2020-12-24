import { GraphRelationship } from "../../../../common/components/graph_relationship";
export function State_stateLifeLineRelationship() {
    GraphRelationship.call(
    this,
    "state_stateLifeLineRelationship",
    "state_stateLifeLineRelationship",
    {
        "source": ["state", "initialState"],
        "rel_source_target": "and",
        "target": ["stateLifeLine"],
        "style": "strokeColor=#333333;strokeWidth=2;dashed=1;endFill=0;endArrow=none;edgeStyle=elbowEdgeStyle;elbow=horizontal;orthogonal=1;",
        "attributes": []
    }
  );
}

State_stateLifeLineRelationship.prototype = Object.create(GraphRelationship.prototype);