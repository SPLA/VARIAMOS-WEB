let adaptation_behavior_states_main = function adaptation_behavior_states_main(graph) {
    adaptation_behavior_states_constraints(graph);
    adaptation_behavior_states_handlers(graph);

    graph.keepEdgesInBackground=true;

	let data = {};
	data["m_type"] = "binding"; //custom type
	data["m_elements"] = adaptation_behavior_states_elements(); //custom elements
	data["m_attributes"] = adaptation_behavior_states_attributes(); //custom attributes
	data["m_relations"] = adaptation_behavior_states_relations(); //custom relations
	data["m_properties_styles"] = adaptation_behavior_states_properties_styles(); //custom properties styles
	data["m_labels"] = adaptation_behavior_states_labels(); //custom labels
	data["m_clon_cells"] = adaptation_behavior_states_clon_cells(); //custom clon cells
	data["m_constraints_ic"] = adaptation_behavior_states_constraints_in_creation(); //custom constraints in element creation
	data["m_overlay"] = adaptation_behavior_states_overlay(); //custom overlay
	data["m_relation_styles"] = adaptation_behavior_states_relation_styles();
	return data;

	function adaptation_behavior_states_constraints(graph) {
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

	function adaptation_behavior_states_handlers(graph) {
		graph.removeListener(adaptation_behavior_states_handlers_double_click, mxEvent.DOUBLE_CLICK);
		graph.addListener(mxEvent.DOUBLE_CLICK, adaptation_behavior_states_handlers_double_click);
	}

	function adaptation_behavior_states_handlers_double_click(sender, evt) {
		let cell = evt.getProperty("cell"); // cell may be null
		if (cell != null) {
			adaptation_behavior_states_on_double_click(cell);
		}
		evt.consume();
	}

	function adaptation_behavior_states_elements() {
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
		let lifeLine = { src: projectPath + "images/models/adaptation_binding_state_hardware/lifeLine.png", wd: 100, hg: 35, type: "lifeLine", style: "shape=lifeLine", pname: "LifeLine" };

		let elements = [];
		elements[0] = activity;
		elements[1] = lifeLine;
		//elements[1] = writeAction;
		//elements[2] = readAction;
		//elements[3] = controlAction;
		// elements[1] = timer;
		// elements[5] = digitalVariable;
		// elements[6] = analogVariable;
		// elements[7] = stringVariable;
		// elements[8] = logicalOperator;
		// elements[9] = predicate;
		//elements[7] = delayAction;
		//elements[8] = customAction;

		return elements;
	}

	function adaptation_behavior_states_attributes() {
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

	function adaptation_behavior_states_relations() {
		let relations = [];
		relations[0] = {
			"source": ["state", "initialState"],
			"rel_source_target": "and",
			"target": ["lifeLine"],
			"attributes": [{
				"name": "phase",
				"def_value": "begin"
			}]
		};
		relations[1] = {
			"source": ["lifeLine"],
			"rel_source_target": "and",
			"target": ["lifeLine"],
			"attributes": [{
				"name": "time",
				"def_value": "0"
			},{
				"name": "execution",
				"def_value": "Synchronous"
			}]
		}  

		return relations;
	}

	function adaptation_behavior_states_properties_styles() {
		let styles = {};
		styles = {
			"relation": [{
				"attribute": "phase",
				"input_type": "select",
				"input_values": ["begin", "while", "end"]
			},{
				"attribute": "execution",
				"input_type": "select",
				"input_values": ["Synchronous", "Asynchronous"],
				"onchange": adaptation_behavior_states_custom_methods(0)
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
			]
		}

		return styles;
	}

	function adaptation_behavior_states_custom_methods(pos) {
		let methods = [];
		methods[0] = function () {
			const currentCell = graph.getModel().getCell(this.name);
			let style=currentCell.getStyle();
			alert(style);
			if(this.value=="Asynchronous"){
				style ="dashed=1;" + style;
			}else{
				style=style.replace("dashed=1;", "");
			} 
			currentCell.setStyle(style);
		};   

		return methods[pos];
	}

	function adaptation_behavior_states_labels() {
		let labels = {};
		labels = {
			"bundle": "bundleType"
		};

		return labels;
	}

	function adaptation_behavior_states_constraints_in_creation() {
		let constraints_ic = {};
		constraints_ic = {
			"root": adaptation_behavior_states_custom_methods(2)
		};

		return constraints_ic;
	}

	function adaptation_behavior_states_clon_cells() {
		let clons = {};
		clons = {
			"controlAction":"control"
		};

		return clons;
	}

	function adaptation_behavior_states_overlay() {
		let func1 = function () {
			let adaptation_behavior_states_root = graph.getModel().getCell("adaptation_behavior_states");
			let adaptation_behavior_states_elements = graph.getModel().getChildEdges(adaptation_behavior_states_root);
			for (let i = 0; i < adaptation_behavior_states_elements.length; i++) {
				let source = adaptation_behavior_states_elements[i].source;
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

	function adaptation_behavior_states_relation_styles() {		
		let relations = []; 
		relations[0] = {
			"source": ["state", "initialState", "activity", "readAction", "writeAction", "controlAction"],
			"rel_source_target": "and",
			"target": ["lifeLine"],
			"style": "dashed=1;endFill=0;endArrow=none;"
		} 
		relations[1] = {
			"source": ["readAction", "writeAction", "controlAction"],
			"rel_source_target": "and",
			"target": ["digitalVariable", "analogVariable", "timer", "analogActuator", "digitalActuator", "analogSensor", "digitalSensor"],
			"style": "dashed=1;endFill=1"
		} 
		return relations; 
	}

	function adaptation_behavior_states_on_double_click(cell) {
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

export default adaptation_behavior_states_main