var adaptation_state_actions = function adaptation_state_actions(graph,selected_method)
{ 
    class Dictionary {
      items=new Array();
      ids=new Array();
      lastId=1;

      constructor() {
      }

      add(group, type, key, value) { 
        value.id="id_" + this.lastId;
        this.createType(group, type);
        this.items[group][type][key]=value;
        this.ids[group + "_" + type + "_" + key]="id_" + this.lastId;
        this.lastId++;
      }

      createGroup(group) {  
        if(!this.items[group]){
          this.items[group]={};
        }
      }

      createType(group, type) {  
        this.createGroup(group);
        if(!this.items[group][type]){
          this.items[group][type]={};
        }
      }

      getId(group, type, key){
        return this.ids[group + "_" + type + "_" + key];
      }
    }

    if(selected_method=="serializeJson"){
        return serializeJson(graph); 
    }

    function serializeJson(graph){
          var model={};  
          model["name"]="SemaforoConBotone1";

          var dicElements=new Dictionary();
 
          serializeMachineJson(graph, dicElements);  
          serializeHardwareJson(graph, dicElements); 
          serializeBindingJson(graph, dicElements); 

          for (var groupName in dicElements.items) { 
            model[groupName]=[];
            var group=dicElements.items[groupName]; 
            for (var typeName in group) { 
              var type=group[typeName];  
              for (var itemName in type) { 
                var item={};
                item[typeName]=type[itemName]; 
                model[groupName].push(item); 
              }
            }
          }   

          // for (var key in dicElements.items) { 
          //   var item={}
          //   item[key]=dicElements.items[key]; 
          //   model.machine.push(item);
          // }    
 
          var modelJson=JSON.stringify(model);
          return modelJson; 
    } 
    
    function serializeMachineJson(graph, dicElements){ 
      serializeMachineStates(graph, dicElements); 
      serializeMachineTransitions(graph, dicElements);
    } 
    
    function serializeHardwareJson(graph, dicElements){  
      serializeHardwareBoard(graph, dicElements);  
      serializeHardwarePorts(graph, dicElements); 
    }

    function serializeBindingJson(graph, dicElements){  
      serializeBindingVariables(graph, dicElements);   
      serializeBindingTimers(graph, dicElements);   
      serializeBindingActivities(graph, dicElements);   
      serializeBindingReadActions(graph, dicElements);   
      serializeBindingWriteActions(graph, dicElements);   
      serializeBindingPredicates(graph, dicElements);   
      serializeBindingLogicalOperators(graph, dicElements);  

      serializeBindingRelationshipsState_Activity(graph, dicElements);  
      serializeBindingRelationshipsActivity_WriteAction(graph, dicElements);  
      serializeBindingRelationshipsWriteAction_Port(graph, dicElements); 

      serializeBindingRelationshipsLogicalOperator_Trasition(graph, dicElements);  
      serializeBindingRelationshipsLogicalOperator_LogicalOperator(graph, dicElements); 
      serializeBindingRelationshipsPredicate_LogicalOperator(graph, dicElements); 
      serializeBindingRelationshipsPredicate_ReadActions(graph, dicElements); 
      serializeBindingRelationshipsReadAction_Port(graph, dicElements); 
    }

    function serializeMachineStates(graph, dicElements){ 
      var graphModel = graph.getModel();
      var mainCell = graphModel.getCell("adaptation_state");
      var vertices = graphModel.getChildVertices(mainCell);
      var edges = graphModel.getChildEdges(mainCell); 

      for (var i = 0; i < vertices.length; i++) { 
          var vertice = vertices[i];
          var type = vertice.getAttribute("type"); 
          var label = vertice.getAttribute("label"); 
          if(type=="initialState"){ 
            var state = {
                id: 0,
                type: type,
                label: label
              };
            dicElements.add("machine","state", label, state);  
          }  
          else if(type=="state"){
            var state = {
                id: 0,
                type: type,
                label: label
              };
              dicElements.add("machine","state", label, state); 
          }   
      }    
    }

  function serializeMachineTransitions(graph, dicElements){ 
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("adaptation_state");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);

    var dicTransitions={}; 

    for (var i = 0; i < edges.length; i++) {
        var source = edges[i].source;
        var target = edges[i].target; 
        var sourceType=source.getAttribute("type");
        var targetType=target.getAttribute("type");

        if((sourceType=="initialState" || sourceType=="state") && targetType=="transition"){
          var labelState = source.getAttribute("label"); 
          var labelTransition = target.getAttribute("label"); 
          var transition=dicTransitions[labelTransition];
          if(!transition){
            transition = { 
              id:"",
              label: labelTransition,
              source: null,
              target: null
            };
          } 
          transition.source=dicElements.getId("machine", "state", labelState);  
          dicTransitions[labelTransition]=transition; 
        }
        else if(sourceType=="transition" && (targetType=="initialState" || targetType=="state")){
          var labelState = target.getAttribute("label"); 
          var labelTransition = source.getAttribute("label"); 
          var transition=dicTransitions[labelTransition];
          if(!transition){
            transition = { 
              id:"",
              label: labelTransition,
              source: null,
              target: null
            };
          } 
          transition.target=dicElements.getId("machine", "state", labelState); 
          dicTransitions[labelTransition]=transition; 
        }  
    }
    
    for (var key in dicTransitions) {
      dicElements.add("machine","transition", key, dicTransitions[key]); 
    }   
  } 

  function serializeHardwareBoard(graph, dicElements){ 
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("adaptation_hardware");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell); 

    for (var i = 0; i < vertices.length; i++) { 
        var vertice = vertices[i];
        var type = vertice.getAttribute("type"); 
        var label = vertice.getAttribute("label"); 
        if(type=="board"){  
          var board = {
              id: "",
              label: label,
              type: vertice.getAttribute("boardType")
            };
          dicElements.add("hardware","board", label, board);  
        }    
    }    
  }

  function serializeHardwarePorts(graph, dicElements){ 
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("adaptation_hardware");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);  

    for (var i = 0; i < vertices.length; i++) { 
      var vertice = vertices[i];
      var type = vertice.getAttribute("type"); 
      var label = vertice.getAttribute("label"); 
      if(type=="digitalActuator" || type=="analogActuator" ||  type=="digitalSensor" ||  type=="analogSensor"){ 
        var actuator = {
            id: "",
            label: label,
            type: type,
            pin: vertice.getAttribute("pin"),
            initialValue: vertice.getAttribute("initialValue")
          };
        dicElements.add("hardware","port", label, actuator);   
      } 
    }
  } 

  function serializeBindingVariables(graph, dicElements){ 
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("adaptation_binding_state_hardware");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);  

    for (var i = 0; i < vertices.length; i++) { 
      var vertice = vertices[i];
      var type = vertice.getAttribute("type"); 
      var label = vertice.getAttribute("label"); 
      if(type=="digitalVariable" || type=="analogVariable"){ 
        var item = {
            id: "",
            label: label,
            type: type,
            value: vertice.getAttribute("value")
          };
        dicElements.add("binding","variable", label, item);   
      } 
    }
  }  

  function serializeBindingTimers(graph, dicElements){ 
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("adaptation_binding_state_hardware");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);  

    for (var i = 0; i < vertices.length; i++) { 
      var vertice = vertices[i];
      var type = vertice.getAttribute("type"); 
      var label = vertice.getAttribute("label"); 
      if(type=="timer"){ 
        var item = {
            id: "",
            label: label, 
            initialValue: vertice.getAttribute("initialValue")
          };
        dicElements.add("binding","timer", label, item);   
      } 
    }
  } 

  function serializeBindingActivities(graph, dicElements){ 
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("adaptation_binding_state_hardware");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);  

    for (var i = 0; i < vertices.length; i++) { 
      var vertice = vertices[i];
      var type = vertice.getAttribute("type"); 
      var label = vertice.getAttribute("label"); 
      if(type=="activity"){ 
        var item = {
            id: "",
            label: label 
          };
        dicElements.add("binding","activity", label, item);   
      } 
    }
  } 

  function serializeBindingPredicates(graph, dicElements){ 
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("adaptation_binding_state_hardware");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);  

    for (var i = 0; i < vertices.length; i++) { 
      var vertice = vertices[i];
      var type = vertice.getAttribute("type"); 
      var label = vertice.getAttribute("label"); 
      if(type=="predicate"){ 
        var item = {
            id: "",
            label: label, 
            operator: vertice.getAttribute("operator"),
            value: vertice.getAttribute("value")
          };
        dicElements.add("binding","predicate", label, item);   
      } 
    }
  } 

  function serializeBindingLogicalOperators(graph, dicElements){ 
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("adaptation_binding_state_hardware");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);  

    for (var i = 0; i < vertices.length; i++) { 
      var vertice = vertices[i];
      var type = vertice.getAttribute("type"); 
      var label = vertice.getAttribute("label"); 
      if(type=="logicalOperator"){ 
        var item = {
            id: "",
            label: label, 
            value: vertice.getAttribute("value")
          };
        dicElements.add("binding","logicalOperator", label, item);   
      } 
    }
  } 

  function serializeBindingReadActions(graph, dicElements){ 
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("adaptation_binding_state_hardware");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);  

    for (var i = 0; i < vertices.length; i++) { 
      var vertice = vertices[i];
      var type = vertice.getAttribute("type"); 
      var label = vertice.getAttribute("label"); 
      if(type=="readAction"){ 
        var item = {
            id: "",
            label: label
          };
        dicElements.add("binding","readAction", label, item);   
      } 
    }
  } 

  function serializeBindingWriteActions(graph, dicElements){ 
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("adaptation_binding_state_hardware");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);  

    for (var i = 0; i < vertices.length; i++) { 
      var vertice = vertices[i];
      var type = vertice.getAttribute("type"); 
      var label = vertice.getAttribute("label"); 
      if(type=="writeAction"){ 
        var item = {
            id: "",
            label: label
          };
        dicElements.add("binding","writeAction", label, item);   
      } 
    }
  } 

  

  function serializeBindingRelationshipsState_Activity(graph, dicElements){ 
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("adaptation_binding_state_hardware");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);  
    var dicKey="relationship_state_activity";
    dicElements.createType("binding", dicKey); 

    for (var i = 0; i < edges.length; i++) {
        var source = edges[i].source;
        var target = edges[i].target; 
        var sourceType=source.getAttribute("type");
        var targetType=target.getAttribute("type");
        var relName=source.getAttribute("label") + "_" + target.getAttribute("label"); 

        if((sourceType=="initialState" || sourceType=="state") && targetType=="activity"){
          var state=source.getAttribute("label");  
          var item=dicElements.items["binding"][dicKey][relName];
          if(!item){
            item = {
              id:"",
              state: dicElements.getId("machine","state",state),
              beginPhase:[],
              whilePhase:[],
              endPhase:[]
            };  
            dicElements.add("binding",dicKey,relName, item); 
          }   
          var child = { 
            activity: dicElements.getId("binding","activity",target.getAttribute("label")) 
          };  
          var phase=edges[i].getAttribute("phase");
          if(phase=="begin"){
            item.beginPhase.push(child);
          }
          else if(phase=="while"){
            item.whilePhase.push(child);
          }
          else if(phase=="end"){
            item.endPhase.push(child);
          } 
          dicElements.items["binding"][dicKey][relName]=item; 
        } 
    } 
  } 

  function serializeBindingRelationshipsActivity_WriteAction(graph, dicElements){ 
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("adaptation_binding_state_hardware");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);  
    var dicKey="relationship_activity_writeAction";
    dicElements.createType("binding",dicKey ); 

    for (var i = 0; i < edges.length; i++) {
        var source = edges[i].source;
        var target = edges[i].target; 
        var sourceType=source.getAttribute("type");
        var targetType=target.getAttribute("type");
        var relName=source.getAttribute("label") + "_" + target.getAttribute("label"); 

        if(sourceType=="activity" && targetType=="writeAction"){
          var activity=source.getAttribute("label"); 
          var item=dicElements.items["binding"][dicKey][relName];
          if(!item){
            item = {
              id:"",
              activity: dicElements.getId("binding","activity",activity),
              writeActions:[]
            };  
            dicElements.add("binding",dicKey,relName, item);  
          }   
          var writeAction = {
            writeAction: dicElements.getId("binding","writeAction",target.getAttribute("label")) 
          }; 
          item.writeActions.push(writeAction);   
          dicElements.items["binding"][dicKey][relName]=item; 
        } 
    } 
  }

  function serializeBindingRelationshipsWriteAction_Port(graph, dicElements){ 
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("adaptation_binding_state_hardware");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);  
    var dicKey="relationship_writeAction_port";
    dicElements.createType("binding", dicKey); 

    for (var i = 0; i < edges.length; i++) {
        var source = edges[i].source;
        var target = edges[i].target; 
        var sourceType=source.getAttribute("type");
        var targetType=target.getAttribute("type");
        var relName=target.getAttribute("label") + "_Port" ;  

        if(targetType=="writeAction"){
          var writeAction=target.getAttribute("label");   
          var port=null;         
          if(sourceType=="digitalActuator" || sourceType=="analogActuator" || sourceType=="digitalSensor" || sourceType=="analogSensor"){
            port= dicElements.getId("hardware","port",source.getAttribute("label")) ;  
          } 
          else if(sourceType=="timer"){
            port= dicElements.getId("binding","timer",source.getAttribute("label")) ;  
          } 
          else if(sourceType=="digitalVariable" || sourceType=="analogVariable"){ 
            port= dicElements.getId("binding","variable",source.getAttribute("label")) ;  
          }
          if(port){
            var item=dicElements.items["binding"][dicKey][relName];
            if(!item){
              item = {
                id:"",
                writeAction: dicElements.getId("binding","writeAction",writeAction),
                readPort: port,
                writePort: null
              };  
              dicElements.add("binding",dicKey,relName, item);  
            }  
          }     
        }     
    } 

    for (var i = 0; i < edges.length; i++) {
      var source = edges[i].source;
      var target = edges[i].target; 
      var sourceType=source.getAttribute("type");
      var targetType=target.getAttribute("type");
      var relName=source.getAttribute("label") + "_Port" ;  

      if(sourceType=="writeAction"){
        var writeAction=source.getAttribute("label");   
        var port=null;         
        if(targetType=="digitalActuator" || targetType=="analogActuator" || targetType=="digitalSensor" || targetType=="analogSensor"){
          port= dicElements.getId("hardware","port",target.getAttribute("label")) ;  
        } 
        else if(targetType=="timer"){
          port= dicElements.getId("binding","timer",target.getAttribute("label")) ;  
        } 
        else if(targetType=="digitalVariable" || targetType=="analogVariable"){ 
          port= dicElements.getId("binding","variable",target.getAttribute("label")) ;  
        }
        if(port){
          var item=dicElements.items["binding"][dicKey][relName];
          if(!item){
            item = {
              id:"",
              writeAction: dicElements.getId("binding","writeAction",writeAction),
              readPort: null,
              writePort: port
            };  
            dicElements.add("binding",dicKey,relName, item);  
          }  
          item.writePort=port; 
          dicElements.items["binding"][dicKey][relName]=item; 
        }     
      }     
    } 
  }

  function serializeBindingRelationshipsLogicalOperator_Trasition(graph, dicElements){ 
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("adaptation_binding_state_hardware");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);  
    var dicKey ="relationship_logicalOperator_trasition";
    dicElements.createType("binding", dicKey); 

    for (var i = 0; i < edges.length; i++) {
        var source = edges[i].source;
        var target = edges[i].target; 
        var sourceType=source.getAttribute("type");
        var targetType=target.getAttribute("type");
        var relName=source.getAttribute("label") + "_" + target.getAttribute("label"); 
        if(sourceType=="logicalOperator" && targetType=="transition"){
          var activity=source.getAttribute("label"); 
          var item=dicElements.items["binding"][dicKey][relName];
          if(!item){
            item = {
              id:"", 
              logicalOperator: dicElements.getId("binding","logicalOperator",source.getAttribute("label")),
              transition: dicElements.getId("machine","transition",target.getAttribute("label"))
            }; 
            dicElements.add("binding",dicKey,relName, item);  
          }  
          dicElements.items["binding"][dicKey][relName]=item; 
        } 
    } 
  }  

  function serializeBindingRelationshipsLogicalOperator_LogicalOperator(graph, dicElements){ 
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("adaptation_binding_state_hardware");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);  
    var dicKey="relationship_logicalOperator_logicalOperator";
    dicElements.createType("binding", dicKey); 

    for (var i = 0; i < edges.length; i++) {
        var source = edges[i].source;
        var target = edges[i].target; 
        var sourceType=source.getAttribute("type");
        var targetType=target.getAttribute("type");
        var relName=source.getAttribute("label") + "_" + target.getAttribute("label"); 

        if(sourceType=="logicalOperator" && targetType=="logicalOperator"){
          var logicalOperator=target.getAttribute("label"); 
          var item=dicElements.items["binding"][dicKey][relName];
          if(!item){
            item = {
              id:"",
              logicalOperator: dicElements.getId("binding","logicalOperator",logicalOperator),
              logicalOperators:[] 
            };  
            dicElements.add("binding",dicKey,relName, item);  
          }   
          var logicalOperatorChild = {
            logicalOperator: dicElements.getId("binding","logicalOperator",source.getAttribute("label")) 
          }; 
          item.logicalOperators.push(logicalOperatorChild);   
          dicElements.items["binding"][dicKey][relName]=item;   
        } 
    } 
  }

  function serializeBindingRelationshipsPredicate_LogicalOperator(graph, dicElements){ 
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("adaptation_binding_state_hardware");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);   
    var dicKey="relationship_logicalOperator_predicate";
    dicElements.createType("binding", dicKey); 

    for (var i = 0; i < edges.length; i++) {
        var source = edges[i].source;
        var target = edges[i].target; 
        var sourceType=source.getAttribute("type");
        var targetType=target.getAttribute("type");
        var relName=source.getAttribute("label") + "_" + target.getAttribute("label"); 

        if(sourceType=="predicate" && targetType=="logicalOperator"){
          var logicalOperator=target.getAttribute("label"); 
          var item=dicElements.items["binding"][dicKey][relName];
          if(!item){
            item = {
              id:"",
              logicalOperator: dicElements.getId("binding","logicalOperator",logicalOperator),
              predicates:[] 
            };  
            dicElements.add("binding",dicKey,relName, item);  
          }   
          var predicate = {
            predicate: dicElements.getId("binding","predicate",source.getAttribute("label")) 
          }; 
          item.predicates.push(predicate);   
          dicElements.items["binding"][dicKey][relName]=item;  
        } 
    } 
  }
 
  function serializeBindingRelationshipsPredicate_ReadActions(graph, dicElements){ 
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("adaptation_binding_state_hardware");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);  
    var dicKey="relationship_predicate_readActions";
    dicElements.createType("binding", dicKey); 

    for (var i = 0; i < edges.length; i++) {
        var source = edges[i].source;
        var target = edges[i].target; 
        var sourceType=source.getAttribute("type");
        var targetType=target.getAttribute("type");
        var relName=target.getAttribute("label") + "_" + source.getAttribute("label");  

        if(sourceType=="readAction" && targetType=="predicate"){
          var predicate=target.getAttribute("label"); 
          var item=dicElements.items["binding"][dicKey][relName];
          if(!item){
            item = {
              id:"",
              predicate: dicElements.getId("binding","predicate",predicate),
              readAction: dicElements.getId("binding","readAction",source.getAttribute("label"))
            };  
            dicElements.add("binding",dicKey,relName, item);
          }      
          dicElements.items["binding"][dicKey][relName]=item;   
        }  
    } 
  }

  function serializeBindingRelationshipsReadAction_Port(graph, dicElements){ 
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("adaptation_binding_state_hardware");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);  
    var dicKey="relationship_readAction_port";
    dicElements.createType("binding", dicKey); 

    for (var i = 0; i < edges.length; i++) {
        var source = edges[i].source;
        var target = edges[i].target; 
        var sourceType=source.getAttribute("type");
        var targetType=target.getAttribute("type");
        var relName=target.getAttribute("label") + "_Port" ; 

        var readAction=null;
        var port=null;

        if(targetType=="readAction"){
          readAction=target.getAttribute("label");            
          if(sourceType=="digitalActuator" || sourceType=="analogActuator" || sourceType=="digitalSensor" || sourceType=="analogSensor"){
            port= dicElements.getId("hardware","port",source.getAttribute("label")) ;  
          } 
          else if(sourceType=="timer"){
            port= dicElements.getId("binding","timer",source.getAttribute("label")) ;  
          } 
          else if(sourceType=="digitalVariable" || sourceType=="analogVariable"){ 
            port= dicElements.getId("binding","variable",source.getAttribute("label")) ;  
          }
          if(port){
            var item=dicElements.items["binding"][dicKey][relName];
            if(!item){
              item = {
                id:"",
                readAction: dicElements.getId("binding","readAction",readAction),
                readPort: port
              };  
              dicElements.add("binding",dicKey,relName, item);  
            }  
          }      
        }     
    } 
  }

  

} 

export default adaptation_state_actions