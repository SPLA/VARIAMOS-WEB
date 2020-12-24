import { getDevices } from "../adaptation_hardware/devices";
import { getActions } from "../adaptation_hardware/devices";
import application_creator from "../../actions/application_implementation/adaptation_state/application_creator";

let setup_events = function setup_events(graph) {
  //clean previous generated events
  if (graph.eventListeners.length > 22) {
    graph.eventListeners.pop();
    graph.eventListeners.pop();
    graph.eventListeners.pop();
    graph.eventListeners.pop();
    graph.eventListeners.pop();
    graph.eventListeners.pop();
    graph.eventListeners.pop();
    graph.eventListeners.pop();
  } 

  graph.popupMenuHandler.factoryMethod = function(menu, cell, evt) {
    if (cell.vertex) {
      createPopUpMenuVertex(menu, cell, evt);
    }
    if (cell.edge) {
      createPopUpMenuEdge(menu, cell, evt);
    }
  };
  function createPopUpMenuEdge(menu, cell, evt) {
    menu.addItem("First edge option", null, function() {
      alert("This is the first option of edge ");
    });
    menu.addItem("Second edge option", null, function() {
      alert("This is the second option of edge ");
    });
  }
  function createPopUpMenuVertex(menu, cell, evt) {
    let type = cell.getAttribute("type");
    switch (type) {
      case "computer":
        menu.addItem("Create application", null, function() {
          createApplication(cell);
        }); 
        break;
      default:
        menu.addItem("First vertex option", null, function() {
          alert("This is the first option of vertex ");
        });
        menu.addItem("Second vertex option", null, function() {
          alert("This is the second option of vertex ");
        });
        break;
    }
  }
  function createApplication(cell){
      try{
        let me=this;
        let creator=new application_creator(graph);
        creator.createFromReferenceArchitecture(graph, cell); 
        alert("Application created.");
      }catch(err){
          alert(err);
      }
  }
};

export default setup_events;
