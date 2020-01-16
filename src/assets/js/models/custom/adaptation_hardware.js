import { getDevices } from "./adaptation_hardware/devices";

let customBoards = [
	{
		name: "ArduinoUNO",
		digitalPins: [
			"D1", "D2", "D3",
			"D4", "D5"
		],
		analogPins: [
			"A0", "A1", "A2",
			"A3"
		],
		pwmPins: [
			"P12", "P10"
		]
	},
	{
		name: "ArduinoNANO",
		digitalPins: [
			"D2", "D3", "D4",
			"D5", "D7", "D10",
			"D11"
		],
		analogPins: [
			"A0", "A1", "A2",
			"A3", "A4", "A5",
			"A6", "A7"
		],
		pwmPins: [
			"P6", "P8", "P9",
			"P12", "P13", "P14"
		]
	},
	{
		name: "ArduinoMEGA",
		digitalPins: [
			"D0", "D1", "D14",
			"D15", "D16", "D17",
			"D18", "D19", "D20",
			"D21", "D22", "D23",
			"D24", "D25", "D26",
			"D27", "D28", "D29",
			"D30", "D31", "D32",
			"D33", "D34", "D35",
			"D36", "D37", "D38",
			"D39", "D40", "D41",
			"D42", "D43", "D44",
			"D45", "D46", "D47",
			"D48", "D49", "D50",
			"D51", "D52", "D53"
		],
		analogPins: [
			"A0", "A1", "A2",
			"A3", "A4", "A5",
			"A6", "A7", "A8",
			"A9", "A10", "A11",
			"A12", "A13", "A14",
			"A15"
		],
		pwmPins: [
			"P2", "P3", "P4",
			"P5", "P6", "P7",
			"P8", "P9", "P10",
			"P11", "P12", "P13",
		]
	}
];

