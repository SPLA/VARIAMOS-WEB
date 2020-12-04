import { GraphUtil } from "@/assets/js/common/graphutil";

export function Adaptation_behavior_transitionsOrganizer(graph) {
  this.graph = graph;
  this.modelName = "adaptation_behavior_transitions";
  this.transitionY=15; 

  this.variableX=150;
  this.variableY=15;
}

Adaptation_behavior_transitionsOrganizer.prototype.organizeComponents = function () {
  let graph = this.graph;
  let modelName = this.modelName;
  let modelCell = graph.getModel().getCell(modelName);

  let grapUtil = new GraphUtil();

  let y = 15;
  let x = 15;
  let dx = 75;
  let dy = 75;

  var transitions = grapUtil.getElementsByType(graph, modelName, "transition");
  transitions.forEach((transition) => {
    let transitionGeometry = transition.getGeometry();
    transitionGeometry.x = x;
    transitionGeometry.y = this.transitionY;
    let relations = grapUtil.getRelationsToTarget(graph, modelName, transition, ["logicalOperator"]);
    relations.forEach((relation) => {
      let source = relation.source;
      let sourceGeometry = source.getGeometry();
      sourceGeometry.x = transitionGeometry.x + transitionGeometry.width + dx;
      sourceGeometry.y = this.transitionY;
      this.organizeLogicalOperator(source);
    });
  });

  this.organizeVariables();

  graph.refresh();

};


Adaptation_behavior_transitionsOrganizer.prototype.organizeLogicalOperator = function (logicalOperator) {
  let graph = this.graph;
  let modelName = "adaptation_behavior_transitions";
  let modelCell = graph.getModel().getCell(modelName);
  let grapUtil = new GraphUtil();
  
  let geometry = logicalOperator.getGeometry();
  
  let y = geometry.y;
  let x = 15;
  let dx = 75;
  let dy = 75;

  let relations = grapUtil.getRelationsToTarget(graph, modelName, logicalOperator, ["predicate"]);
  relations.forEach((relation) => {
    let source = relation.source;
    let sourceGeometry = source.getGeometry();
    sourceGeometry.x = geometry.x + geometry.width + dx;
    sourceGeometry.y = y;
    y+=dy;
    this.transitionY = y; 

    this.variableX=sourceGeometry.x + sourceGeometry.width + dx;

    this.organizePredicate(source);
  });
};

Adaptation_behavior_transitionsOrganizer.prototype.organizePredicate = function (predicate) {
  let graph = this.graph;
  let modelName = "adaptation_behavior_transitions";
  let modelCell = graph.getModel().getCell(modelName); 
  let grapUtil = new GraphUtil();
  
  let geometry = predicate.getGeometry();

  let x = geometry.x;
  let y = geometry.y;
  let dx = 75;
  let dy = 75;

  let predicateArguments=[]; 
  predicateArguments.push(predicate.children[0]);
  predicateArguments.push(predicate.children[1]);
 
  predicateArguments.forEach((predicateArgument) => {
    let relations = grapUtil.getRelationsToTarget(graph, modelName, predicateArgument, ["variable"]);
    relations.forEach((relation) => {
      let source = relation.source;
      let sourceGeometry = source.getGeometry();
      sourceGeometry.x = geometry.x + geometry.width + dx;
      sourceGeometry.y = y;
      y+=dy;
      this.transitionY = y; 
    });
  });

  graph.refresh();

};

 

Adaptation_behavior_transitionsOrganizer.prototype.organizeVariables = function () {  
  let grapUtil = new GraphUtil(); 
  let y = 15;
  let x = 15;
  let dx = 15;
  let dy = 15; 
  var variables = grapUtil.getElementsByType(this.graph, this.modelName, "variable");
  variables.forEach((variable) => {
    let variableGeometry = variable.getGeometry();
    variableGeometry.x = this.variableX;  
  }); 
};