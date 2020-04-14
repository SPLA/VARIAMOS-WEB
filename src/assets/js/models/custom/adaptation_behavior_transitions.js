let adaptation_behavior_transitions_main = function adaptation_behavior_transitions_main(graph) {
	adaptation_behavior_transitions_constraints(graph);
	adaptation_behavior_transitions_handlers(graph);

	let data = {};
	data["m_type"] = "binding"; //custom type
	data["m_elements"] = adaptation_behavior_transitions_elements(); //custom elements
	data["m_attributes"] = adaptation_behavior_transitions_attributes(); //custom attributes
	data["m_relations"] = adaptation_behavior_transitions_relations(); //custom relations
	data["m_properties_styles"] = adaptation_behavior_transitions_properties_styles(); //custom properties styles
	data["m_labels"] = adaptation_behavior_transitions_labels(); //custom labels
	data["m_clon_cells"] = adaptation_behavior_transitions_clon_cells(); //custom clon cells
	data["m_constraints_ic"] = adaptation_behavior_transitions_constraints_in_creation(); //custom constraints in element creation
	data["m_overlay"] = adaptation_behavior_transitions_overlay(); //custom overlay
	data["m_relation_styles"] = adaptation_behavior_transitions_relation_styles();
	return data;

	function adaptation_behavior_transitions_constraints(graph) {
		graph.multiplicities = []; //reset multiplicities 
		graph.multiplicities.push(new mxMultiplicity(
			true, "logicalOperator", null, null, 0, 1, ["transition", "logicalOperator"],
			"Only one connection allowed",
			"The logicalOperator only can be associated to transition"));
		graph.multiplicities.push(new mxMultiplicity(
			true, "predicate", null, null, 0, 1, ["logicalOperator"],
			"Only one connection allowed",
			"The predicate only can be assigned to one logicalOperator"));
		// graph.multiplicities.push(new mxMultiplicity(
		// 	true, "variable", null, null, 0, 1000000, ["predicate"],
		// 	"Only one connection allowed",
		// 	"The variable only can be assigned to predicate"));
	}

	function adaptation_behavior_transitions_handlers(graph) {
		graph.removeListener(adaptation_behavior_transitions_handlers_double_click, mxEvent.DOUBLE_CLICK);
		graph.addListener(mxEvent.DOUBLE_CLICK, adaptation_behavior_transitions_handlers_double_click);
	}

	function adaptation_behavior_transitions_handlers_double_click(sender, evt) {
		let cell = evt.getProperty("cell"); // cell may be null
		if (cell != null) {
			adaptation_behavior_transitions_on_double_click(cell);
		}
		evt.consume();
	}

	function adaptation_behavior_transitions_elements() {
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
		let logicalOperator = { src: projectPath + "images/models/adaptation_binding_state_hardware/logicalOperator.png", wd: 35, hg: 35, type: "logicalOperator", style: "shape=logicalOperator", pname: "Logical operator" };
		let predicate = { src: projectPath + "images/models/adaptation_binding_state_hardware/predicate.png", wd: 100, hg: 35, type: "predicate", style: "shape=predicate", pname: "Predicate" };

		let elements = [];
		elements[0] = logicalOperator;
		elements[1] = predicate;
		// elements[0] = activity;
		// elements[1] = timer;
		// elements[2] = writeAction;
		// elements[3] = readAction;
		// elements[4] = controlAction;
		// elements[5] = digitalVariable;
		// elements[6] = analogVariable;
		// elements[7] = stringVariable;
		//elements[7] = delayAction;
		//elements[8] = customAction;

		return elements;
	}

	function adaptation_behavior_transitions_attributes() {
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
			},{
				"name": "alias",
				"def_value": "op"
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

	function adaptation_behavior_transitions_relations() {
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

	function adaptation_behavior_transitions_properties_styles() {
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
			},{
				"attribute": "label",
				"input_type": "disabled"
			}, {
				"attribute": "alias",
				"input_type": "none"
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

	function adaptation_behavior_transitions_custom_methods(pos) {
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
				alert(global.messages["adaptation_behavior_transitions_custom_range_check"]);
				return false;
			}
			return true;
		};
		methods[2] = function (graph) {
			let adaptation_behavior_transitions_root = graph.getModel().getCell("adaptation_behavior_transitions");
			let adaptation_behavior_transitions_vertices = graph.getModel().getChildVertices(adaptation_behavior_transitions_root);

			for (let i = 0; i < adaptation_behavior_transitions_vertices.length; i++) {
				if (adaptation_behavior_transitions_vertices[i].getAttribute("type") == "root") {
					alert(global.messages["adaptation_behavior_transitions_custom_root_check"]);
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

	function adaptation_behavior_transitions_labels() {
		let labels = {};
		labels = {
			"bundle": "bundleType"
		};

		return labels;
	}

	function adaptation_behavior_transitions_constraints_in_creation() {
		let constraints_ic = {};
		constraints_ic = {
			"root": adaptation_behavior_transitions_custom_methods(2)
		};

		return constraints_ic;
	}

	function adaptation_behavior_transitions_clon_cells() {
		let clons = {};
		clons = {
			"controlAction": "control"
		};

		return clons;
	}

	function adaptation_behavior_transitions_overlay() {
		let func1 = function () {
			let adaptation_behavior_transitions_root = graph.getModel().getCell("adaptation_behavior_transitions");
			let adaptation_behavior_transitions_elements = graph.getModel().getChildEdges(adaptation_behavior_transitions_root);
			for (let i = 0; i < adaptation_behavior_transitions_elements.length; i++) {
				let source = adaptation_behavior_transitions_elements[i].source;
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

	function adaptation_behavior_transitions_relation_styles() {
		let relations = [];
		relations[0] = {
			"source": ["logicalOperator"],
			"rel_source_target": "and",
			"target": ["transition", "logicalOperator"],
			"style": "strokeColor=#333333;strokeWidth=2;dashed=0;endFill=1;"
		}
		relations[1] = {
			"source": ["predicate"],
			"rel_source_target": "and",
			"target": ["logicalOperator"],
			"style": "strokeColor=#333333;strokeWidth=2;dashed=0;endFill=1;"
		}
		relations[2] = {
			"source": ["variable", "digitalVariable", "analogVariable", "stringVariable"],
			"rel_source_target": "and",
			"target": ["predicateArgument"],
			"style": "strokeColor=#333333;strokeWidth=2;dashed=1;endFill=0;"
		}
		return relations;
	}

	function adaptation_behavior_transitions_on_double_click(cell) {
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

export default adaptation_behavior_transitions_main