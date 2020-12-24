import { GraphRelationship } from "../../../../common/components/graph_relationship";
export function Predicate_logicalOperatorRelationship() {
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

Predicate_logicalOperatorRelationship.prototype = Object.create(GraphRelationship.prototype);