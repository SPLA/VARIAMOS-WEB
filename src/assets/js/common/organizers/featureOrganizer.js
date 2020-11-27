import { GraphUtil } from "@/assets/js/common/graphutil";

export function FeatureOrganizer(graph) {
  this.graph = graph;
  this.modelName = "feature"; 
  this.rootX=15;
  this.rootY=15; 
}

FeatureOrganizer.prototype.organizeComponents = function () { 
  let modelCell = this.graph.getModel().getCell(this.modelName); 
  this.organizeRoot();
  this.graph.refresh(); 
};


FeatureOrganizer.prototype.organizeRoot = function () {  
  let grapUtil = new GraphUtil(); 
  let y = 15;
  let x = 15;
  let dx = 15;
  let dy = 15; 
  var roots = grapUtil.getElementsByType(this.graph, this.modelName, "root");
  roots.forEach((root) => {
    let componentGeometry = root.getGeometry();
    componentGeometry.x = this.rootX;
    componentGeometry.y = this.rootY;
    this.organizeComponent(root);
  }); 
};

FeatureOrganizer.prototype.organizeComponent = function (component) {  
  let grapUtil = new GraphUtil(); 
  let y = 15;
  let x = 15;
  let dx = 15;
  let dy = 50; 

  let componentGeometry = component.getGeometry();

  this.rootX = componentGeometry.x;

  let relations = grapUtil.getRelationsToTarget(this.graph, this.modelName, component, null);
    relations.forEach((relation) => {
      let source = relation.source;
      let sourceGeometry = source.getGeometry();
      sourceGeometry.x = this.rootX;
      sourceGeometry.y = componentGeometry.y + componentGeometry.height + dy;
      this.organizeComponent(source); 
      this.rootX += sourceGeometry.width + dx;
    }); 
};