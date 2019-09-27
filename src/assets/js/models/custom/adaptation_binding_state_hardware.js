var adaptation_binding_state_hardware_main = function adaptation_binding_state_hardware_main(graph) {
	adaptation_binding_state_hardware_constraints(graph);
	adaptation_binding_state_hardware_handlers(graph);

	var data = {};
	data["m_type"] = "binding"; //custom type
	data["m_elements"] = adaptation_binding_state_hardware_elements(); //custom elements
	data["m_attributes"] = adaptation_binding_state_hardware_attributes(); //custom attributes
	data["m_relations"] = adaptation_binding_state_hardware_relations(); //custom relations
	data["m_properties_styles"] = adaptation_binding_state_hardware_properties_styles(); //custom properties styles
	data["m_labels"] = adaptation_binding_state_hardware_labels(); //custom labels
	data["m_clon_cells"] = adaptation_binding_state_hardware_clon_cells(); //custom clon cells
	data["m_constraints_ic"] = adaptation_binding_state_hardware_constraints_in_creation(); //custom constraints in element creation
	data["m_overlay"] = adaptation_binding_state_hardware_overlay(); //custom overlay
	data["m_relation_styles"] = adaptation_binding_state_hardware_relation_styles();
	return data;

	function adaptation_binding_state_hardware_constraints(graph) {
		graph.multiplicities = []; //reset multiplicities
		graph.multiplicities.push(new mxMultiplicity(
			true, "state", null, null, 0, 0, null,
			"Invalid connection",
			"Only shape targets allowed"));
		graph.multiplicities.push(new mxMultiplicity(
			true, "bundle", null, null, 0, 1, ["root", "abstract"],
			"Only 1 target allowed",
			"Only shape targets allowed"));
	}

	function adaptation_binding_state_hardware_handlers(graph) {
		graph.removeListener(adaptation_binding_state_hardware_handlers_double_click, mxEvent.DOUBLE_CLICK);
		graph.addListener(mxEvent.DOUBLE_CLICK, adaptation_binding_state_hardware_handlers_double_click);
	}

	function adaptation_binding_state_hardware_handlers_double_click(sender, evt) {
		var cell = evt.getProperty("cell"); // cell may be null
		if (cell != null) {
			adaptation_binding_state_hardware_on_double_click(cell);
		}
		evt.consume();
	}

	function adaptation_binding_state_hardware_elements() {
		var activity = { src: projectPath + "images/models/feature/rectangle2.png", wd: 100, hg: 35, type: "activity", style: "shape=activity", pname: "Activity" };
		var digitalVariable = { src: projectPath + "images/models/feature/bundle.png", wd: 100, hg: 35, type: "digitalVariable", style: "shape=digitalVariable", pname: "Digital variable" };
		var analogVariable = { src: projectPath + "images/models/feature/bundle.png", wd: 100, hg: 35, type: "analogVariable", style: "shape=analogVariable", pname: "Analog variable" };
		var timer = { src: projectPath + "images/models/feature/bundle.png", wd: 100, hg: 35, type: "timer", style: "shape=timer", pname: "Timer" };
		var readAction = { src: projectPath + "images/models/feature/rectangle2.png", wd: 100, hg: 35, type: "readAction", style: "shape=readAction", pname: "Read action" };
		var writeAction = { src: projectPath + "images/models/feature/rectangle2.png", wd: 100, hg: 35, type: "writeAction", style: "shape=writeAction", pname: "Write action" };
		var controlAction = { src: projectPath + "images/models/feature/rectangle2.png", wd: 100, hg: 35, type: "controlAction", style: "strokeWidth=2", pname: "Control action" };
		var delayAction = { src: projectPath + "images/models/feature/rectangle2.png", wd: 100, hg: 35, type: "delayAction", style: "strokeWidth=2", pname: "Delay action" };
		var customAction = { src: projectPath + "images/models/feature/rectangle2.png", wd: 100, hg: 35, type: "customAction", style: "strokeWidth=2", pname: "Custom action" };
		var logicalOperator = { src: projectPath + "images/models/feature/bundle.png", wd: 100, hg: 35, type: "logicalOperator", style: "shape=ellipse", pname: "Logical operator" };
		var predicate = { src: projectPath + "images/models/feature/rectangle2.png", wd: 100, hg: 35, type: "predicate", style: "shape=predicate", pname: "Predicate" };

		var elements = [];
		elements[0] = activity;
		elements[1] = digitalVariable;
		elements[2] = analogVariable;
		elements[3] = timer;
		elements[4] = readAction;
		elements[5] = writeAction;
		elements[6] = controlAction;
		elements[7] = delayAction;
		elements[8] = customAction;
		elements[9] = logicalOperator;
		elements[10] = predicate;

		return elements;
	}

	function adaptation_binding_state_hardware_attributes() {
		var attributes = [];
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
		return attributes;
	}

	function adaptation_binding_state_hardware_relations() {
		var relations = [];
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

	function adaptation_binding_state_hardware_properties_styles() {
		var styles = {};
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
			]
		}

		return styles;
	}

	function adaptation_binding_state_hardware_custom_methods(pos) {
		var methods = []
		methods[0] = function () {
			document.getElementById("tr-lowRange").style.display = "none";
			document.getElementById("tr-highRange").style.display = "none";
			var val = document.getElementById("tr-bundleType").getElementsByTagName('select')[0].value;
			if (val == "RANGE") {
				document.getElementById("tr-lowRange").style.display = "";
				document.getElementById("tr-highRange").style.display = "";
			}
		};
		methods[1] = function () {
			var lowRange = document.getElementById("input-lowRange").value;
			var highRange = document.getElementById("input-highRange").value;
			if (lowRange > highRange) {
				alert(global.messages["adaptation_binding_state_hardware_custom_range_check"]);
				return false;
			}
			return true;
		};
		methods[2] = function (graph) {
			var adaptation_binding_state_hardware_root = graph.getModel().getCell("adaptation_binding_state_hardware");
			var adaptation_binding_state_hardware_vertices = graph.getModel().getChildVertices(adaptation_binding_state_hardware_root);

			for (var i = 0; i < adaptation_binding_state_hardware_vertices.length; i++) {
				if (adaptation_binding_state_hardware_vertices[i].getAttribute("type") == "root") {
					alert(global.messages["adaptation_binding_state_hardware_custom_root_check"]);
					return false;
				}
			}
			return true;
		};
		methods[3] = function () {
			// Creates a new overlay with an image and a tooltip and makes it "transparent" to events
			var overlay = new mxCellOverlay(new mxImage('images/MX/check.png', 16, 16), 'Overlay tooltip');
			if (this.checked) {
				graph.addCellOverlay(graph.getModel().getCell(this.name), overlay);
			} else {
				graph.removeCellOverlay(graph.getModel().getCell(this.name));
			}
		};

		return methods[pos];
	}

	function adaptation_binding_state_hardware_labels() {
		var labels = {};
		labels = {
			"bundle": "bundleType"
		};

		return labels;
	}

	function adaptation_binding_state_hardware_constraints_in_creation() {
		var constraints_ic = {};
		constraints_ic = {
			"root": adaptation_binding_state_hardware_custom_methods(2)
		};

		return constraints_ic;
	}

	function adaptation_binding_state_hardware_clon_cells() {
		var clons = {};
		clons = {
			"concrete": "binding_adaptation_binding_state_hardware_component"
		};

		return clons;
	}

	function adaptation_binding_state_hardware_overlay() {
		var func1 = function () {
			var adaptation_binding_state_hardware_root = graph.getModel().getCell("adaptation_binding_state_hardware");
			var adaptation_binding_state_hardware_elements = graph.getModel().getChildEdges(adaptation_binding_state_hardware_root);
			for (var i = 0; i < adaptation_binding_state_hardware_elements.length; i++) {
				var source = adaptation_binding_state_hardware_elements[i].source;
				var type = source.getAttribute("type");
				if (type == "concrete") {
					var sel = source.getAttribute("selected");
					if (sel == "true") {
						var overlay = new mxCellOverlay(new mxImage('images/MX/check.png', 16, 16), 'Overlay tooltip');
						graph.addCellOverlay(source, overlay);
					}
				}
			}
		};

		return func1;
	}

	function adaptation_binding_state_hardware_relation_styles() {		
		//endFill=0;strokeColor=red;fillColor=green
		var relations = []; 
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

	function adaptation_binding_state_hardware_on_double_click(cell) {
		var sourceType = cell.getAttribute("type");
		//alert(sourceType)
		if (sourceType == "initialState" || sourceType == "state" || sourceType == "transition") {
			//alert(sourceType)
			window.location = "http://localhost:8080/variamosweb#/models/Luz%20controlada/Application-Luzcontrolada-1/adaptation_state";
		}
		else
			if (sourceType == "analogSensor" || sourceType == "digitalSensor" || sourceType == "analogActuator" || sourceType == "digitalActuator") {
				//alert(sourceType)
				window.location = "http://localhost:8080/variamosweb#/models/Luz%20controlada/Application-Luzcontrolada-1/adaptation_hardware";
			}
			else if ((sourceType == "controlAction")) {
				//alert(sourceType)
				window.location = "http://localhost:8080/variamosweb#/models/Luz%20controlada/Application-Luzcontrolada-1/adaptation_hardware";
			}
	}

}

export default adaptation_binding_state_hardware_main