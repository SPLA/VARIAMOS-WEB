import { GraphRelationship } from "../../../../common/components/graph_relationship";
export function LogicalOperator_transitionRelationship() {
    GraphRelationship.call(
    this,
    "state_stateLifeLineRelationship",
    "state_stateLifeLineRelationship",
    {
        "source": ["state", "initialState"],
        "rel_source_target": "and",
        "target": ["stateLifeLine"],
        "style": "strokeColor=#333333;strokeWidth=2;",
        "attributes": []
    }
  );
}

LogicalOperator_transitionRelationship.prototype = Object.create(GraphRelationship.prototype);