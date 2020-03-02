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
      actors.forEach((actor, idx) => {
        const x = 50 + (200*(idx%3));
        const y = 50 + (600*Math.floor(idx/3));
        //add the actor's id as the key to the reference to the created class.
        classMap.set(actor.getId(), this.createClass(x, y, actor, classDiagRoot));
      });
      return classMap;
    },
    analyzeTopLevelConnections(actors, classMap, classDiagRoot){
      const relMap = new Map();
      //analyse direct connections between actors
      actors.forEach(actor => {
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
      });
      return relMap;
    },
    analyzeDependumConnections(dependums, classMap, relMap, classDiagRoot, model){
      //Go over all the dependums and construct the required dependencies.
      //TODO: Add Resource/Quality dependum handling
      dependums.forEach(dependum => {
        const n_edges = dependum.getEdgeCount();
        if(n_edges === 2){
          const depId = dependum.getId();
          const e1 = dependum.getEdgeAt(0);
          const e1Source = e1.getTerminal(true);
          const e1Target = e1.getTerminal(false);
          const e1SourceId = e1Source.getId();
          const e1TargetId = e1Target.getId();
          const e2 = dependum.getEdgeAt(1);
          const e2Source = e2.getTerminal(true);
          const e2Target = e2.getTerminal(false);
          const e2SourceId = e2Source.getId();
          const e2TargetId = e2Target.getId();
          let target = e1SourceId === depId ?  e1Target : e2Target;
          const targetType = target.getAttribute('type');
          let source = e1SourceId === depId ?  e2Source : e1Source;
          const sourceType = source.getAttribute('type');

          if(["goal","quality","task","resource"].includes(targetType)){
            const value = target.getParent().getValue();
            target = model.getCell(value.actorCellId);
          }

          if(["goal","quality","task","resource"].includes(sourceType)){
            const value = source.getParent().getValue();
            source = model.getCell(value.actorCellId);
          }

          if(this.checkPresence(relMap, source.getId(), target.getId())){
            if(relMap.has(source.getId())){
              const edgeList = relMap.get(source.getId());
              edgeList.push(target.getId());
              relMap.set(source.getId(), edgeList);
            } else {
              const edgeList = [target.getId()];
              relMap.set(source.getId(), edgeList);
            }

            const sourceClass = classMap.get(source.getId());
            const targetClass = classMap.get(target.getId());

            let relationType = 'rel_class_class';
            let doc = mxUtils.createXmlDocument();
            let node = doc.createElement(relationType);
            node.setAttribute('type', relationType);
            node.setAttribute('relation', 'Association');
            const newEdge = this.current_graph.insertEdge(classDiagRoot, null, node, sourceClass, targetClass, "endArrow=none;endFill=none;endSize=10;");
            
            //Handle Goals-Dep as attributes and Task-Dep as methods
            const depType = dependum.getAttribute('type');  
            const depName = dependum.getAttribute('label').replace(/\s/g,'');
            if(depType === 'goal-dependum'){
              const attr_fields = sourceClass.getChildAt(1);
              const n_children = attr_fields.getChildCount();
              const field_type = 'attribute';
              const doc_field = mxUtils.createXmlDocument();
              const node_field = doc_field.createElement(field_type);
              node_field.setAttribute('label', depName);
              const field = this.current_graph.insertVertex(attr_fields, null, node_field, 1, (20 * n_children) + 1, 98, 18, 'fillColor=#FFFFFF;selectable=0;align=left;fontColor=black;strokeColor=none;');
              field.setConnectable(false);
              this.handleResize(null, {getProperty(_string){return [sourceClass]}});
            } else if(depType === 'task-dependum'){
              const attr_fields = sourceClass.getChildAt(2);
              const n_children = attr_fields.getChildCount();
              const field_type = 'method';
              const doc_field = mxUtils.createXmlDocument();
              const node_field = doc_field.createElement(field_type);
              node_field.setAttribute('label', depName+'()');
              const field = this.current_graph.insertVertex(attr_fields, null, node_field, 1, (20 * n_children) + 1, 98, 18, 'fillColor=#FFFFFF;selectable=0;align=left;fontColor=black;strokeColor=none;');
              field.setConnectable(false);
              this.handleResize(null, {getProperty(_string){return [sourceClass]}});
            }
          }
        }
      });
    },
    analyzeActorStructure(actors, classMap, classDiagRoot){
      let lastIdx = actors.length;
      const fieldMap = new Map();
      const resources = [];
      const qualities = {};
      actors.forEach(actor => {
        const actorId = actor.getId();
        //Init qualities object
        qualities[actorId] = [];
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
            const matching_class = classMap.get(actorId);
            for(let i = 0; i < n_children; i++){
              const child = actor_parent.getChildAt(i);
              const childId = child.getId();
              const child_txt = child.getAttribute('label');
              const child_type = child.getAttribute('type');
              if(["goal","task","quality","resource"].includes(child_type)){
                let attr_fields;
                let n_children;
                let field_type;
                let node_field;
                let doc_field;
                let field;
                switch(child_type){ 
                  //If it is a goal, add as an attribute to the corresponding class
                  //TODO add boolean refinement
                  case "goal":
                    attr_fields = matching_class.getChildAt(1);
                    n_children = attr_fields.getChildCount();
                    field_type = 'attribute';
                    doc_field = mxUtils.createXmlDocument();
                    node_field = doc_field.createElement(field_type);
                    node_field.setAttribute('label', child_txt);
                    field = this.current_graph.insertVertex(attr_fields, null, node_field, 1, (20 * n_children) + 1, 98, 18, 'fillColor=#FFFFFF;selectable=0;align=left;fontColor=black;strokeColor=none;');
                    field.setConnectable(false);
                    this.handleResize(null, {getProperty(_string){return [matching_class]}});
                    fieldMap.set(childId, field);
                    break;
                  //If it is a task it is added as a method to the class
                  //TODO add boolean refinement
                  case "task":
                    attr_fields = matching_class.getChildAt(2);
                    n_children = attr_fields.getChildCount();
                    field_type = 'method';
                    doc_field = mxUtils.createXmlDocument();
                    node_field = doc_field.createElement(field_type);
                    node_field.setAttribute('label', child_txt+'()');
                    field = this.current_graph.insertVertex(attr_fields, null, node_field, 1, (20 * n_children) + 1, 98, 18, 'fillColor=#FFFFFF;selectable=0;align=left;fontColor=black;strokeColor=none;');
                    field.setConnectable(false);
                    this.handleResize(null, {getProperty(_string){return [matching_class]}});
                    fieldMap.set(childId, field);
                    break;
                  //If it is a resource a new class must be created.
                  //Assumtion, here needed by can only exist within the actor in question.
                  case "resource":
                    const x = 50 + (200*(lastIdx%3));
                    const y = 50 + (600*Math.floor(lastIdx/3));
                    lastIdx += 1;
                    const elem = this.createClass(x, y, child, classDiagRoot);
                    //Set the element in the graph.
                    classMap.set(childId, elem);
                    //Reuse the vars already defined,
                    //instead of field, here we will insert a relation.
                    field_type = 'rel_class_class';
                    doc_field = mxUtils.createXmlDocument();
                    node_field = doc_field.createElement(field_type);
                    node_field.setAttribute('type', field_type);
                    node_field.setAttribute('relation', 'Association');
                    const newEdge = this.current_graph.insertEdge(classDiagRoot, null, node_field, classMap.get(childId), classMap.get(actorId), "endArrow=none;endFill=none;endSize=10;");
                    fieldMap.set(childId, field);
                    resources.push(child);
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
      });
      return {lastIdx, fieldMap, resources, qualities};
    },
    analyzeResources(resources, fieldMap){
      //Now, we must go over all resources to do parameter refinement.
      resources.forEach(resource => {
        const n_edges = resource.getEdgeCount();
        if(n_edges > 0){
          for (let i = 0; i < n_edges; i++){
            const edge = resource.getEdgeAt(i);
            //Here we assume that what the edges lead to tasks.
            const eSource = edge.getTerminal(true);
            const eTarget = edge.getTerminal(false);
            const eSourceId = eSource.getId();
            const eTargetId = eTarget.getId();
            //If you are the source, parametrize the field the target corresponds to
            if(resource.getId() === eSourceId){
              const field = fieldMap.get(eTargetId);
              if(field !== undefined){
                const txt = field.getAttribute('label');
                const startP = txt.indexOf('(');
                const endP = txt.indexOf(')');
                const dif = endP - startP === 1;
                let str = txt.slice(0,startP+1);
                if(dif){
                  str = str + resource.getAttribute('label') + ')';
                }
                field.setAttribute('label', str);
              }
            } else {
              alert("TODO: Add support for multiple parameters");
              //Evidently if not, do the opposite.
            }
          }
        }
      });
    },
    analyzeQualities(actors, qualities, classMap, lastIdx, classDiagRoot){
      let idx = lastIdx;
      const visitedEdges = [];
      //Now, for each actor, handle the associated notes.
      actors.forEach(actor => {
        const actorId = actor.getId();
        const actor_quals = qualities[actorId];
        if(actor_quals.length > 0){
          //If this is the case, then we must add a note where we will put
          //all of the notes.
          const x = 50 + (200*(lastIdx%3));
          const y = 50 + (600*Math.floor(lastIdx/3));
          idx += 1;

          const type = "note";
          let doc = mxUtils.createXmlDocument();
          let node = doc.createElement(type);
          node.setAttribute('type', type);
          //Create a class instance in a the corresponding model
          const note = this.current_graph.insertVertex(classDiagRoot, null, node, x, y, 100, 40, "shape=file");
          //Link the note with the actor.
          const link_type = 'rel_class_class';
          const doc_link = mxUtils.createXmlDocument();
          const node_link = doc_link.createElement(link_type);
          node_link.setAttribute('type', link_type);
          node_link.setAttribute('relation', 'Association');
          //Add the edge.
          const newEdge = this.current_graph.insertEdge(classDiagRoot, null, node_link, note, classMap.get(actorId), "endArrow=none;dashed=1;");
          //Init info txt
          let info = '';
          //Go over all quality elements and examine their relations
          actor_quals.forEach(quality => {
            const qualityId = quality.getId();
            //get quality edges.
            const n_edges = quality.getEdgeCount();
            if (n_edges > 0){
              for(let i = 0; i < n_edges; i++){
                const edge = quality.getEdgeAt(i);
                const edgeId = edge.getId();
                if(!visitedEdges.includes(edgeId)){
                  visitedEdges.push(edgeId);

                  const eSource = edge.getTerminal(true);
                  const eSourceType = eSource.getAttribute('type');
                  const eSourceLabel = eSource.getAttribute('label');
                  const eTarget = edge.getTerminal(false);
                  const eTargetType = eTarget.getAttribute('type');
                  const eTargetLabel = eTarget.getAttribute('label');
                  const eSourceId = eSource.getId();
                  const eTargetId = eTarget.getId();
                  const isSrc = eSourceId === qualityId;

                  const relType = edge.getAttribute('relType');
                  //If relType is undefined it means that it is a
                  //qualification relation
                  if(relType === undefined){
                    //Handle special case for qualify links
                    info += eSourceLabel + ' -> ' + eTargetLabel + '\n';
                  } else {
                    //Format the line
                    info += eSourceLabel + ((!isSrc && eSourceType === 'task')? '() -> ' : ' -> ') + eTargetLabel;
                    //Add the ending based on the type
                    switch(relType){
                      case "make":
                        //TASK_CLASS_METHOD_NAME() -> TARGET_QUALITY_NAME [++]
                        info += '[++]\n';
                        break;
                      case "help":
                        //TASK_CLASS_METHOD_NAME() -> TARGET_QUALITY_NAME [+]
                        info += '[+]\n';
                        break;
                      case "hurt":
                        //TASK_CLASS_METHOD_NAME() -> TARGET_QUALITY_NAME [-]
                        info += '[-]\n';
                        break;
                      case "break":
                        //TASK_CLASS_METHOD_NAME() -> TARGET_QUALITY_NAME [--]
                        info += '[--]\n';
                        break;
                    }
                  }
                }
              } 
            }
          });
          note.setAttribute('information', info);
        }
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
      //Go over all dependums and construct the relationships between the actos
      this.analyzeDependumConnections(dependums, classMap, relMap, classDiagRoot, model);
      //Go over actor's internal structure and construct the corresponding
      //fields and map them in a fieldMap. Also identify resources and qualities
      //for further processing.
      const {lastIdx, fieldMap, resources, qualities} = this.analyzeActorStructure(actors, classMap, classDiagRoot);
      //Go over all resources and refine the fields that use them.
      this.analyzeResources(resources, fieldMap);
      //Go over all qualities and insert them into a note associated with a class.
      this.analyzeQualities(actors, qualities, classMap, lastIdx, classDiagRoot);
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