let adaptation_hardware_main = function adaptation_hardware_main(graph) {

	adaptation_hardware_constraints(graph);
	let data={};
	data["m_type"]="normal"; //custom type
	data["m_elements"]=adaptation_hardware_elements(); //custom elements
	data["m_attributes"]=adaptation_hardware_attributes(); //custom attributes
	data["m_relations"]=adaptation_hardware_relations(); //custom relations
	data["m_properties_styles"]=adaptation_hardware_properties_styles(); //custom properties styles
	data["m_labels"]=adaptation_hardware_labels(); //custom labels
	data["m_clon_cells"]=adaptation_hardware_clon_cells(); //custom clon cells
	data["m_constraints_ic"]=adaptation_hardware_constraints_in_creation(); //custom constraints in element creation
	data["m_overlay"]=adaptation_hardware_overlay(); //custom overlay
	data["m_relation_styles"] = adaptation_hardware_relation_styles();
	data["m_constraints_relations"] = adaptation_hardware_constraints_relations; //custom constraints for relations
	return data;

	function adaptation_hardware_constraints(graph){
		graph.multiplicities=[]; //reset multiplicities
		graph.multiplicities.push(new mxMultiplicity(
			true, "root", null, null, 0, 0, null,
			"Invalid connection",
			"Only shape targets allowed"));
		graph.multiplicities.push(new mxMultiplicity(
			true, "analog", null, null, 0, 1, ["analog"],
			"Only 1 target allowed",
			"Only shape targets allowed"));
	}

	function adaptation_hardware_constraints_relations(graph, source, target){
		//only one custom file per component
		if((source.getAttribute("type")=="analog" && target.getAttribute("type")!="analog")){
			alert("Invalid connection only one custom. file can be linked for this component");
			return false;
			/*let target_id = target.getId();
			let inco_egdes = graph.getModel().getIncomingEdges(graph.getModel().getCell(target_id));
			for (let j = 0; j < inco_egdes.length; j++) {
				if(inco_egdes[j].source.getAttribute("type")=="custom"){
					alert("Invalid connection only one custom. file can be linked for this component");
					return false;
				}
			}*/
		}

		//fragment can be only linked with one component
		if(target.getAttribute("type")=="component" && source.getAttribute("type")=="fragment"){
			let source_id = source.getId();
			let out_egdes = graph.getModel().getOutgoingEdges(graph.getModel().getCell(source_id));
			for (let j = 0; j < out_egdes.length; j++) {
				if(out_egdes[j].target.getAttribute("type")=="component"){
					alert("Invalid connection one fragment can be only linked with one component");
					return false;
				}
			}
		}

		return true;
	}

	function adaptation_hardware_elements(){

		let elements = [];
		let index = 0;

		for(let board of customBoards) {

			let boardPath = projectPath + "images/models/adaptation_hardware/";
			let shapeImagePath = boardPath + "board.png";

			let boardComposition = {
				src: shapeImagePath,
				wd: 280,
				hg: 180,
				type: "board",
				style: "shape=" + board.name.toLowerCase(),
				pname: "Arduino " + board.name.toUpperCase(),
				attributes:[{
					"name": "subtype",
					"def_value": board.name
				},{
					"name": "digitalPins",
					"def_value": board.digitalPins
				},{
					"name": "analogPins",
					"def_value": board.analogPins
				},{
					"name": "pwmPins",
					"def_value": board.pwmPins
				}]
			};

			elements[index++] = boardComposition;

		}

		for(let device of getDevices()) {

			let devicePath = projectPath + "images/models/adaptation_hardware/";
			let shapeImagePath = devicePath + "analogActuator.png";

			let deviceComposition = {
				src: shapeImagePath,
				wd: 100,
				hg: 35,
				type: "device", //para poder clonarlo y bindearlo 
				style: "shape=" + device.name,
				pname: device.name,
				attributes:[{
					"name":"subtype",
					"def_value": device.name //led, piezo o lo que sea
				},{
					"name": "digitalPins",
					"def_value": device.digitalPins
				},{
					"name": "analogPins",
					"def_value": device.analogPins
				},{
					"name": "pwmPins",
					"def_value": device.pwmPins
				}]
			};

			elements[index++] = deviceComposition;

		}

		return elements;

	}

	function adaptation_hardware_attributes(){

		let index = 0;
		let attributes=[];

		attributes[index++]={
			"types":["board"],
			"custom_attributes":[{
				"name":"boardType",
				"def_value":"ArduinoUNO"
			}]
		};
		attributes[index++]={
			"types":["device"],
			"custom_attributes":[{
				"name":"subType",
				"def_value":"Simple"
			},{
				"name":"pin",
				"def_value":"D2"
			},{
				"name":"initialValue",
				"def_value":"LOW"
			}]
		};
		attributes[index++]={
			"types":["digitalSensor"],
			"custom_attributes":[{
				"name":"subType",
				"def_value":"Simple"
			},{
				"name":"pin",
				"def_value":"D12"
			},{
				"name":"initialValue",
				"def_value":"LOW"
			}]
		};
		attributes[index++]={
			"types":["analogActuator"],
			"custom_attributes":[{
				"name":"subType",
				"def_value":"Simple"
			},{
				"name":"pin",
				"def_value":"A0"
			},{
				"name":"initialValue",
				"def_value":"0"
			}]
		};
		attributes[index++]={
			"types":["analogSensor"],
			"custom_attributes":[{
				"name":"subType",
				"def_value":"Simple"
			},{
				"name":"pin",
				"def_value":"A4"
			},{
				"name":"initialValue",
				"def_value":"0"
			}]
		};
		attributes[index++]={
			"types":["Led"],
			"custom_attributes":[{
				"name":"subType",
				"def_value":"Simple"
			},{
				"name":"pin",
				"def_value":"A4"
			},{
				"name":"subtype",
				"def_value":"No se"
			}]
		};

		for(let boardStyle of customBoards) {

			attributes[index++] = {
				"types":["Led"],
				"custom_attributes":[{
					"name": "pin",
					"parameters":[
						{
							"name": "pin",
							"def_value":"A4"
						}
					]
				}]
			};

		}

		return attributes;
	}

	function adaptation_hardware_relations(){
		let relations=[];
		relations[0]={
			"source":["triangulito"],
			"rel_source_target":"and",
			"target":["triangulito"],
			"attributes":[{
				"name":"relType",
				"def_value":"mandatory"
			}]
		}

		return relations;
	}

	function adaptation_hardware_properties_styles(){
		let styles={};
		styles={
			"board":[{
				"attribute":"boardType",
				"input_type":"select",
				"input_values":["ArduinoUno"]
			}],
			"device": [
				{
					"attribute": "subtype",
					"input_type":"disabled" 
				}
			],
			"led":[
				{
					"attribute": "simpleled",
					"input_type":"select",
					"input_values":["test2"]
				}
			],
			"digitalActuator":[{
				"attribute":"subType",
				"input_type":"select",
				"input_values":["Simple","Pwm","LiquidCrystal"]
			},{
				"attribute":"pinX",
				"input_type":"select",
				"input_values":["D2","D4","D7","D8","D12","D13"]
			},{
				"attribute":"pwm",
				"input_type":"checkbox"
			}],
			"analogActuator":[{
				"attribute":"subType",
				"input_type":"select",
				"input_values":["Simple"]
			},{
				"attribute":"pinX",
				"input_type":"select",
				"input_values":["A0","A1","A2","A3","A4","A5","A6"]
			}],
			"digitalSensor":[{
				"attribute":"subType",
				"input_type":"select",
				"input_values":["Simple","Keypad"]
			},{
				"attribute":"pinX",
				"input_type":"select",
				"input_values":["D2","D4","D7","D8","D12","D13"]
			}
			],
			"analogSensor":[{
				"attribute":"subType",
				"input_type":"select",
				"input_values":["Simple"]
			},{
				"attribute":"pinX",
				"input_type":"select",
				"input_values":["A0","A1","A2","A3","A4","A5","A6"]
			}
			]
		}

		return styles;
	}

	function adaptation_hardware_relation_styles() {
		let relations = [];
		relations[0] = {
			"source": ["analog"],
			"rel_source_target": "and",
			"target": ["analog"],
			"style": "dashed=1;endFill=0;"
		}
		return relations;
	}

	function adaptation_hardware_custom_methods(pos){
		let methods=[]
		methods[0]=function(){
			document.getElementById("tr-lowRange").style.display="none";
			document.getElementById("tr-highRange").style.display="none";
			let val = document.getElementById("tr-bundleType").getElementsByTagName('select')[0].value;
			if(val=="RANGE"){
				document.getElementById("tr-lowRange").style.display="";
				document.getElementById("tr-highRange").style.display="";
			}
		};
		methods[1]=function(){
			let lowRange = document.getElementById("input-lowRange").value;
			let highRange = document.getElementById("input-highRange").value;
			if(lowRange>highRange){
				alert(global.messages["adaptation_hardware_custom_range_check"]);
				return false;
			}
			return true;
		};
		methods[2]=function(graph){
			let adaptation_hardware_root = graph.getModel().getCell("adaptation_hardware");
			let adaptation_hardware_vertices = graph.getModel().getChildVertices(adaptation_hardware_root);

			for (let i = 0; i < adaptation_hardware_vertices.length; i++) {
				if(adaptation_hardware_vertices[i].getAttribute("type")=="root"){
					alert(global.messages["adaptation_hardware_custom_root_check"]);
					return false;
				}
			}
			return true;
		};
		methods[3]=function(){
			// Creates a new overlay with an image and a tooltip and makes it "transparent" to events
			let overlay = new mxCellOverlay(new mxImage('images/MX/check.png', 16, 16), 'Overlay tooltip');
			if(this.checked){
				graph.addCellOverlay(graph.getModel().getCell(this.name), overlay);
			}else{
				graph.removeCellOverlay(graph.getModel().getCell(this.name));
			}
		};

		return methods[pos];
	}

	function adaptation_hardware_labels(){
		let labels={};
		labels={
			"bundle":"bundleType"
		};

		return labels;
	}

	function adaptation_hardware_constraints_in_creation(){
		let constraints_ic={};
		constraints_ic={
			"root":adaptation_hardware_custom_methods(2)
		};

		return constraints_ic;
	}

	function adaptation_hardware_clon_cells(){
		let clons={};
		clons={
			"digitalActuator":"adaptation_binding_state_hardware",
			"digitalSensor":"adaptation_binding_state_hardware",
			"analogActuator":"adaptation_binding_state_hardware",
			"analogSensor":"adaptation_binding_state_hardware",
			"device":"adaptation_behavior_hardware"
		};

		return clons;
	}

	function adaptation_hardware_overlay(){
		let func1=function(){
			let adaptation_hardware_root = graph.getModel().getCell("adaptation_hardware");
			let adaptation_hardware_elements = graph.getModel().getChildEdges(adaptation_hardware_root);
			for (let i = 0; i < adaptation_hardware_elements.length; i++) {
				let source = adaptation_hardware_elements[i].source;
				let type = source.getAttribute("type");
				if(type=="concrete"){
					let sel = source.getAttribute("selected");
					if(sel=="true"){
						let overlay = new mxCellOverlay(new mxImage('images/MX/check.png', 16, 16), 'Overlay tooltip');
						graph.addCellOverlay(source,overlay);
					}
				}
			}
		};

		return func1;
	}

}

export default adaptation_hardware_main