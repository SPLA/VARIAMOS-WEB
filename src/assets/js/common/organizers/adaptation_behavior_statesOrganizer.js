import { GraphUtil } from "@/assets/js/common/graphutil";

export function Adaptation_behavior_statesOrganizer(graph) {
  this.graph = graph;
  this.minActivityll=1000000;
  this.maxActivityll=-1000000;
}

Adaptation_behavior_statesOrganizer.prototype.organizeComponents = function() {
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
        if (component.getGeometry().y<components[i].getGeometry().y) {
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
  let dx = 10;
  let dy = 15;

  let llxs = [];
  llxs["stateLifeLine"] = 0;
  llxs["actionLifeLine"] = 0;
  llxs["activityLifeLine"] = 0;

  for (let index = 0; index < components.length; index++) {
    let vertex = components[index];
    let geometry = vertex.getGeometry();
    // vertex.setStyle("dashed=1;fillColor=#000080;strokeColor=#aaaaaa;");
    geometry.x = x;
    geometry.y = y;
    geometry.height = 25;

    let llx = geometry.x + geometry.width;

    let relations = grapUtil.getRelationsFromSource(graph, modelName, vertex, [
      "stateLifeLine",
      "actionLifeLine",
      "activityLifeLine",
    ]);
    relations.forEach((relation) => {
      let child = relation.target;
      let type = child.getAttribute("type"); 
      let childGeometry = child.getGeometry();
      childGeometry.height=15;
      childGeometry.y = y + geometry.height / 2 - childGeometry.height / 2;
      childGeometry.x = llx + llxs[type] + dx;
      childGeometry.width = dx*2;
      llxs[type] += childGeometry.width + dx;
 
      if(type=="activityLifeLine"){
        this.minActivityll=Math.min(this.minActivityll, childGeometry.x);
        this.maxActivityll=Math.max(this.maxActivityll, childGeometry.x+childGeometry.width);
      }
    });
 
    y += geometry.height + 5;
  }

  this.organizeLifeLines("activityLifeLine",["stateLifeLine"]);
  this.organizeLifeLines("actionLifeLine",["activityLifeLine"]);

  graph.refresh();
};

Adaptation_behavior_statesOrganizer.prototype.organizeLifeLines = function(
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
      //targetGeometry.y = minY;
      //targetGeometry.height=maxY-minY;
      //targetGeometry.height=15;
    }
    if(target.getAttribute("type")=="actionLifeLine"){
      //targetGeometry.y = this.minActivityll; 
      //targetGeometry.height=this.maxActivityll-this.minActivityll;
      //targetGeometry.height=15;
    }
    if(target.getAttribute("type")=="activityLifeLine"){
      targetGeometry.x=125;
      targetGeometry.width=1000;
    } 
    if(target.getAttribute("type")=="actionLifeLine"){
      targetGeometry.x=125;
      targetGeometry.width=1000;
    } 
  });
};
