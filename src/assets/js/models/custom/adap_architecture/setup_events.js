<<<<<<< HEAD
//import { getDevices } from "../adaptation_hardware/devices";
//import { getActions } from "../adaptation_hardware/devices";
//import application_creator from "../../actions/application_implementation/adaptation_state/application_creator";
=======
import { getDevices } from "../adaptation_hardware/devices";
import { getActions } from "../adaptation_hardware/devices";
import application_creator from "../../actions/application_implementation/adaptation_state/application_creator";
>>>>>>> 3f10d396ced714f890112c6c8ba5ed0a13d79b20

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
<<<<<<< HEAD
        alert("This is the first option of edge ");
=======
      alert("This is the first option of edge ");
>>>>>>> 3f10d396ced714f890112c6c8ba5ed0a13d79b20
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
<<<<<<< HEAD
          alert("Create application");
        }); 
        break;

=======
          createApplication(cell);
        }); 
        break;
>>>>>>> 3f10d396ced714f890112c6c8ba5ed0a13d79b20
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
<<<<<<< HEAD
/*
=======
>>>>>>> 3f10d396ced714f890112c6c8ba5ed0a13d79b20
  function createApplication(cell){
      try{
        let me=this;
        let creator=new application_creator(graph);
        creator.createFromReferenceArchitecture(graph, cell); 
        alert("Application created.");
      }catch(err){
          alert(err);
      }
<<<<<<< HEAD
  }*/
=======
  }
>>>>>>> 3f10d396ced714f890112c6c8ba5ed0a13d79b20
};

export default setup_events;
