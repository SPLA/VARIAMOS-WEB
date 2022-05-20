import { GraphUtil } from "@/assets/js/common/graphutil";

export function Adaptation_behavior_states_horizontalOrganizer(graph) {
  this.graph = graph;
  this.minActivityll=1000000;
  this.maxActivityll=-1000000;
}

Adaptation_behavior_states_horizontalOrganizer.prototype.organizeComponents = function() {
  let graph = this.graph;
  let modelName = "adaptation_behavior_states";
  let modelCell = graph.getModel().getCell(modelName);

  let grapUtil = new GraphUtil();

  var components = [];
  var types = [
    "initialState",
    "state",
    "activity",
    "readAction",
    "writeAction",
    "customAction",
    "controAction",
  ];
  types.forEach((type) => {
    var arr = grapUtil.getElementsByType(graph, modelName, type); 
    arr.forEach((component) => {
      let inserted=false;
      for (let i = 0; i < components.length; i++) {
        if (component.getGeometry().x<components[i].getGeometry().x) {
          components.splice(i, 0, component);
          inserted=true;
          break;
        }    
      }
      if (!inserted) {
        components.push(component);
      }
    });
  });

  let y = 15;
  let x = 15;
  let dx = 5;
  let dy = 30;

  let llys = [];
  llys["stateLifeLine"] = 0;
  llys["actionLifeLine"] = 0;
  llys["activityLifeLine"] = 0;

  for (let index = 0; index < components.length; index++) {
    let vertex = components[index];
    let geometry = vertex.getGeometry();
    // vertex.setStyle("dashed=1;fillColor=#000080;strokeColor=#aaaaaa;");
    geometry.x = x;
    geometry.y = y;

    let lly = geometry.y + geometry.height;

    let relations = grapUtil.getRelationsFromSource(graph, modelName, vertex, [
      "stateLifeLine",
      "actionLifeLine",
      "activityLifeLine",
    ]);
    relations.forEach((relation) => {
      let child = relation.target;
      let type = child.getAttribute("type"); 
      let childGeometry = child.getGeometry();
      childGeometry.x = x + geometry.width / 2 - childGeometry.width / 2;
      childGeometry.y = lly + llys[type] + dy;
      llys[type] += childGeometry.height + dy;
 
      if(type=="activityLifeLine"){
        this.minActivityll=Math.min(this.minActivityll, childGeometry.y);
        this.maxActivityll=Math.max(this.maxActivityll, childGeometry.y+childGeometry.height);
      }
    });

    x += geometry.width + dx;
  }

  this.organizeLifeLines("activityLifeLine",["stateLifeLine"]);
  this.organizeLifeLines("actionLifeLine",["activityLifeLine"]);

  graph.refresh();
};

Adaptation_behavior_states_horizontalOrganizer.prototype.organizeLifeLines = function(
  targetType,
  sourceTypes
) {
  let graph = this.graph;
  let modelName = "adaptation_behavior_states";
  let modelCell = graph.getModel().getCell(modelName);
  let grapUtil = new GraphUtil();

  var targets = grapUtil.getElementsByType(graph, modelName, targetType);
  targets.forEach((target) => {
    let targetGeometry = target.getGeometry();
    let targetLabel=target.getAttribute("label");
    let minY=10000000;
    let maxY=-1;
    let relations = grapUtil.getRelationsToTarget(graph, modelName, target, sourceTypes);
    relations.forEach((relation) => {
      let source = relation.source;
      let sourceGeometry = source.getGeometry();
      if(minY > sourceGeometry.y){
        minY = sourceGeometry.y;
      }
      if(maxY < sourceGeometry.y + sourceGeometry.height){
        maxY = sourceGeometry.y + sourceGeometry.height;
      }
    });
    if(maxY>-1){
      targetGeometry.y = minY;
      targetGeometry.height=maxY-minY;
    }
    if(target.getAttribute("type")=="actionLifeLine"){
      targetGeometry.y = this.minActivityll; 
      targetGeometry.height=this.maxActivityll-this.minActivityll;
    }
  });
};
