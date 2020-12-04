import { GraphUtil } from "@/assets/js/common/graphutil";

export function Adaptation_hardwareOrganizer(graph) {
  this.graph = graph;
  this.modelName = "adaptation_hardware"; 
  this.deviceX=15;
  this.deviceY=15;
  this.actionX=15;
  this.actionY=115;
  this.boardX=15;
  this.boardY=150;
}

Adaptation_hardwareOrganizer.prototype.organizeComponents = function () { 
  let modelCell = this.graph.getModel().getCell(this.modelName); 
  this.organizeBoards(); 
  this.organizeDevices();
  this.graph.refresh(); 
};


Adaptation_hardwareOrganizer.prototype.organizeBoards = function () {  
  let grapUtil = new GraphUtil(); 
  let y = 15;
  let x = 15;
  let dx = 15;
  let dy = 15; 
  var boards = grapUtil.getElementsByType(this.graph, this.modelName, "board");
  boards.forEach((board) => {
    let boardGeometry = board.getGeometry();
    boardGeometry.x = this.boardX;
    boardGeometry.y = this.boardY;
    this.boardX += boardGeometry.width + dx ;
  });
};


Adaptation_hardwareOrganizer.prototype.organizeDevices = function () {  
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
    this.deviceX += deviceGeometry.width + dx ;
  }); 
};