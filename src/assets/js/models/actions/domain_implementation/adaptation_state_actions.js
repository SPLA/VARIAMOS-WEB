import hardware_importer from "@/assets/js/models/actions/application_implementation/adaptation_state/hardware_importer.js";

var adaptation_state_actions = function adaptation_state_actions(graph, selected_method) {
  class Dictionary {
    items = new Array();
    ids = new Array();
    lastId = 1;

    constructor() {
    }

    add(group, type, key, value) {
      value.id = "id_" + this.lastId;
      this.createType(group, type);
      this.items[group][type][key] = value;
      this.ids[group + "_" + type + "_" + key] = "id_" + this.lastId;
      this.lastId++;
      return value.id;
    }

    createGroup(group) {
      if (!this.items[group]) {
        this.items[group] = {};
      }
    }

    createType(group, type) {
      this.createGroup(group);
      if (!this.items[group][type]) {
        this.items[group][type] = {};
      }
    }

    deleteGroup(group) {
      if (this.items[group]) {
        this.items[group] = {};
      }
    }

    getId(group, type, key) {
      return this.ids[group + "_" + type + "_" + key];
    }

  }

  if (selected_method == "serializeJson") {
    return serializeJson(graph);
  } else if (selected_method == "importFromArchitecture") {
    let importer = new hardware_importer(graph);
    importer.importFromArchitectureModel();
  } else if (selected_method == "generateHardwareFromArchitecture") {
    let importer = new hardware_importer(graph);
    importer.generateHardwareFromArchitecture();
  }

  function serializeJson(graph) {
    var model = {};
    model["name"] = "Mi proyecto";

    var dicElements = new Dictionary();

    serializeHardwareJson(graph, dicElements);
    serializeMachineJson(graph, dicElements);
    serializeBindingJson(graph, dicElements);
    serializeControlson(graph, dicElements);

    dicElements.deleteGroup("dummy");

    for (var groupName in dicElements.items) {
      model[groupName] = [];
      var group = dicElements.items[groupName];
      for (var typeName in group) {
        var type = group[typeName];
        for (var itemName in type) {
          var item = {};
          item[typeName] = type[itemName];
          model[groupName].push(item);
        }
      }
    }

    // for (var key in dicElements.items) { 
    //   var item={}
    //   item[key]=dicElements.items[key]; 
    //   model.machine.push(item);
    // }    

    return model;
  }

  function serializeMachineJson(graph, dicElements) {
    serializeMachineStates(graph, dicElements);
    serializeMachineTransitions(graph, dicElements);
  }

  function serializeHardwareJson(graph, dicElements) {
    serializeHardwareBoard(graph, dicElements);
    serializeHardwareDevices(graph, dicElements);
    serializeHardwareRelationshipsDevice_Board(graph, dicElements);
  }

  function serializeBindingJson(graph, dicElements) {
    serializeBindingVariables(graph, dicElements);
    serializeBindingTimers(graph, dicElements);
    serializeBindingActivities(graph, dicElements);
    serializeBindingReadActions(graph, dicElements);
    serializeBindingWriteActions(graph, dicElements);
    serializeBindingControlActions(graph, dicElements);
    serializeHardwareRelationshipsAction_Result(graph, dicElements);
    serializeHardwareRelationshipsAction_Variable(graph, dicElements);
    serializeBindingPredicates(graph, dicElements);
    serializeBindingLogicalOperators(graph, dicElements);

    serializeBindingRelationshipsState_Activity(graph, dicElements);
    serializeBindingRelationshipsActivity_Action(graph, dicElements);
    serializeBindingRelationshipsDevice_Action(graph, dicElements);
    // serializeBindingRelationshipsActivity_WriteAction(graph, dicElements);
    // serializeBindingRelationshipsWriteAction_Port(graph, dicElements);
    // serializeBindingRelationshipsControlAction_Port(graph, dicElements);

    serializeBindingRelationshipsLogicalOperator_Transition(graph, dicElements);
    serializeBindingRelationshipsLogicalOperator_LogicalOperator(graph, dicElements);
    serializeBindingRelationshipsPredicate_LogicalOperator(graph, dicElements);
    serializeBindingRelationshipsPredicate_Variables(graph, dicElements);
    serializeBindingRelationshipsReadAction_Port(graph, dicElements);
  }

  function serializeMachineStates(graph, dicElements) {
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("adaptation_state");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);


    for (var i = 0; i < vertices.length; i++) {
      var vertice = vertices[i];
      var type = vertice.getAttribute("type");
      var label = vertice.getAttribute("label");
      if (type == "initialState") {
        var state = {
          id: 0,
          type: type,
          label: label
        };
        dicElements.add("machine", "state", label, state);
      }
      else if (type == "state") {
        var required = vertice.getAttribute("required");
        if (required != "true") {
          continue;
        }
        var state = {
          id: 0,
          type: type,
          label: label
        };
        dicElements.add("machine", "state", label, state);
      }
    }
  }

  function serializeMachineTransitions(graph, dicElements) {
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("adaptation_state");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell); 

    var dicTransitions = {}; 

    let noSource=[];
    let noTarget=[];

    for (var i = 0; i < edges.length; i++) {
      var source = edges[i].source;
      var target = edges[i].target;
      var sourceType = source.getAttribute("type");
      var targetType = target.getAttribute("type"); 

      if (sourceType == "state" && targetType == "transition") { 
        var required = source.getAttribute("required");
        if (required != "true") { 
          noSource.push(target);
          continue;
        } 
      }
      else if (sourceType == "transition" && targetType == "state") {
        var required = target.getAttribute("required");
        if (required != "true") { 
          noTarget.push(source);
          continue;
        } 
      }
    }


     
    for (var i = 0; i < edges.length; i++) {
      var source = edges[i].source;
      var target = edges[i].target;
      var sourceType = source.getAttribute("type");
      var targetType = target.getAttribute("type"); 

      if ((sourceType == "initialState" || sourceType == "state") && targetType == "transition") {
        var labelState = source.getAttribute("label");
        var labelTransition = target.getAttribute("label");
        var required = target.getAttribute("required");
        if (required != "true") { 
          continue;
        } 
        if (noSource.includes(target) || noTarget.includes(target)) {
          continue;
        } 
        var transition = dicTransitions[labelTransition];
        if (!transition) {
          transition = {
            id: "",
            label: labelTransition,
            source: null,
            target: null
          };
        }
        transition.source = dicElements.getId("machine", "state", labelState);
        dicTransitions[labelTransition] = transition;
      }
      else if (sourceType == "transition" && (targetType == "initialState" || targetType == "state")) {
        var labelState = target.getAttribute("label");
        var labelTransition = source.getAttribute("label");
        var required = source.getAttribute("required");
        if (required != "true") { 
          continue;
        } 
        if (noSource.includes(source) || noTarget.includes(source)) {
          continue;
        } 
        var transition = dicTransitions[labelTransition];
        if (!transition) {
          transition = {
            id: "",
            label: labelTransition,
            source: null,
            target: null
          };
        }
        transition.target = dicElements.getId("machine", "state", labelState);
        dicTransitions[labelTransition] = transition;
      }
    }

    for (var key in dicTransitions) {
      dicElements.add("machine", "transition", key, dicTransitions[key]);
    }
  }

  function serializeHardwareBoard(graph, dicElements) {
    let vertices = getElements(graph, "adaptation_hardware", "board");
    for (var i = 0; i < vertices.length; i++) {
      let vertice = vertices[i];
      var label = vertice.getAttribute("label");
      var type = vertice.getAttribute("type");
      var board = {
        id: "",
        label: label,
        type: vertice.getAttribute("boardType"),
        pins: []
      };
      dicElements.add("hardware", "board", label, board);
      let children = vertice.children;
      for (let i = 0; i < children.length; i++) {
        let child = children[i];
        let pinName = child.getAttribute("label");
        let pinType = child.getAttribute("type");
        if (pinType == "digital" || pinType == "pwm") {
          pinName = pinName.substring(1);
        }
        var pin = {
          id: "",
          label: pinName,
          type: child.getAttribute("type")
        };
        pin.id = dicElements.add("dummy", "board_pin", board.label + "_" + pin.label, pin);
        board.pins.push(pin);
      }
    }
  }

  function serializeHardwareDevices(graph, dicElements) {
    let vertices = getElements(graph, "adaptation_hardware", "device");
    for (var i = 0; i < vertices.length; i++) {
      let vertice = vertices[i];
      var label = vertice.getAttribute("label");
      var type = vertice.getAttribute("type");
      var required = vertice.getAttribute("required");
      if (required != "true") {
        continue;
      }
      var device = {
        id: "",
        label: label,
        type: type,
        subType: vertice.getAttribute("subtype"),
        pins: []
      };
      dicElements.add("hardware", "device", label, device);
      let children = vertice.children;
      if (children) {
        for (let i = 0; i < children.length; i++) {
          let child = children[i];
          var pin = {
            id: "",
            label: child.getAttribute("label"),
            type: child.getAttribute("type")
          };
          if (pin.type == "pwm") {
            pin.label = "D" + pin.label.substring(1);
            pin.type = "digital";
          }
          pin.id = dicElements.add("dummy", "device_pin", device.label + "_" + pin.label, pin);
          device.pins.push(pin);
        }
      }
    }
  }



  function serializeHardwareRelationshipsDevice_Board(graph, dicElements) {
    var dicKey = "relationship_device_board";
    dicElements.createType("hardware", dicKey);

    let relations = getRelationsFromTypes(graph, "adaptation_hardware", ["digital", "analog", "pwm"], ["digital", "analog", "pwm"]);
    for (var i = 0; i < relations.length; i++) {
      var relation = relations[i];
      var source = relation.source;
      var target = relation.target;
      var sourceType = source.getAttribute("type");
      var targetType = target.getAttribute("type");

      let parentSource = source.parent;
      let parentTarget = target.parent;
      var required = parentSource.getAttribute("required");
      if (required != "true") {
        continue;
      }

      let pinDevice = null;
      let pinBoard = null;
      let device = null;
      let board = null;

      if (parentSource.getAttribute("type") == "device" && parentTarget.getAttribute("type") == "board") {
        pinDevice = source;
        device = parentSource;
        pinBoard = target;
        board = parentTarget;
      } else if (parentSource.getAttribute("type") == "board" && parentTarget.getAttribute("type") == "device") {
        pinDevice = target;
        device = parentTarget;
        pinBoard = source;
        board = parentSource;
      }

      if (pinDevice != null) {
        let pinName = pinBoard.getAttribute("label");
        let pinType = pinBoard.getAttribute("type");
        if (pinType == "digital" || pinType == "pwm") {
          pinName = pinName.substring(1);
        }

        if (pinDevice.getAttribute("type") == "pwm") {
          pinDevice.setAttribute("label", "D" + pinDevice.getAttribute("label").substring(1));
          pinDevice.setAttribute("type", "digital");
        }

        let kpd = device.getAttribute("label") + "_" + pinDevice.getAttribute("label");
        let kpb = board.getAttribute("label") + "_" + pinName;
        let relName = parentSource.getAttribute("label") + "_" + source.getAttribute("label") + "_" + parentTarget.getAttribute("label") + "_" + target.getAttribute("label");
        var item = dicElements.items["hardware"][dicKey][relName];
        if (!item) {
          item = {
            id: "",
            pinDevice: dicElements.getId("dummy", "device_pin", kpd),
            pinBoard: dicElements.getId("dummy", "board_pin", kpb)
          };
          dicElements.add("hardware", dicKey, relName, item);
        }
      }
    }
  }

  function serializeHardwarePorts(graph, dicElements) {
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("adaptation_hardware");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);

    for (var i = 0; i < vertices.length; i++) {
      var vertice = vertices[i];
      var type = vertice.getAttribute("type");
      var label = vertice.getAttribute("label");
      if (type == "digitalActuator" || type == "analogActuator" || type == "digitalSensor" || type == "analogSensor") {
        var pins = ("" + vertice.getAttribute("pin")).replace(/ /g, "").replace(/,/g, ',').split(",");
        var actuator = {
          id: "",
          label: label,
          type: type,
          pin: pins,
          initialValue: vertice.getAttribute("initialValue"),
          subType: vertice.getAttribute("subType")
        };
        dicElements.add("hardware", "device", label, actuator);
      }
    }
  }

  function serializeBindingVariables(graph, dicElements) {
    let vertices = getElements(graph, "adaptation_behavior_hardware", "variable");
    for (var i = 0; i < vertices.length; i++) {
      let vertice = vertices[i];
      var label = vertice.getAttribute("label");
      var type = "analogVariable";
      var dataType = vertice.getAttribute("dataType");
      if (dataType == "digital") {
        type = "digitalVariable";
      } else if (dataType == "string") {
        type = "stringVariable";
      };
      var item = {
        id: "",
        label: label,
        type: type,
        value: vertice.getAttribute("value")
      };
      dicElements.add("binding", "variable", label, item);
    }
  }

  function serializeBindingTimers(graph, dicElements) {
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("adaptation_behavior_hardware");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);

    for (var i = 0; i < vertices.length; i++) {
      var vertice = vertices[i];
      var type = vertice.getAttribute("type");
      var label = vertice.getAttribute("label");
      if (type == "timer") {
        var item = {
          id: "",
          label: label,
          initialValue: vertice.getAttribute("initialValue")
        };
        dicElements.add("binding", "timer", label, item);
      }
    }
  }

  function serializeBindingActivities(graph, dicElements) {
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("adaptation_behavior_states");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);

    for (var i = 0; i < vertices.length; i++) {
      var vertice = vertices[i];
      var type = vertice.getAttribute("type");
      var label = vertice.getAttribute("label");
      if (type == "activity") {
        var item = {
          id: "",
          label: label
        };
        dicElements.add("binding", "activity", label, item);
      }
    }
  }

  function serializeBindingPredicates(graph, dicElements) {
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("adaptation_behavior_transitions");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);

    for (var i = 0; i < vertices.length; i++) {
      var vertice = vertices[i];
      var type = vertice.getAttribute("type");
      var label = vertice.getAttribute("label");
      if (type == "predicate") {
        var item = {
          id: "",
          label: label,
          operator: vertice.getAttribute("operator"),
          value: vertice.getAttribute("value")
        };
        dicElements.add("binding", "predicate", label, item);
      }
    }
  }

  function serializeBindingLogicalOperators(graph, dicElements) {
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("adaptation_behavior_transitions");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);

    for (var i = 0; i < vertices.length; i++) {
      var vertice = vertices[i];
      var type = vertice.getAttribute("type");
      var label = vertice.getAttribute("label");
      if (type == "logicalOperator") {
        var item = {
          id: "",
          label: label,
          value: vertice.getAttribute("value")
        };
        dicElements.add("binding", "logicalOperator", label, item);
      }
    }
  }

  function serializeBindingReadActions(graph, dicElements) {
    let vertices = getElements(graph, "adaptation_behavior_hardware", "readAction");
    for (var i = 0; i < vertices.length; i++) {
      let vertice = vertices[i];
      var label = vertice.getAttribute("label");
      var type = vertice.getAttribute("type");
      var required = vertice.getAttribute("required");
      if (required != "true") {
        continue;
      }
      var device=getActionDeviceParent(graph, vertice);
      required = device.getAttribute("required");
      if (required != "true") {
        continue;
      }

      var action = {
        id: "",
        label: label,
        type: type,
        subType: vertice.getAttribute("subtype"),
        arguments: []
      };
      dicElements.add("binding", "readAction", label, action);
      let children = vertice.children;
      if (children) {
        for (let i = 0; i < children.length; i++) {
          let child = children[i];
          var argument = {
            id: "",
            label: child.getAttribute("label"),
            type: child.getAttribute("type"),
            dataType: child.getAttribute("dataType")
          };
          argument.id = dicElements.add("dummy", "action_argument", action.label + "_" + argument.label, argument);
          action.arguments.push(argument);
        }
      }
    }
  }

  function serializeBindingWriteActions(graph, dicElements) {
    let vertices = getElements(graph, "adaptation_behavior_hardware", "writeAction");
    for (var i = 0; i < vertices.length; i++) {
      let vertice = vertices[i];
      var label = vertice.getAttribute("label");
      var type = vertice.getAttribute("type");
      var required = vertice.getAttribute("required");
      if (required != "true") {
        continue;
      }
      var device=getActionDeviceParent(graph,vertice);
      required = device.getAttribute("required");
      if (required != "true") {
        continue;
      }
      var action = {
        id: "",
        label: label,
        type: type,
        subType: vertice.getAttribute("subtype"),
        arguments: []
      };
      dicElements.add("binding", "writeAction", label, action);
      let children = vertice.children;
      if (children) {
        for (let i = 0; i < children.length; i++) {
          let child = children[i];
          var argument = {
            id: "",
            label: child.getAttribute("label"),
            type: child.getAttribute("type"),
            dataType: child.getAttribute("dataType")
          };
          argument.id = dicElements.add("dummy", "action_argument", action.label + "_" + argument.label, argument);
          action.arguments.push(argument);
        }
      }
    }
  }

  function serializeBindingControlActions(graph, dicElements) {
    let vertices = getElements(graph, "adaptation_behavior_hardware", "controlAction");
    for (var i = 0; i < vertices.length; i++) {
      let vertice = vertices[i];
      var label = vertice.getAttribute("label");
      var type = vertice.getAttribute("type");
      var required = vertice.getAttribute("required");
      if (required != "true") {
        continue;
      }
      var controlType = vertice.getAttribute("controlType");
      if (!controlType) {
        controlType = "continuous";
      }
      var action = {
        id: "",
        label: label,
        type: type,
        controlType: controlType,
        arguments: [],
        configuration: []
      };
      dicElements.add("binding", "controlAction", label, action);
      let children = vertice.children;
      if (children) {
        for (let i = 0; i < children.length; i++) {
          let child = children[i];
          let al = child.getAttribute("label");
          let alabel = al;
          if (["s", "sp"].includes(alabel)) {
            alabel = "setPoint";
          }
          else if (["m"].includes(alabel)) {
            alabel = "measurement";
          }
          var argument = {
            id: "",
            label: alabel,
            type: child.getAttribute("type"),
            dataType: child.getAttribute("dataType")
          };
          argument.id = dicElements.add("dummy", "action_argument", action.label + "_" + al, argument);
          action.arguments.push(argument);
        }
      }

      vertices = getElements(graph, "control", "controller");
      for (var i = 0; i < vertices.length; i++) {
        let vertice = vertices[i];
        var item = {
          id: "",
          label: "proportional",
          dataType: "double",
          value: vertice.getAttribute("Proportional")
        };
        item.id = dicElements.add("dummy", "control_configuration", action.label + "_" + "proportional", item);
        action.configuration.push(item);

        var item = {
          id: "",
          label: "Integral",
          dataType: "double",
          value: vertice.getAttribute("Integral")
        };
        item.id = dicElements.add("dummy", "control_configuration", action.label + "_" + "integral", item);
        action.configuration.push(item);

        var item = {
          id: "",
          label: "derivate",
          dataType: "double",
          value: vertice.getAttribute("Derivate")
        };
        item.id = dicElements.add("dummy", "control_configuration", action.label + "_" + "derivate", item);
        action.configuration.push(item);
      }
    }
  }

  function serializeHardwareRelationshipsAction_Result(graph, dicElements) {
    var dicKey = "relationship_action_result";
    dicElements.createType("binding", dicKey);

    let relations = getRelationsFromTypes(graph, "adaptation_behavior_hardware", ["readAction", "controlAction"], ["variable"]);
    for (var i = 0; i < relations.length; i++) {
      var relation = relations[i];
      var source = relation.source;
      var target = relation.target;
      var sourceType = source.getAttribute("type");
      var targetType = target.getAttribute("type");
      var required = source.getAttribute("required");
      if (required != "true") {
        continue;
      }

      let relName = source.getAttribute("label") + "_" + target.getAttribute("label");
      var item = dicElements.items["binding"][dicKey][relName];
      if (!item) {
        var aid = "";
        if (sourceType == "readAction") {
          aid = dicElements.getId("binding", "readAction", source.getAttribute("label"));
        } else {
          aid = dicElements.getId("binding", "controlAction", source.getAttribute("label"));
        }
        item = {
          id: "",
          variable: dicElements.getId("binding", "variable", target.getAttribute("label")),
          action: aid
        };
        dicElements.add("binding", dicKey, relName, item);
      }
    }
  }

  function serializeHardwareRelationshipsAction_Variable(graph, dicElements) {
    var dicKey = "relationship_action_variable";
    dicElements.createType("binding", dicKey);

    let relations = getRelationsFromTypes(graph, "adaptation_behavior_hardware", ["digitalVariable", "analogVariable", "stringVariable", "variable"], ["actionArgument"]);
    for (var i = 0; i < relations.length; i++) {
      var relation = relations[i];
      var source = relation.source;
      var target = relation.target;
      var sourceType = source.getAttribute("type");
      var targetType = target.getAttribute("type");

      let parentSource = source.parent;
      let parentTarget = target.parent;
      var required = parentTarget.getAttribute("required");
      if (required != "true") {
        continue;
      }

      let variable = source;
      let pinAction = null;
      let action = null;

      if ((parentTarget.getAttribute("type") == "readAction" || parentTarget.getAttribute("type") == "writeAction" || parentTarget.getAttribute("type") == "controlAction")) {
        pinAction = target;
        action = parentTarget;
      }

      if (pinAction != null) {
        let kpd = variable.getAttribute("label");
        let kpb = action.getAttribute("label") + "_" + pinAction.getAttribute("label");
        let relName = source.getAttribute("label") + "_" + parentTarget.getAttribute("label") + "_" + target.getAttribute("label");
        var item = dicElements.items["binding"][dicKey][relName];
        if (!item) {
          item = {
            id: "",
            variable: dicElements.getId("binding", "variable", kpd),
            actionArgument: dicElements.getId("dummy", "action_argument", kpb)
          };
          dicElements.add("binding", dicKey, relName, item);
        }
      }
    }
  }



  function serializeBindingRelationshipsState_Activity(graph, dicElements) {
    var dicKey = "relationship_state_activity";
    dicElements.createType("binding", dicKey);

    let relations = getRelationsFromTypes(graph, "adaptation_behavior_states", ["initialState", "state"], ["stateLifeLine"]);
    for (var i = 0; i < relations.length; i++) {
      var relation = relations[i];
      var source = relation.source;
      var target = relation.target;
      var sourceType = source.getAttribute("type");
      var targetType = target.getAttribute("type");
      var relName = source.getAttribute("label") + "_activities";
      let phase = target.getAttribute("phase");

      if (sourceType=="state") {
        let originalState=getOriginalElement(graph, "adaptation_state", source);
        let required=originalState.getAttribute("required");
        if (required!="true") {
          continue;
        } 
      }
      
      var item = dicElements.items["binding"][dicKey][relName];
      if (!item) {
        item = {
          id: "",
          state: dicElements.getId("machine", "state", source.getAttribute("label")),
          beginPhase: [],
          whilePhase: [],
          endPhase: []
        };
        dicElements.add("binding", dicKey, relName, item);
      }


      var stateLifeLine = target;
      var relationsStateLifeLine_ActivityLifeLine = getRelationsFromSource(graph, "adaptation_behavior_states", stateLifeLine, ["activityLifeLine"]);
      for (let index = 0; index < relationsStateLifeLine_ActivityLifeLine.length; index++) {
        let relationStateLifeLine_ActivityLifeLine = relationsStateLifeLine_ActivityLifeLine[index];
        let activityLifeLine = relationStateLifeLine_ActivityLifeLine.target;
        let relationsActivityLifeLine_Activity = getRelationsToTarget(graph, "adaptation_behavior_states", activityLifeLine, ["activity"]);
        if (relationsActivityLifeLine_Activity.length > 0) {
          let activity = relationsActivityLifeLine_Activity[0].source;
          let relStateActivity = {};
          relStateActivity["activity"] = dicElements.getId("binding", "activity", activity.getAttribute("label"));
          relStateActivity["execution"] = relationStateLifeLine_ActivityLifeLine.getAttribute("execution");
          relStateActivity["time"] = relationStateLifeLine_ActivityLifeLine.getAttribute("time");
          item[phase + 'Phase'].push(relStateActivity);
        }
      }


    }
  }

  function serializeBindingRelationshipsActivity_Action(graph, dicElements) {
    var dicKey = "relationship_activity_action";
    dicElements.createType("binding", dicKey);

    let relations = getRelationsFromTypes(graph, "adaptation_behavior_states", ["activity"], ["activityLifeLine"]);
    for (var i = 0; i < relations.length; i++) {
      var relation = relations[i];
      var source = relation.source;
      var target = relation.target;
      var sourceType = source.getAttribute("type");
      var targetType = target.getAttribute("type");
      var relName = source.getAttribute("label") + "_" + target.getAttribute("label");

      var required = source.getAttribute("required");
      if (required != "true") {
        continue;
      }

      var item = dicElements.items["binding"][dicKey][relName];
      if (!item) {
        item = {
          id: "",
          activity: dicElements.getId("binding", "activity", source.getAttribute("label")),
          actions: []
        };
        dicElements.add("binding", dicKey, relName, item);
      }


      var activityLifeLine = target;
      var relationsActivityLifeLine_ActionLifeLine = getRelationsFromSource(graph, "adaptation_behavior_states", activityLifeLine, ["actionLifeLine"]);
      for (let index = 0; index < relationsActivityLifeLine_ActionLifeLine.length; index++) {
        let relationActivityLifeLine_ActionLifeLine = relationsActivityLifeLine_ActionLifeLine[index];
        let actionLifeLine = relationActivityLifeLine_ActionLifeLine.target;
        let relationsActionLifeLine_Action = getRelationsToTarget(graph, "adaptation_behavior_states", actionLifeLine, ["readAction", "writeAction", "controlAction"]);
        if (relationsActionLifeLine_Action.length > 0) {
          let action = relationsActionLifeLine_Action[0].source;
          required = action.getAttribute("required");
          if (required != "true") {
            continue;
          }
          if (["readAction", "writeAction"].includes(action.getAttribute("type"))) {
            var originalAction = getOriginalElement(graph, "adaptation_behavior_hardware", action); 
            let relationDevice_Action = getRelationsToTarget(graph, "adaptation_behavior_hardware", originalAction, ["device"]);
            if (relationDevice_Action.length > 0) {
              let device = relationDevice_Action[0].source;
              var originalDevice = getOriginalElement(graph, "adaptation_hardware", device); 
              required = originalDevice.getAttribute("required");
              if (required != "true") {
                continue;
              }
            }
          }

          let relActivityAction = {};
          relActivityAction["action"] = dicElements.getId("binding", action.getAttribute("type"), action.getAttribute("label"));
          relActivityAction["actionType"] = action.getAttribute("type");
          relActivityAction["execution"] = relationActivityLifeLine_ActionLifeLine.getAttribute("execution");
          relActivityAction["time"] = relationActivityLifeLine_ActionLifeLine.getAttribute("time");
          item.actions.push(relActivityAction);
        }
      }
    }
  }

  function serializeBindingRelationshipsDevice_Action(graph, dicElements) {
    var dicKey = "relationship_device_action";
    dicElements.createType("binding", dicKey);

    let relations = getRelationsFromTypes(graph, "adaptation_behavior_hardware", ["device"], ["writeAction", "readAction"]);
    for (var i = 0; i < relations.length; i++) {
      var relation = relations[i];
      var source = relation.source;
      var target = relation.target;
      var sourceType = source.getAttribute("type");
      var targetType = target.getAttribute("type");
      var relName = source.getAttribute("label") + "_" + target.getAttribute("label");

      var required = source.getAttribute("required");
      if (required != "true") {
        continue;
      }

      required = target.getAttribute("required");
      if (required != "true") {
        continue;
      }

      var item = dicElements.items["binding"][dicKey][relName];
      if (!item) {
        item = {
          id: "",
          device: dicElements.getId("hardware", "device", source.getAttribute("label")),
          action: dicElements.getId("binding", target.getAttribute("type"), target.getAttribute("label")),
          actionType: target.getAttribute("type")
        };
        dicElements.add("binding", dicKey, relName, item);
      }
    }
  }

  function getRelationsFromTypes(graph, modelName, sourceTypes, targetTypes) {
    var ret = [];
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell(modelName);
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);
    for (var i = 0; i < edges.length; i++) {
      var edge = edges[i];
      var source = edge.source;
      var target = edge.target;
      var sourceType = source.getAttribute("type");
      var targetType = target.getAttribute("type");
      if (sourceTypes.includes(sourceType) && targetTypes.includes(targetType)) {
        ret.push(edge);
      }
    }
    return ret;
  }

  function getRelationsFromSource(graph, modelName, sourceBase, targetTypes) {
    // var graphModel = graph.getModel();
    // var mainCell = graphModel.getCell(modelName);
    // var vertices = graphModel.getChildVertices(mainCell);
    // var edges = graphModel.getChildEdges(mainCell);
    var edges = sourceBase.edges;
    var ret = [];
    for (var i = 0; i < edges.length; i++) {
      var edge = edges[i];
      var source = edge.source;
      var target = edge.target;
      if (source == sourceBase && targetTypes.includes(target.getAttribute("type"))) {
        ret.push(edge);
      }
    }
    return ret;
  }

  function getRelationsToTarget(graph, modelName, targetBase, sourceTypes) {
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell(modelName);
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);
    var ret = [];
    for (var i = 0; i < edges.length; i++) {
      var edge = edges[i];
      var source = edge.source;
      var target = edge.target;
      if (target == targetBase && sourceTypes.includes(source.getAttribute("type"))) {
        ret.push(edge);
      }
    }
    return ret;
  }

  function getElements(graph, modelName, elementType) {
    let ret = [];
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell(modelName);
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);

    for (var i = 0; i < vertices.length; i++) {
      var vertice = vertices[i];
      var type = vertice.getAttribute("type");
      if (type == elementType) {
        ret.push(vertice);
      }
    }
    return ret;
  }

  function getElementsByLabel(graph, modelName, elementType, label) {
    let ret = [];
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell(modelName);
    var vertices = graphModel.getChildVertices(mainCell);
    for (var i = 0; i < vertices.length; i++) {
      var vertice = vertices[i];
      var type = vertice.getAttribute("type");
      if (type == elementType) {
        var vlabel = vertice.getAttribute("label");
        if (label == vlabel) {
          ret.push(vertice);
        }
      }
    }
    return ret;
  }

  function getOriginalElement(graph, modelName, clonElement) {
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell(modelName);
    var vertices = graphModel.getChildVertices(mainCell);
    for (var i = 0; i < vertices.length; i++) {
      var vertice = vertices[i];
      if (clonElement.getAttribute("type") == vertice.getAttribute("type")) {
        if (clonElement.getAttribute("label") == vertice.getAttribute("label")) {
          return vertice;
        }
      }
    }
    return null;
  }

  function getTransitionSourceState(graph, transition) {
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("adaptation_state");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);  
    for (var i = 0; i < edges.length; i++) {
      var source = edges[i].source;
      var target = edges[i].target;
      if (target==transition) {
        var sourceType = source.getAttribute("type");
        var targetType = target.getAttribute("type");  
        if (sourceType == "state" || sourceType == "initialState") { 
          return source; 
        } 
      }
    } 
  }

  function getTransitionTargetState(graph, transition) {
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("adaptation_state");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);  
    for (var i = 0; i < edges.length; i++) {
      var source = edges[i].source;
      var target = edges[i].target;
      if (source==transition) {
        var sourceType = source.getAttribute("type");
        var targetType = target.getAttribute("type");  
        if (targetType == "state" || targetType == "initialState") { 
          return target; 
        } 
      }
    } 
  }


  function getActionDeviceParent(graph, action) { 
    let relationDevice_Action = getRelationsToTarget(graph, "adaptation_behavior_hardware", action, ["device"]);
    if (relationDevice_Action.length > 0) {
      let device = relationDevice_Action[0].source;
      let originalDevice = getOriginalElement(graph, "adaptation_hardware", device); 
      return originalDevice;
    }
  }


  function serializeBindingRelationshipsActivity_WriteAction(graph, dicElements) {
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("adaptation_binding_state_hardware");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);
    var dicKey = "relationship_activity_writeAction";
    dicElements.createType("binding", dicKey);

    for (var i = 0; i < edges.length; i++) {
      var source = edges[i].source;
      var target = edges[i].target;
      var sourceType = source.getAttribute("type");
      var targetType = target.getAttribute("type");
      var relName = source.getAttribute("label") + "_writeActions";

      if (sourceType == "activity" && targetType == "writeAction") {
        var activity = source.getAttribute("label");
        var item = dicElements.items["binding"][dicKey][relName];
        if (!item) {
          item = {
            id: "",
            activity: dicElements.getId("binding", "activity", activity),
            writeActions: []
          };
          dicElements.add("binding", dicKey, relName, item);
        }
        var writeAction = {
          writeAction: dicElements.getId("binding", "writeAction", target.getAttribute("label"))
        };
        item.writeActions.push(writeAction);
        dicElements.items["binding"][dicKey][relName] = item;
      }
    }
  }

  function serializeBindingRelationshipsWriteAction_Port(graph, dicElements) {
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("adaptation_binding_state_hardware");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);
    var dicKey = "relationship_writeAction_port";
    dicElements.createType("binding", dicKey);

    for (var i = 0; i < edges.length; i++) {
      var source = edges[i].source;
      var target = edges[i].target;
      var sourceType = source.getAttribute("type");
      var targetType = target.getAttribute("type");
      var relName = target.getAttribute("label") + "_Port";

      if (targetType == "writeAction") {
        var writeAction = target.getAttribute("label");
        var port = null;
        if (sourceType == "digitalActuator" || sourceType == "analogActuator" || sourceType == "digitalSensor" || sourceType == "analogSensor") {
          port = dicElements.getId("hardware", "device", source.getAttribute("label"));
        }
        else if (sourceType == "timer") {
          port = dicElements.getId("binding", "timer", source.getAttribute("label"));
        }
        else if (sourceType == "digitalVariable" || sourceType == "analogVariable" || sourceType == "stringVariable") {
          port = dicElements.getId("binding", "variable", source.getAttribute("label"));
        }
        if (port) {
          var item = dicElements.items["binding"][dicKey][relName];
          if (!item) {
            item = {
              id: "",
              writeAction: dicElements.getId("binding", "writeAction", writeAction),
              readPort: port,
              writePort: null
            };
            dicElements.add("binding", dicKey, relName, item);
          }
        }
      }
    }

    for (var i = 0; i < edges.length; i++) {
      var source = edges[i].source;
      var target = edges[i].target;
      var sourceType = source.getAttribute("type");
      var targetType = target.getAttribute("type");
      var relName = source.getAttribute("label") + "_Port";

      if (sourceType == "writeAction") {
        var writeAction = source.getAttribute("label");
        var port = null;
        if (targetType == "digitalActuator" || targetType == "analogActuator" || targetType == "digitalSensor" || targetType == "analogSensor") {
          port = dicElements.getId("hardware", "device", target.getAttribute("label"));
        }
        else if (targetType == "timer") {
          port = dicElements.getId("binding", "timer", target.getAttribute("label"));
        }
        else if (targetType == "digitalVariable" || targetType == "analogVariable" || targetType == "stringVariable") {
          port = dicElements.getId("binding", "variable", target.getAttribute("label"));
        }
        if (port) {
          var item = dicElements.items["binding"][dicKey][relName];
          if (!item) {
            item = {
              id: "",
              writeAction: dicElements.getId("binding", "writeAction", writeAction),
              readPort: null,
              writePort: port
            };
            dicElements.add("binding", dicKey, relName, item);
          }
          item.writePort = port;
          dicElements.items["binding"][dicKey][relName] = item;
        }
      }
    }
  }

  function serializeBindingRelationshipsControlAction_Port(graph, dicElements) {
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("adaptation_binding_state_hardware");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);
    var dicKey = "relationship_controlAction_port";
    dicElements.createType("binding", dicKey);

    for (var i = 0; i < edges.length; i++) {
      var source = edges[i].source;
      var target = edges[i].target;
      var sourceType = source.getAttribute("type");
      var targetType = target.getAttribute("type");
      var relName = target.getAttribute("label") + "_Port";

      if (targetType == "controlAction") {
        var controlAction = target.getAttribute("label");
        var item = dicElements.items["binding"][dicKey][relName];
        if (!item) {
          item = {
            id: "",
            controlAction: dicElements.getId("binding", "controlAction", controlAction),
            readPort: null,
            writePort: null,
            timer: null,
            varTimerLimit: null
          };
          dicElements.add("binding", dicKey, relName, item);
        }
        if (sourceType == "digitalActuator" || sourceType == "analogActuator" || sourceType == "digitalSensor" || sourceType == "analogSensor") {
          item.readPort = dicElements.getId("hardware", "device", source.getAttribute("label"));
        }
        else if (sourceType == "timer") {
          item.timer = dicElements.getId("binding", "timer", source.getAttribute("label"));
        }
        else if (sourceType == "digitalVariable" || sourceType == "analogVariable" || sourceType == "stringVariable") {
          item.varTimerLimit = dicElements.getId("binding", "variable", source.getAttribute("label"));
        }
        dicElements.add("binding", dicKey, relName, item);
      }
    }

    for (var i = 0; i < edges.length; i++) {
      var source = edges[i].source;
      var target = edges[i].target;
      var sourceType = source.getAttribute("type");
      var targetType = target.getAttribute("type");
      var relName = source.getAttribute("label") + "_Port";

      if (sourceType == "controlAction") {
        var controlAction = source.getAttribute("label");
        var item = dicElements.items["binding"][dicKey][relName];
        if (!item) {
          item = {
            id: "",
            controlAction: dicElements.getId("binding", "controlAction", controlAction),
            readPort: null,
            writePort: null,
            timer: null,
            varTimerLimit: null
          };
          dicElements.add("binding", dicKey, relName, item);
        }
        if (targetType == "digitalActuator" || targetType == "analogActuator") {
          item.writePort = dicElements.getId("hardware", "device", target.getAttribute("label"));
        }
        dicElements.items["binding"][dicKey][relName] = item;
      }
    }
  }

  function serializeBindingRelationshipsLogicalOperator_Transition(graph, dicElements) {
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("adaptation_behavior_transitions");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);
    var dicKey = "relationship_logicalOperator_transition";
    dicElements.createType("binding", dicKey);

    for (var i = 0; i < edges.length; i++) {
      var source = edges[i].source;
      var target = edges[i].target;
      var sourceType = source.getAttribute("type");
      var targetType = target.getAttribute("type");
      var relName = source.getAttribute("label") + "_" + target.getAttribute("label");
      if (sourceType == "logicalOperator" && targetType == "transition") {
        var activity = source.getAttribute("label");

        var transition=getOriginalElement(graph, "adaptation_state", target); 
        var required = transition.getAttribute("required");
        if (required != "true") { 
          continue;
        }  

        var state=getTransitionSourceState(graph, transition);
        if (state.getAttribute("type")=="state") {
          required = state.getAttribute("required");
          if (required != "true") { 
            continue;
          }  
        }

        state=getTransitionTargetState(graph, transition);
        if (state.getAttribute("type")=="state") {
          required = state.getAttribute("required");
          if (required != "true") { 
            continue;
          }  
        } 

        var item = dicElements.items["binding"][dicKey][relName];
        if (!item) {
          item = {
            id: "",
            logicalOperator: dicElements.getId("binding", "logicalOperator", source.getAttribute("label")),
            transition: dicElements.getId("machine", "transition", target.getAttribute("label"))
          };
          dicElements.add("binding", dicKey, relName, item);
        }
        dicElements.items["binding"][dicKey][relName] = item;
      }
    }
  }

  function serializeBindingRelationshipsLogicalOperator_LogicalOperator(graph, dicElements) {
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("adaptation_behavior_transitions");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);
    var dicKey = "relationship_logicalOperator_logicalOperator";
    dicElements.createType("binding", dicKey);

    for (var i = 0; i < edges.length; i++) {
      var source = edges[i].source;
      var target = edges[i].target;
      var sourceType = source.getAttribute("type");
      var targetType = target.getAttribute("type");
      var relName = source.getAttribute("label") + "_" + target.getAttribute("label");

      if (sourceType == "logicalOperator" && targetType == "logicalOperator") {
        var logicalOperator = target.getAttribute("label");
        var item = dicElements.items["binding"][dicKey][relName];
        if (!item) {
          item = {
            id: "",
            logicalOperator: dicElements.getId("binding", "logicalOperator", logicalOperator),
            logicalOperators: []
          };
          dicElements.add("binding", dicKey, relName, item);
        }
        var logicalOperatorChild = {
          logicalOperator: dicElements.getId("binding", "logicalOperator", source.getAttribute("label"))
        };
        item.logicalOperators.push(logicalOperatorChild);
        dicElements.items["binding"][dicKey][relName] = item;
      }
    }
  }

  function serializeBindingRelationshipsPredicate_LogicalOperator(graph, dicElements) {
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("adaptation_behavior_transitions");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);
    var dicKey = "relationship_logicalOperator_predicate";
    dicElements.createType("binding", dicKey);

    for (var i = 0; i < edges.length; i++) {
      var source = edges[i].source;
      var target = edges[i].target;
      var sourceType = source.getAttribute("type");
      var targetType = target.getAttribute("type");
      var relName = target.getAttribute("label") + "_predicates";

      if (sourceType == "predicate" && targetType == "logicalOperator") {
        var logicalOperator = target.getAttribute("label");
        var item = dicElements.items["binding"][dicKey][relName];
        if (!item) {
          item = {
            id: "",
            logicalOperator: dicElements.getId("binding", "logicalOperator", logicalOperator),
            predicates: []
          };
          dicElements.add("binding", dicKey, relName, item);
        }
        var predicate = {
          predicate: dicElements.getId("binding", "predicate", source.getAttribute("label"))
        };
        item.predicates.push(predicate);
        dicElements.items["binding"][dicKey][relName] = item;
      }
    }
  }

  function serializeBindingRelationshipsPredicate_Variables(graph, dicElements) {
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("adaptation_behavior_transitions");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);
    var dicKey = "relationship_predicate_variables";
    dicElements.createType("binding", dicKey);

    for (var i = 0; i < edges.length; i++) {
      var source = edges[i].source;
      var target = edges[i].target;
      var sourceType = source.getAttribute("type");
      var targetType = target.getAttribute("type");

      if ((sourceType == "variable") && targetType == "predicateArgument") {
        var predicate = target.parent;
        var relName = predicate.getAttribute("label") + "_variables";
        var item = dicElements.items["binding"][dicKey][relName];
        if (!item) {
          item = {
            id: "",
            predicate: dicElements.getId("binding", "predicate", predicate.getAttribute("label")),
            primaryVariable: null,
            secondaryVariable: null
          };
          dicElements.add("binding", dicKey, relName, item);
        }
        let labelVariable = target.getAttribute("label");
        if (labelVariable == "v1") {
          item.primaryVariable = dicElements.getId("binding", "variable", source.getAttribute("label"));
        } else {
          item.secondaryVariable = dicElements.getId("binding", "variable", source.getAttribute("label"));
        }
        dicElements.items["binding"][dicKey][relName] = item;
      }
    }
  }

  function serializeBindingRelationshipsPredicate_ReadActions(graph, dicElements) {
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("adaptation_binding_state_hardware");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);
    var dicKey = "relationship_predicate_readActions";
    dicElements.createType("binding", dicKey);

    for (var i = 0; i < edges.length; i++) {
      var source = edges[i].source;
      var target = edges[i].target;
      var sourceType = source.getAttribute("type");
      var targetType = target.getAttribute("type");
      var relName = target.getAttribute("label") + "_readActions";

      if (sourceType == "readAction" && targetType == "predicate") {
        var predicate = target.getAttribute("label");
        var item = dicElements.items["binding"][dicKey][relName];
        if (!item) {
          item = {
            id: "",
            predicate: dicElements.getId("binding", "predicate", predicate),
            readActionPrimary: dicElements.getId("binding", "readAction", source.getAttribute("label")),
            readActionSecondary: null
          };
          dicElements.add("binding", dicKey, relName, item);
        } else {
          item.readActionSecondary = dicElements.getId("binding", "readAction", source.getAttribute("label"));
        }
        dicElements.items["binding"][dicKey][relName] = item;
      }
    }
  }

  function serializeBindingRelationshipsReadAction_Port(graph, dicElements) {
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("adaptation_binding_state_hardware");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);
    var dicKey = "relationship_readAction_port";
    dicElements.createType("binding", dicKey);

    for (var i = 0; i < edges.length; i++) {
      var source = edges[i].source;
      var target = edges[i].target;
      var sourceType = source.getAttribute("type");
      var targetType = target.getAttribute("type");
      var relName = target.getAttribute("label") + "_Port";

      var readAction = null;
      var port = null;

      if (targetType == "readAction") {
        readAction = target.getAttribute("label");
        if (sourceType == "digitalActuator" || sourceType == "analogActuator" || sourceType == "digitalSensor" || sourceType == "analogSensor") {
          port = dicElements.getId("hardware", "device", source.getAttribute("label"));
        }
        else if (sourceType == "timer") {
          port = dicElements.getId("binding", "timer", source.getAttribute("label"));
        }
        else if (sourceType == "digitalVariable" || sourceType == "analogVariable" || sourceType == "stringVariable") {
          port = dicElements.getId("binding", "variable", source.getAttribute("label"));
        }
        if (port) {
          var item = dicElements.items["binding"][dicKey][relName];
          if (!item) {
            item = {
              id: "",
              readAction: dicElements.getId("binding", "readAction", readAction),
              readPort: port
            };
            dicElements.add("binding", dicKey, relName, item);
          }
        }
      }
    }
  }

  function serializeControlson(graph, dicElements) {
    serializeControlSetpoint(graph, dicElements);
    serializeControlSummingpoint(graph, dicElements);
    serializeControlController(graph, dicElements);
    serializeControlOutput(graph, dicElements);
    serializeControlFilter(graph, dicElements);
    serializeControlTransducer(graph, dicElements);
    serializeControlBranchpoint(graph, dicElements);
    serializeBindingRelationshipsController_ControlAction(graph, dicElements);
    serializeBindingRelationshipsSumming_Controller(graph, dicElements);
    serializeBindingRelationshipsControllerSumming(graph, dicElements);
    serializeBindingRelationshipsFilterSumming(graph, dicElements);
    serializeBindingRelationshipsTransducerSumming(graph, dicElements);
    serializeBindingRelationshipsBranchpointSumming(graph, dicElements);
    serializeBindingRelationshipsSetpointSumming(graph, dicElements);
    serializeBindingRelationshipstransducerFilter(graph, dicElements);
    serializeBindingRelationshipsBranchpointFilter(graph, dicElements);
    serializeBindingRelationshipsBranchpointTransducer(graph, dicElements);
    serializeBindingRelationshipsBranchpointMeasuredOutput(graph, dicElements);
    serializeBindingRelationshipsControlActionBranchpoint(graph, dicElements);


  }

  function serializeBindingRelationshipsController_ControlAction(graph, dicElements) {
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("control");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);
    var dicKey = "relationship_controller_control_action";
    dicElements.createType("control", dicKey);

    for (var i = 0; i < edges.length; i++) {
      var source = edges[i].source;
      var target = edges[i].target;
      var sourceType = source.getAttribute("type");
      var targetType = target.getAttribute("type");
      var relName = source.getAttribute("label") + "_" + target.getAttribute("label");
      if (sourceType == "controller" && targetType == "controlAction") {
        var activity = source.getAttribute("label");
        var item = dicElements.items["control"][dicKey][relName];
        if (!item) {
          item = {
            id: "",
            controller: dicElements.getId("control", "controller", source.getAttribute("label")),
            controlAction: dicElements.getId("binding", "controlAction", target.getAttribute("label"))
          };
          dicElements.add("control", dicKey, relName, item);
        }
        dicElements.items["control"][dicKey][relName] = item;
      }
    }
  }
  function serializeBindingRelationshipsSumming_Controller(graph, dicElements) {
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("control");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);
    var dicKey = "relationship_summing_point_controller";
    dicElements.createType("control", dicKey);

    for (var i = 0; i < edges.length; i++) {
      var source = edges[i].source;
      var target = edges[i].target;
      var sourceType = source.getAttribute("type");
      var targetType = target.getAttribute("type");
      var relName = source.getAttribute("label") + "_" + target.getAttribute("label");
      if (sourceType == "summing_point" && targetType == "controller") {
        var activity = source.getAttribute("label");
        var item = dicElements.items["control"][dicKey][relName];
        if (!item) {
          item = {
            id: "",
            SummingPoint: dicElements.getId("control", "summing_point", source.getAttribute("label")),
            controller: dicElements.getId("control", "controller", target.getAttribute("label"))
          };
          dicElements.add("control", dicKey, relName, item);
        }
        dicElements.items["control"][dicKey][relName] = item;
      }
    }
  }

  function serializeBindingRelationshipsControllerSumming(graph, dicElements) {
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("control");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);
    var dicKey = "relationship_controller_summing_point";
    dicElements.createType("control", dicKey);

    for (var i = 0; i < edges.length; i++) {
      var source = edges[i].source;
      var target = edges[i].target;
      var sourceType = source.getAttribute("type");
      var targetType = target.getAttribute("type");
      var relName = source.getAttribute("label") + "_" + target.getAttribute("label");
      if (sourceType == "controller" && targetType == "summing_point") {
        var activity = source.getAttribute("label");
        var item = dicElements.items["control"][dicKey][relName];
        if (!item) {
          item = {
            id: "",
            Controller: dicElements.getId("control", "summing_point", source.getAttribute("label")),
            SummingPoint: dicElements.getId("control", "controller", target.getAttribute("label"))
          };
          dicElements.add("control", dicKey, relName, item);
        }
        dicElements.items["control"][dicKey][relName] = item;
      }
    }
  }
  function serializeBindingRelationshipsFilterSumming(graph, dicElements) {
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("control");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);
    var dicKey = "relationship_filter_summing_Point";
    dicElements.createType("control", dicKey);

    for (var i = 0; i < edges.length; i++) {
      var source = edges[i].source;
      var target = edges[i].target;
      var sourceType = source.getAttribute("type");
      var targetType = target.getAttribute("type");
      var relName = source.getAttribute("label") + "_" + target.getAttribute("label");
      if (sourceType == "filter" && targetType == "summing_point") {
        var activity = source.getAttribute("label");
        var item = dicElements.items["control"][dicKey][relName];
        if (!item) {
          item = {
            id: "",
            Filter: dicElements.getId("control", "filter", source.getAttribute("label")),
            SummingPoint: dicElements.getId("control", "summing_point", target.getAttribute("label"))
          };
          dicElements.add("control", dicKey, relName, item);
        }
        dicElements.items["control"][dicKey][relName] = item;
      }
    }
  }
  function serializeBindingRelationshipsTransducerSumming(graph, dicElements) {
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("control");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);
    var dicKey = "relationship_transducer_summing_point";
    dicElements.createType("control", dicKey);

    for (var i = 0; i < edges.length; i++) {
      var source = edges[i].source;
      var target = edges[i].target;
      var sourceType = source.getAttribute("type");
      var targetType = target.getAttribute("type");
      var relName = source.getAttribute("label") + "_" + target.getAttribute("label");
      if (sourceType == "transducer" && targetType == "summing_point") {
        var activity = source.getAttribute("label");
        var item = dicElements.items["control"][dicKey][relName];
        if (!item) {
          item = {
            id: "",
            Tranducer: dicElements.getId("control", "transducer", source.getAttribute("label")),
            SummingPoint: dicElements.getId("control", "summing_point", target.getAttribute("label"))
          };
          dicElements.add("control", dicKey, relName, item);
        }
        dicElements.items["control"][dicKey][relName] = item;
      }
    }
  }
  function serializeBindingRelationshipsBranchpointSumming(graph, dicElements) {
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("control");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);
    var dicKey = "relationship_branchpoint_summing_point";
    dicElements.createType("control", dicKey);

    for (var i = 0; i < edges.length; i++) {
      var source = edges[i].source;
      var target = edges[i].target;
      var sourceType = source.getAttribute("type");
      var targetType = target.getAttribute("type");
      var relName = source.getAttribute("label") + "_" + target.getAttribute("label");
      if (sourceType == "branchpoint" && targetType == "summing_point") {
        var activity = source.getAttribute("label");
        var item = dicElements.items["control"][dicKey][relName];
        if (!item) {
          item = {
            id: "",
            Branchpoint: dicElements.getId("control", "branchpoint", source.getAttribute("label")),
            SummingPoint: dicElements.getId("control", "summing_point", target.getAttribute("label"))
          };
          dicElements.add("control", dicKey, relName, item);
        }
        dicElements.items["control"][dicKey][relName] = item;
      }
    }
  }
  function serializeBindingRelationshipsSetpointSumming(graph, dicElements) {
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("control");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);
    var dicKey = "relationship_setpoint_summing_point";
    dicElements.createType("control", dicKey);

    for (var i = 0; i < edges.length; i++) {
      var source = edges[i].source;
      var target = edges[i].target;
      var sourceType = source.getAttribute("type");
      var targetType = target.getAttribute("type");
      var relName = source.getAttribute("label") + "_" + target.getAttribute("label");
      if (sourceType == "set_point" && targetType == "summing_point") {
        var activity = source.getAttribute("label");
        var item = dicElements.items["control"][dicKey][relName];
        if (!item) {
          item = {
            id: "",
            Setpoint: dicElements.getId("control", "set_point", source.getAttribute("label")),
            SummingPoint: dicElements.getId("control", "summing_point", target.getAttribute("label"))
          };
          dicElements.add("control", dicKey, relName, item);
        }
        dicElements.items["control"][dicKey][relName] = item;
      }
    }
  }
  function serializeBindingRelationshipstransducerFilter(graph, dicElements) {
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("control");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);
    var dicKey = "relationship_transducer_filter";
    dicElements.createType("control", dicKey);

    for (var i = 0; i < edges.length; i++) {
      var source = edges[i].source;
      var target = edges[i].target;
      var sourceType = source.getAttribute("type");
      var targetType = target.getAttribute("type");
      var relName = source.getAttribute("label") + "_" + target.getAttribute("label");
      if (sourceType == "transducer" && targetType == "filter") {
        var activity = source.getAttribute("label");
        var item = dicElements.items["control"][dicKey][relName];
        if (!item) {
          item = {
            id: "",
            Transducer: dicElements.getId("control", "transducer", source.getAttribute("label")),
            Filter: dicElements.getId("control", "filter", target.getAttribute("label"))
          };
          dicElements.add("control", dicKey, relName, item);
        }
        dicElements.items["control"][dicKey][relName] = item;
      }
    }
  }
  function serializeBindingRelationshipsBranchpointFilter(graph, dicElements) {
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("control");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);
    var dicKey = "relationship_branchpoint_filter";
    dicElements.createType("control", dicKey);

    for (var i = 0; i < edges.length; i++) {
      var source = edges[i].source;
      var target = edges[i].target;
      var sourceType = source.getAttribute("type");
      var targetType = target.getAttribute("type");
      var relName = source.getAttribute("label") + "_" + target.getAttribute("label");
      if (sourceType == "branchpoint" && targetType == "filter") {
        var activity = source.getAttribute("label");
        var item = dicElements.items["control"][dicKey][relName];
        if (!item) {
          item = {
            id: "",
            Branchpoint: dicElements.getId("control", "branchpoint", source.getAttribute("label")),
            Filter: dicElements.getId("control", "filter", target.getAttribute("label"))
          };
          dicElements.add("control", dicKey, relName, item);
        }
        dicElements.items["control"][dicKey][relName] = item;
      }
    }
  }
  function serializeBindingRelationshipsBranchpointTransducer(graph, dicElements) {
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("control");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);
    var dicKey = "relationship_branchpoint_transducer";
    dicElements.createType("control", dicKey);

    for (var i = 0; i < edges.length; i++) {
      var source = edges[i].source;
      var target = edges[i].target;
      var sourceType = source.getAttribute("type");
      var targetType = target.getAttribute("type");
      var relName = source.getAttribute("label") + "_" + target.getAttribute("label");
      if (sourceType == "branchpoint" && targetType == "transducer") {
        var activity = source.getAttribute("label");
        var item = dicElements.items["control"][dicKey][relName];
        if (!item) {
          item = {
            id: "",
            Branchpoint: dicElements.getId("control", "branchpoint", source.getAttribute("label")),
            Transducer: dicElements.getId("control", "transducer", target.getAttribute("label"))
          };
          dicElements.add("control", dicKey, relName, item);
        }
        dicElements.items["control"][dicKey][relName] = item;
      }
    }
  }
  function serializeBindingRelationshipsBranchpointMeasuredOutput(graph, dicElements) {
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("control");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);
    var dicKey = "relationship_branchpoint_measured_output";
    dicElements.createType("control", dicKey);

    for (var i = 0; i < edges.length; i++) {
      var source = edges[i].source;
      var target = edges[i].target;
      var sourceType = source.getAttribute("type");
      var targetType = target.getAttribute("type");
      var relName = source.getAttribute("label") + "_" + target.getAttribute("label");
      if (sourceType == "branchpoint" && targetType == "measured_output") {
        var activity = source.getAttribute("label");
        var item = dicElements.items["control"][dicKey][relName];
        if (!item) {
          item = {
            id: "",
            Branchpoint: dicElements.getId("control", "branchpoint", source.getAttribute("label")),
            Measured_Output: dicElements.getId("control", "measured_output", target.getAttribute("label"))
          };
          dicElements.add("control", dicKey, relName, item);
        }
        dicElements.items["control"][dicKey][relName] = item;
      }
    }
  }
  function serializeBindingRelationshipsControlActionBranchpoint(graph, dicElements) {
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("control");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);
    var dicKey = "relationship_controlAction_branchPoint";
    dicElements.createType("control", dicKey);

    for (var i = 0; i < edges.length; i++) {
      var source = edges[i].source;
      var target = edges[i].target;
      var sourceType = source.getAttribute("type");
      var targetType = target.getAttribute("type");
      var relName = source.getAttribute("label") + "_" + target.getAttribute("label");
      if (sourceType == "controlAction" && targetType == "branchpoint") {
        var activity = source.getAttribute("label");
        var item = dicElements.items["control"][dicKey][relName];
        if (!item) {
          item = {
            id: "",
            ControlAction: dicElements.getId("binding", "controlAction", source.getAttribute("label")),
            Branchpoint: dicElements.getId("control", "branchpoint", target.getAttribute("label"))
          };
          dicElements.add("control", dicKey, relName, item);
        }
        dicElements.items["control"][dicKey][relName] = item;
      }
    }
  }

  function serializeControlSetpoint(graph, dicElements) {
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("control");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);

    for (var i = 0; i < vertices.length; i++) {
      var vertice = vertices[i];
      var type = vertice.getAttribute("type");
      var label = vertice.getAttribute("label");
      if (type == "set_point") {
        var item = {
          id: "",
          label: label,
          type: type,
          valueSetpoint: vertice.getAttribute("SetPoint"),
          time: vertice.getAttribute("Time"),
        };
        dicElements.add("control", "set_point", label, item);
      }
    }
  }

  function serializeControlSummingpoint(graph, dicElements) {
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("control");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);

    for (var i = 0; i < vertices.length; i++) {
      var vertice = vertices[i];
      var type = vertice.getAttribute("type");
      var label = vertice.getAttribute("label");
      if (type == "summing_point") {
        var item = {
          id: "",
          label: label,
          type: type,
          valueSummingpoint: vertice.getAttribute("Direction"),
        };
        dicElements.add("control", "summing_point", label, item);
      }
    }
  }

  function serializeControlController(graph, dicElements) {
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("control");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);

    for (var i = 0; i < vertices.length; i++) {
      var vertice = vertices[i];
      var type = vertice.getAttribute("type");
      var label = vertice.getAttribute("label");
      if (type == "controller") {
        var item = {
          id: "",
          label: label,
          type: type,
          proportional: vertice.getAttribute("Proportional"),
          integral: vertice.getAttribute("Integral"),
          derivate: vertice.getAttribute("Derivate"),
        };
        dicElements.add("control", "controller", label, item);
      }
    }
  }
  function serializeControlOutput(graph, dicElements) {
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("control");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);

    for (var i = 0; i < vertices.length; i++) {
      var vertice = vertices[i];
      var type = vertice.getAttribute("type");
      var label = vertice.getAttribute("label");
      if (type == "measured_output") {
        var item = {
          id: "",
          label: label,
          type: type,
          outputvalue: vertice.getAttribute("CurrentOutput"),
        };
        dicElements.add("control", "measured_output", label, item);
      }
    }
  }
  function serializeControlFilter(graph, dicElements) {
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("control");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);

    for (var i = 0; i < vertices.length; i++) {
      var vertice = vertices[i];
      var type = vertice.getAttribute("type");
      var label = vertice.getAttribute("label");
      if (type == "filter") {
        var item = {
          id: "",
          label: label,
          type: type,
        };
        dicElements.add("control", "filter", label, item);
      }
    }
  }
  function serializeControlTransducer(graph, dicElements) {
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("control");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);

    for (var i = 0; i < vertices.length; i++) {
      var vertice = vertices[i];
      var type = vertice.getAttribute("type");
      var label = vertice.getAttribute("label");
      if (type == "transducer") {
        var item = {
          id: "",
          label: label,
          type: type,
          valuetransducer: vertice.getAttribute("InitialPosition")
        };
        dicElements.add("control", "transducer", label, item);
      }
    }
  }

  function serializeControlBranchpoint(graph, dicElements) {
    var graphModel = graph.getModel();
    var mainCell = graphModel.getCell("control");
    var vertices = graphModel.getChildVertices(mainCell);
    var edges = graphModel.getChildEdges(mainCell);

    for (var i = 0; i < vertices.length; i++) {
      var vertice = vertices[i];
      var type = vertice.getAttribute("type");
      var label = vertice.getAttribute("label");
      if (type == "branchpoint") {
        var item = {
          id: "",
          label: label,
          type: type,
        };
        dicElements.add("control", "branchpoint", label, item);
      }
    }
  }



}

export default adaptation_state_actions