var feature_main = function feature_main(graph)
{
	feature_constraints(graph);
	var data=[];
	data[0]="normal" //custom type
	data[1]=feature_elements(); //custom elements
	data[2]=feature_attributes(); //custom attributes
	data[3]=feature_relations(); //custom relations
	data[4]=feature_properties_styles(); //custom properties styles
	data[5]=feature_labels(); //custom labels
	data[6]=feature_clon_cells(); //custom clon cells
	data[7]=feature_constraints_in_creation(); //custom constraints in element creation
	data[8]=feature_overlay(); //custom overlay
	return data;
	
	function feature_constraints(graph){
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

	function feature_elements(){
		var root = {src:projectPath+"images/models/feature/rectangle3.png", wd:100, hg:35, type:"root", style:"strokeWidth=3", pname:"Root Feature"};
		var abstract = {src:projectPath+"images/models/feature/rectangle2.png", wd:100, hg:35, type:"abstract", style:"strokeWidth=2", pname:"Abstract Feature"};
		var concrete = {src:projectPath+"images/models/feature/rectangle.png", wd:100, hg:35, type:"concrete", style:"", pname:"Concrete Feature"};
		var bundle = {src:projectPath+"images/models/feature/bundle.png", wd:35, hg:35, type:"bundle", style:"shape=ellipse", pname:"Bundle"};
		
		var elements=[];
		elements[0]=root;
		elements[1]=abstract;
		elements[2]=concrete;
		elements[3]=bundle;
		
		return elements;
	}

	function feature_attributes(){
		var attributes=[];
		attributes[0]={
			"types":["bundle"],
			"custom_attributes":[{
				"name":"bundleType",
				"def_value":"AND"
			},
			{
				"name":"lowRange",
				"def_value":"1"
			},
			{
				"name":"highRange",
				"def_value":"1"
			}]
		};
		attributes[1]={
			"types":["concrete"],
			"custom_attributes":[{
				"name":"selected",
				"def_value":"false"
			}]

		};
		return attributes;
	}

	function feature_relations(){
		var relations=[];
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

	function feature_properties_styles(){
		var styles={};
		styles={
			"concrete":[{
					"attribute":"selected",
					"input_type":"checkbox",
					"onchange": feature_custom_methods(3)
				}
			],
			"relation":[{
					"attribute":"relType",
					"input_type":"select",
					"input_values":["mandatory","optional","requires","excludes"]
				}
			],
			"bundle":[
				{
					"attribute":"bundleType",
					"input_type":"select",
					"input_values":["AND","OR","XOR","RANGE"],
					"onchange": feature_custom_methods(0)
				},
				{
					"attribute":"lowRange",
					"input_type":"text",
					"input_text_type":"number",
					"def_display":"none",
					"display_check_attribute":"bundleType",
					"display_check_value":"RANGE",
					"display_check":"",
					"onchangerestrictive": feature_custom_methods(1)
				},
				{
					"attribute":"highRange",
					"input_type":"text",
					"input_text_type":"number",
					"def_display":"none",
					"display_check_attribute":"bundleType",
					"display_check_value":"RANGE",
					"display_check":"",
					"onchangerestrictive": feature_custom_methods(1)
				}
			]
		}

		return styles;
	}

	function feature_custom_methods(pos){
		var methods=[]
		methods[0]=function(){
			document.getElementById("tr-lowRange").style.display="none";
			document.getElementById("tr-highRange").style.display="none";
			var val = document.getElementById("tr-bundleType").getElementsByTagName('select')[0].value;
			if(val=="RANGE"){
				document.getElementById("tr-lowRange").style.display="";
				document.getElementById("tr-highRange").style.display="";
			}
		};
		methods[1]=function(){
			var lowRange = document.getElementById("input-lowRange").value;
			var highRange = document.getElementById("input-highRange").value;
			if(lowRange>highRange){
				alert(global.messages["feature_custom_range_check"]);
				return false;
			}
			return true;
		};
		methods[2]=function(graph){
			var feature_root = graph.getModel().getCell("feature");    
			var feature_vertices = graph.getModel().getChildVertices(feature_root);

			for (var i = 0; i < feature_vertices.length; i++) {
				if(feature_vertices[i].getAttribute("type")=="root"){
					alert(global.messages["feature_custom_root_check"]);
					return false;
				}
			}
			return true;
		};
		methods[3]=function(){
			// Creates a new overlay with an image and a tooltip and makes it "transparent" to events
			var overlay = new mxCellOverlay(new mxImage('images/MX/check.png', 16, 16), 'Overlay tooltip');	
			if(this.checked){
				graph.addCellOverlay(graph.getModel().getCell(this.name), overlay);
			}else{
				graph.removeCellOverlay(graph.getModel().getCell(this.name));
			}
		};

		return methods[pos];
	}

	function feature_labels(){
		var labels={};
		labels={
			"bundle":"bundleType"
		};

		return labels;
	}

	function feature_constraints_in_creation(){
		var constraints_ic={};
		constraints_ic={
			"root":feature_custom_methods(2)
		};

		return constraints_ic;
	}

	function feature_clon_cells(){
		var clons={};
		clons={
			"concrete":"binding_feature_component"
		};

		return clons;
	}

	function feature_overlay(){
		var func1=function(){
			var feature_root = graph.getModel().getCell("feature");
			var feature_elements = graph.getModel().getChildEdges(feature_root);
			for (var i = 0; i < feature_elements.length; i++) {
				var source = feature_elements[i].source;
				var type = source.getAttribute("type");
				if(type=="concrete"){
					var sel = source.getAttribute("selected");
					if(sel=="true"){
						var overlay = new mxCellOverlay(new mxImage('images/MX/check.png', 16, 16), 'Overlay tooltip');
						graph.addCellOverlay(source,overlay);
					}
				}
			}
		};

		return func1;
	}
	
}

export default feature_main