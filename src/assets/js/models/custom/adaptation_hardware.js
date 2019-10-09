let adaptation_hardware_main = function adaptation_hardware_main(graph)
{
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
	return data;
	
	function adaptation_hardware_constraints(graph){
		graph.multiplicities=[]; //reset multiplicities
		graph.multiplicities.push(new mxMultiplicity(
			true, "root", null, null, 0, 0, null,
			"Invalid connection",
			"Only shape targets allowed"));
		graph.multiplicities.push(new mxMultiplicity(
			true, "bundle", null, null, 0, 1, ["root","abstract"],
			"Only 1 target allowed",
			"Only shape targets allowed"));
	}

	function adaptation_hardware_elements(){
		let board = {src:projectPath+"images/models/adaptation_hardware/board.png", wd:100, hg:35, type:"board", style:"shape=board", pname:"Board"};
		let digitalActuator = {src:projectPath+"images/models/adaptation_hardware/digitalActuator.png", wd:100, hg:35, type:"digitalActuator", style:"shape=digitalActuator", pname:"Digital actuator"};
		let digitalSensor = {src:projectPath+"images/models/adaptation_hardware/digitalSensor.png", wd:100, hg:35, type:"digitalSensor", style:"shape=digitalSensor", pname:"Digital sensor"};
		let analogActuator = {src:projectPath+"images/models/adaptation_hardware/analogActuator.png", wd:100, hg:35, type:"analogActuator", style:"shape=analogActuator", pname:"Analog actuator"};
		let analogSensor = {src:projectPath+"images/models/adaptation_hardware/analogSensor.png", wd:100, hg:35, type:"analogSensor", style:"shape=analogSensor", pname:"Analog sensor"};
		    
		let elements=[];
		elements[0]=board;
		elements[1]=digitalActuator; 
		elements[2]=analogActuator; 
		elements[3]=digitalSensor; 
		elements[4]=analogSensor;
		
		return elements;
	}

	function adaptation_hardware_attributes(){
		let attributes=[];
		attributes[0]={
			"types":["board"],
			"custom_attributes":[{
				"name":"boardType",
				"def_value":"ArduinoUNO"
			}] 
		};
		attributes[1]={
			"types":["digitalActuator"],
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
		attributes[2]={
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
		attributes[3]={
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
		attributes[4]={
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
		return attributes;
	}

	function adaptation_hardware_relations(){
		let relations=[];
		relations[0]={
			"source":["abstract","concrete"],
			"rel_source_target":"and",
			"target":["abstract","concrete","root"],
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
				}
			],
			"analogActuator":[{
					"attribute":"subType",
					"input_type":"select",
					"input_values":["Simple"]
				},{
				"attribute":"pinX",
				"input_type":"select",
				"input_values":["A0","A1","A2","A3","A4","A5","A6"]
				}
			],
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
			"analogSensor":"adaptation_binding_state_hardware"
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