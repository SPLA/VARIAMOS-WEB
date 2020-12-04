import { GraphUtil } from "@/assets/js/common/graphutil";
import { renameElementByType } from "@/assets/js/common/graphutils";
import { LogicalOperator } from "@/assets/js/models/custom/adaptation_behavior_transitions/components/logicalOperator";
import { Predicate } from "@/assets/js/models/custom/adaptation_behavior_transitions/components/predicate";
import { Activity } from "@/assets/js/models/custom/adaptation_behavior_states/components/activity";
import { StateLifeLine } from "@/assets/js/models/custom/adaptation_behavior_states/components/stateLifeLine";
import { ActivityLifeLine } from "@/assets/js/models/custom/adaptation_behavior_states/components/activityLifeLine";
import { State_stateLifeLineRelationship } from "@/assets/js/models/custom/adaptation_behavior_states/relationships/state_stateLifeLineRelationship";
import { StateLifeLine_activityLifeLineRelationship } from "@/assets/js/models/custom/adaptation_behavior_states/relationships/stateLifeLine_activityLifeLineRelationship";
import { Predicate_logicalOperatorRelationship } from "@/assets/js/models/custom/adaptation_behavior_transitions/relationships/predicate_logicalOperatorRelationship";
import { LogicalOperator_transitionRelationship } from "@/assets/js/models/custom/adaptation_behavior_transitions/relationships/logicalOperator_transitionRelationship";



