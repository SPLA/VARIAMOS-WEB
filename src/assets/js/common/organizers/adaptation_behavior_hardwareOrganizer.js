import { GraphUtil } from "@/assets/js/common/graphutil";

export function Adaptation_behavior_hardwareOrganizer(graph) {
  this.graph = graph;
  this.modelName = "adaptation_behavior_hardware"; 
  this.deviceX=15;
  this.deviceY=15;
  this.actionX=15;
  this.actionY=115;
  this.variableX=15;
  this.variableY=300;
}

Adaptation_behavior_hardwareOrganizer.prototype.organizeComponents = function () { 
  let modelCell = this.graph.getModel().getCell(this.modelName); 
  this.organizeVariables();
  this.organizeActions();  
  this.graph.refresh(); 
};


Adaptation_behavior_hardwareOrganizer.prototype.organizeVariables = function () {  
  let grapUtil = new GraphUtil(); 
  let y = 15;
  let x = 15;
  let dx = 15;
  let dy = 15; 
  var variables = grapUtil.getElementsByType(this.graph, this.modelName, "variable");
  variables.forEach((variable) => {
    let variableGeometry = variable.getGeometry();
    variableGeometry.x = this.variableX;
    variableGeometry.y = this.variableY;
    this.variableX += variableGeometry.width + dx ;
  }); 
};

Adaptation_behavior_hardwareOrganizer.prototype.organizeActions = function () {   
  let grapUtil = new GraphUtil(); 
  let y = 15;
  let x = 15;
  let dx = 15;
  let dy = 15; 

  var devices = grapUtil.getElementsByType(this.graph, this.modelName, "device");
  devices.forEach((device) => {
    let deviceGeometry = device.getGeometry();
    deviceGeometry.x = this.deviceX;
    deviceGeometry.y = this.deviceY;
    let relations = grapUtil.getRelationsFromSource(this.graph, this.modelName, device, ["readAction", "writeAction", "customAction", "controlAction"]);
    relations.forEach((relation) => {
      let source = relation.target;
      let sourceGeometry = source.getGeometry();
      sourceGeometry.x = this.actionX;
      sourceGeometry.y = this.actionY;
      this.organizeAction(source);
      this.actionX += sourceGeometry.width + dx ;
    });
    if(this.deviceX<this.actionX){
      this.deviceX=this.actionX;
    }else{
      this.deviceX +=deviceGeometry.width + dx ;
    }
  });

  this.organizeCustomActions();
  this.organizeControlActions();

};


Adaptation_behavior_hardwareOrganizer.prototype.organizeAction = function (action) { 
  let grapUtil = new GraphUtil(); 
  let geometry = action.getGeometry(); 
  let y = geometry.y;
  let x = 15;
  let dx = 75;
  let dy = 75; 
  let relations = grapUtil.getRelationsFromSource(this.graph, this.modelName, action, ["variable"]);
  relations.forEach((relation) => {
    let source = relation.target;
    let sourceGeometry = source.getGeometry();
    // sourceGeometry.x = geometry.x;
    // sourceGeometry.y = this.actionY+100;
  });
}; 


Adaptation_behavior_hardwareOrganizer.prototype.organizeCustomActions = function () { 
  let grapUtil = new GraphUtil(); 
  let y = 15;
  let x = 15;
  let dx = 15;
  let dy = 15; 
  var controlActions = grapUtil.getElementsByType(this.graph, this.modelName, "customAction");
  controlActions.forEach((controlAction) => {
    let controlActionGeometry = controlAction.getGeometry();
    controlActionGeometry.x = this.actionX;
    controlActionGeometry.y = this.actionY;
    this.actionX += controlActionGeometry.width + dx ;
  }); 
};


Adaptation_behavior_hardwareOrganizer.prototype.organizeControlActions = function () { 
  let grapUtil = new GraphUtil(); 
  let y = 15;
  let x = 15;
  let dx = 15;
  let dy = 15; 
  var controlActions = grapUtil.getElementsByType(this.graph, this.modelName, "controlAction");
  controlActions.forEach((controlAction) => {
    let controlActionGeometry = controlAction.getGeometry();
    controlActionGeometry.x = this.actionX;
    controlActionGeometry.y = this.actionY;
    this.actionX += controlActionGeometry.width + dx ;
  }); 
};