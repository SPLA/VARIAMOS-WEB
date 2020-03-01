let adaptation_state_main = function adaptation_state_main(graph)
{
	adaptation_state_constraints(graph);
	let data={};
	data["m_type"]="normal"; //custom type
	data["m_elements"]=adaptation_state_elements(); //custom elements
	data["m_attributes"]=adaptation_state_attributes(); //custom attributes
	data["m_relations"]=adaptation_state_relations(); //custom relations
	data["m_properties_styles"]=adaptation_state_properties_styles(); //custom properties styles
	data["m_labels"]=adaptation_state_labels(); //custom labels
	data["m_clon_cells"]=adaptation_state_clon_cells(); //custom clon cells
	data["m_constraints_ic"]=adaptation_state_constraints_in_creation(); //custom constraints in element creation
	data["m_overlay"]=adaptation_state_overlay(); //custom overlay 
	return data;
	
	function adaptation_state_constraints(graph){
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

	function adaptation_state_elements(){
		let initialState = {src:projectPath+"images/models/adaptation_state/initialState.png", wd:100, hg:35, type:"initialState", style:"shape=doubleEllipse", pname:"Initial state"};
		let state = {src:projectPath+"images/models/adaptation_state/state.png", wd:100, hg:35, type:"state", style:"shape=ellipse", pname:"State"};
		let transition = {src:projectPath+"images/models/adaptation_state/transition.png", wd:100, hg:35, type:"transition", style:"shape=transition", pname:"Transition"};
		  
		let elements=[];
		elements[0]=initialState;
		elements[1]=state; 
		elements[2]=transition; 
		
		return elements;
	}

	function adaptation_state_attributes(){
		let attributes=[];
		attributes[0]={
			"types":["state"],
			"custom_attributes":[{
				"name":"acceptance",
				"def_value":"false"
			}]

		};
		attributes[1]={
			"types":["initialState"],
			"custom_attributes":[{
				"name":"acceptance",
				"def_value":"true"
			}]

		};
		return attributes;
	}

	function adaptation_state_relations(){
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

		relations[0]={
			"source":["initialState", "state"],
			"rel_source_target":"and",
			"target":["initialState", "state"],
			"attributes":[{
				"name":"label",
				"def_value":"transitionX"
			}]
		}
	
		return relations;
	}

	function adaptation_state_properties_styles(){
		let styles={};
		styles={
			"state":[{
				"attribute":"acceptance",
				"input_type":"checkbox"
				}
			],
			"initialState":[{
					"attribute":"acceptance",
					"input_type":"checkbox"
				}
			]
		}

		return styles;
	}

	function adaptation_state_custom_methods(pos){
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
				alert(global.messages["adaptation_state_custom_range_check"]);
				return false;
			}
			return true;
		};
		methods[2]=function(graph){
			let adaptation_state_root = graph.getModel().getCell("adaptation_state");    
			let adaptation_state_vertices = graph.getModel().getChildVertices(adaptation_state_root);

			for (let i = 0; i < adaptation_state_vertices.length; i++) {
				if(adaptation_state_vertices[i].getAttribute("type")=="root"){
					alert(global.messages["adaptation_state_custom_root_check"]);
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

	function adaptation_state_labels(){
		let labels={};
		labels={
			"bundle":"bundleType"
		};

		return labels;
	}

	function adaptation_state_constraints_in_creation(){
		let constraints_ic={};
		constraints_ic={
			"root":adaptation_state_custom_methods(2)
		};

		return constraints_ic;
	}

	function adaptation_state_clon_cells(){
		let clons={};
		clons={ 
			"transition":"adaptation_behavior_transitions",
			"state":"adaptation_behavior_states", 
			"initialState":"adaptation_behavior_states" 
		};

		return clons;
	}

	function adaptation_state_overlay(){
		let func1=function(){
			let adaptation_state_root = graph.getModel().getCell("adaptation_state");
			let adaptation_state_elements = graph.getModel().getChildEdges(adaptation_state_root);
			for (let i = 0; i < adaptation_state_elements.length; i++) {
				let source = adaptation_state_elements[i].source;
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

export default adaptation_state_main