let setupElements = function setupElements(
  graph,
  elements,
  customAttributes,
  cClonCells,
  cConstraintsIc,
  toolbar,
  cType
) {
  if (elements == null) {
    //disable palette for "binding" models
    let tbContainer = document.getElementById("tbContainer");
    let span = document.createElement("span");
    span.innerHTML = global.messages["setup_elements_palette_no_elements"];
    tbContainer.appendChild(span);
  } else {
    //add elements to the palette
    for (let i = 0; i < elements.length; i++) {
      addVertex(
        graph,
        toolbar,
        elements[i].src,
        elements[i].wd,
        elements[i].hg,
        elements[i].style,
        elements[i].type,
        elements[i].pname,
        customAttributes,
        cClonCells,
        cConstraintsIc
      );
    }
  }

  function addVertex(
    graph,
    toolbar,
    icon,
    w,
    h,
    style,
    type,
    namepalette,
    customAttributes,
    cClonCells,
    cConstraintsIc
  ) {
    let doc = mxUtils.createXmlDocument();
    let node = doc.createElement(type);
    node.setAttribute("label", type);
    node.setAttribute("type", type);

    //include custom attributes
    if (customAttributes) {
      for (let z = 0; z < customAttributes.length; z++) {
        if (customAttributes[z]["types"].indexOf(type) > -1) {
          for (
            let j = 0;
            j < customAttributes[z]["custom_attributes"].length;
            j++
          ) {
            node.setAttribute(
              customAttributes[z]["custom_attributes"][j]["name"],
              customAttributes[z]["custom_attributes"][j]["def_value"]
            );
          }
        }
      }
    }

    let vertex = new mxCell(node, new mxGeometry(0, 0, w, h), style);
    vertex.setConnectable(true);
    vertex.setVertex(true);

    if (cConstraintsIc != null && cConstraintsIc[type]) {
      addToolbarItem(
        graph,
        toolbar,
        vertex,
        icon,
        namepalette,
        cClonCells,
        cConstraintsIc[type]
      );
    } else {
      addToolbarItem(graph, toolbar, vertex, icon, namepalette, cClonCells, "");
    }
  }

  function addToolbarItem(
    graph,
    toolbar,
    prototype,
    image,
    namepalette,
    cClonCells,
    cConstraintsIc
  ) {
    // Function that is executed when the image is dropped on
    // the graph. The cell argument points to the cell under
    // the mousepointer if there is one.
    let funct = function(graph, evt, cell) {
      let onCreationAllowed = true;  
      if (cConstraintsIc != "") {
        onCreationAllowed = cConstraintsIc(graph);
      }

      if (onCreationAllowed) { 
        var name="";
        let type = prototype.getAttribute("type");
        let promptName=prototype.getAttribute("promptName");
        if(promptName=='true'){
          var name = prompt("Please enter element name", ""); 
          if (name == "") { 
              return;
          }
        } 
        graph.stopEditing(false);
        let pt = graph.getPointForEvent(evt);
        let vertex = graph.getModel().cloneCell(prototype);
        vertex.geometry.x = pt.x;
        vertex.geometry.y = pt.y;

        let newCells = graph.importCells([vertex], 0, 0, cell);
        newCells.forEach((element) => {
          if(name==""){
            renameElementByType(graph, "adaptation_state", element);
          }else{
            element.setAttribute('label', name);
            graph.refresh();
          } 
        });
        graph.setSelectionCells(newCells);

        //execute if there are clons for the current element
        if (cClonCells != null) {
          let type = newCells[0].getAttribute("type");
          if (cClonCells[type]) {
            //clon cell in a new model
            graph.getModel().prefix = "clon"; //cloned cell contains clon prefix
            graph.getModel().nextId = graph.getModel().nextId - 1;
            let vertex2 = graph.getModel().cloneCell(newCells[0]);
            let parent2 = graph.getModel().getCell(cClonCells[type]);
            graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, "#DCDCDC", [
              vertex2,
            ]); //different background for a cloned cell
            let importedCells=graph.importCells([vertex2], 0, 0, parent2);
            graph.getModel().prefix = ""; //restart prefix
            if (type == "transition") {
              let graphUtil = new GraphUtil();
              let modelName="adaptation_behavior_transitions"; 
              let logicalOperator = new LogicalOperator();
              let logicalOperatorCells = graphUtil.createComponent(graph, logicalOperator.getPrototype(), modelName, pt.x + 150, pt.y);
              graphUtil.createRelationship(graph, modelName, logicalOperatorCells[0], importedCells[0], new LogicalOperator_transitionRelationship());

              let predicate = new Predicate();
              let predicateCells = graphUtil.createComponent(graph, predicate.getPrototype(), modelName, pt.x + 150 + 100, pt.y, "to_" + name);
              graphUtil.createRelationship(graph, modelName, predicateCells[0], logicalOperatorCells[0], new Predicate_logicalOperatorRelationship());
               
              graphUtil.organizeModel(graph, modelName);
            }else if(type == "initialState" || type=="state"){
                let graphUtil = new GraphUtil();
                let modelName="adaptation_behavior_states";  

                let stateLifeLine = new StateLifeLine();
                let stateLifeLineCells = graphUtil.createComponent(graph, stateLifeLine.getPrototype(), modelName, pt.x, pt.y + 75);
                graphUtil.createRelationship(graph, modelName, importedCells[0], stateLifeLineCells[0], new State_stateLifeLineRelationship());

                let activity = new Activity();
                let activityCells = graphUtil.createComponent(graph, activity.getPrototype(), modelName, pt.x + 120, pt.y, "activity_" + name);
 
                let activityLifeLine = new ActivityLifeLine();
                let activityLifeLineCells = graphUtil.createComponent(graph, activityLifeLine.getPrototype(), modelName, pt.x + 120, pt.y + 75);
                graphUtil.createRelationship(graph, modelName, activityCells[0], activityLifeLineCells[0], new State_stateLifeLineRelationship());

                graphUtil.createRelationship(graph, modelName, stateLifeLineCells[0], activityLifeLineCells[0], new StateLifeLine_activityLifeLineRelationship());

                graphUtil.organizeModel(graph, modelName);
            }
          }
        }
      }
    };

    let tbContainer = document.getElementById("tbContainer");
    let mdiv = document.createElement("div");
    let span = document.createElement("span");
    span.innerHTML = namepalette + "<br />";
    mdiv.appendChild(span);

    // Creates the image which is used as the drag icon (preview)
    let img = toolbar.addMode(namepalette, image, funct);
    mxUtils.makeDraggable(img, graph, funct);

    mdiv.classList.add("pallete-div");
    mdiv.appendChild(img);
    tbContainer.appendChild(mdiv);
  }
};

export default setupElements;
