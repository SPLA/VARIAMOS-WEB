<template>
<div>
  <a @click="generateClasses()" class="dropdown-item">Generate classes</a>
</div>
</template>

<script>
import { setupModal, modalH3, modalInputTexts, modalButton, modalSimpleText } from '@/assets/js/common/util.js'
import { handleResize } from '../../../assets/js/models/custom/classdiag/setup_events.js'
import axios from "axios";

export default {
  data: function(){
    return {
      model_data:"",
      errors:[] //errors
    }
  },
  props: {
   current_graph: {
    type: Object,
    required: true
   }
  },
  methods: {
    createClass(xPos, yPos, actor, classDiagRoot){
      const type = "class";
      let doc = mxUtils.createXmlDocument();
      let node = doc.createElement(type);
      node.setAttribute('type', type);
      //Create a class instance in a the corresponding model
      const element = this.current_graph.insertVertex(classDiagRoot, null, node, xPos, yPos, 100, 100, "html=1;whiteSpace=wrap;overflow=visible;fontColor=black;fillColor=none;strokeColor=#000000;strokeWidth=5;");

      //Insert name element
      const class_name_type = 'class_name';
      const doc_name = mxUtils.createXmlDocument();
      const node_name = doc_name.createElement(class_name_type);
      node_name.setAttribute('type', class_name_type);
      node_name.setAttribute('label', actor.getAttribute('label'));
      const class_name = this.current_graph.insertVertex(element,null,node_name,0,0,100,20,'fillColor=#FFFFFF;selectable=0;fontColor=black;');
      class_name.setConnectable(false);
      //Insert attributes element
      const class_attributes_type = 'class_attributes';
      const doc_attributes = mxUtils.createXmlDocument();
      const node_attributes = doc_attributes.createElement(class_attributes_type);
      node_attributes.setAttribute('type', class_attributes_type);
      const class_attributes = this.current_graph.insertVertex(element,null,node_attributes,0,20,100,40,'fillColor=#FFFFFF;selectable=0;');
      class_attributes.setConnectable(false);
      //Insert methods element
      const class_methods_type = 'class_methods';
      const doc_methods = mxUtils.createXmlDocument();
      const node_methods = doc_methods.createElement(class_methods_type);
      node_methods.setAttribute('type', class_methods_type);
      const class_methods = this.current_graph.insertVertex(element,null,node_methods,0,60,100,40,'fillColor=#FFFFFF;selectable=0;');
      class_methods.setConnectable(false);
      
      this.current_graph.orderCells(true, [class_name, class_attributes, class_methods]);

      return element;
    },
    checkPresence(relMap, source, target){
      if(relMap.has(source)){
        const links = relMap.get(source);
        return !links.includes(target);
      } else if (relMap.has(target)){
        const links = relMap.get(target);
        return !links.includes(source);
      } else {
        return true;
      }
    },
    getTopLevelElems(istarRoot, model){
      const istarChildCount = istarRoot.getChildCount();
      const actors = [];
      const dependums = [];

      //Get the references to all top-level objects
      for(let i = 0; i < istarChildCount; i++){
        let child = istarRoot.getChildAt(i);
        let childType = child.getAttribute("type");
        let value = null;
        if(childType === undefined){
          value = child.getValue();
          childType = value.type;
        }
        if(["actor","agent","role", "boundary"].includes(childType)){
          if("boundary" === childType && value !== null){
            child = model.getCell(value.actorCellId);
            childType = child.getAttribute("type");
          }
          actors.push(child);
				} else {
          if(!childType.includes("rel")){
            dependums.push(child);
          }
        }
      }
      return {actors, dependums};
    },
    createClassMap(actors, classDiagRoot){
      const classMap = new Map();
      let idx = 0;
      actors.forEach(actor => {
        const stereoType = actor.getAttribute('stereotype');
        if(stereoType !== 'None'){
          const x = 50 + (200*(idx%3));
          const y = 50 + (600*Math.floor(idx/3));
          idx++;
          //add the actor's id as the key to the reference to the created class.
          classMap.set(actor.getId(), this.createClass(x, y, actor, classDiagRoot));
        }        
      });
      return classMap;
    },
    analyzeTopLevelConnections(actors, classMap, classDiagRoot){
      const relMap = new Map();
      //analyse direct connections between actors
      actors.forEach(actor => {
        const actorId = actor.getId();
        //Check that actor has been selected
        if(classMap.has(actorId)){
          //Get reference to corresponding class
          const class_element = classMap.get(actor.getId());
          const n_edges = actor.getEdgeCount();
          if(n_edges > 0){
            for(let i = 0; i < n_edges; i++){
              const edge = actor.getEdgeAt(i);
              const edgeType = edge.getAttribute("type");
              //Only if they are direct connection to another actor
              if(!edgeType.includes('dependum')){
                const source = edge.getTerminal(true).getId();
                const target = edge.getTerminal(false).getId();
                const relType = edge.getAttribute("relType");
                if(this.checkPresence(relMap, source, target)){
                  if(relMap.has(source)){
                    const edgeList = relMap.get(source);
                    edgeList.push(target);
                    relMap.set(source, edgeList);
                  } else {
                    const edgeList = [target];
                    relMap.set(source, edgeList);
                  }

                  let relationType = 'rel_class_class';
                  let doc = mxUtils.createXmlDocument();
                  let node = doc.createElement(relationType);
                  node.setAttribute('type', relationType);

                  if(relType == "participates-in"){
                    node.setAttribute('relation', 'Association');
                    const newEdge = this.current_graph.insertEdge(classDiagRoot, null, node, classMap.get(source), classMap.get(target), "endArrow=none;endFill=none;endSize=10;");
                  } else  {
                    node.setAttribute('relation', 'Inheritance');
                    const newEdge = this.current_graph.insertEdge(classDiagRoot, null, node, classMap.get(source), classMap.get(target), "endArrow=block;endFill=0;endSize=10;");
                  }
                }
              }
            }
          }
        }
      });
      return relMap;
    },
    analyzeDependumConnections(dependums, classMap, relMap, classDiagRoot, model){
      //Go over all the dependums and construct the required dependencies.
      //TODO: Add Resource/Quality dependum handling
      dependums.forEach(dependum => {
        const stereoType = dependum.getAttribute('stereotype');
        const dependumType = dependum.getAttribute('type');
        //For now we only have the case for resources defined
        if(['resource-dependum'].includes(dependumType)){
          if(stereoType === 'Class'){
            const idx = classMap.size;
            const x = 50 + (200*(idx%3));
            const y = 50 + (200*Math.floor(idx/3));
            classMap.set(dependum.getId(), this.createClass(x, y, dependum, classDiagRoot));
          } else if (stereoType === 'Attribute'){
            console.log('Attribute Dependum');
          }
        }
      });
    },
    analyzeActorStructure(actors){
      const resources_class = {};
      const resources_attributes = {};
      const tasks = {};
      const qualities = {};
      actors.forEach(actor => {
        const actorId = actor.getId();
        //Init qualities object
        qualities[actorId] = [];
        tasks[actorId] = [];
        resources_class[actorId] = [];
        resources_attributes[actorId] = [];
        //Only check those that have boundaries
        const actor_parent = actor.getParent();
        let parent_type = actor_parent.getAttribute('type');
        let value = null;
        if(actor_parent.getId() !== "istar" && parent_type === undefined){
          value = actor_parent.getValue();
          parent_type = value.type;
        }
        //Only boundaries are interesting
        if(parent_type === 'boundary'){
          const n_children = actor_parent.getChildCount();
          //At least one besides the actor
          if(n_children > 1){
            for(let i = 0; i < n_children; i++){
              const child = actor_parent.getChildAt(i);
              const child_type = child.getAttribute('type');
              if(["goal","task","quality","resource"].includes(child_type)){
                const childStereotype = child.getAttribute('stereotype');
                if(childStereotype !== 'None'){
                  switch(child_type){ 
                    case "goal":
                      //Goals are ignored
                      break;
                    case "task":
                      tasks[actorId].push(child);
                      break;
                    case "resource":
                      if(childStereotype === 'Class'){
                        resources_class[actorId].push(child);
                      } else {
                        resources_attributes[actorId].push(child);
                      }
                      break;
                    case "quality":
                      qualities[actorId].push(child);
                      break;
                    default:
                      alert("something went wrong converting the model")
                      break;
                  }
                }
              }
            }
          }
        }
      });
      return {tasks, resources_class, resources_attributes, qualities};
    },
    analyzeClassResources(actors, classMap, resources_class, classDiagRoot){
      let idx = classMap.size;
      //For each of the actor's resources
      //Go over them and generate the corresponding class.
      actors.forEach(actor => {
        resources_class[actor.getId()].forEach(resource => {
          const x = 50 + (200*(idx%3));
          const y = 50 + (200*Math.floor(idx/3));
          classMap.set(resource.getId(), this.createClass(x, y, resource, classDiagRoot));
          idx++;
        });
      });
    },
    addAttribute(resource, class_element){
      const attr_container = class_element.getChildAt(1);
      const n_children = attr_container.getChildCount();
      const field_type = 'attribute';
      const doc_field = mxUtils.createXmlDocument();
      const node_field = doc_field.createElement(field_type);
      node_field.setAttribute('label', '- ' + _.camelCase(resource.getAttribute('label')));
      const field = this.current_graph.insertVertex(attr_container, null, node_field, 1, (20 * n_children) + 1, 98, 18, 'fillColor=#FFFFFF;selectable=0;align=left;fontColor=black;strokeColor=none;');
      field.setConnectable(false);
      this.handleResize(null, {getProperty(_string){return [class_element]}});
    },
    analyzeAttributeResources(actors, classMap, resources_attributes){
      actors.forEach(actor => {
        const actorId = actor.getId();
        resources_attributes[actorId].forEach(resource => {
          //Check number of edges
          const n_edges = resource.getEdgeCount();
          if(n_edges > 0){
            //Check if theres a belong to edge.
            //Directly access the edges object to use Array.find;
            const belongsToEdge = resource.edges.find(edge => edge.getAttribute('connectionType') === 'belongs-to');
            if(belongsToEdge !== undefined){
              //We know that this is an attribute, so it must point to the target class
              const edgeTarget = belongsToEdge.getTerminal(false).getId();
              //Check that the target is included in the classMap
              if(classMap.has(edgeTarget)){
                this.addAttribute(resource, classMap.get(edgeTarget));
              } else {
                alert(resource.getAttribute('label') + 'is incorrectly connected');
              }
            } else {
              //If it does not belong to something different to its actor
              //Check if the actor is defined in the classMap
              if(classMap.has(actorId)){
                this.addAttribute(resource, classMap.get(actorId));
              } else {
                alert(resource.getAttribute('label') + 'Cannot be transformed into an attribute');
              }
            }
          }
        });
      });
    },
    addMethod(task, class_element){
      const method_container = class_element.getChildAt(2);
      const n_children = method_container.getChildCount();
      const field_type = 'method';
      const doc_field = mxUtils.createXmlDocument();
      const node_field = doc_field.createElement(field_type);
      node_field.setAttribute('label', '+ ' + _.camelCase(task.getAttribute('label')) + '()');
      const field = this.current_graph.insertVertex(method_container, null, node_field, 1, (20 * n_children) + 1, 98, 18, 'fillColor=#FFFFFF;selectable=0;align=left;fontColor=black;strokeColor=none;');
      field.setConnectable(false);
      this.handleResize(null, {getProperty(_string){return [class_element]}});
    },
    analyzeTasks(actors, classMap, tasks){
      actors.forEach(actor => {
        const actorId = actor.getId();
        tasks[actorId].forEach(task => {
          //Check number of edges
          const n_edges = task.getEdgeCount();
          if(n_edges > 0){
            //Check if theres a belong to edge.
            //Directly access the edges object to use Array.find;
            const belongsToEdge = task.edges.find(edge => edge.getAttribute('connectionType') === 'belongs-to');
            if(belongsToEdge !== undefined){
              //We know that this is a method, so it must point to the target class
              const edgeTarget = belongsToEdge.getTerminal(false).getId();
              //Check that the target is included in the classMap
              if(classMap.has(edgeTarget)){
                this.addMethod(task, classMap.get(edgeTarget));
              } else {
                alert(task.getAttribute('label') + 'is incorrectly connected');
              }
            } else {
              //If it does not belong to something different to its actor
              //Check if the actor is defined in the classMap
              if(classMap.has(actorId)){
                this.addMethod(task, classMap.get(actorId));
              } else {
                alert(task.getAttribute('label') + 'Cannot be transformed into an attribute');
              }
            }
          }
        });
      });
    },
    analyzeQualities(actors, qualities, classMap){
      const noteMap = new Map();
      actors.forEach(actor => {
        const actorId = actor.getId();
        qualities[actorId].forEach(quality => {
          const qualityId = quality.getId();
          //Follow each edge leading out of the quality to see what it is associated to.
          quality.edges.forEach(edge => {
            const edgeSource = edge.getTerminal(true);
            const edgeSourceId = edgeSource.getId();
            //For now we will only include edges that lead into the quality
            if(edgeSourceId !== qualityId){
              //Check if the source is stereotyped
              const stereotype = edgeSource.getAttribute('stereotype');
              if(stereotype !== 'None'){
                //Find if it is connected to another resource with a belongs to edge
                const belongsToEdge = edgeSource.edges.find(edge => edge.getAttribute('connectionType') === 'belongs-to');
                if(belongsToEdge !== undefined){
                  //We know that this is a task/resource, so it must point to the target class
                  const edgeTarget = belongsToEdge.getTerminal(false).getId();
                  //Check that the target is included in the classMap
                  if(classMap.has(edgeTarget)){
                    //Add note for targetclass
                    if(noteMap.has(edgeTarget)){
                      noteMap.get(edgeTarget).push({text: quality.getAttribute('label'), contType: edge.getAttribute('relType')});
                    } else {
                      noteMap.set(edgeTarget, [{text: quality.getAttribute('label'), contType: edge.getAttribute('relType')}]);
                    }
                  } else {
                    alert(quality.getAttribute('label') + 'is incorrectly connected');
                  }
                } else {
                  //If not, it must be connected to the actor within which it finds itself
                  if(classMap.has(actorId)){
                    //Add note for actor class
                    if(noteMap.has(actorId)){
                      noteMap.get(actorId).push({text: quality.getAttribute('label'), contType: edge.getAttribute('relType')});
                    } else {
                      noteMap.set(actorId, [{text: quality.getAttribute('label'), contType: edge.getAttribute('relType')}]);
                    }
                  } else {
                    alert(task.getAttribute('label') + 'Cannot be transformed into an attribute');
                  }
                }
              }
            }
          });
        });
      });
      return noteMap;
    },
    addNotes(noteMap, classMap, model, classDiagRoot){
      let idx = classMap.size;
      noteMap.forEach((noteArray, classId) => {
        //First create a note
        const x = 50 + (200*(idx%3));
        const y = 50 + (200*Math.floor(idx/3));
        idx++;

        const type = "note";
        let doc = mxUtils.createXmlDocument();
        let node = doc.createElement(type);
        node.setAttribute('type', type);
        //Create a class instance in a the corresponding model
        const note = this.current_graph.insertVertex(classDiagRoot, null, node, x, y, 100, 40, "shape=file");
        //Link the note with the corresponding class.
        const link_type = 'rel_class_class';
        const doc_link = mxUtils.createXmlDocument();
        const node_link = doc_link.createElement(link_type);
        node_link.setAttribute('type', link_type);
        node_link.setAttribute('relation', 'Association');
        //Add the edge.
        const newEdge = this.current_graph.insertEdge(classDiagRoot, null, node_link, note, classMap.get(classId), "endArrow=none;dashed=1;");
        //Init info txt
        let info = '';
        noteArray.forEach(({text, contType}) => {
          info += text + ' [';
          switch(contType){
            case "make":
              info += '++]\n';
              break;
            case "help":
              info += '+]\n';
              break;
            case "hurt":
              info += '-]\n';
              break;
            case "break":
              info += '--]\n';
              break;
            default:
              info += '=]\n';
              break;
          }
        });
        note.setAttribute('information', info);
      });
    },
    generateClasses(){
      const model = this.current_graph.getModel();
      const istarRoot = model.getCell("istar"); 
      const classDiagRoot = model.getCell("classdiag");
      //Go over all top level elements and extract actors and dependums
      const {actors, dependums} = this.getTopLevelElems(istarRoot, model);
      //Go over the actors, create their respective classes in the class diagram
      //and create a map that has the actors as keys and the classes as values.
      const classMap = this.createClassMap(actors, classDiagRoot);
      //Go over all high level connections between actors and add the edges to
      //a map of relations.
      const relMap = this.analyzeTopLevelConnections(actors, classMap, classDiagRoot);
      //Go over all dependums and construct the relationships between the actors
      this.analyzeDependumConnections(dependums, classMap, relMap, classDiagRoot, model);
      //Go over actor's internal structure and construct the corresponding
      //fields and map them in a fieldMap. Also identify resources and qualities
      //for further processing.
      const {tasks, resources_class, resources_attributes, qualities} = this.analyzeActorStructure(actors);
      //Go over class resources to get new classes
      this.analyzeClassResources(actors, classMap, resources_class, classDiagRoot);
      //Go over all attribute resources
      this.analyzeAttributeResources(actors, classMap, resources_attributes);
      //Go over all the tasks
      this.analyzeTasks(actors, classMap, tasks);
      //Go over all qualities and insert them into a note associated with a class.
      const noteMap = this.analyzeQualities(actors, qualities, classMap, classDiagRoot);
      this.addNotes(noteMap, classMap, model, classDiagRoot);
    },
    //TEMP
    handleResize(_sender, evt){
        const cells = evt.getProperty('cells');
        if (cells != null)
        {
            cells.forEach(cell => {
                //Set up handling for classes
                if(cell.getAttribute('type') === 'class'){
                    const model = this.current_graph.getModel();
                    const cellGeo = cell.getGeometry().clone();

                    const name_container = cell.getChildAt(0);
                    const name_geo = name_container.getGeometry().clone();

                    const attr_container = cell.getChildAt(1);
                    const attr_geo = attr_container.getGeometry().clone();

                    const method_container = cell.getChildAt(2);
                    const method_geo = method_container.getGeometry().clone();

                    const attr_count = attr_container.getChildCount();
                    const method_count = method_container.getChildCount();

                    const limitWidth = 100;
                    const attribute_height = attr_count === 0 ? 40 : (20 * (attr_count + 1));
                    const method_height = method_count === 0 ? 40 : (20 * (method_count + 1));
                    const limitHeight = 20 + attribute_height + method_height;
                    let extraHeight = cellGeo.height - limitHeight;
                    if (extraHeight < 0){
                        extraHeight = 0;
                    }

                    //Reset the geometry to the limit if under it
                    let resetGeo = false;

                    if (cellGeo.height < limitHeight) {
                        cellGeo.height = limitHeight;
                        resetGeo = true;
                    }

                    if (cellGeo.width < limitWidth) {
                        cellGeo.width = limitWidth;
                        resetGeo = true;
                    }

                    if (resetGeo){
                        model.setGeometry(cell, cellGeo);
                    }

                    //Set geometry for name
                    name_geo.x = 0;
                    name_geo.y = 0;
                    name_geo.width = cellGeo.width;
                    model.setGeometry(name_container, name_geo);

                    //Set geometry for attributes
                    attr_geo.x = 0;
                    attr_geo.y = 20;
                    attr_geo.width = cellGeo.width;
                    attr_geo.height = attribute_height + (extraHeight/2);
                    model.setGeometry(attr_container, attr_geo);

                    //Set geometry for methods
                    method_geo.x = 0;
                    method_geo.y = attr_geo.height + name_geo.height;
                    method_geo.width = cellGeo.width;
                    method_geo.height = method_height + (extraHeight/2);
                    model.setGeometry(method_container, method_geo);
                }
            });
        }
    }
  }
}
</script>


<style scoped>
</style>