let adaptation_behavior_hardware_main = function adaptation_behavior_hardware_main(graph) {
	adaptation_behavior_hardware_constraints(graph);
	adaptation_behavior_hardware_handlers(graph);

	let data = {};
	data["m_type"] = "binding"; //custom type
	data["m_elements"] = adaptation_behavior_hardware_elements(); //custom elements
	data["m_attributes"] = adaptation_behavior_hardware_attributes(); //custom attributes
	data["m_relations"] = adaptation_behavior_hardware_relations(); //custom relations
	data["m_properties_styles"] = adaptation_behavior_hardware_properties_styles(); //custom properties styles
	data["m_labels"] = adaptation_behavior_hardware_labels(); //custom labels
	data["m_clon_cells"] = adaptation_behavior_hardware_clon_cells(); //custom clon cells
	data["m_constraints_ic"] = adaptation_behavior_hardware_constraints_in_creation(); //custom constraints in element creation
	data["m_overlay"] = adaptation_behavior_hardware_overlay(); //custom overlay
	data["m_relation_styles"] = adaptation_behavior_hardware_relation_styles();
	return data;

	function adaptation_behavior_hardware_constraints(graph) {
		graph.multiplicities = []; //reset multiplicities
		// graph.multiplicities.push(new mxMultiplicity(
		// 	true, "state", null, null, 0, 0, null,
		// 	"Invalid connection",
		// 	"Only shape targets allowed"));
		graph.multiplicities.push(new mxMultiplicity(
			true, "bundle", null, null, 0, 1, ["root", "abstract"],
			"Only 1 target allowed",
			"Only shape targets allowed"));
	}

	function adaptation_behavior_hardware_handlers(graph) {
		graph.removeListener(adaptation_behavior_hardware_handlers_double_click, mxEvent.DOUBLE_CLICK);
		graph.addListener(mxEvent.DOUBLE_CLICK, adaptation_behavior_hardware_handlers_double_click);
	}

	function adaptation_behavior_hardware_handlers_double_click(sender, evt) {
		let cell = evt.getProperty("cell"); // cell may be null
		if (cell != null) {
			adaptation_behavior_hardware_on_double_click(cell);
		}
		evt.consume();
	}

	function adaptation_behavior_hardware_elements() {
		let activity = { src: projectPath + "images/models/adaptation_binding_state_hardware/activity.png", wd: 100, hg: 35, type: "activity", style: "shape=activity", pname: "Activity" };
		let digitalVariable = { src: projectPath + "images/models/adaptation_binding_state_hardware/digitalVariable.png", wd: 100, hg: 35, type: "digitalVariable", style: "shape=digitalVariable", pname: "Digital variable" };
		let analogVariable = { src: projectPath + "images/models/adaptation_binding_state_hardware/analogVariable.png", wd: 100, hg: 35, type: "analogVariable", style: "shape=analogVariable", pname: "Analog variable" };
		let stringVariable = { src: projectPath + "images/models/adaptation_binding_state_hardware/stringVariable.png", wd: 100, hg: 35, type: "stringVariable", style: "shape=stringVariable", pname: "String variable" };
		let timer = { src: projectPath + "images/models/adaptation_binding_state_hardware/timer.png", wd: 100, hg: 35, type: "timer", style: "shape=timer", pname: "Timer" };
		let readAction = { src: projectPath + "images/models/adaptation_binding_state_hardware/readAction.png", wd: 100, hg: 35, type: "readAction", style: "shape=readAction", pname: "Read action" };
		let writeAction = { src: projectPath + "images/models/adaptation_binding_state_hardware/writeAction.png", wd: 100, hg: 35, type: "writeAction", style: "shape=writeAction", pname: "Write action" };
		let controlAction = { src: projectPath + "images/models/adaptation_binding_state_hardware/controlAction.png", wd: 100, hg: 35, type: "controlAction", style: "shape=controlAction", pname: "Control action" };
		let delayAction = { src: projectPath + "images/models/adaptation_binding_state_hardware/delayAction.png", wd: 100, hg: 35, type: "delayAction", style: "strokeWidth=2", pname: "Delay action" };
		let customAction = { src: projectPath + "images/models/adaptation_binding_state_hardware/customAction.png", wd: 100, hg: 35, type: "customAction", style: "strokeWidth=2", pname: "Custom action" };
		let logicalOperator = { src: projectPath + "images/models/adaptation_binding_state_hardware/logicalOperator.png", wd: 100, hg: 35, type: "logicalOperator", style: "shape=ellipse", pname: "Logical operator" };
		let predicate = { src: projectPath + "images/models/adaptation_binding_state_hardware/predicate.png", wd: 100, hg: 35, type: "predicate", style: "shape=predicate", pname: "Predicate" };

		let elements = [];
		let index = 0;
		
		elements[index++] = digitalVariable;
		elements[index++] = analogVariable;
		elements[index++] = stringVariable;
		elements[index++] = controlAction;
		elements[index++] = timer;
		//elements[index++] = writeAction;
		//elements[index++] = readAction;

		// elements[0] = activity;
		// elements[1] = timer;
		// elements[8] = logicalOperator;
		// elements[9] = predicate;
		//elements[7] = delayAction;
		//elements[8] = customAction;

		let customWriteActions = [
			{
				"name":"turnOn",
				"parameters":[
					{
						"name":"frecuency",
						"type":"int"
					} 
				]
			}, 
			{
				"name":"turnOff",
				"parameters":[]
			}
		];

		for(let action of customWriteActions) { 
			let devicePath = projectPath + "images/models/adaptation_binding_state_hardware/";
			let shapeImagePath = devicePath + "writeAction.png"; 

			let deviceComposition = {
				src: shapeImagePath,
				wd: 100,
				hg: 35,
				type: "writeAction", //para poder clonarlo y bindearlo 
				style: "shape=writeAction",
				pname: action.name,
				attributes:[{
					"name":"subtype",
					"def_value":action.name
				},{ 
					"name":"parameters",
					"def_value":action.parameters
				}]
			}; 
			elements[index++] = deviceComposition; 
		}

		let customReadActions = [ 
			{
				"name":"isOn",
				"parameters":[]
			},
			{
				"name":"isOff",
				"parameters":[]
			},{
				"name":"test",
				"parameters":[
					{
						"name":"arg1",
						"type":"int"
					},
					{
						"name":"arg2",
						"type":"int"
					} ,
					{
						"name":"arg3",
						"type":"int"
					}  ,
					{
						"name":"arg4",
						"type":"int"
					}  
				]
			},
		];

		for(let action of customReadActions) { 
			let devicePath = projectPath + "images/models/adaptation_binding_state_hardware/";
			let shapeImagePath = devicePath + "readAction.png"; 

			let deviceComposition = {
				src: shapeImagePath,
				wd: 100,
				hg: 35,
				type: "readAction", //para poder clonarlo y bindearlo 
				style: "shape=readAction",
				pname: action.name,
				attributes:[{
					"name":"subtype",
					"def_value":action.name
				},{ 
					"name":"parameters",
					"def_value":action.parameters
				}]
			}; 
			elements[index++] = deviceComposition; 
		}
 
		return elements;
	}

	function adaptation_behavior_hardware_attributes() {
		let attributes = [];
		attributes[0] = {
			"types": ["digitalAction"],
			"custom_attributes": [{
				"name": "value",
				"def_value": "LOW"
			}]
		};
		attributes[1] = {
			"types": ["analogAction"],
			"custom_attributes": [{
				"name": "value",
				"def_value": "0"
			}]
		};
		attributes[2] = {
			"types": ["delayAction"],
			"custom_attributes": [{
				"name": "value",
				"def_value": "0"
			}]
		};
		attributes[3] = {
			"types": ["customAction"],
			"custom_attributes": [{
				"name": "code",
				"def_value": ""
			}]
		};
		attributes[4] = {
			"types": ["logicalOperator"],
			"custom_attributes": [{
				"name": "value",
				"def_value": "SINGLE"
			}]
		};
		attributes[5] = {
			"types": ["predicate"],
			"custom_attributes": [
				{
					"name": "operator",
					"def_value": "="
				}]
		};
		attributes[6] = {
			"types": ["timer"],
			"custom_attributes": [{
				"name": "initialValue",
				"def_value": "0"
			}]
		};
		attributes[7] = {
			"types": ["digitalVariable"],
			"custom_attributes": [{
				"name": "value",
				"def_value": "LOW"
			}]
		};
		attributes[8] = {
			"types": ["analogVariable"],
			"custom_attributes": [{
				"name": "value",
				"def_value": "0"
			}]
		};
		attributes[9] = {
			"types": ["stringVariable"],
			"custom_attributes": [{
				"name": "value",
				"def_value": ""
			}]
		};
		return attributes;
	}

	function adaptation_behavior_hardware_relations() {
		let relations = [];
		relations[0] = {
			"source": ["state", "initialState"],
			"rel_source_target": "and",
			"target": ["activity"],
			"attributes": [{
				"name": "phase",
				"def_value": "begin"
			}]
		} 

		return relations;
	}

	function adaptation_behavior_hardware_properties_styles() {
		let styles = {};
		styles = {
			"relation": [{
				"attribute": "phase",
				"input_type": "select",
				"input_values": ["begin", "while", "end"]
			}
			],
			"digitalAction": [{
				"attribute": "value",
				"input_type": "select",
				"input_values": ["LOW", "HIGH"]
			}
			],
			"digitalVariable": [{
				"attribute": "value",
				"input_type": "select",
				"input_values": ["LOW", "HIGH"]
			}
			],
			"logicalOperator": [{
				"attribute": "value",
				"input_type": "select",
				"input_values": ["SINGLE", "OR", "AND"]
			}
			],
			"predicate": [{
				"attribute": "operator",
				"input_type": "select",
				"input_values": ["=", ">", "<", ">=", "<=", "!="]
			}
			],
			"writeAction":[
				{
					"attribute": "subtype",
					"input_type":"disabled" 
				},
				{
					"attribute": "parameters",
					"input_type":"none" 
				}
			],
			"readAction":[
				{
					"attribute": "subtype",
					"input_type":"disabled" 
				},
				{
					"attribute": "parameters",
					"input_type":"none" 
				}
			]
		}

		return styles;
	}

	function adaptation_behavior_hardware_custom_methods(pos) {
		let methods = [];
		methods[0] = function () {
			document.getElementById("tr-lowRange").style.display = "none";
			document.getElementById("tr-highRange").style.display = "none";
			let val = document.getElementById("tr-bundleType").getElementsByTagName('select')[0].value;
			if (val == "RANGE") {
				document.getElementById("tr-lowRange").style.display = "";
				document.getElementById("tr-highRange").style.display = "";
			}
		};
		methods[1] = function () {
			let lowRange = document.getElementById("input-lowRange").value;
			let highRange = document.getElementById("input-highRange").value;
			if (lowRange > highRange) {
				alert(global.messages["adaptation_behavior_hardware_custom_range_check"]);
				return false;
			}
			return true;
		};
		methods[2] = function (graph) {
			let adaptation_behavior_hardware_root = graph.getModel().getCell("adaptation_behavior_hardware");
			let adaptation_behavior_hardware_vertices = graph.getModel().getChildVertices(adaptation_behavior_hardware_root);

			for (let i = 0; i < adaptation_behavior_hardware_vertices.length; i++) {
				if (adaptation_behavior_hardware_vertices[i].getAttribute("type") == "root") {
					alert(global.messages["adaptation_behavior_hardware_custom_root_check"]);
					return false;
				}
			}
			return true;
		};
		methods[3] = function () {
			// Creates a new overlay with an image and a tooltip and makes it "transparent" to events
			let overlay = new mxCellOverlay(new mxImage('images/MX/check.png', 16, 16), 'Overlay tooltip');
			if (this.checked) {
				graph.addCellOverlay(graph.getModel().getCell(this.name), overlay);
			} else {
				graph.removeCellOverlay(graph.getModel().getCell(this.name));
			}
		};

		return methods[pos];
	}

	function adaptation_behavior_hardware_labels() {
		let labels = {};
		labels = {
			"bundle": "bundleType"
		};

		return labels;
	}

	function adaptation_behavior_hardware_constraints_in_creation() {
		let constraints_ic = {};
		constraints_ic = {
			"root": adaptation_behavior_hardware_custom_methods(2)
		};

		return constraints_ic;
	}

	function adaptation_behavior_hardware_clon_cells() {
		let clons = {};
		clons = {
			"controlAction":"control",
			"readAction":"adaptation_behavior_states",
			"writeAction":"adaptation_behavior_states",
			"controlAction":"adaptation_behavior_states",
			"digitalVariable":"adaptation_behavior_transitions",
			"analogVariable":"adaptation_behavior_transitions",
			"stringVariable":"adaptation_behavior_transitions"
		};

		return clons;
	}

	function adaptation_behavior_hardware_overlay() {
		let func1 = function () {
			let adaptation_behavior_hardware_root = graph.getModel().getCell("adaptation_behavior_hardware");
			let adaptation_behavior_hardware_elements = graph.getModel().getChildEdges(adaptation_behavior_hardware_root);
			for (let i = 0; i < adaptation_behavior_hardware_elements.length; i++) {
				let source = adaptation_behavior_hardware_elements[i].source;
				let type = source.getAttribute("type");
				if (type == "concrete") {
					let sel = source.getAttribute("selected");
					if (sel == "true") {
						let overlay = new mxCellOverlay(new mxImage('images/MX/check.png', 16, 16), 'Overlay tooltip');
						graph.addCellOverlay(source, overlay);
					}
				}
			}
		};

		return func1;
	}

	function adaptation_behavior_hardware_relation_styles() {		
		let relations = []; 
		relations[0] = {
			"source": ["digitalVariable", "analogVariable", "timer", "analogActuator", "digitalActuator", "analogSensor", "digitalSensor"],
			"rel_source_target": "and",
			"target": ["readAction", "writeAction", "controlAction"],
			"style": "dashed=1;endFill=0;"
		} 
		relations[1] = {
			"source": ["readAction", "writeAction", "controlAction"],
			"rel_source_target": "and",
			"target": ["digitalVariable", "analogVariable", "timer", "analogActuator", "digitalActuator", "analogSensor", "digitalSensor"],
			"style": "dashed=1;endFill=1"
		} 
		return relations; 
	}

	function adaptation_behavior_hardware_on_double_click(cell) {
		// var sourceType = cell.getAttribute("type");
		// alert(sourceType)
		// if (sourceType == "initialState" || sourceType == "state" || sourceType == "transition") {
		// 	//alert(sourceType)
		// 	window.location = "http://localhost:8080/variamosweb#/models/Luz%20controlada/Application-Luzcontrolada-1/adaptation_state";
		// }
		// else
		// 	if (sourceType == "analogSensor" || sourceType == "digitalSensor" || sourceType == "analogActuator" || sourceType == "digitalActuator") {
		// 		//alert(sourceType)
		// 		window.location = "http://localhost:8080/variamosweb#/models/Luz%20controlada/Application-Luzcontrolada-1/adaptation_hardware";
		// 	}
		// 	else if ((sourceType == "controlAction")) {
		// 		//alert(sourceType)
		// 		window.location = "http://localhost:8080/variamosweb#/models/Luz%20controlada/Application-Luzcontrolada-1/adaptation_hardware";
		// 	}
	}

}

export default adaptation_behavior_hardware_main