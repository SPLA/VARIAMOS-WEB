export function GraphRelationship(type, label, definition) {
  this.type = type;
  this.label = label;
  this.definition = definition;
}

GraphRelationship.prototype.getPrototype = function() {};
