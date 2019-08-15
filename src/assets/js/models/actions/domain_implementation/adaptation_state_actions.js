var adaptation_state_actions = function adaptation_state_actions(graph,selected_method)
{ 
    class Dictionary {
      items=new Array();
      ids=new Array();
      lastId=1;

      constructor() {
      }

      add(key, value) {
        this.items[key]=value;
        this.ids[key]=this.lastId;
        this.lastId++;
      }

      getId(key){
        return this.ids[key];
      }
    }

    if(selected_method=="serializeJson"){
        return serializeJson(graph); 
    }

    function serializeJson(graph){
          var model={
            name:"SemaforoConBotone1",
            machine:[],
            hardware:[],
            binding:[]
          } 

          var dicElements=new Dictionary();
 
          serializeMachineJson(graph, model, dicElements);   
          //serializeHardwareJson(graph, model); 
          //serializeBindingJson(graph, model); 

          for (var key in dicElements.items) {
            alert(key);
            var item={}
            item[key]=dicElements.items[key]; 
            model.machine.push(item);
          }    
   
          var modelJson=JSON.stringify(model);
          return modelJson; 
    } 
    
    function serializeMachineJson(graph, model, dicElements){ 
      serializeMachineStates(graph, model, dicElements); 
    }

    function serializeMachineStates(graph, model, dicElements){ 
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
                type: type,
                label: label
              };
            dicElements.add("state_" + label, state);  
          }  
          else if(type=="state"){
            var state = {
                type: type,
                label: label
              };
              dicElements.add("state_" + label, state); 
          }   
      }    
    }

  function serializeMachineTransitions(graph, model){ 
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
              label: labelTransition,
              source: null,
              target: null
            };
          } 
          transition.source=labelState; 
          dicTransitions[labelTransition]=transition;
        }
        else if(sourceType=="transition" && (targetType=="initialState" || targetType=="state")){
          var labelState = target.getAttribute("label"); 
          var labelTransition = source.getAttribute("label"); 
          var transition=dicTransitions[labelTransition];
          if(!transition){
            transition = { 
              label: labelTransition,
              source: null,
              target: null
            };
          } 
          transition.target=labelState; 
          dicTransitions[labelTransition]=transition;
        }  
    }
  }
  
  
    
  function serializeHardwareJson(graph, model){ 
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("adaptation_hardware");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);

    var dicTransitions={};

    for (var i = 0; i < vertices.length; i++) { 
        var vertice = vertices[i];
        var type = vertice.getAttribute("type"); 
        var label = vertice.getAttribute("label"); 
        if(type=="board"){ 
          var board = {
              label: label,
              type: vertice.getAttribute("boardType")
            };
          model.hardware.board=board; 
        }   
        else if(type=="digitalActuator"){ 
          var actuator = {
              label: label,
              pin: vertice.getAttribute("pin"),
              initialValue: vertice.getAttribute("initialValue")
            };
          model.hardware.ports.actuators.digital.push(actuator); 
        }   
        else if(type=="analogActuator"){ 
          var actuator = {
              label: label,
              pin: vertice.getAttribute("pin"),
              initialValue: vertice.getAttribute("initialValue")
            };
          model.hardware.ports.actuators.analog.push(actuator); 
        } 
        else if(type=="digitalSensor"){ 
          var sensor = {
              label: label,
              pin: vertice.getAttribute("pin"),
              initialValue: vertice.getAttribute("initialValue")
            };
          model.hardware.ports.sensors.digital.push(sensor); 
        } 
        else if(type=="analogSensor"){ 
          var sensor = {
              label: label,
              pin: vertice.getAttribute("pin"),
              initialValue: vertice.getAttribute("initialValue")
            };
          model.hardware.ports.sensors.analog.push(sensor); 
        } 
    }   
  }   

  function serializeBindingJson(graph, model){ 
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("adaptation_binding_state_hardware");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);

    var dicTransitions={};

    for (var i = 0; i < vertices.length; i++) { 
        var vertice = vertices[i];
        var type = vertice.getAttribute("type"); 
        var label = vertice.getAttribute("label"); 
        if(type=="digitalVariable"){ 
          var variable = {
              label: label,
              value: vertice.getAttribute("value") 
            };
          model.binding.variables.digital.push(variable); 
        }
        else if(type=="analogVariable"){ 
          var variable = {
              label: label,
              value: vertice.getAttribute("value") 
            };
          model.binding.variables.analog.push(variable); 
        }
        else if(type=="activity"){ 
          var activity = {
              label: label 
            };
          model.binding.activities.push(activity); 
        }
        else if(type=="timer"){ 
          var timer = {
              label: label,
              initialValue: vertice.getAttribute("initialValue")
            };
          model.binding.timers.push(timer); 
        }     
        else if(type=="predicate"){ 
          var predicate = {
              label: label,
              operator: vertice.getAttribute("operator"),
              value: vertice.getAttribute("value")
            };
          model.binding.predicates.push(predicate); 
        }   
        else if(type=="logicalOperator"){ 
          var logicalOperator = {
              label: label,
              value: vertice.getAttribute("value")
            };
          model.binding.logicalOperators.push(logicalOperator); 
        }     
        else if(type=="writeAction"){ 
          var action = {
              label: label
            };
          model.binding.actions.write.push(action); 
        }   
        else if(type=="readAction"){ 
          var action = {
              label: label 
            };
          model.binding.actions.read.push(action); 
        }     
    }

    var dic_states_activities={};
    var dic_activities_actions={};
    var dic_logicalOperators_predicates={};
    var dic_logicalOperators_logicalOperators={};
    var dic_predicates_readActions={};
    var dic_writeActions_ports={};


    for (var i = 0; i < edges.length; i++) {
      var source = edges[i].source;
      var target = edges[i].target; 
      var sourceType=source.getAttribute("type");
      var targetType=target.getAttribute("type"); 
      if((sourceType=="initialState" || sourceType=="state") && targetType=="activity"){
        var state=source.getAttribute("label"); 
        var item=dic_states_activities[state];
        if(!item){
          item = {
            state:state,
            beginPhase:[],
            whilePhase:[],
            endPhase:[]
          }; 
        }   
        var child = { 
          activity: target.getAttribute("label")
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
        dic_states_activities[state]=item;    
      }
      else if(sourceType=="activity" && targetType=="writeAction"){
        var activity=source.getAttribute("label"); 
        var item=dic_activities_actions[activity];
        if(!item){
          item = {
            activity:activity,
            actions:[]
          }; 
        }   
        var action = {
          action: target.getAttribute("label")
        }; 
        item.actions.push(action);
        dic_activities_actions[activity]=item;          
      }
      else if(sourceType=="logicalOperator" && targetType=="transition"){ 
        var item = {
          transition: target.getAttribute("label"),
          logicalOperator: source.getAttribute("label")
        };  
        model.binding.relationships.transitions_logicalOperators.push(item);        
      }       
      else if(sourceType=="predicate" && targetType=="logicalOperator"){
        var logicalOperator=target.getAttribute("label"); 
        var item=dic_logicalOperators_predicates[logicalOperator];
        if(!item){
          item = {
            logicalOperator:logicalOperator,
            predicates:[]
          }; 
        }   
        var predicate = {
          predicate: source.getAttribute("label")
        }; 
        item.predicates.push(predicate);
        dic_logicalOperators_predicates[logicalOperator]=item;         
      }
      else if(sourceType=="logicalOperator" && targetType=="logicalOperator"){
        var logicalOperator=target.getAttribute("label"); 
        var item=dic_logicalOperators_logicalOperators[logicalOperator];
        if(!item){
          item = {
            logicalOperator:logicalOperator,
            logicalOperators:[]
          }; 
        }   
        var logicalOperatorChild = {
          logicalOperator: source.getAttribute("label")
        }; 
        item.logicalOperators.push(logicalOperatorChild);
        dic_logicalOperators_logicalOperators[logicalOperator]=item;          
      }
      else if(sourceType=="readAction" && targetType=="predicate"){
        var predicate=target.getAttribute("label"); 
        var item=dic_predicates_readActions[predicate];
        if(!item){
          item = {
            predicate:predicate,
            readActionPrimary: source.getAttribute("label"),
            readActionSecondary: null
          }; 
        }else{
          item.readActionSecondary=source.getAttribute("label");
        }      
        dic_predicates_readActions[predicate]=item;           
      }
      else if((sourceType=="digitalVariable" || sourceType=="analogVariable" || sourceType=="digitalActuator" || sourceType=="analogActuator" || sourceType=="digitalSensor" || sourceType=="analogSensor" || sourceType=="timer") && targetType=="readAction"){
        var item = {
          readAction: target.getAttribute("label"),
          port: source.getAttribute("label")
        };  
        model.binding.relationships.readActions_ports.push(item);   
      }
      else if((sourceType=="digitalVariable" || sourceType=="analogVariable" || sourceType=="digitalActuator" || sourceType=="analogActuator" || sourceType=="digitalSensor" || sourceType=="analogSensor" || sourceType=="timer") && targetType=="writeAction"){
        var writeAction=target.getAttribute("label"); 
        var item=dic_writeActions_ports[writeAction];
        if(!item){
          item = {
            writeAction:writeAction,
            readPort: source.getAttribute("label"),
            writePort: null
          }; 
        }else{
          item.readPort=source.getAttribute("label");
        }      
        dic_writeActions_ports[writeAction]=item;         
      }
      else if(sourceType=="writeAction" && (targetType=="digitalVariable" || targetType=="analogVariable" || targetType=="digitalActuator" || targetType=="analogActuator" || targetType=="digitalSensor" || targetType=="analogSensor" || targetType=="timer")){
        var writeAction=source.getAttribute("label"); 
        var item=dic_writeActions_ports[writeAction];
        if(!item){
          item = {
            writeAction:writeAction,
            readPort: null,
            writePort:  target.getAttribute("label")
          }; 
        }else{
          item.writePort=target.getAttribute("label");
        }      
        dic_writeActions_ports[writeAction]=item;    
      }   
    }

    for (var key in dic_states_activities) {
      model.binding.relationships.states_activities.push(dic_states_activities[key]);  
    } 
    for (var key in dic_activities_actions) {
      model.binding.relationships.activities_actions.push(dic_activities_actions[key]);  
    } 
    for (var key in dic_logicalOperators_predicates) {
      model.binding.relationships.logicalOperators_predicates.push(dic_logicalOperators_predicates[key]);  
    }
    for (var key in dic_logicalOperators_logicalOperators) {
      model.binding.relationships.logicalOperators_logicalOperators.push(dic_logicalOperators_logicalOperators[key]);  
    }
    for (var key in dic_predicates_readActions) {
      model.binding.relationships.predicates_readActions.push(dic_predicates_readActions[key]);  
    }
    for (var key in dic_writeActions_ports) {
      model.binding.relationships.writeActions_ports.push(dic_writeActions_ports[key]);  
    }
   
  }   

} 

export default adaptation_state_actions